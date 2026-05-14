import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield, Star, Users, BrainCircuit } from 'lucide-react';
import './Home.css';

interface HomeProps {
    lang: 'en' | 'uz';
}

const Home = ({ lang }: HomeProps) => {
    const t = {
        heroBadge: lang === 'en' ? 'AI-POWERED PREPARATION' : 'AI ASOSLI TAYYORGARLIK',
        heroTitle: lang === 'en' ? 'The fastest path to your target CEFR score.' : 'Ko\'zlangan CEFR natijangizga eng tezkor yo\'l.',
        heroSubtitle: lang === 'en'
            ? 'From your current level to your target, in three steps. Powered by AI, balanced for the official standards.'
            : 'Hozirgi darajangizdan maqsadgacha uch bosqichda. AI yordamida, rasmiy standartlarga moslangan.',
        cta: lang === 'en' ? 'Start for Free' : 'Bepul boshlash',
        steps: [
            { id: 1, title: lang === 'en' ? 'Diagnose' : 'Tahlil', desc: lang === 'en' ? 'Talk to our AI to find your baseline.' : 'AI bilan suhbatlashib hozirgi darajangizni aniqlang.' },
            { id: 2, title: lang === 'en' ? 'Draft' : 'Reja', desc: lang === 'en' ? 'Get a personalized plan in seconds.' : 'Siz uchun maxsus reja 2 soniyada tayyor bo\'ladi.' },
            { id: 3, title: lang === 'en' ? 'Drill' : 'Mashq', desc: lang === 'en' ? 'Practice with adaptive mock exams.' : 'Dinamik o\'zgaruvchan mock imtihonlar bilan mashq qiling.' }
        ],
        results: lang === 'en'
            ? [
                { val: '+1.5', label: 'Bands average' },
                { val: '10k+', label: 'Happy students' },
                { val: '24/7', label: 'AI Support' }
            ]
            : [
                { val: '+1.5', label: 'O\'rtacha oshish' },
                { val: '10k+', label: 'Talabalar' },
                { val: '24/7', label: 'AI Yordamchi' }
            ]
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="badge" style={{ marginBottom: '1.5rem' }}>{t.heroBadge}</span>
                    <h1 className="hero-title">{t.heroTitle}</h1>
                    <p className="hero-subtitle">{t.heroSubtitle}</p>
                    <div className="hero-actions">
                        <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            {t.cta} <ArrowRight size={20} />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Results Bar */}
            <section className="results-strip">
                <div className="container results-flex">
                    {t.results.map((res, i) => (
                        <div key={i} className="result-item">
                            <div className="result-val">{res.val}</div>
                            <div className="result-label">{res.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3-Step Process Section (IELTS Nation Style) */}
            <section className="steps-section container">
                <div className="text-center" style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem' }}>{lang === 'en' ? 'Simple. Fast. Effective.' : 'Oddiy. Tezkor. Samarali.'}</h2>
                </div>
                <div className="steps-grid">
                    {t.steps.map(step => (
                        <div key={step.id} className="step-card">
                            <div className="step-num">{step.id}</div>
                            <h3>{step.title}</h3>
                            <p className="text-muted">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature Highlight Section */}
            <section className="features-highlight container">
                <div className="highlight-card glass-panel">
                    <div className="highlight-content">
                        <div className="badge">{lang === 'en' ? 'NEW FEATURE' : 'YANGI IMKONIYAT'}</div>
                        <h2>{lang === 'en' ? 'Full Cambridge Mock Tests' : 'To\'liq Cambridge Mock Testlari'}</h2>
                        <p>{lang === 'en' ? 'Real timing, real scoring, and detailed AI feedback for every section.' : 'Haqiqiy vaqt, aniq ballar va har bir bo\'lim uchun AI tahlillari.'}</p>
                        <Link to="/login" className="btn btn-outline">{lang === 'en' ? 'Try Mock Test' : 'Mock testni ko\'rish'}</Link>
                    </div>
                    <div className="highlight-visual">
                        <div className="visual-circle"></div>
                        <div className="visual-mock">
                            <div style={{ height: '14px', width: '40%', background: 'var(--color-primary)', borderRadius: '4px', marginBottom: '1.5rem' }}></div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ height: '8px', width: '100%', background: '#eee', borderRadius: '4px' }}></div>
                                <div style={{ height: '8px', width: '90%', background: '#eee', borderRadius: '4px' }}></div>
                                <div style={{ height: '8px', width: '95%', background: '#eee', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 }}>
                    <div className="brand" style={{ fontSize: '1.25rem' }}>CEFR<span className="text-primary">prep</span></div>
                    <p>© 2025 CEFRprep. Built for Uzbekistan.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
