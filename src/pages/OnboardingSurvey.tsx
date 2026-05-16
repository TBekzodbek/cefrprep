import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Headphones, GraduationCap, Mic, ArrowRight, Zap, Star, ShieldCheck, Activity, PieChart, Globe, Target, BrainCircuit, Clock, AlertCircle, Sun, Moon, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './OnboardingSurvey.css';

// Asset imports
import atlasWolfImg from '../assets/images/atlas-wolf.png';

interface Props {
    lang: 'en' | 'uz';
    toggleLang: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const OnboardingSurvey = ({ lang, toggleLang, theme, toggleTheme }: Props) => {
    const navigate = useNavigate();

    // Survey State
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selections, setSelections] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        };
        fetchUser();
    }, []);

    const categories = [
        {
            id: 'reading',
            icon: <BookOpen size={40} />,
            title: lang === 'en' ? 'Reading' : 'O\'qib tushunish',
            desc: lang === 'en' ? 'Master authentic texts: from ads to academic articles.' : 'E\'lonlardan tortib akademik maqolalargacha bo\'lgan matnlar.',
            color: '#3b82f6',
            features: ['Scanning & Skimming', 'Genre-specific practice', 'Detail extraction']
        },
        {
            id: 'listening',
            icon: <Headphones size={40} />,
            title: lang === 'en' ? 'Listening' : 'Tinglab tushunish',
            desc: lang === 'en' ? 'Dialogues, reports, and academic presentations.' : 'Muloqotlar, reportajlar va ma\'ruzalar.',
            color: '#10b981',
            features: ['Dialogue analysis', 'Situational training', 'Keyword identification']
        },
        {
            id: 'writing',
            icon: <GraduationCap size={40} />,
            title: lang === 'en' ? 'Writing' : 'Yozma nutq',
            desc: lang === 'en' ? 'Practice Task 1 (Letters) and Task 2 (Essays).' : 'Task 1 (Xat) va Task 2 (Esse) bo\'yicha amaliyot.',
            color: '#8b5cf6',
            features: ['Cohesion & Coherence', 'Vocabulary optimization', 'Official DTM criteria']
        },
        {
            id: 'speaking',
            icon: <Mic size={40} />,
            title: lang === 'en' ? 'Speaking' : 'Og\'zaki nutq',
            desc: lang === 'en' ? 'Interview simulation and logical presentations.' : 'Suhbat va mantiqiy taqdimotlar.',
            color: '#f97316',
            features: ['Unprepared speech', 'Problem-solving', 'Advanced reasoning']
        }
    ];

    const surveyQuestions = [
        {
            id: 'current_level',
            icon: <BrainCircuit size={40} />,
            q: lang === 'en' ? 'What is your current level?' : 'Hozirgi darajangiz qanday?',
            opts: ['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper', 'C1 Advanced']
        },
        {
            id: 'target_level',
            icon: <Target size={40} />,
            q: lang === 'en' ? 'What is your target score?' : 'Maqsadli natijangiz?',
            opts: ['B1 (38-50 pts)', 'B2 (51-64 pts)', 'C1 (65-75 pts)']
        },
        {
            id: 'weakness',
            icon: <AlertCircle size={40} />,
            q: lang === 'en' ? 'Which area is your weakest?' : 'Qaysi bo\'limda qiynalasiz?',
            opts: [lang === 'en' ? 'Speaking & Grammar' : 'Gapirish va Grammatika', lang === 'en' ? 'Academic Writing' : 'Akademik Yozish', lang === 'en' ? 'Reading Speed' : 'O\'qish tezligi', lang === 'en' ? 'Listening Detail' : 'Listening detallari']
        },
        {
            id: 'frequency',
            icon: <Star size={40} />,
            q: lang === 'en' ? 'How often will you study?' : 'Qanchalik tez-tez shug\'ullanasiz?',
            opts: [lang === 'en' ? 'Every day (Intensive)' : 'Har kuni (Intensiv)', lang === 'en' ? '3-4 times a week' : 'Haftada 3-4 marta', lang === 'en' ? 'Weekends only' : 'Faqat dam olish kunlari']
        },
        {
            id: 'time_left',
            icon: <Clock size={40} />,
            q: lang === 'en' ? 'When is your exam date?' : 'Imtihoningiz qachon?',
            opts: [lang === 'en' ? 'Within 1 month' : '1 oy ichida', lang === 'en' ? '1-3 months' : '1-3 oy', lang === 'en' ? 'Just starting' : 'Endi boshlayapman']
        }
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 90,
                behavior: 'smooth'
            });
        }
    };

    const handleSelect = async (opt: string) => {
        const newSelections = [...selections, opt];
        setSelections(newSelections);

        if (step < surveyQuestions.length) {
            setStep(step + 1);
        } else {
            setIsGenerating(true);
            if (userId) {
                await supabase.from('profiles').upsert({
                    id: userId,
                    current_level: newSelections[0],
                    target_level: newSelections[1],
                    onboarding_completed: true,
                    weakness: newSelections[2],
                    frequency: newSelections[3],
                    time_left: newSelections[4]
                });
                setTimeout(() => navigate('/dashboard'), 2500);
            } else {
                setTimeout(() => navigate('/login?mode=signup'), 2500);
            }
        }
    };

    return (
        <div className="onboarding-master">
            {/* Top Fixed Header - ieltsnation style */}
            <header className="onboarding-header">
                <div className="container header-inner">
                    <Link to="/" className="brand-mini allow-select">
                        CEFR<span className="brand-highlight">ACADEMY</span>
                    </Link>

                    <nav className="header-nav">
                        <button className="nav-link" onClick={() => scrollToSection('reading')}>Reading</button>
                        <button className="nav-link" onClick={() => scrollToSection('listening')}>Listening</button>
                        <button className="nav-link" onClick={() => scrollToSection('writing')}>Writing</button>
                        <button className="nav-link" onClick={() => scrollToSection('speaking')}>Speaking</button>
                    </nav>

                    <div className="header-actions">
                        <button className="action-icon-btn" onClick={toggleTheme} title="Toggle Theme">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button className="action-icon-btn" onClick={toggleLang}>
                            <Globe size={20} />
                            <span className="action-label">{lang.toUpperCase()}</span>
                        </button>
                        <button className="btn-header-primary" onClick={() => scrollToSection('builder')}>
                            Build Plan
                        </button>
                    </div>
                </div>
            </header>

            <main className="onboarding-content">
                {/* Hero Section */}
                <section className="hero-section" id="home">
                    <div className="container hero-container">
                        <div className="hero-text-content">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="hero-main-title">
                                    The fastest path to your <br />
                                    <span className="brand-blue">CEFR score.</span>
                                </h1>
                                <p className="hero-description">
                                    Meet Atlas, your AI powered language coach. Bridge the gap between B1 and C1 with personalized national exam standards.
                                </p>
                                <div className="hero-actions">
                                    <button className="btn-hero-main" onClick={() => scrollToSection('builder')}>
                                        Start Learning Now
                                    </button>
                                    <div className="badge-trust">
                                        <CheckCircle size={18} className="icon-check" />
                                        <span>Official DTM Methodology</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        <div className="hero-visual-content">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="visual-wrapper"
                            >
                                <img src={atlasWolfImg} alt="Atlas" className="mascot-img" />
                                <div className="visual-decoration-circle" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats Strip */}
                <div className="onboarding-stats-bar">
                    <div className="container stats-flex">
                        <div className="stat-unit">
                            <div className="stat-icon-bg"><Activity size={24} /></div>
                            <div className="stat-info">
                                <span className="stat-value">+12 Avg Point</span>
                                <span className="stat-label">Increase</span>
                            </div>
                        </div>
                        <div className="stat-unit">
                            <div className="stat-icon-bg"><PieChart size={24} /></div>
                            <div className="stat-info">
                                <span className="stat-value">98% Score</span>
                                <span className="stat-label">Accuracy</span>
                            </div>
                        </div>
                        <div className="stat-unit">
                            <div className="stat-icon-bg"><Star size={24} /></div>
                            <div className="stat-info">
                                <span className="stat-value">2.4k Successful</span>
                                <span className="stat-label">Students</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <section id="benefits" className="benefits-section">
                    <div className="container benefits-grid">
                        <div className="benefits-left">
                            <h2 className="section-heading">
                                {lang === 'en' ? 'Why CEFR Academy?' : 'Nega CEFR Academy?'}
                            </h2>
                            <div className="features-stack">
                                <div className="feature-item">
                                    <div className="feature-icon-box blue"><ShieldCheck size={28} /></div>
                                    <div className="feature-text">
                                        <h4>National Standards</h4>
                                        <p>Aligned 100% with Uzbek DTM examination system. No guesswork, just results.</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon-box orange"><Zap size={28} /></div>
                                    <div className="feature-text">
                                        <h4>AI Powered Tutor</h4>
                                        <p>Real-time writing and speaking assessments by Atlas, your private language coach.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="benefits-right">
                            <div className="exam-format-card">
                                <h3 className="card-title">Official Exam Format</h3>
                                <div className="format-rows">
                                    {['Reading', 'Listening', 'Writing', 'Speaking'].map((skill, i) => (
                                        <div key={i} className="format-row">
                                            <span className="skill-name">{skill}</span>
                                            <span className="skill-time">{i === 3 ? '15-20 min' : '60-70 min'}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="card-footer-alert">
                                    <AlertCircle size={16} />
                                    <span>Updated for 2025 Standards</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detailed Category Sections */}
                {categories.map((cat, i) => (
                    <section key={cat.id} id={cat.id} className={`category-detail-section ${i % 2 === 0 ? 'white' : 'alt'}`}>
                        <div className="container category-detail-grid">
                            {i % 2 !== 0 && (
                                <div className="category-visual">
                                    <div className="gradient-shape" style={{ background: `linear-gradient(135deg, ${cat.color} 0%, #1e293b 100%)` }}>
                                        {cat.icon}
                                    </div>
                                </div>
                            )}
                            <div className="category-text">
                                <span className="cat-badge" style={{ background: `${cat.color}15`, color: cat.color }}>PHASE 0{i + 1}</span>
                                <h2 className="cat-title">{cat.title}</h2>
                                <p className="cat-description">{cat.desc}</p>
                                <ul className="cat-features-list">
                                    {cat.features.map((f, idx) => (
                                        <li key={idx} className="cat-feature-item">
                                            <CheckCircle size={18} style={{ color: cat.color }} />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className="btn-cat-action" style={{ background: cat.color }} onClick={() => scrollToSection('builder')}>
                                    Start Practice <ArrowRight size={18} />
                                </button>
                            </div>
                            {i % 2 === 0 && (
                                <div className="category-visual">
                                    <div className="gradient-shape" style={{ background: `linear-gradient(135deg, ${cat.color} 0%, #1e293b 100%)` }}>
                                        {cat.icon}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                ))}

                {/* AI Study Plan Builder Section */}
                <section className="builder-section" id="builder">
                    <div className="container builder-container">
                        <div className="builder-header text-center">
                            <h2 className="builder-title">Build Your Study Plan</h2>
                            <p className="builder-subtitle">Tell Atlas about your current goals and level.</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {!isGenerating ? (
                                <motion.div
                                    key={step}
                                    className="survey-card"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="survey-question">
                                        <div className="q-icon-circle">{surveyQuestions[step - 1].icon}</div>
                                        <h3>{surveyQuestions[step - 1].q}</h3>
                                    </div>
                                    <div className="survey-options">
                                        {surveyQuestions[step - 1].opts.map((opt, idx) => (
                                            <button key={idx} className="btn-survey-option" onClick={() => handleSelect(opt)}>
                                                <span>{opt}</span>
                                                <ArrowRight size={20} />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="survey-progress-footer">
                                        <div className="progress-bar-base">
                                            <motion.div
                                                className="progress-bar-fill"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(step / surveyQuestions.length) * 100}%` }}
                                            />
                                        </div>
                                        <span className="step-count">Step {step} of {surveyQuestions.length}</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="gen" className="generating-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <Zap size={64} className="animate-pulse icon-zap" />
                                    <h2>Generating Roadmap...</h2>
                                    <p>Atlas is analyzing your targets to build your 30-day plan.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="onboarding-footer">
                <div className="container footer-inner">
                    <div className="footer-brand allow-select">
                        CEFR<span className="brand-highlight">ACADEMY</span>
                    </div>
                    <p className="footer-copy">© 2025 cefracademy.uz. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default OnboardingSurvey;
