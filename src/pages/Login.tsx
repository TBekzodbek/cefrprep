import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Login.css';

interface Props {
    lang: 'en' | 'uz';
}

const Login = ({ lang }: Props) => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const t = {
        title: isSignUp
            ? (lang === 'en' ? 'Create Account' : 'Ro\'yxatdan o\'tish')
            : (lang === 'en' ? 'Sign In' : 'Tizimga kirish'),
        subtitle: isSignUp
            ? (lang === 'en' ? 'Start your journey to CEFR success.' : 'CEFR muvaffaqiyati sari yo\'lingizni boshlang.')
            : (lang === 'en' ? 'Welcome back to CEFRprep.' : 'CEFRprep platformasiga xush kelibsiz.'),
        emailLabel: lang === 'en' ? 'Email Address' : 'Elektron pochta',
        passwordLabel: lang === 'en' ? 'Password' : 'Parol',
        loginBtn: lang === 'en' ? 'Sign In' : 'Tizimga kirish',
        signUpBtn: lang === 'en' ? 'Sign Up' : 'Ro\'yxatdan o\'tish',
        noAccount: lang === 'en' ? "Don't have an account?" : "Akkauntingiz yo'qmi?",
        haveAccount: lang === 'en' ? "Already have an account?" : "Akkauntingiz bormi?",
        switchLogin: lang === 'en' ? 'Sign In' : 'Tizimga kirish',
        switchSignUp: lang === 'en' ? 'Create an account' : 'Akkaunt yaratish',
        errorGeneric: lang === 'en' ? 'An error occurred.' : 'Xatolik yuz berdi.'
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) navigate('/dashboard');
        };
        checkUser();
    }, [navigate]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error: signUpError, data } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;
                if (data.user) navigate('/onboarding');
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || t.errorGeneric);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="auth-header">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                        <ShieldCheck size={40} />
                    </div>
                    <h2>{t.title}</h2>
                    <p>{t.subtitle}</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleAuth}>
                    <div className="form-group">
                        <label>{t.emailLabel}</label>
                        <input
                            className="form-input"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.passwordLabel}</label>
                        <input
                            className="form-input"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '0.5rem', height: '3rem' }}
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
