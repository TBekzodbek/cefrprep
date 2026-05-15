import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Headphones, GraduationCap, Mic, ArrowRight, Zap, Star, Layout, ShieldCheck, Activity, PieChart, Globe, Target, BrainCircuit, Clock, AlertCircle, Sun, Moon } from 'lucide-react';
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
            icon: <BookOpen size={48} />,
            title: lang === 'en' ? 'Reading Comprehension' : 'O\'qib tushunish',
            desc: lang === 'en'
                ? 'Master 4 parts of authentic texts: from ads and emails to academic articles.'
                : '4 qismdan iborat autentik matnlar: e\'lonlardan tortib akademik maqolalargacha.',
            color: '#3b82f6',
            features: [
                lang === 'en' ? 'Scanning & Skimming techniques' : 'Scanning va Skimming usullari',
                lang === 'en' ? 'Genre-specific practice' : 'Janrli matnlar ustida ishlash',
                lang === 'en' ? 'Detailed detail extraction' : 'Detallashgan tahlillar'
            ]
        },
        {
            id: 'listening',
            icon: <Headphones size={48} />,
            title: lang === 'en' ? 'Listening Proficiency' : 'Tinglab tushunish',
            desc: lang === 'en'
                ? '4-part listening lab covering dialogues, radio reports, and academic presentations.'
                : '4 qismdan iborat laboratoriya: muloqotlar, radio-reportajlar va ma\'ruzalar.',
            color: '#10b981',
            features: [
                lang === 'en' ? 'Monologue & Dialogue analysis' : 'Monolog va Dialog tahlili',
                lang === 'en' ? 'Acoustic situational training' : 'Vaziyatli audio mashqlar',
                lang === 'en' ? 'Keyword identification' : 'Kalit so\'zlarni topish'
            ]
        },
        {
            id: 'writing',
            icon: <GraduationCap size={48} />,
            title: lang === 'en' ? 'Writing Competence' : 'Yozma nutq',
            desc: lang === 'en'
                ? 'Practice Task 1 (Letters/Situations) and Task 2 (Opinion Essays).'
                : 'Task 1 (Xat/Vaziyat) va Task 2 (Insho/Esse) bo\'yicha amaliyot.',
            color: '#8b5cf6',
            features: [
                lang === 'en' ? 'Cohesion & Coherence training' : 'Mantiqiy bog\'liqlik (Cohesion)',
                lang === 'en' ? 'Vocabulary range optimization' : 'Lug\'at boyligini oshirish',
                lang === 'en' ? 'Official Uzbek DTM criteria' : 'Rasmiy DTM mezonlari asosida'
            ]
        },
        {
            id: 'speaking',
            icon: <Mic size={48} />,
            title: lang === 'en' ? 'Speaking Fluency' : 'Og\'zaki nutq',
            desc: lang === 'en'
                ? '3-part interview simulation: from personal questions to logical presentations.'
                : '3 qismdan iborat suhbat: shaxsiy savollardan mantiqiy taqdimotgacha.',
            color: '#f59e0b',
            features: [
                lang === 'en' ? 'Unprepared speech practice' : 'Tayyorgarliksiz nutq tajribasi',
                lang === 'en' ? 'Problem-solving monologues' : 'Muammoli vaziyatli monologlar',
                lang === 'en' ? 'Advanced reasoning skills' : 'Mantiqiy asoslash ko\'nikmasi'
            ]
        }
    ];

    const surveyQuestions = [
        {
            id: 'current_level',
            icon: <BrainCircuit size={48} />,
            q: lang === 'en' ? 'What is your current level?' : 'Hozirgi darajangiz qanday?',
            opts: ['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper', 'C1 Advanced']
        },
        {
            id: 'target_level',
            icon: <Target size={48} />,
            q: lang === 'en' ? 'What is your target score?' : 'Maqsadli natijangiz?',
            opts: ['B1 (38-50 pts)', 'B2 (51-64 pts)', 'C1 (65-75 pts)']
        },
        {
            id: 'weakness',
            icon: <AlertCircle size={48} />,
            q: lang === 'en' ? 'Which area is your weakest?' : 'Qaysi bo\'limda qiynalasiz?',
            opts: [lang === 'en' ? 'Speaking & Grammar' : 'Gapirish va Grammatika', lang === 'en' ? 'Academic Writing' : 'Akademik Yozish', lang === 'en' ? 'Reading Speed' : 'O\'qish tezligi', lang === 'en' ? 'Listening Detail' : 'Listening detallari']
        },
        {
            id: 'frequency',
            icon: <Star size={48} />,
            q: lang === 'en' ? 'How often will you study?' : 'Qanchalik tez-tez shug\'ullanasiz?',
            opts: [lang === 'en' ? 'Every day (Intensive)' : 'Har kuni (Intensiv)', lang === 'en' ? '3-4 times a week' : 'Haftada 3-4 marta', lang === 'en' ? 'Weekends only' : 'Faqat dam olish kunlari']
        },
        {
            id: 'time_left',
            icon: <Clock size={48} />,
            q: lang === 'en' ? 'When is your exam date?' : 'Imtihoningiz qachon?',
            opts: [lang === 'en' ? 'Within 1 month' : '1 oy ichida', lang === 'en' ? '1-3 months' : '1-3 oy', lang === 'en' ? 'Just starting' : 'Endi boshlayapman']
        }
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'auto'
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
            localStorage.setItem('pendingSurvey', JSON.stringify({
                current_level: newSelections[0],
                target_level: newSelections[1],
                weakness: newSelections[2],
                frequency: newSelections[3],
                time_left: newSelections[4]
            }));

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
            {/* Top Navigation Bar */}
            <header className="onboarding-header">
                <div className="container nav-strip">
                    <Link to="/" className="brand-mini">
                        <span className="text-primary" style={{ fontWeight: 800 }}>CEFR</span>ACADEMY
                    </Link>
                    <div className="cat-btns-web">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => scrollToSection(cat.id)}
                                className="cat-nav-btn"
                                style={{ borderColor: cat.color }}
                            >
                                {cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn btn-ghost" onClick={toggleTheme} title="Toggle Theme" style={{ color: '#64748b' }}>
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button className="btn btn-ghost" onClick={toggleLang} style={{ color: '#64748b' }}>
                            <Globe size={20} /> <span>{lang.toUpperCase()}</span>
                        </button>
                        <button onClick={() => scrollToSection('builder')} className="btn btn-primary">{lang === 'en' ? 'Build Plan' : 'Reja tuzish'}</button>
                    </div>
                </div>
            </header>

            <main className="onboarding-sections">
                <section className="hero-onboarding-wrapper" id="home">
                    <div className="container hero-grid">
                        <motion.div
                            className="hero-text"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className="badge-premium">75-POINT SCALE ALIGNED</span>
                            <h1 className="hero-title">
                                {lang === 'en' ? 'The fastest path to your CEFR score.' : 'CEFR natijangizga eng tezkor yo\'l.'}
                            </h1>
                            <p className="hero-subtitle">
                                {lang === 'en'
                                    ? 'Meet Atlas, your AI robot coach. Bridge the gap between B1 and C1 with national exam standards.'
                                    : 'Atlas bilan tanishing - sizning AI robot ustozingiz. B1 dan C1 gacha bo\'lgan masofani milliy standartlarda bosib o\'ting.'}
                            </p>
                            <div className="hero-cta-group">
                                <button onClick={() => scrollToSection('builder')} className="btn btn-primary btn-xl btn-glow">
                                    {lang === 'en' ? 'Start Learning' : 'O\'rganishni boshlash'}
                                </button>
                                <div className="trust-badges">
                                    <ShieldCheck size={20} /> <span>Official DTM Methodology</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="hero-visual"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <img src={atlasWolfImg} alt="Atlas" className="mascot-img-onboarding" />
                        </motion.div>
                    </div>
                </section>

                <div className="onboarding-stats-strip">
                    <div className="container stats-flex">
                        <div className="stat-pill"><Activity size={24} /> <span>+12 Avg Point Increase</span></div>
                        <div className="stat-pill"><PieChart size={24} /> <span>98% Score Accuracy</span></div>
                        <div className="stat-pill"><Star size={24} /> <span>2.4k Successful Students</span></div>
                    </div>
                </div>

                {/* Benefits Informational Section */}
                <section id="benefits" className="benefits-section container" style={{ marginTop: '4rem', padding: '3rem', background: 'var(--color-background-alt)', borderRadius: '2rem', border: '1px solid var(--color-border)', marginBottom: '4rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(280px, 0.8fr)', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', lineHeight: 1.2 }}>
                                {lang === 'en' ? 'Why get a National Certificate?' : 'Nega milliy sertifikat olish kerak?'}
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.25rem' }}>
                                    <div style={{ background: '#3b82f61a', padding: '0.75rem', borderRadius: '1rem' }}><ShieldCheck size={28} className="text-primary" /></div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>{lang === 'en' ? 'University Entrance Bonus' : 'OTM kirish imtihonlari'}</h4>
                                        <p className="text-muted" style={{ fontSize: '0.95rem' }}>{lang === 'en' ? 'Get the maximum score automatically for Bachelor\'s (B1+) and Master\'s (B2+) entrance exams in Uzbekistan.' : 'Bakalavriat (B1+) va Magistratura (B2+) kirish imtihonlarida chet tili fanidan avtomatik ravishda maksimal ballga ega bo\'ling.'}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.25rem' }}>
                                    <div style={{ background: '#10b9811a', padding: '0.75rem', borderRadius: '1rem' }}><Star size={28} className="text-secondary" /></div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>{lang === 'en' ? '3 Years Validity' : '3 yillik imtiyoz'}</h4>
                                        <p className="text-muted" style={{ fontSize: '0.95rem' }}>{lang === 'en' ? 'The certificate is valid for 3 years, recognized by all major institutions and employers.' : 'Sertifikat berilgan kundan boshlab 3 yil davomida o\'z kuchini saqlab qoladi.'}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.25rem' }}>
                                    <div style={{ background: '#8b5cf61a', padding: '0.75rem', borderRadius: '1rem' }}><Clock size={28} className="text-purple" /></div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>{lang === 'en' ? 'Optimized Time Structure' : 'Vaqtni to\'g\'ri boshqarish'}</h4>
                                        <p className="text-muted" style={{ fontSize: '0.95rem' }}>{lang === 'en' ? 'Train under real exam conditions: 3h 05m (B1), 3h 35m (B2), and 3h 50m (C1).' : 'Haqiqiy imtihon sharoitida shug\'ullaning: 3s 05daqiqa (B1) dan 3s 50daqiqa (C1) gacha.'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '2.5rem', background: 'var(--color-surface)', borderRadius: '2rem', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)' }}>
                            <h4 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem' }}>
                                <Layout className="text-primary" /> {lang === 'en' ? 'Official Exam Format (DTM)' : 'Rasmiy imtihon formati (DTM)'}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {[
                                    { n: lang === 'en' ? 'Listening' : 'Tinglab tushunish', t: '30-35 min', q: '30 Qs' },
                                    { n: lang === 'en' ? 'Reading' : 'O\'qib tushunish', t: '60-70 min', q: '30 Qs' },
                                    { n: lang === 'en' ? 'Grammar & Vocab' : 'Leksik-grammatika', t: '30-40 min', q: '30 Qs' },
                                    { n: lang === 'en' ? 'Writing' : 'Yozma nutq', t: '45-80 min', q: '2 Tasks' },
                                    { n: lang === 'en' ? 'Speaking' : 'Og\'zaki nutq', t: '15-20 min', q: '3 Parts' }
                                ].map((row, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: idx < 4 ? '1px solid var(--color-background-alt)' : 'none' }}>
                                        <span style={{ fontWeight: 500 }}>{row.n}</span>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{row.t}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{row.q}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {categories.map((cat, i) => (
                    <section key={cat.id} id={cat.id} className="category-section" style={{ borderLeft: `8px solid ${cat.color}` }}>
                        <div className="container section-inner">
                            <motion.div
                                className="section-content"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                viewport={{ margin: "-100px" }}
                            >
                                <div className="section-badge" style={{ background: `${cat.color}20`, color: cat.color }}>
                                    PHASE 0{i + 1}
                                </div>
                                <h2 className="section-title">{cat.title}</h2>
                                <p className="section-desc">{cat.desc}</p>

                                <ul className="section-features">
                                    {cat.features.map((feature, idx) => (
                                        <li key={idx}>
                                            <Star size={16} style={{ color: cat.color }} /> {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="section-actions">
                                    <button onClick={() => scrollToSection('builder')} className="btn btn-primary btn-lg" style={{ background: cat.color }}>
                                        {lang === 'en' ? 'Build My Plan' : 'Reja tuzish'} <ArrowRight size={20} />
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                className="section-visual-container"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="premium-shape" style={{ background: `linear-gradient(135deg, ${cat.color} 0%, #1e293b 100%)` }}>
                                    <div className="inner-icon" style={{ opacity: 0.25 }}>{cat.icon}</div>
                                </div>
                                <div className="floating-ui-card">
                                    <div className="card-header"><Layout size={14} /> Module Ready</div>
                                    <div className="card-line short" />
                                    <div className="card-line long" />
                                </div>
                            </motion.div>
                        </div>
                    </section>
                ))}

                {/* AI BUILDER SECTION - THE QUESTIONS */}
                <section className="builder-section" id="builder">
                    <div className="container">
                        <div className="builder-header text-center">
                            <span className="badge-premium">AI BUILDER</span>
                            <h2>{lang === 'en' ? 'Customize Your Study Plan' : 'O\'quv rejangizni shakllantiring'}</h2>
                            <p className="text-muted">{lang === 'en' ? 'Tell Atlas about your current standing to get a tailored roadmap.' : 'Atlasga hozirgi darajangiz haqida ayting va shaxsiy reja oling.'}</p>
                        </div>

                        <div className="builder-card-container">
                            <AnimatePresence mode="wait">
                                {!isGenerating ? (
                                    <motion.div
                                        key={`q-${step}`}
                                        className="builder-question-card glass-panel"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <div className="q-icon-box">{surveyQuestions[step - 1].icon}</div>
                                        <h3>{surveyQuestions[step - 1].q}</h3>
                                        <div className="builder-options">
                                            {surveyQuestions[step - 1].opts.map((opt, i) => (
                                                <button key={i} className="builder-opt-btn" onClick={() => handleSelect(opt)}>
                                                    {opt} <ArrowRight size={18} />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="q-progress">
                                            <span>Step {step} of 5</span>
                                            <div className="progress-track"><div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }} /></div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="generating"
                                        className="builder-generating-card glass-panel text-center"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <div className="generating-visual">
                                            <Zap size={64} className="animate-pulse text-warning" />
                                        </div>
                                        <h2>{lang === 'en' ? 'Generating Plan...' : 'Reja tuzilmoqda...'}</h2>
                                        <p>{lang === 'en' ? 'Atlas is analyzing your targets to build your 30-day roadmap.' : 'Atlas maqsadlaringiz asosida 30 kunlik reja tayyorlamoqda.'}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="onboarding-footer">
                <div className="container">
                    <div className="brand-footer">
                        <div className="brand-large">CEFR<span className="text-primary">ACADEMY</span></div>
                        <p>© 2025 CEFRACADEMY.uz. Built for Uzbekistan.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default OnboardingSurvey;
