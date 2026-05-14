import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Headphones, GraduationCap, Mic, ArrowRight, Zap, Star, BrainCircuit } from 'lucide-react';
import './OnboardingSurvey.css';

interface Props {
    lang: 'en' | 'uz';
}

const OnboardingSurvey = ({ lang }: Props) => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 'reading',
            icon: <BookOpen size={64} />,
            title: lang === 'en' ? 'Reading Strategy' : 'O\'qish strategiyasi',
            desc: lang === 'en'
                ? 'Master 60-minute time management and Rasch-based text complexity.'
                : '60 daqiqalik vaqt menejmenti va matn murakkabligini o\'rganing.',
            color: '#3b82f6',
            action: '/dashboard/reading',
            stats: lang === 'en' ? '30+ Passages' : '30+ Matnlar'
        },
        {
            id: 'listening',
            icon: <Headphones size={64} />,
            title: lang === 'en' ? 'Listening Acoustics' : 'Eshitish qobiliyati',
            desc: lang === 'en'
                ? 'Practice with real Uzbekistan exam recording speeds and accents.'
                : 'Haqiqiy imtihon tezligi va aksentlarida mashq qiling.',
            color: '#10b981',
            action: '/dashboard/listening',
            stats: lang === 'en' ? '45+ Audios' : '45+ Audiolar'
        },
        {
            id: 'writing',
            icon: <GraduationCap size={64} />,
            title: lang === 'en' ? 'Writing Evaluation' : 'Yozish mahorati',
            desc: lang === 'en'
                ? 'AI analysis of your Task 1 and Task 2 based on DTM criteria.'
                : 'Task 1 va Task 2 uchun DTM mezonlari asosida AI tahlil.',
            color: '#8b5cf6',
            action: '/dashboard/writing',
            stats: lang === 'en' ? 'AI Feedback' : 'AI Tahlil'
        },
        {
            id: 'speaking',
            icon: <Mic size={64} />,
            title: lang === 'en' ? 'Speaking Conversation' : 'Gapirish mahorati',
            desc: lang === 'en'
                ? 'Real-time conversation with Atlas AI about exam topics.'
                : 'Imtihon mavzularida Atlas AI bilan jonli suhbat.',
            color: '#f59e0b',
            action: '/dashboard/speaking',
            stats: lang === 'en' ? 'Live Chat' : 'Jonli muloqot'
        }
    ];

    return (
        <div className="onboarding-scroll-container">
            {/* Quick Links Nav */}
            <nav className="onboarding-sticky-nav">
                {categories.map(cat => (
                    <a key={cat.id} href={`#${cat.id}`} className="nav-anchor">
                        {cat.icon}
                        <span>{cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}</span>
                    </a>
                ))}
            </nav>

            {/* Intro Section */}
            <section className="onboarding-section intro">
                <motion.div
                    className="intro-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="badge-premium"><BrainCircuit size={16} /> {lang === 'en' ? 'DIAGNOSTIC TOUR' : 'DIAGNOSTIKA'}</span>
                    <h1>{lang === 'en' ? 'Welcome to your AI Journey' : 'AI O\'quv yo\'nalishiga xush kelibsiz'}</h1>
                    <p>{lang === 'en' ? 'Scroll down to explore each category and start your personalized preparation.' : 'Har bir bo\'limni o\'rganish uchun pastga tushing va tayyorgarlikni boshlang.'}</p>
                    <div className="scroll-indicator">
                        <div className="mouse"></div>
                        <span>Scroll Down</span>
                    </div>
                </motion.div>
            </section>

            {/* Category Sections */}
            {categories.map((cat, i) => (
                <section key={cat.id} id={cat.id} className="onboarding-section category-page" style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <div className="container category-grid">
                        <motion.div
                            className="category-visual"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="icon-main-large" style={{ color: cat.color, background: `${cat.color}15` }}>
                                {cat.icon}
                            </div>
                            <div className="visual-decoration">
                                <div className="floating-stat"><Star size={16} /> {cat.stats}</div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="category-info"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="step-tag">Phase 0{i + 1}</div>
                            <h2>{cat.title}</h2>
                            <p>{cat.desc}</p>

                            <div className="feature-bullets">
                                <div className="bullet"><CheckCircle size={18} /> {lang === 'en' ? 'Authentic DTM materials' : 'Haqiqiy DTM materiallari'}</div>
                                <div className="bullet"><CheckCircle size={18} /> {lang === 'en' ? 'Personalized feedback' : 'Shaxsiy tahlillar'}</div>
                            </div>

                            <button onClick={() => navigate(cat.action)} className="btn btn-primary btn-lg" style={{ background: cat.color }}>
                                {lang === 'en' ? 'Enter' : 'Kirish'} {cat.title} <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    </div>
                </section>
            ))}

            <section className="onboarding-section final">
                <motion.div
                    className="final-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                >
                    <Zap size={48} className="text-warning" />
                    <h2>{lang === 'en' ? 'Ready to achieve C1?' : 'C1 darajaga tayyormisiz?'}</h2>
                    <p>{lang === 'en' ? 'Atlas is ready to build your 30-day study roadmap based on these selections.' : 'Atlas tanlovlaringiz asosida 30 kunlik reja tuzishga tayyor.'}</p>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-glow">
                        {lang === 'en' ? 'Go to My Dashboard' : 'Dashboardga o\'tish'}
                    </button>
                </motion.div>
            </section>
        </div>
    );
};

// Help helper
const CheckCircle = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);

export default OnboardingSurvey;
