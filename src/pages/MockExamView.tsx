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

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen, Loader2, ArrowLeft, Trophy, Clock,
    ChevronRight, ChevronLeft, Send, Headphones,
    CheckCircle2, XCircle,
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

function fisherYates<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── Results Panel ───────────────────────────────────────────────────────────

interface ResultsPanelProps {
    results: Results;
    userAnswers: Record<string, string>;
    lang: 'en' | 'uz';
    onFinish: () => void;
}

function ResultsPanel({ results, userAnswers, lang, onFinish }: ResultsPanelProps) {
    const level = MockService.getCEFRLevel(results.score);
    const pct = Math.round((results.score / results.total) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '1.5rem', overflowY: 'auto', height: '100%' }}
        >
            {/* Score Card */}
            <div
                className="glass-panel"
                style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    border: '2px solid var(--color-primary)',
                    marginBottom: '1.25rem',
                }}
            >
                <Trophy size={36} color="var(--color-warning)" style={{ marginBottom: '0.5rem' }} />
                <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>
                    {lang === 'en' ? 'Your Result' : 'Natijangiz'}
                </h2>
                <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1.1 }}>
                    {results.score}
                    <span style={{ fontSize: '1.3rem', color: 'var(--color-text-muted)' }}>/35</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', margin: '0.6rem 0' }}>
                    <span className="badge badge-info">CEFR: {level}</span>
                    <span className="badge badge-success">{pct}%</span>
                </div>
                <button onClick={onFinish} className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }}>
                    {lang === 'en' ? 'Back to Library' : "Kutubxonaga qaytish"}
                </button>
            </div>

            {/* Per-question breakdown — hover tooltip shows user vs correct */}
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
                Hover for details · green = correct · red = wrong
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                {Array.from({ length: 35 }).map((_, i) => {
                    const n = (i + 1).toString();
                    const ok = results.detail[n];
                    const user = userAnswers[n] || '—';
                    const correct = results.correctKeys[n] || '?';
                    return (
                        <div
                            key={n}
                            className={`result-cell ${ok ? 'correct' : 'wrong'}`}
                            title={ok ? `✓ ${user}` : `✗ yours: ${user} | ans: ${correct}`}
                        >
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--color-text-muted)' }}>{n}</div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {ok
                                    ? <CheckCircle2 size={13} color="var(--color-success)" />
                                    : <XCircle size={13} color="var(--color-error)" />}
                            </div>
                            <div style={{
                                fontSize: '0.6rem',
                                fontWeight: 700,
                                color: ok ? 'var(--color-success)' : 'var(--color-error)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {ok ? user : correct}
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const MockExamView = ({ lang, type }: Props) => {
    const [shuffledIds, setShuffledIds] = useState<string[]>([]);
    const [selectedMockId, setSelectedMockId] = useState<string | null>(null);
    const [mockData, setMockData] = useState<MockTest | null>(null);
    const [currentPart, setCurrentPart] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [results, setResults] = useState<Results | null>(null);
    const [timeLeft, setTimeLeft] = useState(type === 'reading' ? 3600 : 2100);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Shuffle mock order once on mount
    useEffect(() => {
        setShuffledIds(fisherYates(MockService.getMockList()));
    }, []);

    // Only keep content-bearing parts (no short headers or answer-key blocks)
    const displayParts = useMemo(() => {
        if (!mockData) return [];
        const arr = type === 'reading' ? mockData.reading : mockData.listening;
        return MockService.getDisplayParts(arr);
    }, [mockData, type]);

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    // ── Submit handler ─────────────────────────────────────────────────────
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

    // ── Countdown timer ────────────────────────────────────────────────────
    useEffect(() => {
        if (!selectedMockId || results) return;
        const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
        return () => clearInterval(id);
    }, [selectedMockId, results]);

    // Auto-submit when time expires
    useEffect(() => {
        if (timeLeft === 0 && selectedMockId && !results && !isSubmitting) {
            handleSubmit();
        }
    }, [timeLeft, selectedMockId, results, isSubmitting, handleSubmit]);

    // ── Mock selection ─────────────────────────────────────────────────────
    const handleSelectMock = (id: string) => {
        const data = MockService.getMock(id);
        setMockData(data);
        setSelectedMockId(id);
        setUserAnswers({});
        setResults(null);
        setCurrentPart(0);
        setTimeLeft(type === 'reading' ? 3600 : 2100);
    };

    const handleAnswerChange = (qNum: string, val: string) => {
        setUserAnswers(prev => ({ ...prev, [qNum]: val }));
    };

    // Audio URL uses mock_mapping to get the correct bucket folder number
    const audioBucketId = selectedMockId ? typedMapping[selectedMockId] : null;
    const audioUrl = audioBucketId
        ? `https://mctcstvjdpcnzypfjhka.supabase.co/storage/v1/object/public/audio/mock_${audioBucketId}/part${currentPart + 1}.mp3`
        : '';

    // ════════════════════════════════════════════════════════════
    // GRID VIEW — mock selection
    // ════════════════════════════════════════════════════════════
    if (!selectedMockId) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
                <header className="page-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {type === 'reading'
                            ? <BookOpen className="text-primary" size={40} />
                            : <Headphones className="text-secondary" size={40} />}
                        {type === 'reading'
                            ? (lang === 'en' ? 'CEFR Reading Library' : 'Reading Mocklar')
                            : (lang === 'en' ? 'CEFR Listening Library' : 'Listening Mocklar')}
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                        {lang === 'en'
                            ? 'Choose any of the 50 mock exams — order is randomised each visit.'
                            : '50 ta mock imtihondan birini tanlang — tartib har safar tasodifiy.'}
                    </p>
                </header>

                <div
                    className="dashboard-grid"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}
                >
                    {shuffledIds.map((id, idx) => (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(idx * 0.025, 0.6) }}
                            whileHover={{ y: -6, boxShadow: 'var(--shadow-lg)', borderColor: 'var(--color-primary)' }}
                            className="glass-panel"
                            onClick={() => handleSelectMock(id)}
                            style={{
                                cursor: 'pointer',
                                padding: '1.75rem',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-xl)',
                                background: 'var(--color-surface)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                <div style={{
                                    width: '3.5rem',
                                    height: '3.5rem',
                                    borderRadius: '1.25rem',
                                    background: type === 'reading' ? 'var(--color-primary-soft)' : 'rgba(6,182,212,0.1)',
                                    color: type === 'reading' ? 'var(--color-primary)' : 'var(--color-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {type === 'reading' ? <BookOpen size={24} /> : <Headphones size={24} />}
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                                    Mock Test {id}
                                </h3>
                                <p className="text-muted" style={{ fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                                    Official Selection
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                                    <span className="badge badge-info">{type === 'reading' ? '60 min' : '35 min'}</span>
                                    <span className="badge badge-info">35 items</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    }

    // ════════════════════════════════════════════════════════════
    // EXAM VIEW
    // ════════════════════════════════════════════════════════════
    const currentText = displayParts[currentPart] || '';
    const totalParts = displayParts.length;
    const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k]).length;
    const isUrgent = timeLeft < 300 && timeLeft > 0;

    return (
        <div className="exam-interface">
            {/* ── Header bar ── */}
            <header className="exam-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button
                        onClick={() => setSelectedMockId(null)}
                        className="btn btn-ghost"
                        style={{ padding: '0.45rem' }}
                        title="Back to library"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="part-tabs">
                        {Array.from({ length: totalParts }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPart(i)}
                                className={`part-tab ${currentPart === i ? 'active' : ''}`}
                            >
                                P{i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div className={`exam-timer ${isUrgent ? 'urgent' : ''}`}>
                        <Clock size={18} />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                        {answeredCount} / 35 {lang === 'en' ? 'answered' : 'javob berildi'}
                    </div>
                </div>
            </header>

            {/* ── Body ── */}
            <div className="exam-body">
                {/* Passage / Audio pane */}
                <div className="passage-pane">
                    {type === 'listening' && (
                        <div
                            className="glass-panel"
                            style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}
                        >
                            <audio
                                key={`${audioBucketId}-${currentPart}`}
                                controls
                                autoPlay
                                style={{ width: '100%', borderRadius: '8px' }}
                            >
                                <source src={audioUrl} type="audio/mpeg" />
                                Your browser does not support audio.
                            </audio>
                        </div>
                    )}
                    <div className="passage-content-clean allow-select">
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Part {currentPart + 1}
                        </h2>
                        {currentText || 'Loading content…'}
                    </div>
                </div>

                {/* Answer / Results pane */}
                <aside className="control-pane">
                    {results ? (
                        <ResultsPanel
                            results={results}
                            userAnswers={userAnswers}
                            lang={lang}
                            onFinish={() => setSelectedMockId(null)}
                        />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div className="instruction-box">
                                <h4 style={{ margin: 0, marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                                    {lang === 'en' ? 'Instructions' : "Yo'riqnoma"}
                                </h4>
                                <p style={{ fontSize: '0.82rem', opacity: 0.75, margin: 0 }}>
                                    {type === 'reading'
                                        ? 'Read the passage on the left and type your answers below. One word or letter per box.'
                                        : 'Listen carefully and type your answers. One word, letter, or number per box.'}
                                </p>
                            </div>

                            {/* 35 answer inputs in a 5-column grid */}
                            <div className="question-grid-premium">
                                {Array.from({ length: 35 }).map((_, i) => {
                                    const qNum = (i + 1).toString();
                                    const filled = !!userAnswers[qNum];
                                    return (
                                        <div
                                            key={qNum}
                                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}
                                        >
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-muted)' }}>
                                                {qNum}
                                            </span>
                                            <input
                                                type="text"
                                                maxLength={30}
                                                value={userAnswers[qNum] || ''}
                                                onChange={e => handleAnswerChange(qNum, e.target.value)}
                                                style={{
                                                    width: '48px',
                                                    height: '38px',
                                                    textAlign: 'center',
                                                    border: `2px solid ${filled ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                                    borderRadius: '8px',
                                                    background: filled ? 'var(--color-primary-soft)' : 'var(--color-surface-alt)',
                                                    fontWeight: 700,
                                                    fontSize: '0.85rem',
                                                    color: 'var(--color-primary)',
                                                    outline: 'none',
                                                    transition: 'border-color 0.15s, background 0.15s',
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ flex: 1 }} />

                            {/* Navigation */}
                            <div className="bottom-nav">
                                <button
                                    className="btn btn-secondary"
                                    disabled={currentPart === 0}
                                    onClick={() => setCurrentPart(p => p - 1)}
                                >
                                    <ChevronLeft size={18} />
                                    {lang === 'en' ? 'Prev' : 'Oldin'}
                                </button>

                                {currentPart < totalParts - 1 ? (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setCurrentPart(p => p + 1)}
                                    >
                                        {lang === 'en' ? 'Next' : 'Keyin'} <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        style={{ background: 'var(--color-success)' }}
                                    >
                                        {isSubmitting
                                            ? <Loader2 size={18} className="animate-spin" />
                                            : <Send size={18} />}
                                        {lang === 'en' ? 'Submit' : 'Topshirish'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default MockExamView;
