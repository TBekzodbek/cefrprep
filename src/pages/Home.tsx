import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Star, BookOpen, Headphones, GraduationCap, Mic,
    CheckCircle2, TrendingUp, Users, Award, Zap, Brain, Target,
    ShieldCheck,
} from 'lucide-react';
import './Home.css';

interface HomeProps { lang: 'en' | 'uz'; }

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const testimonials = [
    {
        text: "I went from B1 to C1 in just 4 months! The mock exams are incredibly accurate, and the AI feedback on my writing made all the difference.",
        name: "Aziza Toshmatova",
        meta: "Student, Tashkent · B1 → C1",
        score: "74 / 75",
        level: "C1",
        color: "#5B50E8",
        initials: "AT",
    },
    {
        text: "Atlas AI helped me identify exactly where I was losing points in listening. My score jumped 12 points in two months of targeted practice.",
        name: "Sardor Mirzayev",
        meta: "University graduate, Samarkand",
        score: "+12 pts",
        level: "B2",
        color: "#06B6D4",
        initials: "SM",
    },
    {
        text: "The reading passages are exactly like the real exam. No other platform I tried matched this quality. I passed on my first attempt!",
        name: "Dilnoza Karimova",
        meta: "Teacher, Namangan · A2 → B2",
        score: "68 / 75",
        level: "B2",
        color: "#10B981",
        initials: "DK",
    },
    {
        text: "I had failed twice before finding CEFR Academy. The personalised AI plan showed me exactly what to study each day. Third time was the charm!",
        name: "Bobur Rakhimov",
        meta: "Engineer, Fergana",
        score: "62 / 75",
        level: "B1",
        color: "#F59E0B",
        initials: "BR",
    },
    {
        text: "The vocabulary lab is outstanding. The spaced-repetition system helped me memorise 800+ academic words. Highly recommend to anyone preparing!",
        name: "Nilufar Ahmedova",
        meta: "Student, Andijan · B1 → B2",
        score: "+15 pts",
        level: "B2",
        color: "#8B5CF6",
        initials: "NA",
    },
    {
        text: "Scored 70 out of 75 on my first sit! The speaking practice with Atlas felt so natural. Worth every tiyin — best investment of my preparation.",
        name: "Eldor Hasanov",
        meta: "Professional, Bukhara",
        score: "70 / 75",
        level: "C1",
        color: "#F43F5E",
        initials: "EH",
    },
];

const skills = [
    {
        icon: <BookOpen size={24} />,
        title: 'Reading',
        desc: '50 official mock tests with real DTM passages. Detailed answer explanations after each session.',
        chips: ['35 Questions', '60 min', 'A1–C1'],
        iconBg: 'rgba(91,80,232,0.12)', iconColor: '#5B50E8',
        chipBg: 'rgba(91,80,232,0.08)', chipColor: '#5B50E8',
    },
    {
        icon: <Headphones size={24} />,
        title: 'Listening',
        desc: 'Authentic recordings from real national exams. Four-part format exactly matching the DTM standard.',
        chips: ['35 Questions', '35 min', 'B1–C1'],
        iconBg: 'rgba(6,182,212,0.12)', iconColor: '#06B6D4',
        chipBg: 'rgba(6,182,212,0.08)', chipColor: '#0891B2',
    },
    {
        icon: <GraduationCap size={24} />,
        title: 'Writing',
        desc: 'AI-powered feedback calibrated to DTM criteria. Personalised scores, corrections, and model answers.',
        chips: ['2 Tasks', '60 min', 'B1–C1'],
        iconBg: 'rgba(245,158,11,0.12)', iconColor: '#D97706',
        chipBg: 'rgba(245,158,11,0.08)', chipColor: '#D97706',
    },
    {
        icon: <Mic size={24} />,
        title: 'Speaking',
        desc: 'Practise with Atlas AI — a stress-free conversation coach available 24/7 to build your fluency.',
        chips: ['3 Parts', '20 min', 'A2–C1'],
        iconBg: 'rgba(16,185,129,0.12)', iconColor: '#059669',
        chipBg: 'rgba(16,185,129,0.08)', chipColor: '#059669',
    },
];

const howSteps = [
    {
        num: '01',
        icon: <Target size={26} />,
        iconBg: 'rgba(91,80,232,0.12)', iconColor: '#5B50E8',
        title: 'Take the Diagnostic',
        desc: 'Complete a short 5-minute survey so Atlas can pinpoint exactly where you are on the CEFR scale.',
    },
    {
        num: '02',
        icon: <Brain size={26} />,
        iconBg: 'rgba(6,182,212,0.12)', iconColor: '#06B6D4',
        title: 'Get Your AI Roadmap',
        desc: 'Receive a personalised 30-day study plan with daily goals targeting your weakest skill areas first.',
    },
    {
        num: '03',
        icon: <TrendingUp size={26} />,
        iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10B981',
        title: 'Practice & Progress',
        desc: 'Complete mock tests, get instant AI feedback, and watch your CEFR level rise week by week.',
    },
];

