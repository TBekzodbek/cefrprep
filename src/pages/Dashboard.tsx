import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, BookOpen, GraduationCap, BarChart, TrendingUp, ArrowRight, CheckCircle2, Calendar, MessageSquare, Compass, Award } from 'lucide-react';
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
    avg_score?: number;
    weakness?: string;
    frequency?: string;
    time_left?: string;
}

interface PlanTask {
    id: number;
    task: string;
    done: boolean;
    time: string;
    priority: boolean;
}

const Dashboard = ({ lang }: Props) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [dailyPlan, setDailyPlan] = useState<PlanTask[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('current_level, target_level, points, tests_completed, avg_score, weakness, frequency, time_left')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfile(data);
                    generateSmartPlan(data);
                } else if (error && error.code === 'PGRST116') {
                    const fallback = { current_level: 'B1', target_level: 'C1', points: 0, tests_completed: 0, avg_score: 0 };
                    setProfile(fallback);
                    generateSmartPlan(fallback);
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, [lang]);

    const generateSmartPlan = (prof: UserProfile) => {
        const tasks: PlanTask[] = [];
        const isAdvanced = prof.current_level?.includes('B2') || prof.current_level?.includes('C1');
        const intensity = prof.frequency?.includes('Intensive') ? 4 : 2;

        // 1. Core Task based on weakness
        if (prof.weakness?.includes('Writing')) {
            tasks.push({ id: 1, task: lang === 'en' ? 'Advanced Writing Analysis' : 'Writing tahlili (Task 2)', done: false, time: '25m', priority: true });
        } else if (prof.weakness?.includes('Reading')) {
            tasks.push({ id: 1, task: lang === 'en' ? 'Scanning Techiques Drill' : 'Scanning usullarida mashq', done: false, time: '20m', priority: true });
        } else {
            tasks.push({ id: 1, task: lang === 'en' ? 'General Diagnostic Session' : 'Umumiy diagnostika', done: true, time: '15m', priority: false });
        }

        // 2. Skill Builder
        if (isAdvanced) {
            tasks.push({ id: 2, task: lang === 'en' ? 'C1 Vocabulary Expansion' : 'C1 darajadagi lug\'at', done: false, time: '15m', priority: false });
        } else {
            tasks.push({ id: 2, task: lang === 'en' ? 'B1/B2 Grammar Focus' : 'B1/B2 Grammatika', done: false, time: '20m', priority: false });
        }

        // 3. Mock Practice
        tasks.push({ id: 3, task: lang === 'en' ? 'Partial Mock (Reading Part 1)' : 'Mock test (Reading bo\'limi)', done: false, time: '30m', priority: prof.weakness?.includes('Reading') || false });

        // 4. Intensive extra task
        if (intensity > 2) {
            tasks.push({ id: 4, task: lang === 'en' ? 'Atlas AI Feedback Review' : 'Atlas AI tahlillarini ko\'rish', done: false, time: '10m', priority: false });
        }

        setDailyPlan(tasks);
    };

    const getScoreBoundary = (level: string) => {
        if (level?.includes('C1')) return 64;
        if (level?.includes('B2')) return 49;
        if (level?.includes('B1')) return 34;
        return 0;
    };

    const targetBoundary = getScoreBoundary(profile?.target_level || 'B2');
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="avatar-placeholder-large" style={{ background: '#f8fafc', borderRadius: '1rem', padding: '0.5rem' }}>
                        <img src={atlasWolfSmall} alt="Atlas" style={{ width: '80px' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{lang === 'en' ? 'Learning Dash' : 'O\'quv paneli'}</h1>
                        <p style={{ opacity: 0.7 }}>{lang === 'en' ? `Atlas personalized your plan for ${profile?.target_level}.` : `Atlas siz uchun ${profile?.target_level} rejasini tuzdi.`}</p>
                    </div>
                </div>
            </header>

            <div className="dashboard-grid-modern" style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr', gap: '2rem', marginTop: '2rem' }}>

                {/* Left: Study Plan & Daily Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Calendar size={20} /> {lang === 'en' ? 'Active Study Plan' : 'Faol o\'quv rejasi'}</h3>
                            <div className="progress-badge">Day 1 of 30</div>
                        </div>

                        <div className="daily-tasks-list">
                            {dailyPlan.map(item => (
                                <div key={item.id} className={`task-item ${item.done ? 'task-done' : ''}`}>
                                    <div className="task-checkbox">
                                        {item.done ? <CheckCircle2 className="text-secondary" /> : <div className="empty-check" />}
                                    </div>
                                    <div className="task-info">
                                        <span className="task-name">{item.task}</span>
                                        <span className="task-meta">{item.time} • {item.priority ? '🔥 Priority' : 'Regular'}</span>
                                    </div>
                                    {!item.done && <button className="btn-start-task">{lang === 'en' ? 'Start' : 'Boshlash'}</button>}
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f9ff', borderRadius: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Compass className="text-primary" size={24} />
                            <p style={{ fontSize: '0.9rem', color: '#0369a1', margin: 0 }}>
                                <strong>Atlas Tip:</strong> {profile?.weakness?.includes('Writing')
                                    ? (lang === 'en' ? 'Focus on cohesive devices today to boost your Task 2 score.' : 'Task 2 ballini oshirish uchun bugun bog\'lovchi vositalarga e\'tibor bering.')
                                    : (lang === 'en' ? 'Read 2 articles from BBC today to improve reading speed.' : 'O\'qish tezligini oshirish uchun BBC dan 2 ta maqola o\'qing.')}
                            </p>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <h3 style={{ marginBottom: '2rem' }}><BarChart size={20} /> {lang === 'en' ? 'Performance' : 'Natijalar'}</h3>
                        <div className="score-viz-container" style={{ display: 'flex', alignItems: 'flex-end', height: '100px', gap: '1rem' }}>
                            {[0.2, 0.4, 0.35, 0.5, 0.6, 0.55, 0.72].map((v, i) => (
                                <div key={i} style={{ flex: 1, background: i === 6 ? 'var(--color-primary)' : '#e2e8f0', height: `${v * 100}%`, borderRadius: '4px' }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Metrics & Levels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="stat-card-modern color-primary-dark">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Score Progress</p>
                                <h4 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{profile?.avg_score || 0}<span style={{ fontSize: '1rem' }}>/75</span></h4>
                            </div>
                            <TrendingUp className="stat-icon-fade" />
                        </div>
                        <div className="mini-progress-track">
                            <div className="mini-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                            <div className="target-marker-line" style={{ left: `${targetPercent}%` }}></div>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.8 }}>
                            <span>Target: {profile?.target_level}</span>
                            <span>{Math.round(progressPercent)}% achieved</span>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={16} /> {lang === 'en' ? 'Current Path' : 'Joriy yo\'nalish'}
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div className="badge-small" style={{ background: '#fef2f2', color: '#b91c1c' }}>⚠️ {profile?.weakness}</div>
                            <div className="badge-small" style={{ background: '#f0fdf4', color: '#16a34a' }}>📅 {profile?.frequency}</div>
                        </div>
                    </div>

                    <Link to="/ai-chat" className="btn btn-primary" style={{ padding: '1.25rem', borderRadius: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                        <MessageSquare size={20} /> {lang === 'en' ? 'Ask Atlas AI' : 'Atlas AI dan so\'rash'}
                    </Link>

                    <div className="stat-card-modern color-white">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Training Day</p>
                                <h4 style={{ fontSize: '1.5rem', margin: '0', color: '#0f172a' }}>1st Day</h4>
                            </div>
                            <Award className="text-secondary" />
                        </div>
                    </div>
                </div>
            </div>

            <section style={{ marginTop: '4rem' }}>
                <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>{lang === 'en' ? 'Full Mock Exams' : 'To\'liq Mock imtihonlari'}</h2>
                <div className="grid grid-cols-2">
                    <Link to="/dashboard/reading" className="training-card-modern">
                        <div className="training-icon-circle" style={{ background: '#eff6ff', color: '#3b82f6' }}><BookOpen /></div>
                        <div className="training-info"><h5>Reading</h5><p>National Exam Prep</p></div>
                        <ArrowRight size={18} className="arrow-fade" />
                    </Link>
                    <Link to="/dashboard/writing" className="training-card-modern">
                        <div className="training-icon-circle" style={{ background: '#f5f3ff', color: '#8b5cf6' }}><GraduationCap /></div>
                        <div className="training-info"><h5>Writing</h5><p>AI Evaluated Tasks</p></div>
                        <ArrowRight size={18} className="arrow-fade" />
                    </Link>
                </div>
            </section>
        </motion.div>
    );
};

export default Dashboard;
