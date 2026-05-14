import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Zap, Headphones, BookOpen, GraduationCap, Mic, BarChart3, PieChart, Activity } from 'lucide-react';
import './Home.css';

// Import local assets
import atlasWolfImg from '../assets/images/atlas-wolf.png';

interface HomeProps {
    lang: 'en' | 'uz';
}

const Home = ({ lang }: HomeProps) => {
    const t = {
        heroBadge: lang === 'en' ? 'ALIGNED WITH NATIONAL 75-PT SCALE' : '75 BALLIK MILLIY TIZIMGA MOSLANGAN',
        heroTitle: lang === 'en' ? 'The fastest path to your target CEFR score.' : 'Ko\'zlangan CEFR natijangizga eng tezkor yo\'l.',
        heroSubtitle: lang === 'en'
            ? 'Meet Atlas, your AI robot coach. We help you bridge the gap between B1 and C1 using real national exam standards.'
            : 'Atlas bilan tanishing - sizning AI robot ustozingiz. B1 dan C1 gacha bo\'lgan masofani milliy imtihon standartlari asosida bosib o\'ting.',
        cta: lang === 'en' ? 'Get Started' : 'Boshlash',
        results: lang === 'en'
            ? [
                { val: '+12', label: 'Point improvement' },
                { val: '2,400+', label: 'Success stories' },
                { val: '98%', label: 'Accuracy rate' }
            ]
            : [
                { val: '+12', label: 'Ball o\'sishi' },
                { val: '2,400+', label: 'Muvaffaqiyatlar' },
                { val: '98%', label: 'Aniq natija' }
            ],
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
                        <span className="badge-premium" style={{ marginBottom: '1.5rem' }}>
                            <Zap size={14} fill="currentColor" /> {t.heroBadge}
                        </span>
                        <h1 className="hero-title">{t.heroTitle}</h1>
                        <p className="hero-subtitle">{t.heroSubtitle}</p>
                        <div className="hero-actions" style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
                            <Link to="/onboarding" className="btn btn-primary btn-glow" style={{ padding: '1.25rem 3rem', fontSize: '1.15rem' }}>
                                {t.cta} <ArrowRight size={20} />
                            </Link>
                            <div className="trust-indicator hidden-mobile">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <span>Trusted by 2.4k students</span>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="hero-image"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="mascot-wrapper">
                            <img src={atlasWolfImg} alt="Atlas the Wolf" className="floating-img main-mascot" />
                            {/* Decorative Floating Graph Card */}
                            <motion.div
                                className="floating-card graph-card"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="graph-header">
                                    <BarChart3 size={16} className="text-primary" />
                                    <span>Score Growth</span>
                                </div>
                                <div className="mock-graph">
                                    <div className="bar" style={{ height: '30%' }}></div>
                                    <div className="bar" style={{ height: '50%' }}></div>
                                    <div className="bar" style={{ height: '85%' }}></div>
                                    <div className="bar highlight" style={{ height: '100%' }}></div>
                                </div>
                                <div className="graph-label">+15 pts</div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Results Bar */}
            <section className="results-strip">
                <div className="container results-flex">
                    {t.results.map((res, i) => (
                        <div key={i} className="result-item">
                            <div className="result-icon-bg">
                                {i === 0 ? <Activity size={32} /> : i === 1 ? <PieChart size={32} /> : <ShieldCheck size={32} />}
                            </div>
                            <div>
                                <div className="result-val">{res.val}</div>
                                <div className="result-label">{res.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Skills Section */}
            <section className="skills-section container">
                <div className="section-header text-center">
                    <span className="badge">BUILDING PLAN</span>
                    <h2>Personalized 30-Day Roadmap</h2>
                </div>
                <div className="skills-grid">
                    {[
                        { icon: <BookOpen size={48} />, title: 'Reading', color: 'blue', desc: 'Predictive "Rasch" based mock tests.' },
                        { icon: <Headphones size={48} />, title: 'Listening', color: 'green', desc: 'Real exam recording acoustics.' },
                        { icon: <GraduationCap size={48} />, title: 'Writing', color: 'purple', desc: 'AI feedback on DTM criteria.' },
                        { icon: <Mic size={48} />, title: 'Speaking', color: 'warning', desc: 'Stress-free Atlas conversation.' }
                    ].map((skill, i) => (
                        <div key={i} className={`skill-card color-${skill.color}`}>
                            <div className="skill-icon" style={{ width: '5rem', height: '5rem' }}>{skill.icon}</div>
                            <h3>{skill.title}</h3>
                            <p>{skill.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Atlas (Simplified - Removed bottom large image) */}
            <section className="comparison-section container" style={{ marginBottom: '5rem' }}>
                <div className="highlight-card premium-gradient" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
                    <div className="highlight-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="badge-light">WHY ATLAS?</div>
                        <h2>Automated Study Journey.</h2>
                        <ul className="premium-list" style={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                            <li style={{ margin: 0 }}><Zap size={24} /> Official 75-point scaling</li>
                            <li style={{ margin: 0 }}><Zap size={24} /> 24/7 AI coaching</li>
                            <li style={{ margin: 0 }}><Zap size={24} /> Real-time diagnostics</li>
                        </ul>
                        <Link to="/onboarding" className="btn btn-white btn-lg" style={{ marginTop: '2rem' }}>Build My Plan Now</Link>
                    </div>
                </div>
            </section>

            <footer className="footer container">
                <div className="footer-content">
                    <div className="brand" style={{ fontSize: '1.5rem' }}>CEFR<span className="text-primary">ACADEMY.uz</span></div>
                    <p>© 2025 CEFRACADEMY.uz. Built for Uzbekistan.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
