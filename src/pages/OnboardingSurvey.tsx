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

/* ─── Study Quotes (35 — rotate each page visit) ─────────────────────────── */
const STUDY_QUOTES = [
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
    { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
    { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
    { text: "Intelligence plus character — that is the goal of true education.", author: "Martin Luther King Jr." },
    { text: "Study without desire spoils the memory, and it retains nothing that it takes in.", author: "Leonardo da Vinci" },
    { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "All our dreams can come true if we have the courage to pursue them.", author: "Walt Disney" },
    { text: "Success is the sum of small efforts repeated day-in and day-out.", author: "Robert Collier" },
    { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
    { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
    { text: "The mind is not a vessel to be filled but a fire to be kindled.", author: "Plutarch" },
    { text: "Change is the end result of all true learning.", author: "Leo Buscaglia" },
    { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
    { text: "Once you stop learning, you start dying.", author: "Albert Einstein" },
    { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
    { text: "Formal education will make you a living; self-education will make you a fortune.", author: "Jim Rohn" },
    { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
    { text: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar" },
    { text: "Strive for progress, not perfection.", author: "Unknown" },
    { text: "The secret of success is to do the common things uncommonly well.", author: "John D. Rockefeller" },
    { text: "Without education, you're not going anywhere in this world.", author: "Malcolm X" },
    { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
    { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
];

/* ─── Survey Testimonials (ticker) ───────────────────────────────────────── */
const SURVEY_TESTIMONIALS = [
    { name: 'Aziz T.', avatar: 'A', color: '#5B50E8', text: 'Got B2 on my first attempt!', score: '+26 pts', meta: 'Tashkent' },
    { name: 'Feruza M.', avatar: 'F', color: '#10B981', text: 'AI feedback is genuinely unreal', score: '+19 pts', meta: 'Samarkand' },
    { name: 'Bobur K.', avatar: 'B', color: '#F59E0B', text: 'A2 to B1 in just 5 weeks', score: '+31 pts', meta: 'Namangan' },
    { name: 'Lola N.', avatar: 'L', color: '#F43F5E', text: 'The mock exams saved me', score: '+22 pts', meta: 'Bukhara' },
    { name: 'Sherzod A.', avatar: 'S', color: '#8B5CF6', text: 'Best CEFR platform in Uzbekistan!', score: '+28 pts', meta: 'Fergana' },
    { name: 'Dilnoza P.', avatar: 'D', color: '#06B6D4', text: 'C1 achieved — first try!', score: '+14 pts', meta: 'Nukus' },
    { name: 'Jasur R.', avatar: 'J', color: '#EC4899', text: 'Vocabulary lab is incredible', score: '+33 pts', meta: 'Andijan' },
    { name: 'Murod B.', avatar: 'M', color: '#14B8A6', text: 'Way better than my private tutor', score: '+17 pts', meta: 'Karshi' },
    { name: 'Gulnora S.', avatar: 'G', color: '#F97316', text: 'Speaking confidence doubled', score: '+24 pts', meta: 'Jizzakh' },
    { name: 'Ulugbek D.', avatar: 'U', color: '#84CC16', text: 'Worth every single som!', score: '+29 pts', meta: 'Termez' },
    { name: 'Kamola T.', avatar: 'K', color: '#EF4444', text: 'From B1 to B2 in 7 weeks', score: '+23 pts', meta: 'Tashkent' },
    { name: 'Sardor Y.', avatar: 'S', color: '#3B82F6', text: 'Premium is absolutely worth it', score: '+27 pts', meta: 'Samarkand' },
];

/* ─── Atlas Scan Interstitial (midpoint after Q6) ────────────────────────── */

interface AtlasScanProps { selections: string[]; onContinue: () => void; userName?: string; }

function AtlasScanScreen({ selections, onContinue, userName }: AtlasScanProps) {
    const [phase, setPhase] = useState<'scanning' | 'reveal'>('scanning');

    const weakness = selections[3] ?? '';
    const weakKey = weakness.toLowerCase().includes('speaking') ? 'speaking'
        : weakness.toLowerCase().includes('writing') ? 'writing'
        : weakness.toLowerCase().includes('reading') ? 'reading'
        : weakness.toLowerCase().includes('listening') ? 'listening'
        : 'all';

    const skillBars = [
        { name: 'Reading',   icon: '📖', score: weakKey === 'reading'   ? 34 : weakKey === 'all' ? 49 : 74 },
        { name: 'Listening', icon: '🎧', score: weakKey === 'listening' ? 29 : weakKey === 'all' ? 47 : 68 },
        { name: 'Writing',   icon: '✍️', score: weakKey === 'writing'   ? 31 : weakKey === 'all' ? 45 : 71 },
        { name: 'Speaking',  icon: '🎤', score: weakKey === 'speaking'  ? 26 : weakKey === 'all' ? 42 : 63 },
    ];
    const critical = skillBars.reduce((min, s) => s.score < min.score ? s : min, skillBars[0]);

    useEffect(() => {
        const t = setTimeout(() => setPhase('reveal'), 2600);
        return () => clearTimeout(t);
    }, []);

    return (
        <motion.div className="atlas-scan-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {phase === 'scanning' ? (
                <>
                    <motion.div
                        className="as-brain"
                        animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.06, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                    >🧠</motion.div>
                    <h3>Scanning your profile{userName ? `, ${userName}` : ''}…</h3>
                    <p className="as-sub">Comparing with students who took the official 405,000 UZS Bilim va malakalarni CEFR exam</p>
                    <div className="as-skill-bars">
                        {skillBars.map((s, i) => (
                            <div key={s.name} className="as-skill-row">
                                <span className="as-skill-name">{s.icon} {s.name}</span>
                                <div className="as-bar-track">
                                    <motion.div
                                        className={`as-bar-fill ${s.score < 45 ? 'critical' : s.score < 62 ? 'medium' : 'strong'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${s.score}%` }}
                                        transition={{ duration: 1.3, delay: 0.3 + i * 0.22, ease: 'easeOut' }}
                                    />
                                </div>
                                <motion.span
                                    className={`as-bar-pct${s.score < 45 ? ' crit' : ''}`}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ delay: 1.6 + i * 0.22 }}
                                >{s.score}%</motion.span>
                            </div>
                        ))}
                    </div>
                    <motion.p className="as-scanning-pulse" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.1, repeat: Infinity }}>
                        Scanning…
                    </motion.p>
                </>
            ) : (
                <motion.div className="as-reveal" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="as-found-badge">⚠️ Critical gap identified</div>
                    <h3>Your <span className="as-weak-name">{critical.name}</span> is limiting your score</h3>
                    <p className="as-reveal-sub">
                        {weakKey === 'all'
                            ? '76% of students with gaps across all skills fail their first official CEFR exam attempt without a structured plan — wasting 405,000 UZS.'
                            : `71% of students who struggle with ${critical.name} fail their first official CEFR exam attempt without targeted practice — wasting their 405,000 UZS registration fee.`}
                    </p>
                    <div className="as-contrast-row">
                        <div className="as-contrast-cell fail">
                            <span>Without a plan</span>
                            <strong>71% fail</strong>
                        </div>
                        <div className="as-vs">vs</div>
                        <div className="as-contrast-cell pass">
                            <span>Atlas Premium users</span>
                            <strong>89% pass ✓</strong>
                        </div>
                    </div>
                    <div className="as-student-win">
                        <div className="as-sw-ava" style={{ background: '#5B50E8' }}>A</div>
                        <div className="as-sw-body">
                            <strong>Aziz T.</strong> had the same {critical.name} gap{userName ? ` as you, ${userName}` : ''} — passed B2 in 7 weeks and earned university entrance exemption.
                        </div>
                        <span className="as-sw-badge">+26 pts 🎉</span>
                    </div>
                    <button className="btn btn-primary as-cta-btn" onClick={onContinue}>
                        Show me how Atlas fixes this →
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}

/* ─── Plan Building Animation (just before result) ───────────────────────── */

function PlanBuildingScreen({ userName }: { userName?: string }) {
    const items = [
        { icon: '🔍', text: 'Skill gap analysis against official CEFR rubric complete' },
        { icon: '📅', text: 'Daily schedule calculated for monthly exam date' },
        { icon: '📝', text: 'Official Bilim va malakalarni mock sequence prepared' },
        { icon: '🎯', text: 'B2 / C1 benefits target mapped to your profile' },
    ];
    return (
        <div className="plan-building-screen">
            <motion.div className="pb-pulse"
                animate={{ scale: [1, 1.14, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.6, repeat: Infinity }}
            >
                <Sparkles size={38} color="var(--color-primary)" />
            </motion.div>
            <h3>{userName ? `Building your plan, ${userName}…` : 'Building your roadmap…'}</h3>
                        <p>Calibrating your path to the official 405,000 UZS CEFR exam</p>
            <div className="pb-list">
                {items.map((item, i) => (
                    <motion.div key={i} className="pb-list-item"
                        initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.55 }}
                    >
                        <span className="pb-item-icon">{item.icon}</span>
                        <span className="pb-item-text">{item.text}</span>
                        <motion.span className="pb-item-check"
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ delay: 0.7 + i * 0.55, type: 'spring', stiffness: 280 }}
                        >✓</motion.span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const OnboardingSurvey = ({ lang, toggleLang, theme, toggleTheme }: Props) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showResult, setShowResult] = useState(false);
    const [selections, setSelections] = useState<string[]>([]);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [showScanAnimation, setShowScanAnimation] = useState(false);
    const [showPlanBuilding, setShowPlanBuilding] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showNameStep, setShowNameStep] = useState(true);
    const [userName, setUserName] = useState('');
    const [nameInput, setNameInput] = useState('');
    // Rotate quote each page visit (persisted in localStorage)
    const [quoteIdx] = useState(() => {
        const stored = parseInt(localStorage.getItem('cefr_quote_idx') ?? '0');
        const next = (stored + 1) % STUDY_QUOTES.length;
        localStorage.setItem('cefr_quote_idx', String(next));
        return stored % STUDY_QUOTES.length;
    });

    useEffect(() => { supabase.auth.getUser(); }, []);

    const scrollTo = (id: string) =>
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    /* ── Survey — 12 questions, 4 groups ── */
    // hint?: small insight chip shown above the question on certain steps
    const surveyQuestions = [
        // ── Group 1: Foundation (Q1–3) ──
        {
            id: 'current_level', group: 'Foundation',
            q: 'What is your current CEFR level?',
            sub: 'Be honest — Atlas AI builds the right plan for exactly where you are today.',
            opts: [
                { label: 'A1 — Beginner', icon: '🌱', desc: 'Just starting English' },
                { label: 'A2 — Elementary', icon: '📘', desc: 'Basic conversations' },
                { label: 'B1 — Intermediate', icon: '📗', desc: 'Can hold a discussion' },
                { label: 'B2 — Upper-Intermediate', icon: '📙', desc: 'Near exam-ready' },
                { label: 'C1 — Advanced', icon: '🏆', desc: 'High proficiency' },
            ],
        },
        {
            id: 'target_level', group: 'Foundation',
            q: 'What certificate level are you aiming for?',
            sub: 'B2 unlocks university entrance exemption. C1 unlocks a 50% teacher salary bonus. Choose your target.',
            opts: [
                { label: 'B1 — 38–50 pts', icon: '🎯', desc: 'Foundation certificate' },
                { label: 'B2 — 51–64 pts', icon: '🏫', desc: 'University exemption + max entrance points' },
                { label: 'C1 — 65–75 pts', icon: '💰', desc: '50% teacher salary bonus + toifa max' },
            ],
        },
        {
            id: 'exam_date', group: 'Foundation',
            q: 'When is your next CEFR exam date?',
            sub: 'The official exam runs monthly across Uzbekistan (register at my.gov.uz). Atlas paces your daily plan around your target sitting.',
            opts: [
                { label: 'In less than 1 month', icon: '🔥', desc: 'Intensive mode' },
                { label: 'In 1–3 months', icon: '⚡', desc: 'Accelerated track' },
                { label: 'In 3–6 months', icon: '📅', desc: 'Steady progress track' },
                { label: 'Not booked yet', icon: '🕐', desc: "I'll decide later" },
            ],
        },
        // ── Group 2: Background (Q4–6) ──
        {
            id: 'weakness', group: 'Background',
            hint: '🧠 83% of students who pinpoint their weakest skill score 20+ points higher',
            q: 'Which skill is dragging your score down the most?',
            sub: 'Atlas will allocate 60% of your daily training to this exact skill.',
            opts: [
                { label: 'Speaking & Fluency', icon: '🎤', desc: 'Fear of speaking aloud' },
                { label: 'Academic Writing', icon: '✍️', desc: 'Essays & formal letters' },
                { label: 'Reading Speed', icon: '📖', desc: 'Running out of time' },
                { label: 'Listening Detail', icon: '🎧', desc: 'Missing small words' },
                { label: 'All skills equally', icon: '⚖️', desc: 'Need a balanced plan' },
            ],
        },
        {
            id: 'previous_attempt', group: 'Background',
            q: 'Have you taken the DTM CEFR exam before?',
            sub: 'Previous experience tells Atlas which exact gaps to fix first.',
            opts: [
                { label: 'No — this is my first attempt', icon: '🆕', desc: 'Clean slate' },
                { label: 'Yes, but scored below target', icon: '📉', desc: 'Need to improve' },
                { label: 'Yes, passed — going for higher', icon: '📈', desc: 'Aiming next level up' },
            ],
        },
        {
            id: 'biggest_challenge', group: 'Background',
            q: 'What is your biggest challenge when studying?',
            sub: 'Atlas builds your plan around your obstacle — not against it.',
            opts: [
                { label: 'I lose motivation easily', icon: '💤', desc: 'Need daily nudges' },
                { label: "I don't know what to study", icon: '🤷', desc: 'No clear roadmap' },
                { label: 'Very little time each day', icon: '⏱️', desc: 'Busy schedule' },
                { label: 'Know theory but fail tests', icon: '📝', desc: 'Need exam practice' },
                { label: 'Exam anxiety & pressure', icon: '😰', desc: 'Stress under test conditions' },
            ],
        },
        // ── Atlas Scan after Q6 ──
        // ── Group 3: Personalisation (Q7–9) ──
        {
            id: 'study_time', group: 'Personalisation',
            q: 'How much time can you study every day?',
            sub: 'Even 15 focused minutes beats 2 hours of passive reading.',
            opts: [
                { label: '15 minutes', icon: '⏱️', desc: 'Short, powerful sprints' },
                { label: '30 minutes', icon: '⏰', desc: 'Consistent daily habit' },
                { label: '1 hour', icon: '🕐', desc: 'Deep focus sessions' },
                { label: '2+ hours (intensive)', icon: '🚀', desc: 'Maximum progress mode' },
            ],
        },
        {
            id: 'priority', group: 'Personalisation',
            hint: "🎯 Students with a clear 'why' are 3× more likely to reach their target",
            q: 'What is the main reason you need this certificate?',
            sub: "Your 'why' becomes the engine that powers your plan when motivation dips.",
            opts: [
                { label: 'University entrance exemption', icon: '🎓', desc: 'B2 = skip foreign language block + max points' },
                { label: 'Teacher salary bonus (50%)', icon: '👨‍🏫', desc: 'C1 = 50% salary supplement for educators' },
                { label: 'Career or promotion', icon: '💼', desc: 'Job advancement requiring English proof' },
                { label: 'Personal achievement', icon: '🏅', desc: 'Proving my proficiency to myself' },
            ],
        },
        {
            id: 'motivation', group: 'Personalisation',
            q: 'How motivated are you to pass this exam right now?',
            sub: 'Your commitment level directly shapes the intensity Atlas sets for you.',
            opts: [
                { label: 'Need a push to get going', icon: '😐', desc: 'Starting is hard' },
                { label: 'Motivated — I have a plan', icon: '😊', desc: 'Ready to be consistent' },
                { label: 'Very motivated', icon: '💪', desc: "I'm all in" },
                { label: 'This is urgent — no excuses', icon: '🔥', desc: 'Maximum intensity mode' },
            ],
        },
        // ── Group 4: Intent (Q10–12) ──
        {
            id: 'feature_interest', group: 'Intent',
            hint: '⭐ Premium prep costs 49K/mo — 8× less than one failed 405K exam retake',
            q: 'Which Atlas AI tool sounds most powerful for your goal?',
            sub: 'This becomes the #1 tool highlighted in your personalised roadmap.',
            opts: [
                { label: 'AI Writing feedback in 30 seconds', icon: '✍️', desc: 'Instant essay grading' },
                { label: 'Speaking pronunciation scoring', icon: '🎤', desc: 'AI fluency analysis' },
                { label: '50 full DTM reading mock exams', icon: '📖', desc: 'Exact exam simulation' },
                { label: 'Spaced-repetition vocabulary trainer', icon: '🔤', desc: '1,500 academic words' },
            ],
        },
        {
            id: 'other_platforms', group: 'Intent',
            q: 'Have you paid for CEFR prep tools before?',
            sub: "We'll show you exactly what's different — and why it's better.",
            opts: [
                { label: 'No — only free tools so far', icon: '🆓', desc: 'Never invested in prep' },
                { label: 'Yes — under 100K UZS', icon: '💳', desc: 'Tried cheaper options' },
                { label: 'Yes — 100K–400K UZS', icon: '💰', desc: 'Courses or tutor sessions' },
                { label: 'Yes — paid 2M+ for IELTS', icon: '💸', desc: '5× the cost of the CEFR exam' },
            ],
        },
        {
            id: 'start_date', group: 'Intent',
            hint: '⚡ Monthly exams at my.gov.uz — every week you delay is one exam cycle lost',
            q: 'When do you want to start improving your score?',
            sub: 'Your roadmap is ready the moment you answer — the clock is already ticking.',
            opts: [
                { label: 'Right now — today', icon: '🚀', desc: 'Let\'s go immediately' },
                { label: 'This week', icon: '📅', desc: 'In the next few days' },
                { label: 'Next month', icon: '🗓️', desc: 'When I have more time' },
                { label: "I'm just exploring", icon: '👀', desc: 'Not decided yet' },
            ],
        },
    ];

    const handleSelect = (opt: string) => {
        // Flash the selected option briefly, then advance
        setSelectedOption(opt);
        setTimeout(() => {
            setSelectedOption(null);
            const newSel = [...selections, opt];
            setSelections(newSel);
            const nextStep = step + 1;

            // After Q6 → Atlas Scan animation
            if (step === 6) {
                setStep(nextStep);
                setShowScanAnimation(true);
                return;
            }
            // After Q12 (last question) → Plan Building animation, then result
            if (step === surveyQuestions.length) {
                setShowPlanBuilding(true);
                return;
            }
            setStep(nextStep);
        }, 360);
    };

    const handleNameSubmit = () => {
        const trimmed = nameInput.trim();
        if (!trimmed) return;
        setUserName(trimmed);
        setShowNameStep(false);
    };

    // Auto-advance from plan building → result after animation completes
    useEffect(() => {
        if (!showPlanBuilding) return;
        const t = setTimeout(() => {
            setShowPlanBuilding(false);
            setShowResult(true);
        }, 3200);
        return () => clearTimeout(t);
    }, [showPlanBuilding]);

    /* ── Compute recommendation from selections ── */
    const getLevelGap = () => {
        const order = ['A1', 'A2', 'B1', 'B2', 'C1'];
        const cur = order.findIndex(l => selections[0]?.startsWith(l));
        const tgt = order.findIndex(l => selections[1]?.startsWith(l));
        return Math.max(0, tgt - cur);
    };
    const isUrgent = !!(selections[2]?.includes('less than 1 month') || selections[2]?.includes('1–3'));
    const gap = getLevelGap();
    const recommendPremium = gap >= 2 || isUrgent;
    const currentLabel = selections[0]?.split(' — ')[0] ?? 'A2';
    const targetLabel  = selections[1]?.split(' — ')[0] ?? 'B2';

    // Progress bar (fills as user answers questions)
    const progressPct = (showResult || showPlanBuilding) ? 100
        : showScanAnimation ? 50
        : showNameStep ? 0
        : ((step - 1) / surveyQuestions.length) * 100;
    const currentGroup: string = showNameStep ? '👋 Welcome'
        : (surveyQuestions[step - 1]?.group ?? 'Complete');

    /* ── Features ── */
    const features = [
        { title: 'Official Mock Tests', desc: '50+ full Reading & Listening papers built from the official Bilim va malakalarni baholash agentligi exam format — the agency that issues your real certificate.', color: 'var(--color-primary)', bg: 'rgba(91,80,232,0.08)', icon: <BookOpen size={20} color="var(--color-primary)" />, chips: ['B1', 'B2', 'C1'] },
        { title: 'AI Essay Grading', desc: 'Instant Writing feedback scored against the exact rubric used in the official CEFR exam — in under 30 seconds, any time of day.', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.08)', icon: <GraduationCap size={20} color="var(--color-success)" />, chips: ['Essay', 'Letter', 'Report'] },
        { title: 'Vocabulary Lab', desc: 'Master the 1,500 most frequent academic words tested in CEFR Reading & Listening sections with smart spaced repetition.', color: 'var(--color-purple)', bg: 'rgba(139,92,246,0.08)', icon: <Library size={20} color="var(--color-purple)" />, chips: ['A2', 'B1', 'B2', 'C1'] },
        { title: 'Speaking Atlas', desc: 'AI fluency and pronunciation scoring on real speaking prompts — the skill that separates B1 from B2, and B2 from C1.', color: 'var(--color-error)', bg: 'rgba(244,63,94,0.08)', icon: <Mic size={20} color="var(--color-error)" />, chips: ['Fluency', 'Pronunciation'] },
        { title: 'Level Progress Map', desc: 'Visualize your journey from A1 to C1 with live XP and streak tracking — know exactly how close you are to your B2 or C1 certificate.', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.08)', icon: <TrendingUp size={20} color="var(--color-warning)" />, chips: ['A1→C1', 'XP System'] },
        { title: 'Grammar Guard', desc: 'Automatically identifies recurring structural errors — the patterns that cost you points on the official CEFR Writing and Speaking assessments.', color: 'var(--color-secondary)', bg: 'rgba(6,182,212,0.08)', icon: <CheckCircle2 size={20} color="var(--color-secondary)" />, chips: ['Grammar', 'Auto-fix'] },
    ];

    /* ── How it works ── */
    const howSteps = [
        { num: '01', icon: <Brain size={20} color="var(--color-primary)" />, bg: 'rgba(91,80,232,0.1)', title: 'Tell Atlas your goal', desc: 'Answer 12 quick questions. Atlas maps your exact skill gaps and builds a daily roadmap targeting your B2 or C1 certificate.' },
        { num: '02', icon: <Layers size={20} color="var(--color-success)" />, bg: 'rgba(16,185,129,0.1)', title: 'Practice with official mocks', desc: 'Work through papers built on the official Bilim va malakalarni baholash agentligi format — all 4 skills, every CEFR level, under real exam timing.' },
        { num: '03', icon: <BarChart2 size={20} color="var(--color-warning)" />, bg: 'rgba(245,158,11,0.1)', title: 'Get instant AI feedback', desc: 'Every answer scored in real-time against official CEFR criteria. Track your progress and walk into the monthly exam day knowing exactly what to expect.' },
    ];

    /* ── Testimonials ── */
    const testimonials = [
        { text: '"I improved from B1 to B2 in just 6 weeks. The AI feedback on my essays was sharper than any tutor I\'d paid 300,000 UZS a month for — and the exam cost was only 405K."', name: 'Sardor M.', meta: 'Tashkent · B1 → B2', avatar: 'S', color: '#5B50E8', score: '+24 pts', stars: 5, exam: 'CEFR 2024' },
        { text: '"The Reading mocks mirror the real Bilim va malakalarni exam exactly. I went in confident and came out with my C1 certificate first attempt. Now I get the 50% salary bonus."', name: 'Dilnoza K.', meta: 'Samarkand · B2 → C1', avatar: 'D', color: '#10B981', score: '+18 pts', stars: 5, exam: 'CEFR 2024' },
        { text: '"Atlas caught grammar patterns in my writing I\'d been repeating for years. Got my B2 — now I\'m exempt from the foreign language block in my university entrance exam."', name: 'Jasur A.', meta: 'Bukhara · A2 → B1', avatar: 'J', color: '#F59E0B', score: '+32 pts', stars: 5, exam: 'CEFR 2024' },
        { text: '"I had 6 weeks until the monthly exam and was panicking. The intensive track gave me a daily plan and I jumped a full CEFR level. Got my B2 — university exemption secured."', name: 'Malika R.', meta: 'Fergana · B1 → B2', avatar: 'M', color: '#F43F5E', score: '+26 pts', stars: 5, exam: 'CEFR 2025' },
        { text: '"I paid 2 million UZS for IELTS prep twice and failed both times. CEFR Academy cost me 49K/month — I passed the 405K Bilim va malakalarni exam on my first try."', name: 'Otabek N.', meta: 'Namangan · B1 → B2', avatar: 'O', color: '#8B5CF6', score: '+29 pts', stars: 5, exam: 'CEFR 2025' },
        { text: '"My tutor was teaching from a 2019 textbook. CEFR Academy uses the actual official format. C1 achieved — and I\'m now earning the teacher salary supplement."', name: 'Zulfiya T.', meta: 'Nukus · B2 → C1', avatar: 'Z', color: '#06B6D4', score: '+15 pts', stars: 5, exam: 'CEFR 2025' },
    ];

    /* ── Comparison table ── */
    const compRows = [
        { label: 'Official Bilim va malakalarni exam papers', academy: true,  tutor: false, youtube: false },
        { label: 'Instant AI feedback (< 30s)',               academy: true,  tutor: false, youtube: false },
        { label: '24 / 7 availability',                       academy: true,  tutor: false, youtube: true  },
        { label: 'Personalised study roadmap',                academy: true,  tutor: true,  youtube: false },
        { label: 'Speaking pronunciation score',              academy: true,  tutor: true,  youtube: false },
        { label: 'Certificate validity',                      academy: '2 yrs', tutor: '—',  youtube: '—'   },
        { label: 'Monthly prep cost (UZS)',                   academy: 'Free–49K', tutor: '300K+', youtube: 'Free' },
        { label: 'vs. IELTS exam (2,000,000 UZS)',            academy: '405K ✓', tutor: '405K ✓', youtube: '2M ✗' },
    ];

    /* ── FAQ ── */
    const faqs = [
        { q: 'How much does the official CEFR exam cost in Uzbekistan?', a: 'The official exam — organized by Bilim va malakalarni baholash agentligi (former DTM) — costs 405,000 UZS. This is more than 5× cheaper than IELTS (≈2,000,000 UZS), making it the most affordable internationally recognized English certificate in Uzbekistan. You can register at my.gov.uz or my.dtm.uz.' },
        { q: 'What are the benefits of achieving a B2 certificate?', a: 'A B2 result (51–64 points) exempts you from the foreign language block in university entrance exams and earns you maximum points in that section. It also provides a significant advantage for non-philology magistratura (master\'s) admission and for doctorate document submission requirements.' },
        { q: 'What are the benefits of achieving a C1 certificate?', a: 'A C1 result (65–75 points) unlocks a 50% teacher salary supplement — a life-changing benefit for educators. It also earns maximum points in the toifa (professional rank) exam and provides the highest advantage for English philology magistratura and doctorate programs.' },
        { q: 'How long is the CEFR certificate valid?', a: 'Your official CEFR certificate is valid for 2 years from the date of issue. The exam is held monthly in Tashkent and at all regional centers across Uzbekistan, so there are regular opportunities to sit it.' },
        { q: 'Is CEFR Academy aligned with the official exam format?', a: 'Yes. Every Reading and Listening mock is built on the official Bilim va malakalarni baholash agentligi exam structure. Writing tasks mirror the exact rubric used by official markers, and Speaking prompts follow the same format as the real exam.' },
        { q: 'What\'s included in the free plan?', a: 'The free plan gives you 3 AI Writing checks, 1 Speaking mock, and unlimited Reading & Listening tests at all CEFR levels. There is no time limit and no credit card required.' },
        { q: 'Is there a refund policy for Premium?', a: 'Absolutely. If you practice for 14 days and don\'t see measurable progress, we will refund your subscription — no questions asked.' },
    ];

    /* ── Pricing plans ── */
    const plans = [
        {
            tier: 'Forever Free', price: 'Free', period: 'No card needed',
            features: ['3 AI Writing checks / month', '1 Speaking mock', 'Full Reading & Listening', 'All B1, B2, C1 levels', 'Official Bilim va malakalarni format'],
            cta: 'Start Free', highlight: false,
        },
        {
            tier: 'Pro', price: '29,000', period: 'UZS / month',
            features: ['Unlimited Writing checks', 'All essay types (letter, report)', 'Unlimited Reading tests', 'Unlimited Listening tests', 'Error tracking dashboard', '7× cheaper than the exam itself'],
            cta: 'Get Pro', highlight: false, badge: 'Popular',
        },
        {
            tier: 'Premium', price: '49,000', period: 'UZS / month · Everything',
            features: ['Everything in Pro', 'Unlimited Speaking feedback', '1 Full CEFR Mock Exam/month', 'Real-time AI pronunciation score', 'B2 & C1 track — official benefits unlocked', '14-day money-back guarantee'],
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
                            <span className="eyebrow" style={{ color: 'var(--color-secondary)' }}>AI-POWERED · BILIM VA MALAKALARNI BAHOLASH AGENTLIGI · UZBEKISTAN</span>
                            <h1 className="h1-hero">
                                Go from <span className="gradient-text">A2 to B2</span><br />
                                before your exam date.
                            </h1>
                            <p className="hero-description">
                                Atlas AI prepares you for the official CEFR exam by Bilim va malakalarni baholash agentligi (former DTM) — held every month across Uzbekistan for only 405,000 UZS. Reach <strong>B2</strong> and earn university entrance exemption. Reach <strong>C1</strong> and unlock a 50% teacher salary bonus.
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
                                <span>✓ Official Bilim va malakalarni Standards</span>
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
                            { icon: <Award size={16} />, text: 'B2 = University entrance exemption' },
                            { icon: <CheckCircle2 size={16} />, text: 'C1 = 50% teacher salary bonus' },
                            { icon: <Users size={16} />, text: '5× cheaper than IELTS' },
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
                        🎓 B2 = UNIVERSITY ENTRANCE EXEMPTION + MAX POINTS &nbsp;·&nbsp; 💰 EXAM COST: 405,000 UZS &nbsp;·&nbsp; 🏆 C1 = 50% TEACHER SALARY BONUS &nbsp;·&nbsp; 📅 MONTHLY EXAMS NATIONWIDE &nbsp;·&nbsp; ✅ 2-YEAR CERTIFICATE VALIDITY &nbsp;·&nbsp; 💸 5× CHEAPER THAN IELTS (2,000,000 UZS) &nbsp;·&nbsp; 🌐 REGISTER: my.gov.uz OR my.dtm.uz &nbsp;·&nbsp; 🎓 B2 = UNIVERSITY ENTRANCE EXEMPTION + MAX POINTS &nbsp;·&nbsp; 💰 EXAM COST: 405,000 UZS &nbsp;·&nbsp; 🏆 C1 = 50% TEACHER SALARY BONUS &nbsp;·&nbsp; 📅 MONTHLY EXAMS NATIONWIDE &nbsp;·&nbsp; ✅ 2-YEAR CERTIFICATE VALIDITY &nbsp;·&nbsp; 💸 5× CHEAPER THAN IELTS (2,000,000 UZS) &nbsp;·&nbsp; 🌐 REGISTER: my.gov.uz OR my.dtm.uz
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="stats-section">
                    <div className="container">
                        <div className="stats-grid">
                            {[
                                { num: '405,000', label: 'UZS Official Exam Fee' },
                                { num: '5×', label: 'Cheaper Than IELTS' },
                                { num: '2 years', label: 'Certificate Validity' },
                                { num: 'Monthly', label: 'Exams Nationwide' },
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
                            These are the three reasons most students fail the official Bilim va malakalarni CEFR exam — and why traditional preparation doesn't fix them.
                        </p>
                        <div className="problem-grid">
                            {[
                                { cls: 'rose', pill: 'No Feedback', icon: <Zap size={26} className="text-error" />, h: '"I don\'t know my level"', p: 'Practicing without a baseline is like driving in the dark. You need instant, accurate scoring on every attempt.' },
                                { cls: 'amber', pill: 'Lost Time', icon: <Clock size={26} className="text-warning" />, h: '"Waiting days for feedback"', p: 'Don\'t wait 48 h for a tutor. Get AI assessments in under 30 seconds, every time, at any hour.' },
                                { cls: 'indigo', pill: 'No Direction', icon: <Activity size={26} className="text-primary" />, h: '"Inconsistent results"', p: 'The official CEFR marking criteria are complex. Atlas ensures you hit every point on every attempt.' },
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
                            Atlas AI adapts to your weaknesses and builds a structured daily path to your B2 or C1 certificate — the 405,000 UZS exam that opens real doors in Uzbekistan.
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
                                Six integrated tools. One platform. One mission: your official Bilim va malakalarni CEFR certificate — valid 2 years, earned in a single 405K UZS exam.
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
                                See exactly why students preparing for the 405,000 UZS official exam choose Atlas AI over paying 300K+ per month for a private tutor.
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
                            Uzbek students from Tashkent to Nukus are passing the official 405,000 UZS CEFR exam and unlocking real benefits — B2 exemptions, C1 salary bonuses, and more.
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
                            All prices in Uzbek Som (UZS). The official CEFR exam fee is 405,000 UZS — register at my.gov.uz or my.dtm.uz. Premium includes 14-day money-back guarantee.
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
                                <strong>The monthly CEFR exam registration is open now.</strong>
                                <span> Students who start preparing 6+ weeks early are 3× more likely to reach their B2 or C1 target.</span>
                            </div>
                        </div>
                        <button className="btn urgency-btn" onClick={() => scrollTo('builder')}>
                            Start Now — It's Free <ArrowRight size={15} />
                        </button>
                    </div>
                </div>

                {/* ── Plan Builder Survey ── */}
                <section id="builder" className="builder-section">
                    <div className="container">
                        <div className="text-center builder-header">
                            <span className="eyebrow">PERSONALISED PLAN BUILDER</span>
                            <h2>Build your free study roadmap in 90 seconds</h2>
                            <p className="text-muted">
                                12 quick questions. Atlas AI maps your exact path to&nbsp;
                                <strong>{targetLabel || 'your target level'}</strong>.
                            </p>
                        </div>

                        {/* ── Rotating quote ── */}
                        <motion.div
                            className="survey-quote-box"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Quote size={18} className="sq-icon" />
                            <div className="sq-content">
                                <p className="sq-text">"{STUDY_QUOTES[quoteIdx].text}"</p>
                                <span className="sq-author">— {STUDY_QUOTES[quoteIdx].author}</span>
                            </div>
                        </motion.div>

                        {/* ── Survey card ── */}
                        <div className="survey-card-v2">

                            {/* Animated progress bar — hidden only on pure result screen */}
                            {!showResult && (
                                <div className="sv2-progress-wrap">
                                    <div className="sv2-progress-track">
                                        <motion.div
                                            className="sv2-progress-fill"
                                            animate={{ width: `${progressPct}%` }}
                                            transition={{ duration: 0.65, ease: 'easeOut' }}
                                        />
                                        {progressPct < 100 && (
                                            <motion.div
                                                className="sv2-progress-glow"
                                                animate={{ left: `${Math.max(progressPct - 0.5, 0)}%` }}
                                                transition={{ duration: 0.65, ease: 'easeOut' }}
                                            />
                                        )}
                                    </div>
                                    <div className="sv2-progress-meta">
                                        <span className="sv2-group-chip">
                                            {showScanAnimation ? '🧠 Atlas Scan'
                                                : showPlanBuilding ? '⚙️ Building'
                                                : currentGroup}
                                        </span>
                                        {!showScanAnimation && !showPlanBuilding && !showNameStep && (
                                            <span className="sv2-step-count">
                                                Q{step} <span className="sv2-step-of">of {surveyQuestions.length}</span>
                                            </span>
                                        )}
                                        <span className="sv2-pct">{Math.round(progressPct)}%</span>
                                    </div>
                                </div>
                            )}

                            <AnimatePresence mode="wait">

                                {/* ─── Name / greeting step ─── */}
                                {showNameStep ? (
                                    <motion.div key="name-step" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -22 }} transition={{ duration: 0.2 }}>
                                        <div className="sv2-name-screen">

                                            {/* Atlas greeting card */}
                                            <motion.div className="sv2-name-atlas-greeting"
                                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1, type: 'spring', stiffness: 180 }}
                                            >
                                                <div className="sv2-name-atlas-avatar">
                                                    <Sparkles size={20} color="white" />
                                                </div>
                                                <div className="sv2-name-atlas-info">
                                                    <strong>Hi! I'm Atlas.</strong>
                                                    <span>Your AI-powered CEFR coach.</span>
                                                </div>
                                            </motion.div>

                                            {/* Question */}
                                            <motion.div className="sv2-name-q-block"
                                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.22 }}
                                            >
                                                <h3 className="sv2-question">What should I call you?</h3>
                                                <p className="sv2-sub">I'll use your name throughout every question, every scan, and your final plan — making this truly yours.</p>
                                            </motion.div>

                                            {/* Input + CTA */}
                                            <motion.div className="sv2-name-input-wrap"
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.38 }}
                                            >
                                                <input
                                                    className="sv2-name-input"
                                                    type="text"
                                                    placeholder="Your first name (e.g. Jasur)"
                                                    value={nameInput}
                                                    onChange={e => setNameInput(e.target.value)}
                                                    onKeyDown={e => { if (e.key === 'Enter') handleNameSubmit(); }}
                                                    autoFocus
                                                    maxLength={32}
                                                />
                                                <motion.button
                                                    className="sv2-name-continue-btn"
                                                    onClick={handleNameSubmit}
                                                    disabled={!nameInput.trim()}
                                                    whileHover={{ scale: nameInput.trim() ? 1.02 : 1 }}
                                                    whileTap={{ scale: nameInput.trim() ? 0.97 : 1 }}
                                                >
                                                    {nameInput.trim()
                                                        ? <>Let's go, <strong>{nameInput.trim()}</strong>! <ArrowRight size={16} /></>
                                                        : <>Enter your name to continue <ArrowRight size={16} /></>
                                                    }
                                                </motion.button>
                                                <p className="sv2-name-note">🔒 Only used to personalise your plan — never shared.</p>
                                            </motion.div>

                                        </div>
                                    </motion.div>

                                ) : showResult ? (
                                    <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="result-screen">
                                        <div className="result-header">
                                            <div className="result-icon-wrap"><Sparkles size={32} color="var(--color-primary)" /></div>
                                            <h3>Your CEFR Roadmap is Ready{userName ? `, ${userName}` : ''}!</h3>
                                            <p className="text-muted">Based on your profile, here's what Atlas AI recommends:</p>
                                        </div>
                                        <div className="result-gap">
                                            <div className="result-level current">{currentLabel}<span>Current</span></div>
                                            <div className="result-arrow">
                                                <div className="result-gap-line" />
                                                <TrendingUp size={20} color="var(--color-primary)" />
                                                <span className="result-gap-label">{gap <= 1 ? '~4–6 weeks' : gap === 2 ? '~8–12 weeks' : '~16+ weeks'}</span>
                                            </div>
                                            <div className="result-level target">{targetLabel}<span>Target</span></div>
                                        </div>
                                        <div className={`result-plan-card ${recommendPremium ? 'premium' : 'pro'}`}>
                                            <div className="result-plan-header">
                                                <span className="result-plan-badge">{recommendPremium ? '⭐ Recommended for your profile' : '✓ Good fit for you'}</span>
                                                <h4>{recommendPremium ? 'Premium Plan' : 'Pro Plan'}</h4>
                                                <div className="result-plan-price">
                                                    <span>{recommendPremium ? '49,000' : '29,000'}</span>
                                                    <span className="result-plan-period">UZS / month</span>
                                                </div>
                                            </div>
                                            <ul className="result-plan-features">
                                                {(recommendPremium
                                                    ? ['Unlimited AI Speaking feedback', 'Unlimited Writing checks + all types', '1 Full CEFR mock exam / month', 'Real-time pronunciation scoring', 'B2 track → university entrance exemption', '14-day money-back guarantee']
                                                    : ['Unlimited Writing checks', 'All essay types (letter, report)', 'Unlimited Reading & Listening', 'Error tracking dashboard', 'Official Bilim va malakalarni format']
                                                ).map(f => <li key={f}><Check size={14} />{f}</li>)}
                                            </ul>
                                        </div>
                                        <div className="result-social-proof">
                                            <div className="rsp-avatars">
                                                {[['#5B50E8','S'],['#10B981','D'],['#F59E0B','J'],['#F43F5E','M'],['#8B5CF6','O']].map(([c,l],i) => (
                                                    <div key={i} className="rsp-avatar" style={{ background: c, marginLeft: i > 0 ? '-8px' : 0 }}>{l}</div>
                                                ))}
                                            </div>
                                            <span><strong>Students like you</strong> are passing the 405K official exam and unlocking real B2/C1 benefits</span>
                                        </div>
                                        {isUrgent && (
                                            <div className="result-urgency">
                                                <Timer size={15} />
                                                <span>Your exam is soon — intensive track loaded. Register at <strong>my.gov.uz</strong> or <strong>my.dtm.uz</strong> (405,000 UZS).</span>
                                            </div>
                                        )}
                                        <div className="result-actions">
                                            <button className="btn btn-primary result-cta" onClick={() => navigate('/login')}>
                                                <Unlock size={16} />
                                                Get {recommendPremium ? 'Premium' : 'Pro'} — Unlock Full Plan
                                            </button>
                                            <button className="result-free-link" onClick={() => navigate('/login')}>
                                                Or start with the free plan — no card needed →
                                            </button>
                                        </div>
                                    </motion.div>

                                ) : showPlanBuilding ? (
                                    /* ─── Plan building animation ─── */
                                    <motion.div key="building" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <PlanBuildingScreen userName={userName} />
                                    </motion.div>

                                ) : showScanAnimation ? (
                                    /* ─── Atlas Scan interstitial ─── */
                                    <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
                                        <AtlasScanScreen
                                            selections={selections}
                                            onContinue={() => setShowScanAnimation(false)}
                                            userName={userName}
                                        />
                                    </motion.div>

                                ) : (
                                    /* ─── Questions ─── */
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 22 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -22 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {/* Insight hint chip (data-driven, shown on Q4/Q8/Q10/Q12) */}
                                        {surveyQuestions[step - 1].hint && (
                                            <motion.div
                                                className="sv2-hint-chip"
                                                initial={{ opacity: 0, y: -6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.18 }}
                                            >
                                                {surveyQuestions[step - 1].hint}
                                            </motion.div>
                                        )}

                                        {/* Personalized welcome on Q1 */}
                                        {step === 1 && userName && (
                                            <motion.div
                                                className="sv2-personal-greeting"
                                                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                Nice to meet you, <strong>{userName}</strong>! Let's map your path to B2 or C1. 👋
                                            </motion.div>
                                        )}

                                        <div className="sv2-q-header">
                                            <span className="sv2-step-label">STEP {step} OF {surveyQuestions.length}</span>
                                            <h3 className="sv2-question">{surveyQuestions[step - 1].q}</h3>
                                            <p className="sv2-sub">{surveyQuestions[step - 1].sub}</p>
                                        </div>

                                        <div className="sv2-options">
                                            {surveyQuestions[step - 1].opts.map((opt, i) => (
                                                <motion.button
                                                    key={opt.label}
                                                    className={`sv2-option-btn${selectedOption === opt.label ? ' selected' : ''}`}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.06 }}
                                                    onClick={() => handleSelect(opt.label)}
                                                    disabled={selectedOption !== null}
                                                >
                                                    <span className="sv2-opt-emoji">{opt.icon}</span>
                                                    <span className="sv2-opt-body">
                                                        <span className="sv2-opt-label">{opt.label}</span>
                                                        {opt.desc && <span className="sv2-opt-desc">{opt.desc}</span>}
                                                    </span>
                                                    {selectedOption === opt.label
                                                        ? <CheckCircle2 size={16} className="sv2-opt-check" />
                                                        : <ArrowRight size={15} className="sv2-opt-arrow" />}
                                                </motion.button>
                                            ))}
                                        </div>

                                        <div className="sv2-social-proof">
                                            <div className="sv2-sp-avatars">
                                                {[['#5B50E8','A'],['#10B981','F'],['#F59E0B','B']].map(([c,l],i) => (
                                                    <div key={i} className="sv2-sp-avatar" style={{ background: c, marginLeft: i > 0 ? '-6px' : 0 }}>{l}</div>
                                                ))}
                                            </div>
                                            <span><strong>{(12000 + step * 137).toLocaleString()}+</strong> students completed this plan builder</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Student wins ticker ── */}
                        <div className="survey-wins-strip">
                            <div className="sws-label">
                                <Star size={12} fill="#F59E0B" color="#F59E0B" />
                                RECENT STUDENT WINS
                            </div>
                            <div className="sws-track-wrap">
                                <div className="sws-track">
                                    {[...SURVEY_TESTIMONIALS, ...SURVEY_TESTIMONIALS].map((t, i) => (
                                        <div key={i} className="sws-card">
                                            <div className="sws-avatar" style={{ background: t.color }}>{t.avatar}</div>
                                            <div className="sws-body">
                                                <span className="sws-name">{t.name} <span className="sws-meta">{t.meta}</span></span>
                                                <span className="sws-text">{t.text}</span>
                                            </div>
                                            <div className="sws-score">{t.score}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
