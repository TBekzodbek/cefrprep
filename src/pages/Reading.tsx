import { motion } from 'framer-motion';
import { BookOpen, Highlighter, PenTool, CheckCircle, PieChart } from 'lucide-react';
import { MotivationalQuote } from '../components/MotivationalQuote';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

const Reading = ({ lang }: Props) => {
    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                        <BookOpen className="text-primary" size={28} />
                        {lang === 'en' ? 'O\'qib tushunish (Reading)' : 'O\'qib tushunish (O\'qish)'}
                    </h1>
                    <p className="text-muted" style={{ margin: '0.5rem 0 0 0' }}>
                        {lang === 'en' ? '4 Parts • 60-70 Minutes • 30 Questions' : '4 qism • 60-70 daqiqa • 30 savol'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
                        <Highlighter size={18} /> {lang === 'en' ? 'Mark Text (3/3)' : 'Belgilash (3/3)'}
                    </button>
                    <button className="btn btn-primary">
                        <CheckCircle size={18} /> {lang === 'en' ? 'Submit Answers' : 'Javoblarni yuborish'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-2 gap-6" style={{ flexGrow: 1, height: '600px' }}>
                {/* Left Side: Mock Text */}
                <div className="glass-panel" style={{ padding: '2rem', overflowY: 'auto' }}>
                    <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
                        <h2>[Insert Reading Passage Title Here]</h2>
                        <p className="text-muted">By [Author Name]</p>
                    </div>

                    <div className="content-placeholder" style={{ minHeight: 'auto', padding: '1rem' }}>
                        <p className="text-muted" style={{ fontSize: '1rem', textAlign: 'left', lineHeight: '1.8' }}>
                            [Insert full multi-paragraph reading passage text here. The text should be formatted so users can select and highlight it.]
                        </p>
                        <div className="skeleton-line w-full" style={{ width: '100%' }}></div>
                        <div className="skeleton-line w-full" style={{ width: '100%' }}></div>
                        <div className="skeleton-line w-3/4"></div>
                        <br />
                        <div className="skeleton-line w-full" style={{ width: '100%' }}></div>
                        <div className="skeleton-line w-1/2"></div>
                    </div>
                </div>

                {/* Right Side: Questions & AI Analytics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', flexGrow: 1, overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <PenTool className="text-primary" size={20} />
                            {lang === 'en' ? 'Questions 1 - 5' : 'Savollar 1 - 5'}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {[1, 2, 3].map(q => (
                                <div key={q} style={{ background: 'var(--color-background-alt)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                    <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{q}. [Insert Question text here]</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {['A', 'B', 'C', 'D'].map(opt => (
                                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                                <input type="radio" name={`q${q}`} /> <span>{opt}) [Insert option text]</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Premium Analytics Placeholder */}
                    <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
                            <PieChart size={20} />
                            {lang === 'en' ? 'AI Suggestion (Premium)' : 'AI Tavsiya (Premium)'}
                        </h4>
                        <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            [AI will highlight why your selected answer was wrong and show vocabulary meaning context from the text here once submitted.]
                        </p>
                    </div>

                    <MotivationalQuote />
                </div>
            </div>
        </motion.div>
    );
};

export default Reading;
