import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, Clock, BrainCircuit, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './OnboardingSurvey.css';

interface Props {
    lang: 'en' | 'uz';
}

const OnboardingSurvey = ({ lang }: Props) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selections, setSelections] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) navigate('/login'); else setUserId(user.id);
        };
        fetchUser();
    }, [navigate]);

    const t = {
        steps: [
            {
                id: 'current_level',
                icon: <BrainCircuit size={32} />,
                q: lang === 'en' ? 'Current English Level' : 'Hozirgi darajangiz',
                opts: ['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper', 'C1 Advanced']
            },
            {
                id: 'target_level',
                icon: <Target size={32} />,
                q: lang === 'en' ? 'Target Multi-level Score' : 'Maqsadli Multi-level ball',
                opts: ['B1 (34-48 pts)', 'B2 (49-63 pts)', 'C1 (64-75 pts)']
            },
            {
                id: 'time_left',
                icon: <Clock size={32} />,
                q: lang === 'en' ? 'Exam Preparation Time' : 'Tayyorgarlik vaqti',
                opts: [lang === 'en' ? 'Less than 1 month' : '1 oydan kam', lang === 'en' ? '1-3 months' : '1-3 oy', lang === 'en' ? 'More than 3 months' : '3 oydan ko\'p']
            }
        ],
        generate: lang === 'en' ? 'Atlas is Preparing Your Path' : 'Atlas o\'quv rejangizni tuzmoqda',
        generating: lang === 'en' ? 'Our AI wolf coach is analyzing your goals based on the national 75-point marking system.' : 'Atlas 75 ballik milliy baholash tizimi asosida profilingizni tahlil qilmoqda.'
    };

    const handleSelect = async (opt: string) => {
        const newSelections = [...selections, opt];
        setSelections(newSelections);
        if (step < 3) setStep(step + 1); else {
            setIsGenerating(true);
            if (userId) {
                await supabase.from('profiles').upsert({
                    id: userId,
                    current_level: newSelections[0],
                    target_level: newSelections[1],
                    time_left: newSelections[2],
                    onboarding_completed: true,
                    avg_score: 0
                });
            }
            setTimeout(() => navigate('/dashboard'), 2500);
        }
    };

    return (
        <div className="onboarding-page">
            <AnimatePresence mode="wait">
                {!isGenerating ? (
                    <motion.div
                        key={`step-${step}`}
                        className="onboarding-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="onboarding-icon">
                            {t.steps[step - 1].icon}
                        </div>
                        <h2>{t.steps[step - 1].q}</h2>
                        <div className="onboarding-options">
                            {t.steps[step - 1].opts.map((opt, i) => (
                                <button key={i} className="option-btn" onClick={() => handleSelect(opt)}>
                                    {opt}
                                    <ArrowRight size={18} style={{ opacity: 0.3 }} />
                                </button>
                            ))}
                        </div>
                        <div className="progress-dots">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`dot ${s === step ? 'active' : ''}`} />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="generating"
                        className="onboarding-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="onboarding-icon">
                            <Sparkles size={32} className="animate-spin" />
                        </div>
                        <h2>{t.generate}</h2>
                        <p className="text-muted">{t.generating}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OnboardingSurvey;
