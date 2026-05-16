import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Target, Activity, Loader2, LogOut, Shield, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { calculateLevel } from '../lib/leveling';

interface Props {
    lang: 'en' | 'uz';
}

interface UserProfile {
    id: string;
    email: string;
    current_level: string;
    target_level: string;
    time_left: string;
    points: number;
    plan_tier: 'free' | 'premium';
    avatar_url?: string;
}

const Profile = ({ lang }: Props) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [username, setUsername] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                setProfile({
                    id: user.id,
                    email: user.email || '',
                    current_level: data?.current_level || 'N/A',
                    target_level: data?.target_level || 'N/A',
                    time_left: data?.time_left || 'N/A',
                    points: data?.points || 0,
                    plan_tier: data?.plan_tier || 'free',
                    avatar_url: data?.avatar_url
                });
                setUsername(data?.username || '');
            } else navigate('/login');
            setLoading(false);
        };
        fetchProfile();
    }, [navigate]);

    const handleUpdateUsername = async () => {
        try {
            setSaving(true);
            const { error } = await supabase.from('profiles').upsert({
                id: profile?.id,
                username: username,
                updated_at: new Date().toISOString()
            });
            if (error) throw error;
            alert('Username updated successfully!');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) throw new Error('You must select an image to upload.');
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${profile?.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
            if (uploadError) {
                if (uploadError.message.includes('bucket not found')) {
                    throw new Error('Storage bucket "avatars" not found. Please create it in your Supabase dashboard under Storage.');
                }
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
            await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile?.id);
            setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
            alert('Profile image updated!');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

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
            <div className="glass-panel" style={{ padding: '3rem', display: 'flex', gap: '3rem', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-xl)', background: 'var(--color-surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <User size={48} className="text-light" />
                        )}
                    </div>
                    <label className="avatar-upload-btn" style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: 'var(--color-primary)', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                        <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                    </label>
                </div>

                <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', display: 'block' }}>
                                {lang === 'en' ? 'Username' : 'Foydalanuvchi nomi'}
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={lang === 'en' ? 'Enter username...' : 'Nom kiriting...'}
                                style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '2px solid var(--color-border)',
                                    color: 'var(--color-text-main)',
                                    outline: 'none',
                                    padding: '0 0 0.5rem 0',
                                    width: '100%'
                                }}
                            />
                        </div>
                        <button
                            onClick={handleUpdateUsername}
                            disabled={saving}
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : (lang === 'en' ? 'Save' : 'Saqlash')}
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {profile?.email}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: profile?.plan_tier === 'premium' ? 'var(--color-warning)' : 'var(--color-text-light)' }}>
                            <Shield size={16} /> {profile?.plan_tier === 'premium' ? 'Premium' : 'Standard Account'}
                        </span>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'var(--color-error)' }}>
                    <LogOut size={18} /> {lang === 'en' ? 'Logout' : 'Chiqish'}
                </button>
            </div>

            <div className="grid grid-cols-2">
                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-main)' }}>
                        <Target className="text-primary" /> {lang === 'en' ? 'Assessment & Goals' : 'Baholash va Maqsadlar'}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                            <span className="text-muted">{lang === 'en' ? 'Current Level' : 'Hozirgi daraja'}</span>
                            <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{profile?.current_level}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                            <span className="text-muted">{lang === 'en' ? 'Target CEFR' : 'Maqsadli CEFR'}</span>
                            <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{profile?.target_level}</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-main)' }}>
                        <Activity className="text-primary" /> {lang === 'en' ? 'Learning Rank' : 'O\'rganish darajasi'}
                    </h3>
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        {profile && (
                            <>
                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{calculateLevel(profile.points).level}</div>
                                <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>{calculateLevel(profile.points).title}</div>
                                <div className="text-muted" style={{ fontSize: '0.9rem' }}>{profile.points} Total XP</div>
                                <div className="mini-progress-track" style={{ marginTop: '1rem', height: '8px' }}>
                                    <div className="mini-progress-bar" style={{ width: `${calculateLevel(profile.points).progress}%` }}></div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
