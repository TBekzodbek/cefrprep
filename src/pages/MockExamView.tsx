/*
  exam_results table (run once in Supabase SQL editor):

  CREATE TABLE exam_results (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    mock_id text NOT NULL,
    exam_type text NOT NULL,
    score integer NOT NULL,
    total integer NOT NULL,
    detail jsonb,
    completed_at timestamptz DEFAULT now()
  );
  ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "insert own" ON exam_results FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "select own" ON exam_results FOR SELECT USING (auth.uid() = user_id);
*/

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Loader2, ArrowLeft, Trophy, Clock,
    ChevronRight, ChevronLeft, Send, Headphones,
    CheckCircle2, XCircle, BarChart3,
} from 'lucide-react';
import { MockService } from '../data/MockService';
import type { MockTest } from '../data/MockService';
import { GamificationService } from '../lib/gamification';
import { supabase } from '../lib/supabase';
import mockMapping from '../data/mock_mapping.json';
import './PageLayout.css';
import './ExamInterface.css';

const typedMapping = mockMapping as Record<string, number>;

interface Props { lang: 'en' | 'uz'; type: 'reading' | 'listening'; }

type Results = {
    score: number;
    total: number;
    detail: Record<string, boolean>;
    correctKeys: Record<string, string>;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fisherYates<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Strip PDF artefacts so the passage reads cleanly
function cleanExamText(raw: string): string {
    return raw
        .replace(/---PAGE\s*\d+---/gi, '\n')
        .replace(/BAGDAD\s+\d{4}/gi, '')
        .replace(/O[''`]?ZBEKISTON RESPUBLIKASI[\s\S]*?LANGUAGE:\s*ENGLISH/gi, '')
        .replace(/ANSWER\s+SHEET[\s\S]*/i, '')
        .replace(
            /FOLLOW THE INSTRUCTIONS OF THE INVIGILATORS![\s\S]*?DO NOT OPEN THE QUESTION PAPER UNTIL YOU ARE TOLD TO DO SO!/gi,
            ''
        )
        .replace(/Please write your full name[\s\S]{0,300}_{10,}/gi, '')
        .replace(/The test booklet consists of.*\n/gi, '')
        .replace(/Mark your answers on the answer sheet\./gi, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// Format mm:ss
function fmt(s: number) {
    return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

// ─── Passage Renderer ─────────────────────────────────────────────────────────

function PassageRenderer({ text, partNumber }: { text: string; partNumber: number }) {
    const cleaned = cleanExamText(text);
    const blocks = cleaned.split(/\n\n+/).filter(b => b.trim().length > 1);

    return (
        <div className="passage-body">
            <div className="passage-part-label">
                <div className="part-badge">Part {partNumber}</div>
            </div>
            {blocks.map((block, i) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                // Instruction / direction lines get highlighted
                const isInstruction =
                    /^(For questions?|Choose (the correct|one word)|Read the following|Label|Match each|Fill in|Decide if|You will hear)/i.test(trimmed);

                // List items like A. B. C. etc get indented
                const isOptionBlock =
                    /^[A-H][).]\s/.test(trimmed) ||
                    /\n[A-H][).]\s/.test(trimmed);

                if (isInstruction) {
                    return (
                        <div key={i} className="passage-instruction">
                            {trimmed}
                        </div>
                    );
                }
                if (isOptionBlock) {
                    return (
                        <div key={i} className="passage-options">
                            {trimmed.split('\n').map((line, j) => (
                                <div key={j} className="passage-option-line">{line.trim()}</div>
                            ))}
                        </div>
                    );
                }

                return (
                    <p key={i} className="passage-para">
                        {trimmed.split('\n').join(' ')}
                    </p>
                );
            })}
        </div>
    );
}

// ─── Answer Panel ─────────────────────────────────────────────────────────────

const SECTIONS = [
    { label: 'Section 1', qs: [1, 2, 3, 4, 5, 6, 7, 8] },
    { label: 'Section 2', qs: [9, 10, 11, 12, 13, 14] },
    { label: 'Section 3', qs: [15, 16, 17, 18, 19, 20] },
    { label: 'Section 4', qs: [21, 22, 23, 24, 25, 26, 27, 28, 29] },
    { label: 'Section 5', qs: [30, 31, 32, 33, 34, 35] },
];

interface AnswerPanelProps {
    answers: Record<string, string>;
    onChange: (q: string, v: string) => void;
    lang: 'en' | 'uz';
    focusRef: React.RefObject<Map<string, HTMLInputElement>>;
}

function AnswerPanel({ answers, onChange, lang, focusRef }: AnswerPanelProps) {
    const answered = Object.values(answers).filter(v => v.trim()).length;
    const pct = (answered / 35) * 100;

    return (
        <div className="answer-panel-content">
            {/* Progress header */}
            <div className="answer-progress-card">
                <div className="ap-header-row">
                    <span className="ap-label">
                        {lang === 'en' ? 'Answered' : 'Javob berildi'}
                    </span>
                    <span className="ap-count">
                        {answered} <span className="ap-total">/ 35</span>
                    </span>
                </div>
                <div className="ap-bar-track">
                    <div className="ap-bar-fill" style={{ width: `${pct}%` }} />
                </div>
            </div>

            {/* Question sections */}
            {SECTIONS.map(sec => (
                <div key={sec.label} className="answer-section">
                    <div className="answer-section-head">
                        <span>{sec.label}</span>
                        <span className="section-range">
                            Q{sec.qs[0]}–Q{sec.qs[sec.qs.length - 1]}
                        </span>
                    </div>
                    <div className="answer-rows">
                        {sec.qs.map(n => {
                            const q = n.toString();
                            const filled = !!answers[q]?.trim();
                            return (
                                <div key={q} className="answer-row">
                                    <span className="answer-num">{n}</span>
                                    <input
                                        type="text"
                                        maxLength={40}
                                        value={answers[q] || ''}
                                        onChange={e => onChange(q, e.target.value)}
                                        className={`answer-input-field${filled ? ' is-filled' : ''}`}
                                        placeholder={lang === 'en' ? 'Type answer…' : 'Javob yozing…'}
                                        autoComplete="off"
                                        spellCheck={false}
                                        ref={el => {
                                            if (el) focusRef.current?.set(q, el);
                                        }}
                                    />
                                    {filled && (
                                        <CheckCircle2
                                            size={15}
                                            className="answer-check-icon"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Results Panel ────────────────────────────────────────────────────────────

interface ResultsPanelProps {
    results: Results;
    userAnswers: Record<string, string>;
    lang: 'en' | 'uz';
    onFinish: () => void;
}

function ResultsPanel({ results, userAnswers, lang, onFinish }: ResultsPanelProps) {
    const level = MockService.getCEFRLevel(results.score);
    const pct = Math.round((results.score / results.total) * 100);
    const color =
        pct >= 80 ? 'var(--color-success)' :
        pct >= 55 ? 'var(--color-warning)' :
        'var(--color-error)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="results-shell"
        >
            {/* Score card */}
            <div className="results-card" style={{ borderColor: color }}>
                <Trophy size={38} color="#F59E0B" style={{ marginBottom: '0.5rem' }} />
                <div className="results-score" style={{ color }}>
                    {results.score}
                    <span className="results-total">/35</span>
                </div>
                <div className="results-badges">
                    <span className="badge badge-info">CEFR {level}</span>
                    <span className="badge badge-success">{pct}%</span>
                </div>
                <p className="results-verdict" style={{ color }}>
                    {pct >= 80
                        ? (lang === 'en' ? 'Excellent work!' : 'Ajoyib natija!')
                        : pct >= 55
                            ? (lang === 'en' ? 'Good effort!' : 'Yaxshi urinish!')
                            : (lang === 'en' ? 'Keep practising!' : "Ko'proq mashq qiling!")}
                </p>
                <button onClick={onFinish} className="btn btn-primary results-back-btn">
                    {lang === 'en' ? '← Back to Library' : '← Kutubxonaga qaytish'}
                </button>
            </div>

            {/* Per-question breakdown */}
            <p className="results-legend">
                {lang === 'en'
                    ? 'Hover any box to see your answer vs the correct answer'
                    : 'Har bir katakchaga sichqonchani olib boring — to\'g\'ri javobni ko\'rasiz'}
            </p>
            <div className="results-grid">
                {Array.from({ length: 35 }).map((_, i) => {
                    const n = (i + 1).toString();
                    const ok = results.detail[n];
                    const user = userAnswers[n] || '—';
                    const correct = results.correctKeys[n] || '?';
                    return (
                        <div
                            key={n}
                            className={`result-cell ${ok ? 'correct' : 'wrong'}`}
                            title={ok ? `✓ ${user}` : `✗  Yours: "${user}" — Correct: "${correct}"`}
                        >
                            <span className="rc-num">{n}</span>
                            {ok
                                ? <CheckCircle2 size={14} color="var(--color-success)" />
                                : <XCircle size={14} color="var(--color-error)" />}
                            <span className="rc-ans" style={{ color: ok ? 'var(--color-success)' : 'var(--color-error)' }}>
                                {ok ? user : correct}
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MockExamView = ({ lang, type }: Props) => {
    const [shuffledIds, setShuffledIds] = useState<string[]>([]);
    const [selectedMockId, setSelectedMockId] = useState<string | null>(null);
    const [mockData, setMockData] = useState<MockTest | null>(null);
    const [currentPart, setCurrentPart] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [results, setResults] = useState<Results | null>(null);
    // Only reading has a countdown — listening is untimed
    const [timeLeft, setTimeLeft] = useState(3600);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

    // Shuffle on mount
    useEffect(() => {
        setShuffledIds(fisherYates(MockService.getMockList()));
    }, []);

    const displayParts = useMemo(() => {
        if (!mockData) return [];
        const arr = type === 'reading' ? mockData.reading : mockData.listening;
        return MockService.getDisplayParts(arr);
    }, [mockData, type]);

    const totalParts = displayParts.length;
    const answeredCount = Object.values(userAnswers).filter(v => v.trim()).length;
    const showTimer = type === 'reading';
    const timerClass =
        timeLeft < 120 ? 'danger' :
        timeLeft < 300 ? 'warning' : '';

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = useCallback(async () => {
        if (!mockData || !selectedMockId || isSubmitting) return;
        setIsSubmitting(true);

        const keys = type === 'reading' ? mockData.keys.reading : mockData.keys.listening;
        const res = MockService.calculateScore(userAnswers, keys);
        setResults({ score: res.score, total: res.total, detail: res.results, correctKeys: keys });

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await Promise.all([
                    GamificationService.updateActivity(user.id, res.score * 10),
                    supabase.from('exam_results').insert({
                        user_id: user.id,
                        mock_id: selectedMockId,
                        exam_type: type,
                        score: res.score,
                        total: res.total,
                        detail: res.results,
                        completed_at: new Date().toISOString(),
                    }),
                ]);
            }
        } catch (err) {
            console.error('Failed to save result:', err);
        }
        setIsSubmitting(false);
    }, [mockData, selectedMockId, isSubmitting, type, userAnswers]);

    // ── Timer (reading only — listening is untimed) ───────────────────────────
    useEffect(() => {
        if (type !== 'reading' || !selectedMockId || results) return;
        const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
        return () => clearInterval(id);
    }, [type, selectedMockId, results]);

    useEffect(() => {
        if (type !== 'reading') return;
        if (timeLeft === 0 && selectedMockId && !results && !isSubmitting) {
            handleSubmit();
        }
    }, [type, timeLeft, selectedMockId, results, isSubmitting, handleSubmit]);

    // ── Select mock ───────────────────────────────────────────────────────────
    const handleSelectMock = (id: string) => {
        const data = MockService.getMock(id);
        setMockData(data);
        setSelectedMockId(id);
        setUserAnswers({});
        setResults(null);
        setCurrentPart(0);
        setTimeLeft(3600); // reading = 60 min; listening is untimed
    };

    const handleAnswerChange = (q: string, val: string) => {
        setUserAnswers(prev => ({ ...prev, [q]: val }));
    };

    const audioBucketId = selectedMockId ? typedMapping[selectedMockId] : null;
    const audioUrl = audioBucketId
        ? `https://mctcstvjdpcnzypfjhka.supabase.co/storage/v1/object/public/audio/mock_${audioBucketId}/part${currentPart + 1}.mp3`
        : '';

    // ════════════════════════════════════════════════════════════
    // GRID VIEW — library
    // ════════════════════════════════════════════════════════════
    if (!selectedMockId) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
                <header className="page-header" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        {type === 'reading'
                            ? <BookOpen className="text-primary" size={36} />
                            : <Headphones className="text-secondary" size={36} />}
                        {type === 'reading'
                            ? (lang === 'en' ? 'Reading Practice' : 'Reading Amaliyoti')
                            : (lang === 'en' ? 'Listening Practice' : 'Listening Amaliyoti')}
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1rem', maxWidth: '560px' }}>
                        {type === 'reading'
                            ? (lang === 'en'
                                ? '50 full-length mock exams · 35 questions each · 60 minutes · All question types covered'
                                : '50 ta to\'liq mock test · har birida 35 savol · 60 daqiqa')
                            : (lang === 'en'
                                ? '50 listening tests · 35 questions each · No time limit · Work at your own pace'
                                : '50 ta listening testi · 35 savol · Vaqt chegarasi yo\'q')}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <div className="lib-stat-chip">
                            <Clock size={14} />
                            {type === 'reading' ? '60 min' : (lang === 'en' ? 'No time limit' : 'Vaqtsiz')}
                        </div>
                        <div className="lib-stat-chip">
                            <BarChart3 size={14} />
                            35 {lang === 'en' ? 'questions' : 'savol'}
                        </div>
                        <div className="lib-stat-chip">
                            <CheckCircle2 size={14} />
                            {lang === 'en' ? 'Instant scoring' : 'Tezkor natija'}
                        </div>
                    </div>
                </header>

                <div className="mock-library-grid">
                    {shuffledIds.map((id, idx) => (
                        <motion.button
                            key={id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                            whileHover={{ y: -4 }}
                            className="mock-card"
                            onClick={() => handleSelectMock(id)}
                        >
                            <div className={`mock-card-icon ${type}`}>
                                {type === 'reading' ? <BookOpen size={22} /> : <Headphones size={22} />}
                            </div>
                            <div className="mock-card-body">
                                <span className="mock-card-title">Mock {id}</span>
                                <span className="mock-card-meta">
                                    {type === 'reading' ? '60 min · 35 Q' : '35 min · 35 Q'}
                                </span>
                            </div>
                            <ChevronRight size={18} className="mock-card-arrow" />
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        );
    }

    // ════════════════════════════════════════════════════════════
    // EXAM VIEW
    // ════════════════════════════════════════════════════════════

    return (
        <div className="exam-shell">

            {/* ── Top bar ── */}
            <header className="exam-topbar">
                <div className="exam-topbar-left">
                    <button
                        className="exam-back-btn"
                        onClick={() => setSelectedMockId(null)}
                        title="Back to library"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="exam-title-block">
                        <span className="exam-type-label">
                            {type === 'reading' ? 'Reading' : 'Listening'}
                        </span>
                        <span className="exam-mock-label">Mock {selectedMockId}</span>
                    </div>
                    {/* Part tabs */}
                    <div className="part-tab-row">
                        {Array.from({ length: totalParts }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPart(i)}
                                className={`part-tab-btn${currentPart === i ? ' active' : ''}`}
                            >
                                P{i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="exam-topbar-right">
                    {showTimer ? (
                        <div className={`exam-clock${timerClass ? ' ' + timerClass : ''}`}>
                            <Clock size={16} />
                            <span>{fmt(timeLeft)}</span>
                        </div>
                    ) : (
                        <div className="exam-no-timer-badge">
                            <Clock size={14} />
                            {lang === 'en' ? 'No time limit' : 'Vaqtsiz'}
                        </div>
                    )}
                    <div className="exam-progress-pill">
                        {answeredCount}<span>/35</span>
                    </div>
                </div>
            </header>

            {/* ── Body ── */}
            <div className="exam-body-grid">

                {/* Passage pane */}
                <div className="exam-passage-pane">
                    {/* Audio for listening */}
                    {type === 'listening' && (
                        <div className="audio-player-card">
                            <Headphones size={20} color="var(--color-secondary)" />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
                                    {lang === 'en' ? `Part ${currentPart + 1} Audio` : `${currentPart + 1}-qism audio`}
                                </p>
                                <audio
                                    key={`${audioBucketId}-${currentPart}`}
                                    controls
                                    style={{ width: '100%', height: '36px' }}
                                >
                                    <source src={audioUrl} type="audio/mpeg" />
                                </audio>
                            </div>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPart}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -12 }}
                            transition={{ duration: 0.22 }}
                        >
                            <PassageRenderer
                                text={displayParts[currentPart] || ''}
                                partNumber={currentPart + 1}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Answer pane */}
                <aside className="exam-answer-pane">
                    {results ? (
                        <ResultsPanel
                            results={results}
                            userAnswers={userAnswers}
                            lang={lang}
                            onFinish={() => setSelectedMockId(null)}
                        />
                    ) : (
                        <>
                            <AnswerPanel
                                answers={userAnswers}
                                onChange={handleAnswerChange}
                                lang={lang}
                                focusRef={inputRefs}
                            />

                            {/* Nav footer */}
                            <div className="exam-nav-footer">
                                <button
                                    className="btn btn-secondary"
                                    disabled={currentPart === 0}
                                    onClick={() => setCurrentPart(p => p - 1)}
                                >
                                    <ChevronLeft size={17} />
                                    {lang === 'en' ? 'Prev' : 'Oldingi'}
                                </button>

                                {currentPart < totalParts - 1 ? (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setCurrentPart(p => p + 1)}
                                    >
                                        {lang === 'en' ? 'Next Part' : 'Keyingi qism'}
                                        <ChevronRight size={17} />
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary submit-btn"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? <Loader2 size={17} className="animate-spin" />
                                            : <Send size={17} />}
                                        {lang === 'en' ? 'Submit Test' : 'Topshirish'}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default MockExamView;
