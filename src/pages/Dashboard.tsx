import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowUpRight, BookOpen, GraduationCap, Headphones, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './PageLayout.css';
import atlasWolfSmall from '../assets/images/atlas-wolf.png';

interface Props {
    lang: 'en' | 'uz';
}

interface UserProfile {
    current_level: string;
    target_level: string;
    points: number;
    tests_completed: number;
    avg_score?: number; // Score out of 75
}

const Dashboard = ({ lang }: Props) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('current_level, target_level, points, tests_completed, avg_score')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfile(data);
                } else if (error && error.code === 'PGRST116') {
                    setProfile({
                        current_level: 'N/A',
                        target_level: 'N/A',
                        points: 0,
                        tests_completed: 0,
                        avg_score: 0
                    });
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const getScoreBoundary = (level: string) => {
        if (level.includes('C1')) return 64;
        if (level.includes('B2')) return 49;
        if (level.includes('B1')) return 34;
        return 0;
    };

    const targetBoundary = getScoreBoundary(profile?.target_level || 'B2 (49-63)');
    const progressPercent = profile?.avg_score ? Math.min((profile.avg_score / 75) * 100, 100) : 0;
    const targetPercent = (targetBoundary / 75) * 100;

    if (loading) {
        return (
            <div className="page-container container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <header className="page-header" style={{ position: 'relative' }}>
                <div>
                    <h1>{lang === 'en' ? 'Dashboard Overview' : 'Boshqaruv paneli'}</h1>
                    <p>
                        {lang === 'en'
                            ? `Atlas calibrated your progress to the official 75-point scale.`
                            : `Atlas natijalaringizni rasmiy 75 ballik tizimga mosladi.`}
                    </p>
                </div>
                <div className="dashboard-mascot hidden-mobile" style={{ position: 'absolute', right: 10, top: '-30px' }}>
                    <img src={atlasWolfSmall} alt="Atlas the Wolf" style={{ width: '140px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }} />
                </div>
            </header>

            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
                <div className="stat-card">
                    <h3>{lang === 'en' ? 'Target Level' : 'Maqsadli daraja'}</h3>
                    <div className="value" style={{ color: 'var(--color-primary)' }}>{profile?.target_level?.split(' ')[0] || 'N/A'}</div>
                    <div className="trend trend-up">
                        <ArrowUpRight size={14} /> {lang === 'en' ? `Requires ${targetBoundary}+ pts` : `${targetBoundary}+ ball talab etiladi`}
                    </div>
                </div>

                <div className="stat-card">
                    <h3>{lang === 'en' ? 'Current Average' : 'O\'rtacha ball'}</h3>
                    <div className="value">{profile?.avg_score || 0} <span style={{ fontSize: '1rem', opacity: 0.5 }}>/ 75</span></div>
                    <div className="progress-bar-container" style={{ height: '8px', background: '#f0f0f5', borderRadius: '4px', marginTop: '1rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), #818cf8)', borderRadius: '4px' }}></div>
                        {/* Target Marker */}
                        <div style={{ position: 'absolute', left: `${targetPercent}%`, top: 0, bottom: 0, width: '2px', background: 'rgba(0,0,0,0.1)', zIndex: 2 }}></div>
                    </div>
                </div>

                <div className="stat-card">
                    <h3>{lang === 'en' ? 'Exam Readiness' : 'Imtihonga tayyorgarlik'}</h3>
                    <div className="value">{Math.round((profile?.avg_score || 0) / 75 * 100)}%</div>
                    <div className="trend text-muted">
                        {lang === 'en' ? 'Overall proficiency' : 'Umumiy o\'zlashtirish'}
                    </div>
                </div>
            </div>

            <section style={{ marginTop: '4rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{lang === 'en' ? 'Practice Sections (Max 75 pts each)' : 'Mashq bo\'limlari (Maks 75 ball)'}</h2>
                <div className="grid grid-cols-2">
                    <Link to="/dashboard/reading" className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className="icon-wrapper color-blue"><BookOpen size={24} /></div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem' }}>{lang === 'en' ? 'Reading' : 'O\'qish'}</h4>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Weighted to 75-pt scale</p>
                        </div>
                    </Link>
                    <Link to="/dashboard/listening" className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className="icon-wrapper color-green"><Headphones size={24} /></div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem' }}>{lang === 'en' ? 'Listening' : 'Eshitish'}</h4>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Weighted to 75-pt scale</p>
                        </div>
                    </Link>
                    <Link to="/dashboard/writing" className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className="icon-wrapper color-purple"><GraduationCap size={24} /></div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem' }}>{lang === 'en' ? 'Writing' : 'Yozish'}</h4>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>2 Tasks • Atlas AI Marking</p>
                        </div>
                    </Link>
                    <Link to="/dashboard/speaking" className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className="icon-wrapper color-warning"><Mic size={24} /></div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem' }}>{lang === 'en' ? 'Speaking' : 'Gapirish'}</h4>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>3 Parts • Real-time Feedback</p>
                        </div>
                    </Link>
                </div>
            </section>
        </motion.div>
    );
};

export default Dashboard;
