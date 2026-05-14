import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Award, Target, Settings, Activity, Loader2, LogOut, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
    lang: 'en' | 'uz';
}

interface UserProfile {
    email: string;
    current_level: string;
    target_level: string;
    time_left: string;
    points: number;
    plan_tier: 'free' | 'premium';
}

const Profile = ({ lang }: Props) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                setProfile({
                    email: user.email || '',
                    current_level: data?.current_level || 'N/A',
                    target_level: data?.target_level || 'N/A',
                    time_left: data?.time_left || 'N/A',
                    points: data?.points || 0,
                    plan_tier: data?.plan_tier || 'free'
                });
            } else navigate('/login');
            setLoading(false);
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    if (loading) return <div className="page-container" style={{ textAlign: 'center', padding: '10rem' }}><Loader2 className="animate-spin text-primary" size={40} /></div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="page-container"
        >
            <div className="glass-panel" style={{ padding: '3rem', display: 'flex', gap: '3rem', alignItems: 'center', marginBottom: '3rem', background: '#ffffff' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-xl)', background: 'var(--color-background-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
                    <User size={48} className="text-light" />
                </div>
                <div style={{ flexGrow: 1 }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{profile?.email.split('@')[0]}</h2>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {profile?.email}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: profile?.plan_tier === 'premium' ? 'var(--color-warning)' : 'var(--color-text-light)' }}>
                            <Shield size={16} /> {profile?.plan_tier === 'premium' ? 'Premium' : 'Standard Account'}
                        </span>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'var(--color-error)', borderColor: 'rgba(239, 68, 68, 0.1)' }}>
                    <LogOut size={18} /> {lang === 'en' ? 'Logout' : 'Chiqish'}
                </button>
            </div>

            <div className="grid grid-cols-2">
                <div className="glass-panel" style={{ padding: '2.5rem', background: '#ffffff' }}>
                    <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Target className="text-primary" /> {lang === 'en' ? 'Assessment & Goals' : 'Baholash va Maqsadlar'}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-background-alt)', paddingBottom: '1rem' }}>
                            <span className="text-muted">{lang === 'en' ? 'Current Level' : 'Hozirgi daraja'}</span>
                            <span style={{ fontWeight: 700 }}>{profile?.current_level}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-background-alt)', paddingBottom: '1rem' }}>
                            <span className="text-muted">{lang === 'en' ? 'Target CEFR' : 'Maqsadli CEFR'}</span>
                            <span style={{ fontWeight: 700 }}>{profile?.target_level}</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2.5rem', background: '#ffffff' }}>
                    <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Activity className="text-primary" /> {lang === 'en' ? 'Learning Statistics' : 'O\'rganish statistikasi'}
                    </h3>
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)' }}>{profile?.points}</div>
                        <div className="text-muted" style={{ fontWeight: 600 }}>Total Experience Points</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
