import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, Clock, BrainCircuit, ArrowRight, AlertCircle, Heart } from 'lucide-react';
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
            if (user) setUserId(user.id);
        };
        fetchUser();
    }, []);

    const t = {
        steps: [
            {
                id: 'current_level',
                icon: <BrainCircuit size={48} />,
                q: lang === 'en' ? 'What is your current level?' : 'Hozirgi darajangiz qanday?',
                opts: ['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper', 'C1 Advanced']
            },
            {
                id: 'target_level',
                icon: <Target size={48} />,
                q: lang === 'en' ? 'What is your target score?' : 'Maqsadli natijangiz?',
                opts: ['B1 (34-48 pts)', 'B2 (49-63 pts)', 'C1 (64-75 pts)']
            },
            {
                id: 'weakness',
                icon: <AlertCircle size={48} />,
                q: lang === 'en' ? 'Which area is your weakest?' : 'Qaysi bo\'limda qiynalasiz?',
                opts: [lang === 'en' ? 'Speaking & Grammar' : 'Gapirish va Grammatika', lang === 'en' ? 'Academic Writing' : 'Akademik Yozish', lang === 'en' ? 'Reading Speed' : 'O\'qish tezligi', lang === 'en' ? 'Listening Detail' : 'Listening detallari']
            },
            {
                id: 'frequency',
                icon: <Heart size={48} />,
                q: lang === 'en' ? 'How often will you study?' : 'Qanchalik tez-tez shug\'ullanasiz?',
                opts: [lang === 'en' ? 'Every day (Intensive)' : 'Har kuni (Intensiv)', lang === 'en' ? '3-4 times a week' : 'Haftada 3-4 marta', lang === 'en' ? 'Weekends only' : 'Faqat dam olish kunlari']
            },
            {
                id: 'time_left',
                icon: <Clock size={48} />,
                q: lang === 'en' ? 'When is your exam date?' : 'Imtihoningiz qachon?',
                opts: [lang === 'en' ? 'Within 1 month' : '1 oy ichida', lang === 'en' ? '1-3 months' : '1-3 oy', lang === 'en' ? 'Just starting' : 'Endi boshlayapman']
            }
        ],
        generate: lang === 'en' ? 'Atlas is Developing Your Plan' : 'Atlas shaxsiy rejangizni tuzmoqda',
        generating: lang === 'en' ? 'Analyzing your weaknesses and targets to build a custom 30-day roadmap...' : 'Kamchiliklaringiz va maqsadlaringiz asosida 30 kunlik reja tayyorlanmoqda...',
        guestMessage: lang === 'en' ? 'Create an account to save your AI plan' : 'Rejangizni saqlab qolish uchun ro\'yxatdan o\'ting'
    };

    const handleSelect = async (opt: string) => {
        const newSelections = [...selections, opt];
        setSelections(newSelections);

        if (step < t.steps.length) {
            setStep(step + 1);
        } else {
            setIsGenerating(true);

            // Store results temporarily
            localStorage.setItem('pendingSurvey', JSON.stringify({
                current_level: newSelections[0],
                target_level: newSelections[1],
                weakness: newSelections[2],
                frequency: newSelections[3],
                time_left: newSelections[4]
            }));

            if (userId) {
                // If logged in, save to DB immediately
                await supabase.from('profiles').upsert({
                    id: userId,
                    current_level: newSelections[0],
                    target_level: newSelections[1],
                    onboarding_completed: true,
                    weakness: newSelections[2],
                    frequency: newSelections[3],
                    time_left: newSelections[4]
                });
                setTimeout(() => navigate('/dashboard'), 2500);
            } else {
                // If guest, redirect to signup after a short delay
                setTimeout(() => navigate('/login?mode=signup'), 2500);
            }
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
                        <div className="step-count">STEP {step} OF {t.steps.length}</div>
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
                            {t.steps.map((_, i) => (
                                <div key={i} className={`dot ${i + 1 === step ? 'active' : ''}`} />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="generating"
                        className="onboarding-card text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="onboarding-icon">
                            <Sparkles size={64} className="animate-pulse text-primary" />
                        </div>
                        <h2 style={{ marginTop: '2rem' }}>{t.generate}</h2>
                        <p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '1rem' }}>{t.generating}</p>
                        {!userId && <p className="guest-alert">{t.guestMessage}</p>}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OnboardingSurvey;
