import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Loader2, ArrowLeft, Trophy, Clock, ChevronRight, ChevronLeft, Send, Headphones } from 'lucide-react';
import { MockService } from '../data/MockService';
import type { MockTest } from '../data/MockService';
import './PageLayout.css';
import './ExamInterface.css';

interface Props { lang: 'en' | 'uz'; type: 'reading' | 'listening'; }

const MockExamView = ({ lang, type }: Props) => {
    const [selectedMockId, setSelectedMockId] = useState<string | null>(null);
    const [mockData, setMockData] = useState<MockTest | null>(null);
    const [currentPart, setCurrentPart] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [results, setResults] = useState<{ score: number; total: number; detail: Record<string, boolean> } | null>(null);
    const [timeLeft, setTimeLeft] = useState(type === 'reading' ? 3600 : 2100);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const mockIds = MockService.getMockList();

    // Timer Logic
    useEffect(() => {
        if (!selectedMockId || results) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [selectedMockId, results]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

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

    const handleSubmit = () => {
        if (!mockData) return;
        setIsSubmitting(true);
        setTimeout(() => {
            const keys = type === 'reading' ? mockData.keys.reading : mockData.keys.listening;
            const res = MockService.calculateScore(userAnswers, keys);
            setResults({ score: res.score, total: res.total, detail: res.results });
            setIsSubmitting(false);
        }, 1500);
    };

    // Grid View
    if (!selectedMockId) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
                <header className="page-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {type === 'reading' ? <BookOpen className="text-primary" size={40} /> : <Headphones className="text-secondary" size={40} />}
                        {type === 'reading' ? (lang === 'en' ? 'CEFR Reading Library' : 'Reading Mocklar') : (lang === 'en' ? 'CEFR Listening Library' : 'Listening Mocklar')}
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.2rem' }}>
                        Select one of the 50 professional mock exams to begin your session.
                    </p>
                </header>

                <div className="dashboard-grid">
                    {mockIds.map(id => (
                        <motion.div
                            key={id}
                            whileHover={{ y: -5, borderColor: 'var(--color-primary)' }}
                            className="stat-card glass-panel"
                            onClick={() => handleSelectMock(id)}
                            style={{ cursor: 'pointer', padding: '1.5rem', border: '1px solid var(--color-border)' }}
                        >
                            <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span className={`badge-small ${type === 'reading' ? 'primary' : 'secondary'}`}>Mock #{id}</span>
                                <Clock size={16} className="text-muted" />
                            </div>
                            <h3 style={{ margin: '0 0 1rem 0' }}>{type === 'reading' ? 'Official Reading' : 'Official Listening'}</h3>
                            <div className="flex" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', gap: '1.5rem' }}>
                                <span>{type === 'reading' ? '5 Parts' : '6 Parts'}</span>
                                <span>35 Questions</span>
                            </div>
                            <button className={`btn ${type === 'reading' ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', marginTop: '1.5rem' }}>Start Exam</button>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    }

    const currentText = type === 'reading' ? mockData?.reading[currentPart] : mockData?.listening[currentPart];
    const totalParts = type === 'reading' ? mockData?.reading.length || 0 : mockData?.listening.length || 0;

    // Exam Interior
    return (
        <div className="exam-interface">
            {/* Top Bar */}
            <header className="exam-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <button onClick={() => setSelectedMockId(null)} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div className="exam-timer">
                        <Clock size={20} />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                    <div className="score-tracker" style={{ fontWeight: 700 }}>
                        {Object.keys(userAnswers).length} / 35 {lang === 'en' ? 'Solved' : 'Yechildi'}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="exam-body">
                {/* Passage Pane */}
                <div className="passage-pane">
                    {type === 'listening' && (
                        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                            <audio
                                key={`${selectedMockId}-${currentPart}`}
                                controls
                                autoPlay
                                style={{ width: '100%', filter: 'invert(1)' }}
                            >
                                <source src={`https://mctcstvjdpcnzypfjhka.supabase.co/storage/v1/object/public/audio/mock_${selectedMockId}/part${currentPart + 1}.mp3`} type="audio/mpeg" />
                            </audio>
                        </div>
                    )}
                    <div className="passage-content-clean">
                        <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>Part {currentPart + 1}</h1>
                        {currentText || "Loading content..."}
                    </div>
                </div>

                {/* Control Pane */}
                <aside className="control-pane">
                    {results ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
                            <div className="glass-panel text-center" style={{ padding: '2rem', border: '2px solid var(--color-primary)' }}>
                                <Trophy size={48} className="text-warning" style={{ marginBottom: '1rem' }} />
                                <h2>Your Result</h2>
                                <h1 style={{ fontSize: '3.5rem', margin: '0.5rem 0' }}>{results.score} / 35</h1>
                                <p className="badge primary">CEFR Level: {MockService.getCEFRLevel(results.score)}</p>
                                <button onClick={() => setSelectedMockId(null)} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Finish Session</button>
                            </div>
                        </motion.div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div className="instruction-box">
                                <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>{lang === 'en' ? 'Instructions' : 'Yo\'riqnoma'}</h4>
                                <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>
                                    {type === 'reading'
                                        ? "Read the text on the left and enter your answers below. One word or letter per box."
                                        : "Listen to the audio and answer the questions based on what you hear."}
                                </p>
                            </div>

                            <div className="question-grid-premium">
                                {Array.from({ length: 35 }).map((_, i) => {
                                    const qNum = (i + 1).toString();
                                    const hasAns = !!userAnswers[qNum];
                                    return (
                                        <div key={qNum} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>{qNum}</span>
                                            <input
                                                type="text"
                                                maxLength={20}
                                                value={userAnswers[qNum] || ''}
                                                onChange={(e) => handleAnswerChange(qNum, e.target.value)}
                                                className={`q-input ${hasAns ? 'filled' : ''}`}
                                                style={{
                                                    width: '50px',
                                                    height: '40px',
                                                    textAlign: 'center',
                                                    border: '2px solid var(--color-border)',
                                                    borderRadius: '8px',
                                                    background: 'var(--color-surface-alt)',
                                                    fontWeight: 700,
                                                    fontSize: '1rem',
                                                    color: 'var(--color-primary)'
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ flex: 1 }}></div>

                            <div className="bottom-nav">
                                <button
                                    className="btn btn-outline"
                                    disabled={currentPart === 0}
                                    onClick={() => setCurrentPart(p => p - 1)}
                                >
                                    <ChevronLeft size={20} /> {lang === 'en' ? 'Previous' : 'Oldingisi'}
                                </button>

                                {currentPart < totalParts - 1 ? (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setCurrentPart(p => p + 1)}
                                    >
                                        {lang === 'en' ? 'Next Part' : 'Keyingisi'} <ChevronRight size={20} />
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        style={{ background: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                        {lang === 'en' ? 'Submit Exam' : 'Tugatish'}
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
