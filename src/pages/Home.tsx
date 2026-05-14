import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Home.css';

// Import local assets
import atlasWolfImg from '../assets/images/atlas-wolf.png';
import successImg from '../assets/images/cefracademy-success.png';
import mockTestImg from '../assets/images/atlas-mock-test.png';

interface HomeProps {
    lang: 'en' | 'uz';
}

const Home = ({ lang }: HomeProps) => {
    const t = {
        heroBadge: lang === 'en' ? 'AI-POWERED PREPARATION' : 'AI ASOSLI TAYYORGARLIK',
        heroTitle: lang === 'en' ? 'The fastest path to your target CEFR score.' : 'Ko\'zlangan CEFR natijangizga eng tezkor yo\'l.',
        heroSubtitle: lang === 'en'
            ? 'Meet Atlas, your AI wolf coach. Get from your current level to your target in three simple steps.'
            : 'Atlas bilan tanishing - sizning AI bo\'ri ustozingiz. Hozirgi darajangizdan maqsadgacha uch bosqichda erishing.',
        cta: lang === 'en' ? 'Start for Free' : 'Bepul boshlash',
        steps: [
            { id: 1, title: lang === 'en' ? 'Diagnose' : 'Tahlil', desc: lang === 'en' ? 'Talk to Atlas to find your current English baseline.' : 'Atlas bilan suhbatlashib hozirgi darajangizni aniqlang.' },
            { id: 2, title: lang === 'en' ? 'Draft' : 'Reja', desc: lang === 'en' ? 'Atlas generates your personalized plan in seconds.' : 'Atlas siz uchun maxsus rejani bir necha soniyada tayyorlaydi.' },
            { id: 3, title: lang === 'en' ? 'Drill' : 'Mashq', desc: lang === 'en' ? 'Practice with adaptive mock exams and instant feedback.' : 'Dinamik mock imtihonlar va tezkor tahlillar bilan mashq qiling.' }
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
                <div className="hero-grid">
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="badge" style={{ marginBottom: '1.5rem' }}>{t.heroBadge}</span>
                        <h1 className="hero-title" style={{ textAlign: 'left', margin: '0 0 2rem 0' }}>{t.heroTitle}</h1>
                        <p className="hero-subtitle" style={{ textAlign: 'left', margin: '0 0 3rem 0' }}>{t.heroSubtitle}</p>
                        <div className="hero-actions" style={{ display: 'flex' }}>
                            <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                                {t.cta} <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div
                        className="hero-image"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <img src={atlasWolfImg} alt="Atlas the Wolf" className="floating-img" style={{ width: '100%', maxWidth: '500px' }} />
                    </motion.div>
                </div>
            </section>

            {/* Results Bar */}
            <section className="results-strip">
                <div className="container results-flex">
                    <div className="success-visual hidden-mobile">
                        <img src={successImg} alt="Success" style={{ height: '60px', opacity: 0.8 }} />
                    </div>
                    {t.results.map((res, i) => (
                        <div key={i} className="result-item">
                            <div className="result-val">{res.val}</div>
                            <div className="result-label">{res.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3-Step Process Section */}
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
                        <p>{lang === 'en' ? 'Real timing, real scoring, and detailed AI feedback from Atlas for every section.' : 'Haqiqiy vaqt, aniq ballar va Atlas tomonidan har bir bo\'lim uchun batafsil tahlillar.'}</p>
                        <Link to="/login" className="btn btn-outline">{lang === 'en' ? 'Try Mock Test' : 'Mock testni ko\'rish'}</Link>
                    </div>
                    <div className="highlight-visual" style={{ background: 'transparent' }}>
                        <img src={mockTestImg} alt="Mock Test" style={{ width: '100%', borderRadius: '1rem', boxShadow: 'var(--shadow-xl)' }} />
                    </div>
                </div>
            </section>

            <footer className="footer container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 }}>
                    <div className="brand" style={{ fontSize: '1.25rem' }}>CEFR<span className="text-primary">ACADEMY.uz</span></div>
                    <p>© 2025 CEFRACADEMY.uz. Built for Uzbekistan.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
