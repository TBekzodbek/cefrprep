import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, Edit3, Send, Sparkles, Loader2,
    CheckCircle, AlertCircle, Clock, RefreshCw,
    ChevronDown,
} from 'lucide-react';
import { getAIResponse, extractJSON } from '../lib/ai';
import './PageLayout.css';
import './Writing.css';

interface Props { lang: 'en' | 'uz'; }

interface AIFeedback {
    score: string;
    positives: string[];
    improvements: string[];
    grammar_fixes: string[];
}

// ─── Prompt banks ─────────────────────────────────────────────────────────────

const TASK1_PROMPTS = [
    {
        title: 'Formal Complaint',
        en: 'You recently bought a new laptop from an electronics store. When you got home, you noticed the screen was damaged. Write a letter to the store manager to:\n• explain when and where you bought the laptop\n• describe the problem\n• say what action you would like the store to take',
        uz: 'Siz yaqinda elektronika do\'konidan yangi noutbuk sotib oldingiz. Uyga kelganingizda ekran shikastlanganini ko\'rdingiz. Do\'kon menejeriga xat yozing:\n• noutbukni qachon va qayerdan sotib olganingizni tushuntiring\n• muammoni tasvirlab bering\n• do\'kondan qanday choralar ko\'rishini so\'rang',
    },
    {
        title: 'University Enquiry',
        en: 'You are interested in enrolling in a part-time English language course at a local college. Write a letter to the college admissions office to:\n• ask about the available courses and their schedules\n• enquire about the fees and payment options\n• find out whether any scholarships are available',
        uz: 'Siz mahalliy kollejda ingliz tili bo\'yicha qisman vaqtli kursga yozilishni xohlaysiz. Qabul idorasiga xat yozing:\n• mavjud kurslar va jadval haqida so\'rang\n• to\'lov miqdori va to\'lov usullari haqida so\'rang\n• stipendiyalar mavjudligini aniqlang',
    },
    {
        title: 'Job Application',
        en: 'You have seen an advertisement for a part-time job at a bookshop. Write a letter to the manager to:\n• explain why you are interested in the position\n• describe your relevant experience or skills\n• ask about the working hours and starting date',
        uz: 'Kitob do\'konida yarim kunlik ish e\'lonini ko\'rdingiz. Menejeriga xat yozing:\n• bu lavozim nima uchun qiziqishingizni tushuntiring\n• tegishli tajriba yoki ko\'nikmalaringizni tasvirlab bering\n• ish soatlari va boshlanish sanasi haqida so\'rang',
    },
    {
        title: 'Accommodation Request',
        en: 'You are going to study abroad for one semester and need accommodation. Write a letter to the university housing office to:\n• introduce yourself and explain your situation\n• describe the type of accommodation you need\n• ask about the application process and deadlines',
        uz: 'Siz bir semestr chet elda o\'qishga borasiz va yashash joyi kerak. Universitetning turar-joy bo\'limiga xat yozing:\n• o\'zingizni tanishtiring va vaziyatingizni tushuntiring\n• qanday yashash joyi kerakligini tasvirlab bering\n• ariza topshirish jarayoni va muddatlarini so\'rang',
    },
    {
        title: 'Neighbour Concern',
        en: 'You have been having problems with a neighbour. Write a letter to your local council to:\n• describe the problem you are experiencing\n• explain how it is affecting you and other residents\n• suggest what action the council should take',
        uz: 'Qo\'shningiz bilan muammolaringiz bor. Mahalliy kengashga xat yozing:\n• duch kelayotgan muammoni tasvirlab bering\n• bu muammo siz va boshqa aholiga qanday ta\'sir qilayotganini tushuntiring\n• kengash qanday chora ko\'rishi kerakligini taklif qiling',
    },
];

