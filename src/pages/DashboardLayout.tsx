import { useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Crown, CreditCard, BookOpen, Headphones, GraduationCap, Mic, LogOut, CheckCircle, Globe, Sun, Moon, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './DashboardLayout.css';

interface Props {
    lang: 'en' | 'uz';
    toggleLang: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const DashboardLayout = ({ lang, toggleLang, theme, toggleTheme }: Props) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) navigate('/login');
        };
        checkUser();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const menuItems = [
        { section: lang === 'en' ? 'Main' : 'Asosiy' },
        { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: lang === 'en' ? 'Overview' : 'Umumiy' },
        { to: '/dashboard/profile', icon: <User size={20} />, label: lang === 'en' ? 'My Profile' : 'Mening Profilim' },
        { to: '/dashboard/plan', icon: <CheckCircle size={20} />, label: lang === 'en' ? 'My AI Plan' : 'AI Rejam' },
        { to: '/dashboard/ai-chat', icon: <Sparkles size={20} />, label: lang === 'en' ? 'Atlas AI Chat' : 'Atlas AI Suhbat' },

        { section: lang === 'en' ? 'Practice Categories' : 'Amaliyot bo\'limlari' },
        { to: '/dashboard/reading', icon: <BookOpen size={20} />, label: lang === 'en' ? 'Reading' : 'O\'qib tushunish' },
        { to: '/dashboard/listening', icon: <Headphones size={20} />, label: lang === 'en' ? 'Listening' : 'Tinglab tushunish' },
        { to: '/dashboard/writing', icon: <GraduationCap size={20} />, label: lang === 'en' ? 'Writing' : 'Yozma nutq' },
        { to: '/dashboard/speaking', icon: <Mic size={20} />, label: lang === 'en' ? 'Speaking' : 'Og\'zaki nutq' },

        { section: lang === 'en' ? 'Account' : 'Hisob' },
        { to: '/dashboard/pricing', icon: <CreditCard size={20} />, label: lang === 'en' ? 'Pricing & Plans' : 'Ta\'riflar' },
    ];

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar glass-panel">
                <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <Link to="/" className="brand">
                        <span className="brand-logo">CEFR</span>
                        <span className="brand-text">ACADEMY</span>
                    </Link>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn btn-ghost theme-toggle-sidebar" onClick={toggleTheme} title="Toggle Theme" style={{ padding: '0.4rem' }}>
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                        <button className="btn btn-ghost lang-toggle-sidebar" onClick={toggleLang} style={{ padding: '0.4rem' }}>
                            <Globe size={18} />
                            <span style={{ fontSize: '0.8rem' }}>{lang.toUpperCase()}</span>
                        </button>
                    </div>
                </div>

                <div className="sidebar-premium-card">
                    <Crown size={24} className="text-warning" style={{ marginBottom: '0.5rem' }} />
                    <h4>{lang === 'en' ? 'Free Plan' : 'Bepul ta\'rif'}</h4>
                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                        {lang === 'en' ? 'Limited access to standard tests.' : 'Cheklangan testlarga kirish.'}
                    </p>
                    <Link to="/dashboard/pricing" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}>
                        {lang === 'en' ? 'Upgrade to Premium' : 'Premiumga o\'tish'}
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => {
                        if (item.section) {
                            return <div key={index} className="sidebar-section-title">{item.section}</div>;
                        }
                        return (
                            <Link
                                key={item.to}
                                to={item.to!}
                                className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="sidebar-link text-error" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <LogOut size={20} />
                        <span>{lang === 'en' ? 'Log Out' : 'Chiqish'}</span>
                    </button>
                </div>
            </aside>

            <main className="dashboard-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
