import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Loader2, ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Login.css';

interface Props {
    lang: 'en' | 'uz';
    theme: 'light' | 'dark';
}

const Login = ({ lang }: Props) => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const t = {
        title: isSignUp
            ? (lang === 'en' ? 'Create Account' : 'Akkaunt yaratish')
            : (lang === 'en' ? 'Welcome Back' : 'Xush kelibsiz'),
        subtitle: isSignUp
            ? (lang === 'en' ? 'Start your journey to National Multi-level CEFR success.' : 'Milliy Multi-level CEFR muvaffaqiyati sari yo\'lingizni boshlang.')
            : (lang === 'en' ? 'Continue your national exam preparation.' : 'Milliy imtihon tayyorgarligini davom ettirish uchun kiring.'),
        emailLabel: lang === 'en' ? 'Email Address' : 'Elektron pochta',
        passwordLabel: lang === 'en' ? 'Password' : 'Parol',
        forgot: lang === 'en' ? 'Forgot password?' : 'Parolni unutdingizmi?',
        loginBtn: lang === 'en' ? 'Sign In' : 'Kirish',
        signUpBtn: lang === 'en' ? 'Create Account' : 'Ro\'yxatdan o\'tish',
        noAccount: lang === 'en' ? "Don't have an account?" : "Akkauntingiz yo'qmi?",
        haveAccount: lang === 'en' ? "Already have an account?" : "Akkauntingiz bormi?",
        switchLogin: lang === 'en' ? 'Sign In' : 'Kirish',
        switchSignUp: lang === 'en' ? 'Sign Up' : 'Ro\'yxatdan o\'tish',
        backHome: lang === 'en' ? 'Back to home' : 'Bosh sahifaga qaytish',
        or: lang === 'en' ? 'or continue with' : 'yoki quyidagilar orqali',
        socialGoogle: lang === 'en' ? 'Continue with Google' : 'Google orqali davom etish',
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) navigate('/dashboard');
        };
        checkUser();
    }, [navigate]);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin.replace(/\/$/, '')}/dashboard`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            console.log('Google OAuth response:', { data, error });
            if (error) {
                throw error;
            }
            // If no error, Supabase will redirect the browser to Google automatically
        } catch (err: any) {
            console.error('Google login error:', err);
            setError(err.message || 'Google login failed. Please check your Supabase Google provider settings.');
            setLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error: signUpError, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        // FIX: Ensure confirmation email redirects to production app, not localhost
                        emailRedirectTo: 'https://cefracademy.uz/onboarding',
                    }
                });
                if (signUpError) throw signUpError;
                if (data.user) {
                    // Inform user to check email
                    alert(lang === 'en' ? 'Verification email sent! Please check your inbox.' : 'Tasdiqlash xati yuborildi! Iltimos, pochtangizni tekshiring.');
                }
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || (lang === 'en' ? 'Authentication error.' : 'Kirishda xatolik yuz berdi.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <Link to="/" className="back-link">
                    <ArrowLeft size={16} /> {t.backHome}
                </Link>

                <div className="auth-header">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                        <ShieldCheck size={48} />
                    </div>
                    <h2>{t.title}</h2>
                    <p>{t.subtitle}</p>
                </div>

                <div className="social-auth">
                    <button className="btn-social" onClick={handleGoogleLogin} disabled={loading}>
                        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" /></svg>
                        {t.socialGoogle}
                    </button>
                </div>

                <div className="divider">{t.or}</div>

                {error && (
                    <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #fee2e2' }}>
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleAuth}>
                    <div className="form-group">
                        <label>{t.emailLabel}</label>
                        <div className="input-container">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="label-row">
                            <label>{t.passwordLabel}</label>
                            {!isSignUp && <Link to="/login" className="forgot-link">{t.forgot}</Link>}
                        </div>
                        <div className="input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                            <div className="input-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />)}
                        {isSignUp ? t.signUpBtn : t.loginBtn}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>{isSignUp ? t.haveAccount : t.noAccount}</span>
                    <button onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? t.switchLogin : t.switchSignUp}</button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
