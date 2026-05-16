import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Mic, Headphones, GraduationCap, Globe, Sun, Moon } from 'lucide-react';
import './Navigation.css';

interface NavigationProps {
    lang: 'en' | 'uz';
    toggleLang: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const Navigation = ({ lang, toggleLang, theme, toggleTheme }: NavigationProps) => {
    const location = useLocation();

    const links = [
        { to: '/dashboard/reading', icon: <BookOpen size={20} />, label: lang === 'en' ? 'Reading' : 'O\'qib tushunish' },
        { to: '/dashboard/listening', icon: <Headphones size={20} />, label: lang === 'en' ? 'Listening' : 'Tinglab tushunish' },
        { to: '/dashboard/writing', icon: <GraduationCap size={20} />, label: lang === 'en' ? 'Writing' : 'Yozma nutq' },
        { to: '/dashboard/speaking', icon: <Mic size={20} />, label: lang === 'en' ? 'Speaking' : 'Og\'zaki nutq' },
    ];

    return (
        <nav className="glass-panel main-nav">
            <div className="container nav-content">
                <Link to="/" className="brand allow-select">
                    <span className="brand-logo">CEFR</span>
                    <span className="brand-text">ACADEMY.uz</span>
                </Link>
                <div className="nav-links">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{link.icon}</span>
                            <span className="nav-label">{link.label}</span>
                        </Link>
                    ))}
                </div>
                <div className="nav-actions">
                    <button className="btn btn-ghost theme-toggle" onClick={toggleTheme} title="Toggle Theme">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button className="btn btn-ghost lang-toggle" onClick={toggleLang}>
                        <Globe size={20} />
                        <span>{lang.toUpperCase()}</span>
                    </button>
                    <Link to="/onboarding" className="btn btn-primary btn-sm">
                        <span className="hidden-mobile">{lang === 'en' ? 'Build Plan' : 'Reja tuzish'}</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