const TASK2_PROMPTS = [
    {
        title: 'Technology & Society',
        en: 'Some people believe that social media has had an overall negative effect on society. Others feel it has had a largely positive impact.\n\nDiscuss both views and give your own opinion.',
        uz: 'Ba\'zi odamlar ijtimoiy tarmoqlar jamiyatga umuman salbiy ta\'sir ko\'rsatdi deb hisoblashadi. Boshqalar esa bu asosan ijobiy ta\'sir deb bilishadi.\n\nIkkala nuqtai nazarni muhokama qiling va o\'z fikringizni bildiring.',
    },
    {
        title: 'Education',
        en: 'In many countries, young people are encouraged to take a gap year — a year off between finishing school and starting university. Some argue this is beneficial, while others believe it is a waste of time.\n\nTo what extent do you agree or disagree with the idea of taking a gap year?',
        uz: 'Ko\'p mamlakatlarda yoshlar maktabni tugatgandan keyin va universitetga kirishdan oldin bir yil tanaffus qilishga undashadi. Ba\'zilar buning foydali ekanligini ta\'kidlaydi, boshqalar esa vaqt isrof deb hisoblaydi.\n\nGap yil g\'oyasi bilan qanchalik rozi yoki rozi emasligingizni izohlang.',
    },
    {
        title: 'Environment',
        en: 'It is the responsibility of individuals, not governments, to protect the environment.\n\nTo what extent do you agree or disagree with this statement?',
        uz: 'Atrof-muhitni muhofaza qilish hukumat emas, alohida shaxslarning mas\'uliyatidir.\n\nBu fikr bilan qanchalik rozi yoki rozi emasligingizni izohlang.',
    },
    {
        title: 'Work & Career',
        en: 'Many people believe that working from home is the future of employment. However, others argue that traditional office work is more productive and beneficial for workers.\n\nDiscuss both views and give your own opinion.',
        uz: 'Ko\'p odamlar uydan ishlash kelajakdagi ish usuli deb hisoblashadi. Ammo boshqalar an\'anaviy ofis ishi ko\'proq samarali va ishchilar uchun foydali deb ta\'kidlaydi.\n\nIkkala nuqtai nazarni muhokama qiling va o\'z fikringizni bildiring.',
    },
    {
        title: 'Health & Lifestyle',
        en: 'The government should make it compulsory for all citizens to follow a healthy diet and take regular exercise.\n\nTo what extent do you agree or disagree?',
        uz: 'Hukumat barcha fuqarolar sog\'lom ovqatlanish va muntazam mashq qilishini majburiy qilishi kerak.\n\nBu fikr bilan qanchalik rozi yoki rozi emasligingizni izohlang.',
    },
];

// ─── Timer hook ───────────────────────────────────────────────────────────────

function useCountdown(initialSeconds: number, active: boolean) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const timedOut = timeLeft === 0;

    useEffect(() => {
        setTimeLeft(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        if (!active || timedOut) return;
        const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
        return () => clearInterval(id);
    }, [active, timedOut]);

    const fmt = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    return { timeLeft, timedOut, fmt };
}

// ─── Component ────────────────────────────────────────────────────────────────

const TOTAL_SECONDS = 60 * 60; // 60 minutes — official CEFR writing exam time

