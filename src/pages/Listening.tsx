import { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, PlayCircle, CheckCircle, Loader2, ArrowLeft, Trophy, AlertCircle, PauseCircle, SkipForward, SkipBack } from 'lucide-react';
import { MockService, MockTest } from '../data/MockService';
import './PageLayout.css';

interface Props { lang: 'en' | 'uz'; }

const Listening = ({ lang }: Props) => {
    const [selectedMockId, setSelectedMockId] = useState<string | null>(null);
    const [mockData, setMockData] = useState<MockTest | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [results, setResults] = useState<{ score: number; total: number; detail: Record<string, boolean> } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentAudioPart, setCurrentAudioPart] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const mockIds = MockService.getMockList();

    const handleSelectMock = (id: string) => {
        const data = MockService.getMock(id);
        setMockData(data);
        setSelectedMockId(id);
        setUserAnswers({});
        setResults(null);
        setCurrentAudioPart(0);
        setIsPlaying(false);
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    const handleAnswerChange = (qNum: string, val: string) => {
        setUserAnswers(prev => ({ ...prev, [qNum]: val }));
    };

    const handleSubmit = () => {
        if (!mockData) return;
        setIsSubmitting(true);
        setTimeout(() => {
            const res = MockService.calculateScore(userAnswers, mockData.keys.listening);
            setResults({ score: res.score, total: res.total, detail: res.results });
            setIsSubmitting(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1200);
    };

    const audioUrl = selectedMockId ? `/audio/mock_${selectedMockId}/part${currentAudioPart + 1}.mp3` : '';

    if (!selectedMockId) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
                <header className="page-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Headphones className="text-secondary" size={40} />
                        {lang === 'en' ? 'CEFR Listening Mocks' : 'Listening Mocklar'}
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
                        {lang === 'en' ? 'Select an exam and listen to all 6 parts to complete your test.' : 'Testni yakunlash uchun mock tanlang va barcha 6 qismni eshiting.'}
                    </p>
                </header>

                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {mockIds.map(id => (
                        <motion.div
                            key={id}
                            whileHover={{ y: -5 }}
                            className="stat-card glass-panel"
                            onClick={() => handleSelectMock(id)}
                            style={{ cursor: 'pointer', padding: '1.5rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span className="badge-small secondary">ID: #{id}</span>
                                <Headphones size={20} className="text-secondary" />
                            </div>
                            <h3 style={{ margin: '0.5rem 0' }}>Listening Test {id}</h3>
                            <div className="flex" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', gap: '1rem' }}>
                                <span>6 Audio Parts</span>
                                <span>35 Qs</span>
                            </div>
                            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>Start Practice</button>
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
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel text-center" style={{ padding: '3rem', marginBottom: '3rem', border: '1px solid var(--color-secondary)' }}>
                    <Trophy size={64} className="text-warning" style={{ margin: '0 auto 1rem' }} />
                    <h1 style={{ fontSize: '4rem', margin: 0 }}>{results.score} / 35</h1>
                    <h2 className="text-secondary">Level Achieved: {MockService.getCEFRLevel(results.score)}</h2>
                    <div className="flex" style={{ justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                        <button onClick={() => setSelectedMockId(null)} className="btn btn-primary">Try Another Mock</button>
                        <button onClick={() => setResults(null)} className="btn btn-outline">Review Mistakes</button>
                    </div>
                </motion.div>
            ) : (
                <header className="page-header-flex" style={{ marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ margin: 0 }}>Listening Mock Exam #{selectedMockId}</h1>
                        <p className="text-muted">6 Audio Parts • 35 Questions • 35-40 Minutes</p>
                    </div>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle />} {lang === 'en' ? 'Submit Section' : 'Bo\'limni tayyorlash'}
                    </button>
                </header>
            )}

            <div className="reading-content-grid" style={{ gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
                <div className="listening-visualizer-side">
                    {/* Integrated Audio Controls */}
                    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
                            {[1, 2, 3, 4, 5, 6].map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentAudioPart(i)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        background: currentAudioPart === i ? 'var(--color-secondary)' : 'var(--color-surface-alt)',
                                        color: currentAudioPart === i ? 'white' : 'var(--color-text)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 700
                                    }}
                                >
                                    Part {p}
                                </button>
                            ))}
                        </div>

                        <div className="audio-control-hub" style={{ background: 'var(--color-surface-alt)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                            <audio
                                key={audioUrl}
                                controls
                                className="custom-player"
                                style={{ width: '100%', filter: 'invert(1)' }}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            >
                                <source src={audioUrl} type="audio/mpeg" />
                            </audio>
                            <p className="text-muted" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                                Currently Playing: <strong>Mock #{selectedMockId} - Part {currentAudioPart + 1}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="text-panel-glass" style={{ padding: '2rem', maxHeight: '50vh', overflowY: 'auto' }}>
                        <div className="badge secondary" style={{ marginBottom: '1.5rem' }}>QUESTION TEXT</div>
                        <div className="passage-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                            {mockData?.listening[currentAudioPart] || "Transcription/Question text for this part is being loaded..."}
                        </div>
                    </div>
                </div>

                <div className="questions-panel-glass" style={{ padding: '1.5rem' }}>
                    <h3 className="flex" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                        <AlertCircle size={20} className="text-secondary" /> Listening Key
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
                                            color: 'var(--color-text)'
                                        }}
                                    />
                                    {results && (
                                        <span style={{ fontSize: '0.8rem', color: isCorrect ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600 }}>
                                            {mockData?.keys.listening[qNum]}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Listening;
