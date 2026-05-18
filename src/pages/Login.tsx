import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Loader2, ArrowLeft, Eye, EyeOff, BookOpen, Headphones, Mic, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Login.css';

interface Props {
    lang: 'en' | 'uz';
    theme: 'light' | 'dark';
    toggleLang: () => void;
}

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

declare global {
    interface Window {
        onTelegramAuth: (user: TelegramUser) => void;
    }
}

const Login = ({ lang, toggleLang }: Props) => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loadingSource, setLoadingSource] = useState<'email' | 'google' | 'telegram' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const tgContainerRef = useRef<HTMLDivElement>(null);

    const loading = loadingSource !== null;

    // Redirect if already logged in
    useEffect(() => {
        const check = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) navigate('/dashboard');
        };
        check();
    }, [navigate]);

    /* ─── Translations ──────────────────────────────── */
    const uz = lang === 'uz';

    const features = [
        { icon: <BookOpen size={16} />, text: uz ? "50 ta to'liq CEFR mock imtihoni"        : '50 full CEFR mock exams' },
        { icon: <Headphones size={16} />, text: uz ? 'Haqiqiy audio materiallar (Listening)'  : 'Real listening audio tracks' },
        { icon: <Mic size={16} />,        text: uz ? "AI yordamida og'zaki nutq baholash"     : 'AI-powered speaking feedback' },
        { icon: <GraduationCap size={16} />, text: uz ? "Shaxsiy AI o'quv rejasi"             : 'Personalised AI study plan' },
    ];

    const t = {
        panelTitle1:   uz ? "Milliy imtihonda"                         : 'Everything you need to',
        panelTitle2:   uz ? "muvaffaqiyat qozonin"                     : 'ace the national exam',
        panelSub:      uz ? "To'rt ko'nikmani mashq qiling, AI bilan rivojlanishingizni kuzating va maqsad CEFR darajangizga erishing."
                          : "Practise all four skills, track your progress with AI, and unlock your target CEFR level.",
        panelUsers:    uz ? "talaba ro'yxatdan o'tgan"                  : 'students joined',

        title:         isSignUp ? (uz ? 'Akkaunt yaratish'   : 'Create Account')
                                : (uz ? 'Xush kelibsiz'      : 'Welcome Back'),
        subtitle:      isSignUp ? (uz ? "CEFR imtihonida muvaffaqiyat sari birinchi qadamingizni qo'ying."
                                      : 'Start your journey to CEFR success.')
                                : (uz ? 'Milliy imtihonga tayyorgarligingizni davom ettiring.'
                                      : 'Continue your national exam preparation.'),
        emailLabel:    uz ? 'Elektron pochta'         : 'Email address',
        passwordLabel: uz ? 'Parol'                   : 'Password',
        forgot:        uz ? 'Unutdingizmi?'           : 'Forgot?',
        loginBtn:      uz ? 'Kirish'                  : 'Sign In',
        signUpBtn:     uz ? "Ro'yxatdan o'tish"       : 'Create Account',
        noAccount:     uz ? "Akkauntingiz yo'qmi?"    : "Don't have an account?",
        haveAccount:   uz ? 'Akkauntingiz bormi?'     : 'Already have an account?',
        switchLogin:   uz ? 'Kirish'                  : 'Sign in',
        switchSignUp:  uz ? "Ro'yxatdan o'tish"       : 'Sign up',
        backHome:      uz ? 'Bosh sahifaga'           : 'Back to home',
        or:            uz ? 'yoki'                    : 'or',
        googleBtn:     uz ? 'Google orqali kirish'    : 'Continue with Google',
        tgHint:        uz ? "Telegram ilovangizda «Tasdiqlash»ni bosing — parol shart emas."
                          : "Tap Confirm in your Telegram app — no password needed.",
        verifying:     uz ? 'Tekshirilmoqda…'         : 'Verifying…',
        successEmail:  uz ? 'Pochtangizni tekshiring — tasdiqlash havolasi yuborildi.'
                          : 'Check your inbox — we sent a confirmation link.',
    };

    /* ─── Auth handlers ─────────────────────────────── */

    const handleTelegramAuth = useCallback(async (user: TelegramUser) => {
        setLoadingSource('telegram');
        setError(null);
        try {
            const res = await fetch(
                'https://mctcstvjdpcnzypfjhka.supabase.co/functions/v1/telegram-auth',
                { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Telegram verification failed');
            const { error: sessionErr } = await supabase.auth.setSession({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
            });
            if (sessionErr) throw sessionErr;
            navigate('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Telegram login failed');
            setLoadingSource(null);
        }
    }, [navigate]);

    // Inject official Telegram widget — data-lang="en" forces English so it
    // doesn't render in Russian/etc based on the user's Telegram language setting.
    useEffect(() => {
        if (!tgContainerRef.current) return;
        tgContainerRef.current.innerHTML = '';
        window.onTelegramAuth = handleTelegramAuth;

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', 'cefracademy1bot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '10');
        script.setAttribute('data-lang', 'en');          // force English button text
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');
        script.async = true;
        tgContainerRef.current.appendChild(script);
    }, [handleTelegramAuth]);

    const handleGoogleLogin = async () => {
        setLoadingSource('google');
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin.replace(/\/$/, '')}/dashboard`,
                queryParams: { access_type: 'offline', prompt: 'consent' },
            },
        });
        if (error) { setError(error.message); setLoadingSource(null); }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingSource('email');
        setError(null);
        setSuccessMsg(null);
        try {
            if (isSignUp) {
                const { error: err, data } = await supabase.auth.signUp({
                    email, password,
                    options: { emailRedirectTo: 'https://cefracademy.uz/onboarding' },
                });
                if (err) throw err;
                if (data.user) setSuccessMsg(t.successEmail);
            } else {
                const { error: err } = await supabase.auth.signInWithPassword({ email, password });
                if (err) throw err;
                navigate('/dashboard');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message
                : (uz ? 'Kirishda xatolik yuz berdi.' : 'Authentication error.'));
        } finally {
            setLoadingSource(null);
        }
    };

    /* ─── JSX ───────────────────────────────────────── */

    return (
        <div className="auth-page">
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />

            <div className="auth-layout">

                {/* ── Left branding panel ── */}
                <div className="auth-panel-left">
                    <Link to="/" className="auth-brand">
                        <span className="auth-brand-logo">CEFR</span>
                        <span className="auth-brand-text">ACADEMY</span>
                    </Link>

                    <div className="auth-panel-body">
                        <h3 className="auth-panel-title">
                            {t.panelTitle1}<br />
                            <span className="auth-panel-grad">{t.panelTitle2}</span>
                        </h3>
                        <p className="auth-panel-sub">{t.panelSub}</p>
                        <ul className="auth-feature-list">
                            {features.map((f, i) => (
                                <li key={i} className="auth-feature-item">
                                    <span className="auth-feature-icon">{f.icon}</span>
                                    {f.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="auth-panel-users">
                        <div className="auth-avatars">
                            {['AT', 'SM', 'FN', 'ZR'].map((init, i) => (
                                <div key={i} className="auth-avatar"
                                    style={{ background: ['#5B50E8','#0EA5E9','#10B981','#F59E0B'][i] }}>
                                    {init}
                                </div>
                            ))}
                        </div>
                        <span><strong>12,000+</strong> {t.panelUsers}</span>
                    </div>
                </div>

                {/* ── Right auth card ── */}
                <motion.div
                    className="auth-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Top row: back link + lang toggle */}
                    <div className="auth-top-row">
                        <Link to="/" className="back-link">
                            <ArrowLeft size={15} /> {t.backHome}
                        </Link>
                        <button className="lang-pill" onClick={toggleLang} title="Switch language">
                            <span className={lang === 'en' ? 'lang-active' : ''}>EN</span>
                            <span className="lang-sep">|</span>
                            <span className={lang === 'uz' ? 'lang-active' : ''}>UZ</span>
                        </button>
                    </div>

                    {/* Header */}
                    <div className="auth-header">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${isSignUp}-${lang}`}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h2>{t.title}</h2>
                                <p>{t.subtitle}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Social buttons */}
                    <div className="social-grid">
                        {/* Google */}
                        <button className="btn-social btn-google" onClick={handleGoogleLogin} disabled={loading}>
                            {loadingSource === 'google'
                                ? <Loader2 size={18} className="spin" />
                                : <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                  </svg>
                            }
                            <span>{t.googleBtn}</span>
                        </button>

                        {/* Telegram — official iframe widget */}
                        {loadingSource === 'telegram'
                            ? <div className="btn-social btn-telegram-loading">
                                <Loader2 size={18} className="spin" />
                                <span>{t.verifying}</span>
                              </div>
                            : <div ref={tgContainerRef} className="tg-widget-container" />
                        }
                    </div>

                    <p className="tg-hint">{t.tgHint}</p>

                    {/* Divider */}
                    <div className="auth-divider"><span>{t.or}</span></div>

                    {/* Banners */}
                    <AnimatePresence>
                        {error && (
                            <motion.div className="auth-banner auth-banner-error"
                                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                {error}
                            </motion.div>
                        )}
                        {successMsg && (
                            <motion.div className="auth-banner auth-banner-success"
                                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                {successMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Email / password form */}
                    <form className="auth-form" onSubmit={handleAuth}>
                        <div className="form-group">
                            <label>{t.emailLabel}</label>
                            <input type="email" required value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com" disabled={loading} />
                        </div>

                        <div className="form-group">
                            <div className="label-row">
                                <label>{t.passwordLabel}</label>
                                {!isSignUp && <Link to="/login" className="forgot-link">{t.forgot}</Link>}
                            </div>
                            <div className="input-pw-wrap">
                                <input type={showPassword ? 'text' : 'password'} required
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••" disabled={loading} />
                                <button type="button" className="pw-toggle"
                                    onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <motion.button type="submit" disabled={loading}
                            className="btn-submit" whileTap={{ scale: 0.98 }}>
                            {loadingSource === 'email'
                                ? <Loader2 size={18} className="spin" />
                                : (isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />)
                            }
                            {isSignUp ? t.signUpBtn : t.loginBtn}
                        </motion.button>
                    </form>

                    <div className="auth-footer">
                        <span>{isSignUp ? t.haveAccount : t.noAccount}</span>
                        <button type="button"
                            onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMsg(null); }}>
                            {isSignUp ? t.switchLogin : t.switchSignUp}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