const Home = ({ lang }: HomeProps) => {
    void lang;

    return (
        <div className="home-page">

            {/* ════════════════════════ HERO ════════════════════════ */}
            <section className="hero-section">
                <div className="hero-blob hero-blob-1" />
                <div className="hero-blob hero-blob-2" />
                <div className="hero-blob hero-blob-3" />

                <div className="container">
                    <div className="hero-grid">
                        {/* Left — Text */}
                        <div>
                            <motion.div {...fadeUp(0)}>
                                <span className="hero-eyebrow">
                                    <Zap size={13} fill="currentColor" />
                                    Aligned with the national 75-pt scale
                                </span>
                            </motion.div>

                            <motion.h1 className="hero-title" {...fadeUp(0.08)}>
                                The fastest path to your <span className="grad">target CEFR score.</span>
                            </motion.h1>

                            <motion.p className="hero-sub" {...fadeUp(0.16)}>
                                Meet <strong>Atlas</strong> — your personal AI coach. 50 official mock exams, real-time feedback, and a study plan built around how <em>you</em> learn. Trusted by 2,400+ students across Uzbekistan.
                            </motion.p>

                            <motion.div className="hero-cta-row" {...fadeUp(0.24)}>
                                <Link to="/onboarding" className="btn-hero">
                                    Start for free <ArrowRight size={18} />
                                </Link>
                                <Link to="/login" className="btn-hero-ghost">
                                    Sign in
                                </Link>
                            </motion.div>

                            <motion.div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }} {...fadeUp(0.32)}>
                                <div className="avatar-stack">
                                    <div className="avatars">
                                        {[['AT','#5B50E8'],['SM','#06B6D4'],['DK','#10B981'],['BR','#F59E0B']].map(([i, c]) => (
                                            <div key={i} className="av" style={{ background: c as string }}>{i}</div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="stars-inline">
                                            {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="currentColor" />)}
                                        </div>
                                        <div className="avatar-text"><strong>2,400+</strong> students enrolled</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right — Visual card */}
                        <motion.div
                            className="hero-visual"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {/* Floating top card */}
                            <motion.div
                                className="floating-card float-card-top"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <div className="float-inner">
                                    <div className="float-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                                        <TrendingUp size={18} />
                                    </div>
                                    <div>
                                        <div className="float-title">Score improved!</div>
                                        <div className="float-sub">+12 pts in 6 weeks</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Main card */}
                            <div className="hero-card-main">
                                <div className="hero-card-badge">Live Progress</div>
                                <div className="score-display">
                                    <div className="score-big">B2</div>
                                    <div className="score-label">Current CEFR Level</div>
                                </div>
                                <div style={{ height: '6px', background: 'var(--color-background-alt)', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '72%' }}
                                        transition={{ duration: 1.4, delay: 0.5 }}
                                        style={{ height: '100%', background: 'var(--gradient-primary)', borderRadius: '10px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                                    <span>A1</span><span style={{ color: 'var(--color-primary)' }}>72% to C1</span><span>C1</span>
                                </div>
                                <div className="score-levels">
                                    {['A1','A2','B1','B2','C1'].map(l => (
                                        <div key={l} className={`level-chip ${l === 'B2' ? 'active' : ''}`}>{l}</div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'var(--color-background-alt)', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ background: '#EEF2FF', color: '#5B50E8', padding: '0.35rem', borderRadius: '8px', display: 'flex' }}>
                                        <Brain size={15} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>Atlas AI suggests:</div>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.73rem' }}>Focus on Listening Part 4 today</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating bottom card */}
                            <motion.div
                                className="floating-card float-card-bottom"
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            >
                                <div className="float-inner">
                                    <div className="float-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
                                        <Award size={18} />
                                    </div>
                                    <div>
                                        <div className="float-title">Mock #16 Complete</div>
                                        <div className="float-sub">28 / 35 correct</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════ STATS STRIP ════════════════ */}
            <section className="stats-strip">
                <div className="container">
                    <div className="stats-strip-grid">
                        {[
                            { num: '2,400+', desc: 'Students Enrolled', icon: <Users size={22} />, bg: 'rgba(91,80,232,0.1)', color: '#5B50E8' },
                            { num: '4.9 ★', desc: 'Average Rating', icon: <Star size={22} fill="currentColor" />, bg: 'rgba(245,158,11,0.1)', color: '#D97706' },
                            { num: '98%', desc: 'Score Accuracy', icon: <ShieldCheck size={22} />, bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
                            { num: '50', desc: 'Official Mocks', icon: <BookOpen size={22} />, bg: 'rgba(6,182,212,0.1)', color: '#06B6D4' },
                        ].map((s, i, arr) => (
                            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div className="stat-pill">
                                    <div className="stat-icon-box" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                                    <div>
                                        <div className="stat-num">{s.num}</div>
                                        <div className="stat-desc">{s.desc}</div>
                                    </div>
                                </div>
                                {i < arr.length - 1 && <div className="stat-divider" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════ HOW IT WORKS ═══════════════ */}
            <section className="section-hiw">
                <div className="container text-center">
                    <motion.div {...fadeUp(0)} viewport={{ once: true }} whileInView={fadeUp(0).animate}>
                        <span className="section-label">How It Works</span>
                        <h2 className="section-title">Three steps to your target score</h2>
                        <p className="section-sub">
                            No guesswork. No wasted hours. Just a clear, data-driven path from where you are to where you want to be.
                        </p>
                    </motion.div>
                    <div className="hiw-grid">
                        <div className="hiw-connector" />
                        {howSteps.map((step, i) => (
                            <motion.div
                                key={step.num}
                                className="hiw-step"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.12 }}
                                viewport={{ once: true }}
                            >
                                <div className="hiw-num">{step.num}</div>
                                <div className="hiw-icon-wrap" style={{ background: step.iconBg, color: step.iconColor }}>{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════ SKILLS ═════════════════════ */}
            <section className="section-skills">
                <div className="container text-center">
                    <span className="section-label">All Four Skills</span>
                    <h2 className="section-title">Complete CEFR preparation</h2>
                    <p className="section-sub">
                        Every component you need to max your score — in one platform, with one AI coach.
                    </p>
                    <div className="skills-cards-grid">
                        {skills.map((s, i) => (
                            <motion.div
                                key={s.title}
                                className="skill-card-new"
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="skill-icon-box" style={{ background: s.iconBg, color: s.iconColor }}>{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                <div className="skill-chip-row">
                                    {s.chips.map(c => (
                                        <span key={c} className="skill-chip" style={{ background: s.chipBg, color: s.chipColor }}>{c}</span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════ TESTIMONIALS ═══════════════ */}
            <section className="section-testimonials">
                <div className="container text-center">
                    <span className="section-label">Student Reviews</span>
                    <h2 className="section-title">Real results, real students</h2>
                    <p className="section-sub">
                        Over 2,400 students have improved their CEFR scores with our platform. Here are some of their stories.
                    </p>
                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.name}
                                className="testi-card"
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="testi-stars">
                                    {[1,2,3,4,5].map(n => <Star key={n} size={14} fill="currentColor" />)}
                                </div>
                                <p className="testi-quote">{t.text}</p>
                                <div className="testi-footer">
                                    <div className="testi-author">
                                        <div className="testi-av" style={{ background: t.color }}>{t.initials}</div>
                                        <div>
                                            <div className="testi-name">{t.name}</div>
                                            <div className="testi-meta">{t.meta}</div>
                                        </div>
                                    </div>
                                    <div className="testi-score-badge">
                                        {t.score}
                                        <span>{t.level}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════ CTA ════════════════════════ */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        className="cta-card"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <span className="cta-eyebrow">Start today — it's free</span>
                        <h2 className="cta-title">Your CEFR certificate is<br />closer than you think.</h2>
                        <p className="cta-sub">
                            Join 2,400+ students who have already reached their target level. Build your personalised plan in under 5 minutes.
                        </p>
                        <Link to="/onboarding" className="cta-btn">
                            Get started for free <ArrowRight size={18} />
                        </Link>
                        <div className="cta-trust">
                            {[
                                { icon: <CheckCircle2 size={15} />, text: 'No credit card required' },
                                { icon: <CheckCircle2 size={15} />, text: 'Free plan forever' },
                                { icon: <CheckCircle2 size={15} />, text: '50 mock exams included' },
                            ].map(item => (
                                <div key={item.text} className="cta-trust-item">
                                    {item.icon} {item.text}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════ FOOTER ════════════════════ */}
            <footer className="home-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div>
                            <Link to="/" className="footer-brand">CEFR<em>ACADEMY</em>.uz</Link>
                            <p className="footer-copy">© 2025 CEFR Academy. Built for Uzbekistan.</p>
                        </div>
                        <ul className="footer-links">
                            <li><Link to="/onboarding">Get Started</Link></li>
                            <li><Link to="/login">Sign In</Link></li>
                            <li><Link to="/dashboard/pricing">Pricing</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
