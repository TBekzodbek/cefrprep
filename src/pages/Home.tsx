import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Quote } from 'lucide-react';
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
        heroBadge: lang === 'en' ? 'ALIGNED WITH NATIONAL 75-PT SCALE' : '75 BALLIK MILLIY TIZIMGA MOSLANGAN',
        heroTitle: lang === 'en' ? 'The fastest path to your target CEFR score.' : 'Ko\'zlangan CEFR natijangizga eng tezkor yo\'l.',
        heroSubtitle: lang === 'en'
            ? 'Meet Atlas, your AI wolf coach. We help you bridge the gap between B1 and C1 using real national exam standards.'
            : 'Atlas bilan tanishing - sizning AI bo\'ri ustozingiz. B1 dan C1 gacha bo\'lgan masofani milliy imtihon standartlari asosida bosib o\'ting.',
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
        testimonials: [
            { name: 'Azizbek K.', role: 'B2 achieved', text: lang === 'en' ? 'Improved my score from 44 to 56 in just 3 weeks.' : '3 haftada natijamni 44 dan 56 ballga ko\'tardim.' },
            { name: 'Madina G.', role: 'C1 candidate', text: lang === 'en' ? 'Atlas’s feedback on Writing Task 2 is incredibly accurate.' : 'Atlasning Writing bo\'yicha tahlillari juda aniq va foydali.' },
            { name: 'Sardorbek M.', role: 'Targeting 60+', text: lang === 'en' ? 'The Reading mock tests feel exactly like the real Agency exams.' : 'Reading testlari xuddi rasmiy Agentlik imtihonidek ekan.' }
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
                        <span className="badge" style={{ marginBottom: '1.5rem', background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' }}>
                            <ShieldCheck size={14} style={{ marginRight: '6px' }} /> {t.heroBadge}
                        </span>
                        <h1 className="hero-title" style={{ textAlign: 'left', margin: '0 0 2rem 0' }}>{t.heroTitle}</h1>
                        <p className="hero-subtitle" style={{ textAlign: 'left', margin: '0 0 3rem 0' }}>{t.heroSubtitle}</p>
                        <div className="hero-actions" style={{ display: 'flex', gap: '1.5rem' }}>
                            <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                                {t.cta} <ArrowRight size={20} />
                            </Link>
                            <div className="trust-indicator hidden-mobile" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', color: '#fbbf24' }}>
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Trusted by 2.4k students</span>
                            </div>
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

            {/* Confidence Section: Why CEFRACADEMY.uz */}
            <section className="confidence-section container" style={{ padding: '8rem 0' }}>
                <div className="grid grid-cols-3" style={{ gap: '3rem' }}>
                    <div className="feature-card-minimal">
                        <div className="icon-wrap color-blue"><ShieldCheck /></div>
                        <h4>National Standard</h4>
                        <p>We use the exact 75-point "Rasch" weighting model used by the state agency.</p>
                    </div>
                    <div className="feature-card-minimal">
                        <div className="icon-wrap color-purple"><Star /></div>
                        <h4>Score Guarantee</h4>
                        <p>Follow our study plan and we guarantee a minimum 10-point score increase.</p>
                    </div>
                    <div className="feature-card-minimal">
                        <div className="icon-wrap color-green"><Quote /></div>
                        <h4>Atlas Feedback</h4>
                        <p>Get personalized feedback from Atlas on every mistake you make.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section container" style={{ marginBottom: '8rem' }}>
                <div className="text-center" style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem' }}>{lang === 'en' ? 'Student Voices' : 'Talabalar fikri'}</h2>
                </div>
                <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
                    {t.testimonials.map((test, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
                            <Quote size={24} style={{ color: 'var(--color-primary)', opacity: 0.2, marginBottom: '1rem' }} />
                            <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', fontSize: '0.95rem' }}>"{test.text}"</p>
                            <div>
                                <strong style={{ display: 'block' }}>{test.name}</strong>
                                <span className="text-muted" style={{ fontSize: '0.85rem' }}>{test.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="footer container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 }}>
                    <div className="brand" style={{ fontSize: '1.25rem' }}>CEFR<span className="text-primary">ACADEMY.uz</span></div>
                    <p>© 2025 CEFRACADEMY.uz. Real National Standards.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