const Writing = ({ lang }: Props) => {
    const [task, setTask] = useState<1 | 2>(1);
    const [text, setText] = useState('');
    const [wordCount, setWordCount] = useState(0);

    // Prompt selection
    const [task1Idx, setTask1Idx] = useState(() => Math.floor(Math.random() * TASK1_PROMPTS.length));
    const [task2Idx, setTask2Idx] = useState(() => Math.floor(Math.random() * TASK2_PROMPTS.length));
    const [showPromptPicker, setShowPromptPicker] = useState(false);

    // Timer: starts when user types the first character
    const [timerStarted, setTimerStarted] = useState(false);
    const { timeLeft, timedOut, fmt } = useCountdown(TOTAL_SECONDS, timerStarted);

    // AI scoring
    const [feedback, setFeedback] = useState<AIFeedback | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const uz = lang === 'uz';
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const currentIdx = task === 1 ? task1Idx : task2Idx;
    const prompts = task === 1 ? TASK1_PROMPTS : TASK2_PROMPTS;
    const currentPrompt = prompts[currentIdx];
    const promptText = uz ? currentPrompt.uz : currentPrompt.en;
    const targetWords = task === 1 ? 150 : 250;

    // Word count
    useEffect(() => {
        setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    }, [text]);

    // Auto-submit when time is up
    useEffect(() => {
        if (timedOut && wordCount >= 20 && !submitting && !feedback) {
            handleSubmit();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timedOut]);

    const handleTextChange = (val: string) => {
        setText(val);
        if (!timerStarted && val.trim().length > 0) setTimerStarted(true);
    };

    const handleTaskSwitch = (t: 1 | 2) => {
        setTask(t);
        setText('');
        setFeedback(null);
        setTimerStarted(false);
    };

    const handleNewPrompt = useCallback(() => {
        const pool = task === 1 ? TASK1_PROMPTS : TASK2_PROMPTS;
        const current = task === 1 ? task1Idx : task2Idx;
        const next = (current + 1) % pool.length;
        if (task === 1) setTask1Idx(next);
        else setTask2Idx(next);
        setText('');
        setFeedback(null);
        setTimerStarted(false);
        setShowPromptPicker(false);
    }, [task, task1Idx, task2Idx]);

    const handleSubmit = async () => {
        if (wordCount < 20) return;
        setSubmitting(true);
        setFeedback(null);

        try {
            const prompt = `
Act as a professional CEFR Writing Examiner. Evaluate this Task ${task} response:

"${text}"

Task prompt: "${promptText}"

Return ONLY valid JSON in this exact format:
{
  "score": "B2",
  "positives": ["strength one", "strength two", "strength three"],
  "improvements": ["area one", "area two", "area three"],
  "grammar_fixes": ["fix one", "fix two", "fix three"]
}

Score on CEFR scale (A2/B1/B2/C1). Feedback language: ${uz ? 'Uzbek (Latin script)' : 'English'}.`;

            const resText = await getAIResponse(prompt);
            const parsed = extractJSON(resText);
            setFeedback({
                score: parsed.score?.toString() || 'B1',
                positives: Array.isArray(parsed.positives) ? parsed.positives : [],
                improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
                grammar_fixes: Array.isArray(parsed.grammar_fixes) ? parsed.grammar_fixes : [],
            });
        } catch {
            setFeedback({
                score: '—',
                positives: [uz ? 'Baholashda xatolik yuz berdi.' : 'Could not reach the AI scorer.'],
                improvements: [],
                grammar_fixes: [],
            });
        } finally {
            setSubmitting(false);
        }
    };

    const timerClass =
        !timerStarted ? 'idle' :
        timeLeft < 120 ? 'danger' :
        timeLeft < 300 ? 'warning' : 'running';

    const wordPct = Math.min(100, Math.round((wordCount / targetWords) * 100));
    const wordOk = wordCount >= targetWords;

    return (
        <div className="writing-shell">

            {/* ── Top bar ───────────────────────────────────────────────── */}
            <header className="writing-topbar">
                <div className="writing-topbar-left">
                    <GraduationCap size={22} color="var(--color-primary)" />
                    <div>
                        <span className="writing-title">
                            {uz ? 'Yozma nutq' : 'Writing Practice'}
                        </span>
                        <span className="writing-subtitle">
                            {uz ? '2 ta topshiriq · 60 daqiqa' : '2 Tasks · 60 Minutes · AI Scoring'}
                        </span>
                    </div>
                </div>

                <div className="writing-topbar-right">
                    <div className={`writing-clock ${timerClass}`}>
                        <Clock size={15} />
                        <span>{timerStarted ? fmt(timeLeft) : '60:00'}</span>
                        {!timerStarted && (
                            <span className="clock-hint">
                                {uz ? 'yozishni boshlang' : 'starts on first keystroke'}
                            </span>
                        )}
                    </div>

                    <button
                        className="btn btn-primary writing-submit-btn"
                        onClick={handleSubmit}
                        disabled={submitting || wordCount < 20}
                    >
                        {submitting
                            ? <Loader2 size={16} className="animate-spin" />
                            : <Send size={16} />}
                        {uz ? 'AI Baholash' : 'Get AI Score'}
                    </button>
                </div>
            </header>

            {/* ── Main grid ─────────────────────────────────────────────── */}
            <div className="writing-main-grid">

                {/* Left: task picker + prompt + feedback */}
                <aside className="writing-left-pane">

                    {/* Task tabs */}
                    <div className="task-tab-row">
                        <button
                            className={`task-tab${task === 1 ? ' active' : ''}`}
                            onClick={() => handleTaskSwitch(1)}
                        >
                            <Edit3 size={15} />
                            {uz ? '1-topshiriq' : 'Task 1'}
                            <span className="task-tab-badge">{uz ? 'Xat' : 'Letter'}</span>
                        </button>
                        <button
                            className={`task-tab${task === 2 ? ' active' : ''}`}
                            onClick={() => handleTaskSwitch(2)}
                        >
                            <Sparkles size={15} />
                            {uz ? '2-topshiriq' : 'Task 2'}
                            <span className="task-tab-badge">{uz ? 'Insho' : 'Essay'}</span>
                        </button>
                    </div>

                    {/* Prompt card */}
                    <div className="prompt-card">
                        <div className="prompt-card-header">
                            <span className="prompt-card-label">
                                {uz ? 'Topshiriq' : 'Your Prompt'} · {currentPrompt.title}
                            </span>
                            <div style={{ position: 'relative' }}>
                                <button
                                    className="prompt-change-btn"
                                    onClick={() => setShowPromptPicker(v => !v)}
                                    title={uz ? 'Boshqa topshiriq' : 'Change prompt'}
                                >
                                    <RefreshCw size={13} />
                                    {uz ? "O'zgartirish" : 'Change'}
                                    <ChevronDown size={12} />
                                </button>

                                <AnimatePresence>
                                    {showPromptPicker && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            className="prompt-picker-dropdown"
                                        >
                                            {prompts.map((p, i) => (
                                                <button
                                                    key={i}
                                                    className={`prompt-picker-item${i === currentIdx ? ' selected' : ''}`}
                                                    onClick={() => {
                                                        if (task === 1) setTask1Idx(i);
                                                        else setTask2Idx(i);
                                                        setText('');
                                                        setFeedback(null);
                                                        setTimerStarted(false);
                                                        setShowPromptPicker(false);
                                                    }}
                                                >
                                                    {p.title}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="prompt-text">{promptText}</div>

                        <div className="prompt-card-footer">
                            <span className="prompt-target">
                                {uz ? 'Minimal:' : 'Minimum:'} <strong>{targetWords}+</strong> {uz ? "so'z" : 'words'}
                            </span>
                            <button className="prompt-next-btn" onClick={handleNewPrompt}>
                                <RefreshCw size={12} />
                                {uz ? "Keyingi topshiriq" : 'Next prompt'}
                            </button>
                        </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="feedback-area">
                        <AnimatePresence mode="wait">
                            {feedback ? (
                                <motion.div
                                    key="feedback"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="feedback-content"
                                >
                                    <div className="feedback-score-row">
                                        <span className="feedback-score-label">
                                            {uz ? 'CEFR darajasi' : 'CEFR Level'}
                                        </span>
                                        <span className="feedback-score-badge">{feedback.score}</span>
                                    </div>

                                    {feedback.positives.length > 0 && (
                                        <div className="feedback-block success">
                                            <div className="fb-block-title">
                                                <CheckCircle size={14} />
                                                {uz ? 'Kuchli tomonlar' : 'Strengths'}
                                            </div>
                                            <ul>
                                                {feedback.positives.map((p, i) => (
                                                    <li key={i}>{p}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {feedback.improvements.length > 0 && (
                                        <div className="feedback-block warning">
                                            <div className="fb-block-title">
                                                <AlertCircle size={14} />
                                                {uz ? 'Rivojlantirish' : 'Areas to Improve'}
                                            </div>
                                            <ul>
                                                {feedback.improvements.map((p, i) => (
                                                    <li key={i}>{p}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {feedback.grammar_fixes.length > 0 && (
                                        <div className="feedback-block info">
                                            <div className="fb-block-title">
                                                <Edit3 size={14} />
                                                {uz ? 'Grammatik tuzatishlar' : 'Grammar Fixes'}
                                            </div>
                                            <ul>
                                                {feedback.grammar_fixes.map((p, i) => (
                                                    <li key={i}>{p}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="feedback-placeholder"
                                >
                                    <Sparkles size={28} color="var(--color-primary)" style={{ opacity: 0.4 }} />
                                    <p>
                                        {uz
                                            ? "Yozishni tugatib, \"AI Baholash\" tugmasini bosing."
                                            : 'Write your response and click "Get AI Score" for instant feedback.'}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </aside>

                {/* Right: editor */}
                <div className="writing-editor-pane">
                    <div className="editor-wrapper">
                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={e => handleTextChange(e.target.value)}
                            placeholder={
                                uz
                                    ? 'Javobingizni shu yerda yozing. Birinchi harfni yozganingizda taymer boshlanadi.'
                                    : 'Start writing your response here. The timer begins on your first keystroke.'
                            }
                            className="writing-textarea"
                        />
                    </div>

                    {/* Word count footer */}
                    <div className="editor-footer-bar">
                        <div className="word-bar-track">
                            <div
                                className={`word-bar-fill${wordOk ? ' complete' : ''}`}
                                style={{ width: `${wordPct}%` }}
                            />
                        </div>
                        <div className="editor-footer-meta">
                            <span>
                                {uz ? "So'zlar:" : 'Words:'}&nbsp;
                                <strong className={wordOk ? 'text-success' : undefined}>{wordCount}</strong>
                                <span style={{ color: 'var(--color-text-muted)' }}> / {targetWords}+</span>
                            </span>
                            {wordOk && (
                                <span className="word-goal-met">
                                    <CheckCircle size={13} />
                                    {uz ? 'Maqsadga yetdingiz' : 'Target reached'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Writing;
