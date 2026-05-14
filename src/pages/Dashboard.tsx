import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowUpRight, BookOpen, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

interface UserProfile {
    current_level: string;
    target_level: string;
    points: number;
    tests_completed: number;
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
                    .select('current_level, target_level, points, tests_completed')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfile(data);
                } else if (error && error.code === 'PGRST116') {
                    setProfile({
                        current_level: 'N/A',
                        target_level: 'N/A',
                        points: 0,
                        tests_completed: 0
                    });
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

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
            <header className="page-header">
                <h1>{lang === 'en' ? 'Dashboard Overview' : 'Boshqaruv paneli'}</h1>
                <p>
                    {lang === 'en'
                        ? 'Welcome back. Here is a summary of your CEFR preparation progress.'
                        : 'Xush kelibsiz. CEFR tayyorgarligingiz bo\'yicha qisqacha ma\'lumotlar.'}
                </p>
            </header>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <h3>{lang === 'en' ? 'Target Score' : 'Maqsadli ball'}</h3>
                    <div className="value" style={{ color: 'var(--color-primary)' }}>{profile?.target_level || 'N/A'}</div>
                    <div className="trend trend-up">
                        <ArrowUpRight size={14} /> {lang === 'en' ? 'Aiming for progress' : 'Rivojlanish ko\'zlangan'}
                    </div>
                </div>

                <div className="stat-card">
                    <h3>{lang === 'en' ? 'Total Experience' : 'Umumiy tajriba'}</h3>
                    <div className="value">{profile?.points || 0} XP</div>
                    <div className="trend text-muted">
                        {lang === 'en' ? 'Start practicing to earn' : 'Mashq qilib ball yig\'ing'}
                    </div>
                </div>

                <div className="stat-card">
                    <h3>{lang === 'en' ? 'Sessions' : 'Mashg\'ulotlar'}</h3>
                    <div className="value">{profile?.tests_completed || 0}</div>
                    <div className="trend text-muted">
                        {lang === 'en' ? 'Tests completed' : 'Tugallangan testlar'}
                    </div>
                </div>
            </div>

            <section style={{ marginTop: '4rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{lang === 'en' ? 'Ready to Practice?' : 'Mashq qilishga tayyormisiz?'}</h2>
                <div className="grid grid-cols-2">
                    <Link to="/dashboard/reading" className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className="icon-wrapper color-blue"><BookOpen size={24} /></div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem' }}>{lang === 'en' ? 'Reading' : 'O\'qish'}</h4>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>{lang === 'en' ? '3 tests available' : '3 ta test mavjud'}</p>
                        </div>
                    </Link>
                    <Link to="/dashboard/writing" className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className="icon-wrapper color-purple"><GraduationCap size={24} /></div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem' }}>{lang === 'en' ? 'Writing' : 'Yozish'}</h4>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>{lang === 'en' ? 'AI evaluation ready' : 'AI baholash tayyor'}</p>
                        </div>
                    </Link>
                </div>
            </section>
        </motion.div>
    );
};

export default Dashboard;
