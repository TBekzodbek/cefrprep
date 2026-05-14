import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Headphones, GraduationCap, Mic, CheckCircle, ShieldCheck, Zap, Users } from 'lucide-react';
import './Home.css';

interface HomeProps {
    lang: 'en' | 'uz';
}

const Home = ({ lang }: HomeProps) => {
    const t = {
        heroTitle: lang === 'en' ? 'The Industry Standard in CEFR Preparation' : 'CEFR imtihoniga tayyorlanishning yangi standarti',
        heroSubtitle: lang === 'en'
            ? 'Join 10,000+ students mastering English with our AI-driven practice platform tailored for the CEFR framework.'
            : 'CEFR tizimi uchun mo\'ljallangan AI platformamiz orqali Ingliz tilini o\'rganayotgan 10,000 dan ortiq talabalarga qo\'shiling.',
        getStarted: lang === 'en' ? 'Start Free Practice' : 'Bepul mashqni boshlash',
        login: lang === 'en' ? 'Sign In' : 'Kirish',
        sections: [
            {
                id: 'reading',
                icon: <BookOpen className="text-primary" />,
                title: lang === 'en' ? 'Advanced Reading' : 'O\'qish ko\'nikmalari',
                description: lang === 'en' ? 'Master complex academic texts with our real-time vocabulary analyzer and structure guides.' : 'Matn tuzilishi va murakkab so\'zlarni real vaqtda tahlil qiluvchi qo\'llanmalar orqali akademik matnlarni o\'rganing.',
                benefits: lang === 'en' ? ['Authentic mock exams', 'AI-powered vocabulary extraction', 'Speed-reading analytics'] : ['Haqiqiy mock imtihonlar', 'AI orqali so\'zlarni tahlil qilish', 'O\'qish tezligi tahlili']
            },
            {
                id: 'listening',
                icon: <Headphones className="text-primary" />,
                title: lang === 'en' ? 'Immersive Listening' : 'Eshitishni rivojlantirish',
                description: lang === 'en' ? 'Practice with diverse accents and native speakers. Get instant transcripts and error analysis.' : 'Turli aksentlarga ega ona tilida so\'zlashuvchilar bilan mashq qiling. Transkript va tahlillarni darhol oling.',
                benefits: lang === 'en' ? ['High-fidelity audio', 'Full interactive transcripts', 'Accent-based training'] : ['Yuqori sifatli audiolar', 'To\'liq interaktiv transkriptlar', 'Aksentlar bo\'yicha o\'quv']
            },
            {
                id: 'writing',
                icon: <GraduationCap className="text-primary" />,
                title: lang === 'en' ? 'Writing Lab' : 'Yozish laboratoriyasi',
                description: lang === 'en' ? 'Receive detailed band scores and grammar corrections instantly using our proprietary AI.' : 'Xususiy AI tizimimiz orqali insholaringiz uchun darhol ball va grammatik tuzatishlar oling.',
                benefits: lang === 'en' ? ['Real-time band scoring', 'Advanced grammar insight', 'Cohesion analysis'] : ['Real vaqtda ballarni aniqlash', 'Grammatik tahlil', 'Matn bog\'liqligi tahlili']
            }
        ]
    };

    return (
        <div className="home-page">
            <header className="hero container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="hero-title">{t.heroTitle}</h1>
                    <p className="hero-subtitle">{t.heroSubtitle}</p>
                    <div className="hero-actions">
                        <Link to="/login" className="btn btn-primary btn-cta">
                            {t.getStarted} <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="btn btn-outline btn-cta">
                            {t.login}
                        </Link>
                    </div>
                </motion.div>
            </header>

            <section className="trust-section">
                <div className="container">
                    <div className="trust-grid">
                        <span className="trust-item">TRUSTED BY STUDENTS</span>
                        <span className="trust-item">AI-POWERED</span>
                        <span className="trust-item">CEFR ALIGNED</span>
                        <span className="trust-item">OFFICIAL STANDARDS</span>
                    </div>
                </div>
            </section>

            <section className="container showcase-container">
                {t.sections.map((sec, i) => (
                    <div key={sec.id} className="section-showcase">
                        <div className="showcase-content">
                            <div className="icon-wrapper color-blue" style={{ marginBottom: '2rem' }}>
                                {sec.icon}
                            </div>
                            <h2>{sec.title}</h2>
                            <p>{sec.description}</p>
                            <ul className="benefits-list">
                                {sec.benefits.map((ben, j) => (
                                    <li key={j}>
                                        <CheckCircle size={20} className="text-success" />
                                        {ben}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/login" className="btn btn-outline">
                                {lang === 'en' ? 'Explore Module' : 'Bo\'limni ko\'rish'}
                            </Link>
                        </div>
                        <div className="showcase-visual">
                            <div className="visual-mock">
                                <div style={{ height: '20px', width: '60%', background: '#f1f5f9', borderRadius: '4px', marginBottom: '1rem' }}></div>
                                <div style={{ height: '10px', width: '100%', background: '#f1f5f9', borderRadius: '2px', marginBottom: '0.5rem' }}></div>
                                <div style={{ height: '10px', width: '90%', background: '#f1f5f9', borderRadius: '2px', marginBottom: '0.5rem' }}></div>
                                <div style={{ height: '10px', width: '95%', background: '#f1f5f9', borderRadius: '2px', marginBottom: '0.5rem' }}></div>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                    <div style={{ height: '80px', width: '120px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '8px' }}></div>
                                    <div style={{ height: '80px', width: '120px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '8px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <footer className="footer">
                <div className="container" style={{ textAlign: 'center' }}>
                    <p className="text-muted">© 2025 CEFRprep. Built with high standards for English learners in Uzbekistan.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
