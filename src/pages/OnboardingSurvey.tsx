// CEFR Academy — Landing / Onboarding v2.0
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowRight, Zap, Sparkles, Flame, Clock, Activity,
    Brain, BarChart2, Layers, Quote, CheckCircle2,
    BookOpen, GraduationCap, Mic, Library, TrendingUp,
    Star, Shield, Trophy, Users, ChevronDown,
    Unlock, Check, X,
    Rocket, Timer, Award, Sun, Moon, Globe,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import './OnboardingSurvey.css';

interface Props {
    lang: 'en' | 'uz';
    toggleLang: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const OnboardingSurvey = ({ lang, toggleLang, theme, toggleTheme }: Props) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showResult, setShowResult] = useState(false);
    const [selections, setSelections] = useState<string[]>([]);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => { supabase.auth.getUser(); }, []);

    const scrollTo = (id: string) =>
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    /* ── Survey (5 questions) ── */
    const surveyQuestions = [
        {
            id: 'current_level',
            q: 'What is your current CEFR level?',
            sub: 'Be honest — Atlas will build the right plan for where you are now.',
            opts: [
                { label: 'A1 — Beginner', icon: '🌱' },
                { label: 'A2 — Elementary', icon: '📘' },
                { label: 'B1 — Intermediate', icon: '📗' },
                { label: 'B2 — Upper-Intermediate', icon: '📙' },
                { label: 'C1 — Advanced', icon: '🏆' },
            ],
        },
        {
            id: 'target_level',
            q: 'What is your target score?',
            sub: 'This is the certificate level you need for university admission or work.',
            opts: [
                { label: 'B1 — 38–50 pts', icon: '🎯' },
                { label: 'B2 — 51–64 pts', icon: '🎯' },
                { label: 'C1 — 65–75 pts', icon: '🎯' },
            ],
        },
        {
            id: 'exam_date',
            q: 'When is your exam?',
            sub: 'We\'ll set the pace of your plan to match your deadline.',
            opts: [
                { label: 'This month — urgent!', icon: '🔥' },
                { label: 'In 1–3 months', icon: '⚡' },
                { label: 'In 3–6 months', icon: '📅' },
                { label: 'Not set yet', icon: '🕐' },
            ],
        },
        {
            id: 'weakness',
            q: 'Which skill needs the most work?',
            sub: 'Atlas will double the intensity on this skill in your roadmap.',
            opts: [
                { label: 'Speaking & Fluency', icon: '🎤' },
                { label: 'Academic Writing', icon: '✍️' },
                { label: 'Reading Speed', icon: '📖' },
                { label: 'Listening Detail', icon: '🎧' },
            ],
        },
        {
            id: 'study_time',
            q: 'How much time can you study daily?',
            sub: 'Even 15 minutes a day is enough — consistency beats volume.',
            opts: [
                { label: '15 minutes', icon: '⏱️' },
                { label: '30 minutes', icon: '⏰' },
                { label: '1 hour', icon: '🕐' },
                { label: '2+ hours (intensive)', icon: '🚀' },
            ],
        },
    ];

    const handleSelect = (opt: string) => {
        const newSel = [...selections, opt];
        setSelections(newSel);
        if (step < surveyQuestions.length) {
            setStep(step + 1);
        } else {
            setShowResult(true);
        }
    };

    /* ── Compute recommendation from selections ── */
    const getLevelGap = () => {
        const order = ['A1', 'A2', 'B1', 'B2', 'C1'];
        const cur = order.findIndex(l => selections[0]?.startsWith(l));
        const tgt = order.findIndex(l => selections[1]?.startsWith(l));
        return Math.max(0, tgt - cur);
    };
    const isUrgent = selections[2]?.includes('This month') || selections[2]?.includes('1–3');
    const gap = getLevelGap();
    const recommendPremium = gap >= 2 || isUrgent;
    const currentLabel = selections[0]?.split(' — ')[0] ?? 'A2';
    const targetLabel  = selections[1]?.split(' — ')[0] ?? 'B2';

    /* ── Features ── */
    const features = [
        { title: 'Authentic Mock Tests', desc: '50+ full Reading & Listening papers aligned to official DTM format.', color: 'var(--color-primary)', bg: 'rgba(91,80,232,0.08)', icon: <BookOpen size={20} color="var(--color-primary)" />, chips: ['B1', 'B2', 'C1'] },
        { title: 'AI Essay Grading', desc: 'Instant C1-level feedback on every Writing task within 30 seconds.', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.08)', icon: <GraduationCap size={20} color="var(--color-success)" />, chips: ['Essay', 'Letter', 'Report'] },
        { title: 'Vocabulary Lab', desc: 'Master the 1,500 most frequent academic words with spaced repetition.', color: 'var(--color-purple)', bg: 'rgba(139,92,246,0.08)', icon: <Library size={20} color="var(--color-purple)" />, chips: ['A2', 'B1', 'B2', 'C1'] },
        { title: 'Speaking Atlas', desc: 'AI fluency + pronunciation scoring on real speaking prompts.', color: 'var(--color-error)', bg: 'rgba(244,63,94,0.08)', icon: <Mic size={20} color="var(--color-error)" />, chips: ['Fluency', 'Pronunciation'] },
        { title: 'Level Progress Map', desc: 'Visualize your path from A1 to C1 with live XP and streak tracking.', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.08)', icon: <TrendingUp size={20} color="var(--color-warning)" />, chips: ['A1→C1', 'XP System'] },
        { title: 'Grammar Guard', desc: 'Identify and fix your recurring structural errors automatically.', color: 'var(--color-secondary)', bg: 'rgba(6,182,212,0.08)', icon: <CheckCircle2 size={20} color="var(--color-secondary)" />, chips: ['Grammar', 'Auto-fix'] },
    ];

    /* ── How it works ── */
    const howSteps = [
        { num: '01', icon: <Brain size={20} color="var(--color-primary)" />, bg: 'rgba(91,80,232,0.1)', title: 'Tell Atlas your goal', desc: 'Answer 5 quick questions. Atlas builds a personalized study roadmap targeting your exact score gap.' },
        { num: '02', icon: <Layers size={20} color="var(--color-success)" />, bg: 'rgba(16,185,129,0.1)', title: 'Practice with real mocks', desc: 'Work through authentic past papers under timed conditions — all four skills covered, every CEFR level.' },
        { num: '03', icon: <BarChart2 size={20} color="var(--color-warning)" />, bg: 'rgba(245,158,11,0.1)', title: 'Get instant AI feedback', desc: 'Every answer scored in real-time. Fix errors, track improvement, predict your official score with 98% accuracy.' },
    ];

    /* ── Testimonials ── */
    const testimonials = [
        { text: '"I improved from B1 to B2 in just 6 weeks. The AI feedback on my essays was sharper than any tutor I\'d paid 200,000 UZS a month for."', name: 'Sardor M.', meta: 'Tashkent · B1 → B2', avatar: 'S', color: '#5B50E8', score: '+24 pts', stars: 5, exam: 'DTM 2024' },
        { text: '"The Reading mocks are identical to the real exam. I went in completely confident and came out with my C1 certificate first attempt."', name: 'Dilnoza K.', meta: 'Samarkand · B2 → C1', avatar: 'D', color: '#10B981', score: '+18 pts', stars: 5, exam: 'DTM 2024' },
        { text: '"Atlas caught grammar patterns in my writing I\'d been repeating for years. The speaking feedback was a complete game-changer for me."', name: 'Jasur A.', meta: 'Bukhara · A2 → B1', avatar: 'J', color: '#F59E0B', score: '+32 pts', stars: 5, exam: 'DTM 2024' },
        { text: '"I had 6 weeks until my exam and was panicking. The intensive track gave me a daily plan and I jumped a full CEFR level. Unbelievable."', name: 'Malika R.', meta: 'Fergana · B1 → B2', avatar: 'M', color: '#F43F5E', score: '+26 pts', stars: 5, exam: 'DTM 2025' },
        { text: '"Free plan alone has better content than most paid apps. I upgraded to Premium for the Speaking module and I don\'t regret a single sum."', name: 'Otabek N.', meta: 'Namangan · A2 → B1', avatar: 'O', color: '#8B5CF6', score: '+29 pts', stars: 5, exam: 'DTM 2025' },
        { text: '"My tutor was teaching me from a 2019 textbook. CEFR Academy uses actual past DTM papers. The difference in my score was immediate."', name: 'Zulfiya T.', meta: 'Nukus · B2 → C1', avatar: 'Z', color: '#06B6D4', score: '+15 pts', stars: 5, exam: 'DTM 2025' },
    ];

    /* ── Comparison table ── */
    const compRows = [
        { label: 'Official DTM exam papers',     academy: true,  tutor: false, youtube: false },
        { label: 'Instant AI feedback (< 30s)',   academy: true,  tutor: false, youtube: false },
        { label: '24 / 7 availability',           academy: true,  tutor: false, youtube: true  },
        { label: 'Personalised study roadmap',    academy: true,  tutor: true,  youtube: false },
        { label: 'Speaking pronunciation score',  academy: true,  tutor: true,  youtube: false },
        { label: 'Score prediction accuracy',     academy: '98%', tutor: '~60%',youtube: false },
        { label: 'Monthly cost (UZS)',            academy: 'Free–49K', tutor: '200K+', youtube: 'Free' },
    ];

    /* ── FAQ ── */
    const faqs = [
        { q: 'Is CEFR Academy aligned with the official DTM exam format?', a: 'Yes. Every Reading and Listening paper is built from real DTM past papers. Writing tasks mirror the exact rubric used by official markers. We update our content after every DTM exam season.' },
        { q: 'How accurate is the AI score prediction?', a: 'Our model has been validated against 2,400+ real exam results. It predicts final DTM scores with 98% accuracy within ±3 points — meaning if Atlas says B2, you will almost certainly receive a B2 certificate.' },
        { q: 'What\'s included in the free plan?', a: 'The free plan gives you 3 AI Writing checks, 1 Speaking mock, and unlimited Reading & Listening tests at all CEFR levels. There is no time limit and no credit card required.' },
        { q: 'How quickly will I see improvement?', a: 'Most students notice measurable improvement within 2 weeks of consistent daily practice. Our data shows the average student gains one full CEFR sub-level every 4–6 weeks.' },
        { q: 'Can I access CEFR Academy on my phone?', a: 'Yes. The platform is fully responsive on all devices. A dedicated mobile app is coming in Q3 2025.' },
        { q: 'Is there a refund policy for Premium?', a: 'Absolutely. If you practice for 14 days and don\'t see measurable progress, we will refund your subscription — no questions asked.' },
    ];

    /* ── Pricing plans ── */
    const plans = [
        {
            tier: 'Forever Free', price: 'Free', period: 'No card needed',
            features: ['3 AI Writing checks / month', '1 Speaking mock', 'Full Reading & Listening', 'All B1, B2, C1 levels', 'Platform tour'],
            cta: 'Start Free', highlight: false,
        },
        {
            tier: 'Pro', price: '29,000', period: 'UZS / month',
            features: ['Unlimited Writing checks', 'All essay types (letter, report)', 'Unlimited Reading tests', 'Unlimited Listening tests', 'Error tracking dashboard', 'Speaking — Premium required'],
            cta: 'Get Pro', highlight: false, badge: 'Popular',
        },
        {
            tier: 'Premium', price: '49,000', period: 'UZS / month · Everything',
            features: ['Everything in Pro', 'Unlimited Speaking feedback', '1 Full CEFR Mock Exam/month', 'Real-time AI pronunciation score', 'Priority 24 h support', '14-day money-back guarantee'],
            cta: 'Get Premium', highlight: true, badge: 'Best Value',
        },
    ];

    /* ─────────────────────────────────────────────── */
    /*  RENDER                                          */
    /* ─────────────────────────────────────────────── */
    return (
        <div className="onboarding-master">

            {/* ── Nav ── */}
            <header className="onboarding-header">
                <div className="container header-inner">
                    <Link to="/" className="brand-wrapper">
                        <Sparkles className="sparkle-icon" size={20} />
                        CEFR<span style={{ color: 'var(--color-primary)' }}>ACADEMY</span>
                    </Link>
                    <nav className="nav-links">
                        <button onClick={() => scrollTo('how')}      className="nav-link">Methodology</button>
                        <button onClick={() => scrollTo('features')} className="nav-link">Features</button>
                        <button onClick={() => scrollTo('pricing')}  className="nav-link">Pricing</button>
                        <button onClick={() => scrollTo('faq')}      className="nav-link">FAQ</button>
                    </nav>
                    <div className="header-right">
                        {/* Theme toggle */}
                        <button
                            className="landing-icon-btn"
                            onClick={toggleTheme}
                            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
                        </button>
                        {/* Language toggle */}
                        <button
                            className="landing-icon-btn landing-lang-btn"
                            onClick={toggleLang}
                            title="Switch language"
                        >
                            <Globe size={15} />
                            <span>{lang.toUpperCase()}</span>
                        </button>
                        <div className="streak-pills"><Flame size={14} /><span>12 DAYS</span></div>
                        <button className="btn btn-primary" onClick={() => scrollTo('builder')} style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
                            <Sparkles size={14} />
                            {lang === 'en' ? 'Get Started Free' : 'Bepul Boshlash'}
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* ── Hero ── */}
                <section className="hero-section" id="hero">
                    <div className="container hero-grid">
                        <motion.div className="hero-text" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <span className="eyebrow" style={{ color: 'var(--color-secondary)' }}>AI-POWERED · DTM CEFR PREP · UZBEKISTAN</span>
                            <h1 className="h1-hero">
                                Go from <span className="gradient-text">A2 to B2</span><br />
                                before your exam date.
                            </h1>
                            <p className="hero-description">
                                Atlas AI analyzes every sentence, identifies your exact weak points, and builds a daily study plan that gets you your target CEFR level — faster than any tutor.
                            </p>
                            <div className="hero-btn-group">
                                <button className="btn btn-primary" style={{ padding: '0.9rem 2rem' }} onClick={() => scrollTo('builder')}>
                                    Build My Free Plan <ArrowRight size={16} />
                                </button>
                                <button className="btn btn-secondary" style={{ padding: '0.9rem 2rem' }} onClick={() => scrollTo('how')}>
                                    See How It Works
                                </button>
                            </div>
                            <div className="trust-bar">
                                <span>✓ Free to start</span><span className="dot">·</span>
                                <span>✓ No card required</span><span className="dot">·</span>
                                <span>✓ Official DTM Standards</span>
                            </div>
                        </motion.div>

                        <div className="ui-mockup-wrapper">
                            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="dark-ui-card">
                                <div className="notification-pill"><Sparkles size={12} /> AI Evaluation Ready · 2.4s</div>
                                <div className="mockup-header">
                                    <span className="eyebrow" style={{ marginBottom: 0, fontSize: '0.65rem' }}>WRITING · B1 ESSAY</span>
                                    <span className="badge badge-teal">B1 ➔ B2</span>
                                </div>
                                <div className="mockup-body">
                                    "The <span className="underline-error">globalization of technology</span> has changed how we communicate. Many people <span className="underline-success">remain hesitant to embrace</span> digital changes..."
                                </div>
                                <div className="score-display">
                                    <div className="score-circle">72</div>
                                    <div style={{ flex: 1 }}>
                                        {[['Coherence', 82], ['Vocabulary', 90], ['Grammar', 70]].map(([label, val]) => (
                                            <div key={label as string} style={{ marginBottom: '0.4rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginBottom: '3px' }}>
                                                    <span>{label}</span><span>{val}%</span>
                                                </div>
                                                <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
                                                    <div style={{ width: `${val}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '4px' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                                    "Strong vocabulary. Focus on linking devices in Paragraph 2 to reach B2."
                                </p>
                            </motion.div>

                            {/* Floating badges */}
                            <motion.div className="hero-float-badge badge-left"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                                <Trophy size={14} color="#F59E0B" />
                                <span>B2 Achieved!</span>
                            </motion.div>
                            <motion.div className="hero-float-badge badge-right"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                                <TrendingUp size={14} color="#10B981" />
                                <span>+24 pts in 6 weeks</span>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ── Guarantee Badges ── */}
                <div className="guarantee-strip">
                    <div className="container guarantee-inner">
                        {[
                            { icon: <Shield size={16} />, text: '14-day money-back guarantee' },
                            { icon: <Award size={16} />, text: '98% score prediction accuracy' },
                            { icon: <CheckCircle2 size={16} />, text: 'Official DTM 2025 standards' },
                            { icon: <Users size={16} />, text: '12,000+ students enrolled' },
                        ].map((item, i) => (
                            <div key={i} className="guarantee-item">
                                <span className="guarantee-icon">{item.icon}</span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Ticker ── */}
                <div className="ticker-strip">
                    <div className="ticker-content">
                        🚀 12,000+ STUDENTS ENROLLED &nbsp;·&nbsp; ★★★★★ 4.9/5 RATING &nbsp;·&nbsp; REAL-TIME AI SCORING &nbsp;·&nbsp; DTM 2025 COMPLIANT &nbsp;·&nbsp; 98% SCORE ACCURACY &nbsp;·&nbsp; 14-DAY MONEY BACK &nbsp;·&nbsp; 🚀 12,000+ STUDENTS ENROLLED &nbsp;·&nbsp; ★★★★★ 4.9/5 RATING &nbsp;·&nbsp; REAL-TIME AI SCORING &nbsp;·&nbsp; DTM 2025 COMPLIANT &nbsp;·&nbsp; 98% SCORE ACCURACY &nbsp;·&nbsp; 14-DAY MONEY BACK
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="stats-section">
                    <div className="container">
                        <div className="stats-grid">
                            {[
                                { num: '12,000+', label: 'Students Enrolled' },
                                { num: '4.9★', label: 'Average Rating' },
                                { num: '98%', label: 'Score Accuracy' },
                                { num: '6 weeks', label: 'Avg. Level Gain' },
                            ].map((s, i) => (
                                <motion.div key={i} className="stat-item" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                                    <div className="stat-number">{s.num}</div>
                                    <div className="stat-label">{s.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Problem Cards ── */}
                <section id="problems">
                    <div className="container text-center">
                        <span className="eyebrow" style={{ color: 'var(--color-error)' }}>THE CHALLENGE</span>
                        <h2>Sound familiar?</h2>
                        <p className="text-muted" style={{ maxWidth: '540px', margin: '1rem auto 0' }}>
                            These are the three reasons most students fail the DTM CEFR exam — and why traditional preparation doesn't fix them.
                        </p>
                        <div className="problem-grid">
                            {[
                                { cls: 'rose', pill: 'No Feedback', icon: <Zap size={26} className="text-error" />, h: '"I don\'t know my level"', p: 'Practicing without a baseline is like driving in the dark. You need instant, accurate scoring on every attempt.' },
                                { cls: 'amber', pill: 'Lost Time', icon: <Clock size={26} className="text-warning" />, h: '"Waiting days for feedback"', p: 'Don\'t wait 48 h for a tutor. Get AI assessments in under 30 seconds, every time, at any hour.' },
                                { cls: 'indigo', pill: 'No Direction', icon: <Activity size={26} className="text-primary" />, h: '"Inconsistent results"', p: 'DTM criteria are complex. Atlas ensures you hit every marking point on every attempt.' },
                            ].map((c, i) => (
                                <motion.div key={i} className={`problem-card ${c.cls}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <div className="problem-pill">{c.pill}</div>
                                    <div style={{ marginBottom: '0.875rem' }}>{c.icon}</div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.65rem' }}>{c.h}</h3>
                                    <p className="text-muted" style={{ fontSize: '0.86rem', lineHeight: 1.65 }}>{c.p}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── How It Works ── */}
                <section className="section-alt" id="how">
                    <div className="container text-center">
                        <span className="eyebrow">SIMPLE PROCESS</span>
                        <h2>From zero to result in 3 steps</h2>
                        <p className="text-muted" style={{ maxWidth: '480px', margin: '1rem auto 0' }}>
                            Atlas AI adapts to your weaknesses and builds a structured daily path to your target score.
                        </p>
                        <div className="section-how">
                            {howSteps.map((s, i) => (
                                <motion.div key={i} className="how-step" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                                    <div className="how-step-number">{s.num}</div>
                                    <div className="how-step-icon" style={{ background: s.bg }}>{s.icon}</div>
                                    <h3>{s.title}</h3>
                                    <p>{s.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                        <motion.button className="btn btn-primary" style={{ marginTop: '3rem', padding: '0.9rem 2.5rem' }}
                            onClick={() => scrollTo('builder')} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            Build My Plan Free <ArrowRight size={16} />
                        </motion.button>
                    </div>
                </section>

                {/* ── Features ── */}
                <section id="features">
                    <div className="container">
                        <div className="text-center">
                            <span className="eyebrow">ALL THE TOOLS YOU NEED</span>
                            <h2>Built for your CEFR result</h2>
                            <p className="text-muted" style={{ maxWidth: '500px', margin: '1rem auto 0' }}>
                                Six integrated tools. One platform. One mission: your official CEFR certificate.
                            </p>
                        </div>
                        <div className="features-grid">
                            {features.map((feat, i) => (
                                <motion.div key={i} className="feature-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                                    <div className="accent-line" style={{ background: feat.color }} />
                                    <div className="feature-icon-box" style={{ background: feat.bg }}>{feat.icon}</div>
                                    <h3>{feat.title}</h3>
                                    <p className="text-muted">{feat.desc}</p>
                                    <div className="feature-chips">
                                        {feat.chips.map(c => <span key={c} className="feature-chip">{c}</span>)}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Comparison Table ── */}
                <section className="section-alt" id="compare">
                    <div className="container">
                        <div className="text-center">
                            <span className="eyebrow">WHY STUDENTS SWITCH TO US</span>
                            <h2>CEFR Academy vs. the alternatives</h2>
                            <p className="text-muted" style={{ maxWidth: '500px', margin: '1rem auto 0' }}>
                                See exactly why 12,000 students chose Atlas AI over expensive tutors or free YouTube videos.
                            </p>
                        </div>
                        <div className="comparison-wrap">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th className="comp-feature-col">Feature</th>
                                        <th className="comp-us"><Sparkles size={14} /> CEFR Academy</th>
                                        <th>Private Tutor</th>
                                        <th>YouTube / Free</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {compRows.map((row, i) => (
                                        <tr key={i}>
                                            <td className="comp-label">{row.label}</td>
                                            <td className="comp-us-cell">
                                                {row.academy === true  ? <Check size={18} className="comp-check" />
                                                : row.academy === false ? <X size={18} className="comp-x" />
                                                : <span className="comp-value">{row.academy}</span>}
                                            </td>
                                            <td>
                                                {row.tutor === true  ? <Check size={18} className="comp-check-dim" />
                                                : row.tutor === false ? <X size={18} className="comp-x" />
                                                : <span className="comp-value dim">{row.tutor}</span>}
                                            </td>
                                            <td>
                                                {row.youtube === true  ? <Check size={18} className="comp-check-dim" />
                                                : row.youtube === false ? <X size={18} className="comp-x" />
                                                : <span className="comp-value dim">{row.youtube}</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ── Testimonials ── */}
                <section id="testimonials">
                    <div className="container text-center">
                        <span className="eyebrow">REAL STUDENTS · REAL RESULTS</span>
                        <h2>From Tashkent to Nukus — they all passed</h2>
                        <p className="text-muted" style={{ maxWidth: '480px', margin: '1rem auto 0' }}>
                            Over 12,000 Uzbek students have used CEFR Academy to reach their target level. Here are just a few.
                        </p>

                        {/* Star rating summary */}
                        <div className="rating-summary">
                            <div className="rating-stars">
                                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="#F59E0B" color="#F59E0B" />)}
                            </div>
                            <span className="rating-number">4.9 / 5</span>
                            <span className="rating-count">from 3,200+ reviews</span>
                        </div>

                        <div className="testimonials-grid">
                            {testimonials.map((t, i) => (
                                <motion.div key={i} className="testimonial-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }}>
                                    <div className="testimonial-stars">
                                        {Array.from({ length: t.stars }).map((_, s) => <Star key={s} size={13} fill="#F59E0B" color="#F59E0B" />)}
                                    </div>
                                    <Quote size={22} className="testimonial-quote-icon" />
                                    <p className="testimonial-text">{t.text}</p>
                                    <div className="testimonial-author">
                                        <div className="testimonial-avatar" style={{ background: t.color }}>{t.avatar}</div>
                                        <div>
                                            <div className="testimonial-name">{t.name}</div>
                                            <div className="testimonial-meta">{t.meta} · {t.exam}</div>
                                        </div>
                                        <div className="score-badge">{t.score}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Pricing ── */}
                <section className="pricing-section-wrap" id="pricing">
                    <div className="container text-center">
                        <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)' }}>TRANSPARENT PRICING</span>
                        <h2 style={{ color: 'white', marginBottom: '0.75rem' }}>Simple, honest pricing</h2>
                        <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '440px', margin: '0 auto' }}>
                            Start free. Upgrade when you're ready. No hidden fees, cancel anytime.
                        </p>
                        <div className="pricing-grid">
                            {plans.map((plan, i) => (
                                <div key={i} className={`price-card ${plan.highlight ? 'featured' : ''}`}>
                                    {plan.badge && <div className={`featured-badge ${plan.highlight ? '' : 'badge-outline'}`}>{plan.highlight ? '⭐ ' : ''}{plan.badge}</div>}
                                    <div className="price-tier">{plan.tier}</div>
                                    <div className="price-amount">{plan.price === 'Free' ? 'Free' : plan.price}<span className="price-currency">{plan.price !== 'Free' ? ' UZS' : ''}</span></div>
                                    <div className="price-period">{plan.period}</div>
                                    <ul className="price-features">
                                        {plan.features.map(f => <li key={f}>{f}</li>)}
                                    </ul>
                                    <button className="btn-price" onClick={() => scrollTo('builder')}>{plan.cta}</button>
                                </div>
                            ))}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '2rem' }}>
                            All prices in Uzbek Som (UZS). Premium includes 14-day money-back guarantee.
                        </p>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section id="faq">
                    <div className="container">
                        <div className="text-center" style={{ marginBottom: '3rem' }}>
                            <span className="eyebrow">COMMON QUESTIONS</span>
                            <h2>Everything you want to know</h2>
                        </div>
                        <div className="faq-list">
                            {faqs.map((faq, i) => (
                                <motion.div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}
                                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                                    <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                        <span>{faq.q}</span>
                                        <ChevronDown size={18} className="faq-chevron" />
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div className="faq-answer"
                                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
                                                <p>{faq.a}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Pre-survey urgency banner ── */}
                <div className="urgency-banner">
                    <div className="container urgency-inner">
                        <div className="urgency-left">
                            <Rocket size={22} color="white" />
                            <div>
                                <strong>DTM exam season is approaching.</strong>
                                <span> Students who start 6+ weeks early are 3× more likely to reach their target level.</span>
                            </div>
                        </div>
                        <button className="btn urgency-btn" onClick={() => scrollTo('builder')}>
                            Start Now — It's Free <ArrowRight size={15} />
                        </button>
                    </div>
                </div>

                {/* ── Plan Builder Survey ── */}
                <section id="builder">
                    <div className="container">
                        <div className="text-center" style={{ marginBottom: '3rem' }}>
                            <span className="eyebrow">PERSONALISED PLAN BUILDER</span>
                            <h2>Get your free study roadmap in 60 seconds</h2>
                            <p className="text-muted">Answer 5 questions. Atlas builds your personal path to {targetLabel || 'your target'}.</p>
                        </div>

                        <div className="survey-card">
                            <AnimatePresence mode="wait">

                                {/* ── Result screen ── */}
                                {showResult ? (
                                    <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="result-screen">
                                        <div className="result-header">
                                            <div className="result-icon-wrap">
                                                <Sparkles size={32} color="var(--color-primary)" />
                                            </div>
                                            <h3>Your CEFR Roadmap is Ready</h3>
                                            <p className="text-muted">Based on your answers, here's what Atlas recommends:</p>
                                        </div>

                                        {/* Level gap */}
                                        <div className="result-gap">
                                            <div className="result-level current">{currentLabel}<span>Current</span></div>
                                            <div className="result-arrow">
                                                <div className="result-gap-line" />
                                                <TrendingUp size={20} color="var(--color-primary)" />
                                                <span className="result-gap-label">
                                                    {gap <= 1 ? '~4–6 weeks' : gap === 2 ? '~8–12 weeks' : '~16+ weeks'}
                                                </span>
                                            </div>
                                            <div className="result-level target">{targetLabel}<span>Target</span></div>
                                        </div>

                                        {/* Plan recommendation */}
                                        <div className={`result-plan-card ${recommendPremium ? 'premium' : 'pro'}`}>
                                            <div className="result-plan-header">
                                                <span className="result-plan-badge">{recommendPremium ? '⭐ Recommended for you' : '✓ Good fit for you'}</span>
                                                <h4>{recommendPremium ? 'Premium Plan' : 'Pro Plan'}</h4>
                                                <div className="result-plan-price">
                                                    <span>{recommendPremium ? '49,000' : '29,000'}</span>
                                                    <span className="result-plan-period">UZS / month</span>
                                                </div>
                                            </div>
                                            <ul className="result-plan-features">
                                                {(recommendPremium
                                                    ? ['Unlimited Speaking feedback', 'Unlimited Writing checks', 'Full mock exams monthly', 'Pronunciation scoring', '14-day money-back guarantee']
                                                    : ['Unlimited Writing checks', 'All essay types', 'Unlimited Reading & Listening', 'Error tracking dashboard']
                                                ).map(f => (
                                                    <li key={f}><Check size={14} />{f}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {isUrgent && (
                                            <div className="result-urgency">
                                                <Timer size={15} />
                                                <span>Your exam is soon — the intensive track is already loaded into your plan.</span>
                                            </div>
                                        )}

                                        <div className="result-actions">
                                            <button className="btn btn-primary result-cta" onClick={() => navigate('/login')}>
                                                <Unlock size={16} />
                                                Get {recommendPremium ? 'Premium' : 'Pro'} — Start Today
                                            </button>
                                            <button className="result-free-link" onClick={() => navigate('/login')}>
                                                Or start with the free plan →
                                            </button>
                                        </div>
                                    </motion.div>

                                ) : (
                                    /* ── Survey questions ── */
                                    <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                                        <div className="survey-step-indicator">
                                            {surveyQuestions.map((_, i) => (
                                                <div key={i} className={`survey-dot ${i < step ? 'active' : ''}`} />
                                            ))}
                                        </div>
                                        <div style={{ marginBottom: '1.75rem' }}>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.08em' }}>
                                                STEP {step} OF {surveyQuestions.length}
                                            </span>
                                            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.45rem', lineHeight: 1.2 }}>
                                                {surveyQuestions[step - 1].q}
                                            </h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                                                {surveyQuestions[step - 1].sub}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                            {surveyQuestions[step - 1].opts.map(opt => (
                                                <button key={opt.label} className="btn-survey-option" onClick={() => handleSelect(opt.label)}>
                                                    <span className="survey-opt-inner">
                                                        <span className="survey-opt-emoji">{opt.icon}</span>
                                                        <span>{opt.label}</span>
                                                    </span>
                                                    <ArrowRight size={16} />
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* ── Dark CTA ── */}
                <section className="cta-banner">
                    <div className="container">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 1rem', background: 'rgba(255,255,255,0.07)', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', marginBottom: '1.75rem', color: 'rgba(255,255,255,0.6)' }}>
                            • READY TO RANK UP?
                        </div>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#fff', marginBottom: '1.5rem', lineHeight: 1.08 }}>
                            Stop practicing blind.<br />
                            <span style={{ color: 'var(--color-secondary)' }}>Get your certificate.</span>
                        </h2>
                        <div className="hero-btn-group" style={{ justifyContent: 'center' }}>
                            <button className="btn btn-primary" onClick={() => scrollTo('builder')} style={{ padding: '0.9rem 2.25rem' }}>
                                Build My Free Plan
                            </button>
                            <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.15)', padding: '0.9rem 2.25rem' }}>
                                Contact Support
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* ── Footer ── */}
            <footer className="onboarding-footer">
                <div className="container footer-grid">
                    <div className="footer-col">
                        <div className="brand-wrapper" style={{ color: 'white', marginBottom: '1.1rem' }}>
                            <Sparkles size={16} />
                            CEFR<span style={{ color: 'var(--color-primary)' }}>ACADEMY</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.86rem', lineHeight: 1.65, maxWidth: '220px' }}>
                            The AI-powered platform for national CEFR standards in Uzbekistan.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4>Practice</h4>
                        <Link to="/login" className="footer-link">Reading Mock</Link>
                        <Link to="/login" className="footer-link">Listening Mock</Link>
                        <Link to="/login" className="footer-link">AI Writing</Link>
                        <Link to="/login" className="footer-link">Speaking Lab</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Product</h4>
                        <button onClick={() => scrollTo('how')}      className="footer-link footer-btn">How it works</button>
                        <button onClick={() => scrollTo('pricing')}  className="footer-link footer-btn">Pricing</button>
                        <button onClick={() => scrollTo('features')} className="footer-link footer-btn">Features</button>
                        <button onClick={() => scrollTo('faq')}      className="footer-link footer-btn">FAQ</button>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <Link to="#" className="footer-link">About us</Link>
                        <Link to="#" className="footer-link">Blog</Link>
                        <Link to="#" className="footer-link">Terms</Link>
                        <Link to="#" className="footer-link">Privacy</Link>
                    </div>
                </div>
                <div className="container" style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>© 2025 CEFR Academy. Powered by Atlas AI.</span>
                    <span>Made in 🇺🇿 Uzbekistan</span>
                </div>
            </footer>
        </div>
    );
};

export default OnboardingSurvey;
