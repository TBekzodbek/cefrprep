import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Loader2, ArrowLeft, Trophy, AlertCircle } from 'lucide-react';
import { MockService } from '../data/MockService';
import type { MockTest } from '../data/MockService';
import './PageLayout.css';

interface Props { lang: 'en' | 'uz'; }

const Reading = ({ lang }: Props) => {
    const [selectedMockId, setSelectedMockId] = useState<string | null>(null);
    const [mockData, setMockData] = useState<MockTest | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [results, setResults] = useState<{ score: number; total: number; detail: Record<string, boolean> } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const mockIds = MockService.getMockList();

    const handleSelectMock = (id: string) => {
        const data = MockService.getMock(id);
        setMockData(data);
        setSelectedMockId(id);
        setUserAnswers({});
        setResults(null);
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    const handleAnswerChange = (qNum: string, val: string) => {
        setUserAnswers(prev => ({ ...prev, [qNum]: val }));
    };

    const handleSubmit = () => {
        if (!mockData) return;
        setIsSubmitting(true);
        setTimeout(() => {
            const res = MockService.calculateScore(userAnswers, mockData.keys.reading);
            setResults({ score: res.score, total: res.total, detail: res.results });
            setIsSubmitting(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1200);
    };

    if (!selectedMockId) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
                <header className="page-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <BookOpen className="text-primary" size={40} />
                        {lang === 'en' ? 'CEFR Reading Mocks' : 'Reading Mocklar'}
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
                        {lang === 'en' ? 'Select one of the 50 professional mock exams to begin.' : 'Tayyorgarlikni boshlash uchun 50 ta mockdan birini tanlang.'}
                    </p>
                </header>

                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {mockIds.map(id => (
                        <motion.div
                            key={id}
                            whileHover={{ y: -5 }}
                            className="stat-card glass-panel"
                            onClick={() => handleSelectMock(id)}
                            style={{ cursor: 'pointer', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span className="badge-small primary">ID: #{id}</span>
                                <BookOpen size={20} className="text-primary" />
                            </div>
                            <h3 style={{ margin: '0.5rem 0' }}>Mock Test {id}</h3>
                            <div className="flex" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', gap: '1rem' }}>
                                <span>Part 1-5</span>
                                <span>35 Qs</span>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Start Mock</button>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    }

    return (
        <div className="page-container" style={{ maxWidth: '1400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button onClick={() => setSelectedMockId(null)} className="btn btn-ghost">
                    <ArrowLeft size={18} /> Back
                </button>
                {results && (
                    <div className="flex" style={{ gap: '1rem' }}>
                        <div className="badge success">Score: {results.score}/{results.total}</div>
                        <div className="badge primary">Level: {MockService.getCEFRLevel(results.score)}</div>
                    </div>
                )}
            </div>

            {results ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel text-center" style={{ padding: '3rem', marginBottom: '3rem', border: '1px solid var(--color-success)' }}>
                    <Trophy size={64} className="text-warning" style={{ margin: '0 auto 1rem' }} />
                    <h1 style={{ fontSize: '4rem', margin: 0 }}>{Math.round((results.score / results.total) * 100)}%</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>You answered {results.score} out of 35 questions correctly.</p>
                    <div className="flex" style={{ justifyContent: 'center', gap: '1rem' }}>
                        <button onClick={() => setSelectedMockId(null)} className="btn btn-primary">Done</button>
                        <button onClick={() => setResults(null)} className="btn btn-outline">Review Answers</button>
                    </div>
                </motion.div>
            ) : (
                <header className="page-header-flex" style={{ marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ margin: 0 }}>Reading Mock Exam #{selectedMockId}</h1>
                        <p className="text-muted">Part 1-5 • 35 Questions • 60 Minutes</p>
                    </div>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle />} {lang === 'en' ? 'Submit Now' : 'Yakunlash'}
                    </button>
                </header>
            )}

            <div className="reading-content-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem', alignItems: 'start' }}>
                <div className="text-panel-glass" style={{ padding: '2.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
                    {mockData?.reading.map((part, idx) => (
                        <div key={idx} style={{ marginBottom: '5rem' }}>
                            <div className="badge primary" style={{ marginBottom: '1.5rem' }}>PART {idx + 1}</div>
                            <div className="passage-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.1rem' }}>
                                {part}
                            </div>
                        </div>
                    ))}
                    {mockData?.reading.length === 0 && <div className="text-center p-8">Questions Loading...</div>}
                </div>

                <div className="questions-side-stack" style={{ position: 'sticky', top: '20px' }}>
                    <div className="questions-panel-glass" style={{ padding: '1.5rem' }}>
                        <h3 className="flex" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                            <AlertCircle size={20} className="text-primary" /> Answer Sheet
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '0.75rem' }}>
                            {Array.from({ length: 35 }).map((_, i) => {
                                const qNum = (i + 1).toString();
                                const isCorrect = results?.detail[qNum];
                                return (
                                    <div key={qNum} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.4rem 0.8rem',
                                        background: 'var(--color-surface-alt)',
                                        borderRadius: '8px',
                                        borderLeft: results ? (isCorrect ? '4px solid var(--color-success)' : '4px solid var(--color-error)') : '4px solid transparent'
                                    }}>
                                        <span style={{ fontWeight: 800, width: '25px', color: 'var(--color-text-muted)' }}>{qNum}</span>
                                        <input
                                            type="text"
                                            value={userAnswers[qNum] || ''}
                                            onChange={(e) => handleAnswerChange(qNum, e.target.value)}
                                            disabled={!!results}
                                            placeholder="..."
                                            style={{
                                                width: '100%',
                                                border: 'none',
                                                background: 'transparent',
                                                padding: '0.3rem',
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                color: 'var(--color-text)'
                                            }}
                                        />
                                        {results && (
                                            <span style={{ fontSize: '0.8rem', color: isCorrect ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600 }}>
                                                {mockData?.keys.reading[qNum]}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reading;
