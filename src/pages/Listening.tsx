import { motion } from 'framer-motion';
import { Headphones, PlayCircle, FileText, CheckCircle, Volume2 } from 'lucide-react';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

const Listening = ({ lang }: Props) => {
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
                        <Headphones className="text-secondary" size={28} />
                        {lang === 'en' ? 'Tinglab tushunish (Listening)' : 'Tinglab tushunish (Eshitish)'}
                    </h1>
                    <p className="text-muted" style={{ margin: '0.5rem 0 0 0' }}>
                        {lang === 'en' ? '4 Parts • 30-35 Minutes • 30 Questions' : '4 qism • 30-35 daqiqa • 30 savol'}
                    </p>
                </div>
                <button className="btn btn-primary">
                    <CheckCircle size={18} /> {lang === 'en' ? 'Submit Section' : 'Bo\'limni yakunlash'}
                </button>
            </header>

            <div className="grid grid-cols-2 gap-6">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Audio Player Placeholder */}
                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gradient-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-glow)' }}>
                            <Volume2 size={32} className="text-secondary" />
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '45%', height: '100%', background: 'var(--color-secondary)' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            <span>02:14</span>
                            <span>05:30</span>
                        </div>
                        <button className="btn btn-secondary" style={{ padding: '1rem', borderRadius: '50%' }}>
                            <PlayCircle size={28} />
                        </button>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>[Replace with actual Custom Audio Player component loading audio source data]</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <FileText size={20} />
                            {lang === 'en' ? 'Transcript (Premium)' : 'Transkript (Premium)'}
                        </h4>
                        <div className="content-placeholder" style={{ minHeight: '100px', padding: '1rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>[Transcript will be blurred/hidden until audio finishes or user upgrades. Insert text map here.]</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', overflowY: 'auto', height: '600px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>{lang === 'en' ? 'Answer the following:' : 'Quyidagilarga javob bering:'}</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {[1, 2, 3, 4].map(q => (
                            <div key={q} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                                <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{q}. [Insert listening comprehension question]</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {['A', 'B', 'C'].map(opt => (
                                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                            <input type="radio" name={`lq${q}`} /> <span>{opt}) [Option data]</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Listening;
