import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Loader2, ArrowLeft, Eye, EyeOff, BookOpen, Headphones, Mic, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Login.css';

interface Props {
    lang: 'en' | 'uz';
    theme: 'light' | 'dark';
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

const features = [
    { icon: <BookOpen size={16} />, text: '50 full CEFR mock exams' },
    { icon: <Headphones size={16} />, text: 'Real listening audio tracks' },
    { icon: <Mic size={16} />, text: 'AI-powered speaking feedback' },
    { icon: <GraduationCap size={16} />, text: 'Personalised study plans' },
];

const Login = ({ lang }: Props) => {
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

    const t = {
        title: isSignUp
            ? (lang === 'en' ? 'Create Account' : 'Akkaunt yaratish')
            : (lang === 'en' ? 'Welcome Back' : 'Xush kelibsiz'),
        subtitle: isSignUp
            ? (lang === 'en' ? 'Join 12,000+ students preparing for CEFR success.' : 'CEFR muvaffaqiyatiga tayyorlanayotgan 12 000+ talabaga qo\'shiling.')
            : (lang === 'en' ? 'Continue your national exam preparation.' : 'Milliy imtihon tayyorgarligini davom ettiring.'),
        emailLabel: lang === 'en' ? 'Email address' : 'Elektron pochta',
        passwordLabel: lang === 'en' ? 'Password' : 'Parol',
        forgot: lang === 'en' ? 'Forgot?' : 'Unutdingizmi?',
        loginBtn: lang === 'en' ? 'Sign In' : 'Kirish',
        signUpBtn: lang === 'en' ? 'Create Account' : 'Ro\'yxatdan o\'tish',
        noAccount: lang === 'en' ? "Don't have an account?" : "Akkauntingiz yo'qmi?",
        haveAccount: lang === 'en' ? "Already have an account?" : "Akkauntingiz bormi?",
        switchLogin: lang === 'en' ? 'Sign in' : 'Kirish',
        switchSignUp: lang === 'en' ? 'Sign up' : 'Ro\'yxatdan o\'tish',
        backHome: lang === 'en' ? 'Back to home' : 'Bosh sahifaga',
        or: lang === 'en' ? 'or' : 'yoki',
        googleBtn: lang === 'en' ? 'Continue with Google' : 'Google orqali',
        telegramBtn: lang === 'en' ? 'Continue with Telegram' : 'Telegram orqali',
        telegramHint: lang === 'en' ? 'Tap Confirm in your Telegram app — no password needed.' : 'Telegram ilovangizda Tasdiqlash tugmasini bosing.',
    };

    /* ─── Auth handlers ─────────────────────────────── */

    // useCallback so the widget useEffect can safely depend on it
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

    // Inject the official Telegram widget iframe into its container
    useEffect(() => {
        if (!tgContainerRef.current) return;
        tgContainerRef.current.innerHTML = '';          // clear on re-render
        window.onTelegramAuth = handleTelegramAuth;

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', 'SadoMedia_bot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '10');
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
        // On success Supabase redirects automatically, no cleanup needed
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
                if (data.user) {
                    setSuccessMsg(lang === 'en'
                        ? 'Check your inbox — we sent a confirmation link.'
                        : 'Pochtangizni tekshiring — tasdiqlash havolasi yuborildi.');
                }
            } else {
                const { error: err } = await supabase.auth.signInWithPassword({ email, password });
                if (err) throw err;
                navigate('/dashboard');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : (lang === 'en' ? 'Authentication error.' : 'Kirishda xatolik.'));
        } finally {
            setLoadingSource(null);
        }
    };

    /* ─── JSX ───────────────────────────────────────── */

    return (
        <div className="auth-page">
            {/* Decorative blobs */}
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />

            <div className="auth-layout">
                {/* ── Left panel ── */}
                <div className="auth-panel-left">
                    <Link to="/" className="auth-brand">
                        <span className="auth-brand-logo">CEFR</span>
                        <span className="auth-brand-text">ACADEMY</span>
                    </Link>
                    <div className="auth-panel-body">
                        <h3 className="auth-panel-title">
                            Everything you need to<br />
                            <span className="auth-panel-grad">ace the national exam</span>
                        </h3>
                        <p className="auth-panel-sub">
                            Practise all four skills, track your progress with AI, and unlock your target CEFR level.
                        </p>
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
                            {['AT','SM','FN','ZR'].map((init, i) => (
                                <div key={i} className="auth-avatar" style={{ background: ['#5B50E8','#0EA5E9','#10B981','#F59E0B'][i] }}>{init}</div>
                            ))}
                        </div>
                        <span>Joined by <strong>12,000+</strong> students</span>
                    </div>
                </div>

                {/* ── Right panel (auth card) ── */}
                <motion.div
                    className="auth-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Link to="/" className="back-link">
                        <ArrowLeft size={15} /> {t.backHome}
                    </Link>

                    {/* Header */}
                    <div className="auth-header">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isSignUp ? 'signup' : 'signin'}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.22 }}
                            >
                                <h2>{t.title}</h2>
                                <p>{t.subtitle}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Social buttons */}
                    <div className="social-grid">
                        {/* Google */}
                        <button
                            className="btn-social btn-google"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
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
                            ? <div className="btn-social btn-telegram btn-telegram-loading">
                                <Loader2 size={18} className="spin" />
                                <span>Verifying…</span>
                              </div>
                            : <div ref={tgContainerRef} className="tg-widget-container" />
                        }
                    </div>

                    {/* Telegram hint */}
                    <p className="tg-hint">{t.telegramHint}</p>

                    {/* Divider */}
                    <div className="auth-divider"><span>{t.or}</span></div>

                    {/* Error / Success banners */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className="auth-banner auth-banner-error"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}
                        {successMsg && (
                            <motion.div
                                className="auth-banner auth-banner-success"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {successMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Email form */}
                    <form className="auth-form" onSubmit={handleAuth}>
                        <div className="form-group">
                            <label>{t.emailLabel}</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <div className="label-row">
                                <label>{t.passwordLabel}</label>
                                {!isSignUp && <Link to="/login" className="forgot-link">{t.forgot}</Link>}
                            </div>
                            <div className="input-pw-wrap">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="pw-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="btn-submit"
                            whileTap={{ scale: 0.98 }}
                        >
                            {loadingSource === 'email'
                                ? <Loader2 size={18} className="spin" />
                                : (isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />)
                            }
                            {isSignUp ? t.signUpBtn : t.loginBtn}
                        </motion.button>
                    </form>

                    <div className="auth-footer">
                        <span>{isSignUp ? t.haveAccount : t.noAccount}</span>
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMsg(null); }}
                        >
                            {isSignUp ? t.switchLogin : t.switchSignUp}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
