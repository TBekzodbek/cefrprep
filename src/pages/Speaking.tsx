import { motion } from 'framer-motion';
import { Mic, Radio, Pause, Sparkles } from 'lucide-react';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

const Speaking = ({ lang }: Props) => {
    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}
        >
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                    <Mic className="text-orange" style={{ color: '#f97316' }} size={32} />
                    {lang === 'en' ? 'Og\'zaki nutq (Speaking)' : 'Og\'zaki nutq (Gapirish)'}
                </h1>
                <p className="text-muted" style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>
                    {lang === 'en' ? '3 Parts • 15 Minutes • 30 Points Total' : '3 qism • 15 daqiqa • Umumiy 30 ball'}
                </p>
            </header>

            {/* AI Robot / Visualizer Space */}
            <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>

                <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'var(--gradient-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(249, 115, 22, 0.2)', border: '2px solid rgba(249, 115, 22, 0.4)' }}>
                    {/* Animated rings for speaking effect */}
                    <Radio size={64} style={{ color: '#f97316', animation: 'pulse 2s infinite' }} />
                </div>

                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        {lang === 'en' ? 'AI: "Please tell me about your hometown."' : 'AI: "Menga ona shahringiz haqida so\'zlab bering."'}
                    </h3>
                    <p className="text-muted">
                        {lang === 'en' ? 'Press the microphone to respond.' : 'Javob berish uchun mikrofonni bosing.'}
                    </p>
                </div>

                {/* User Controls */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <button className="btn btn-outline" style={{ padding: '1rem', borderRadius: '50%' }}>
                        <Pause size={24} />
                    </button>
                    <button className="btn" style={{ padding: '1.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: 'white', boxShadow: '0 10px 25px rgba(249, 115, 22, 0.4)' }}>
                        <Mic size={32} />
                    </button>
                    <button className="btn btn-outline" style={{ padding: '1rem', borderRadius: '50%' }}>
                        <Sparkles size={24} style={{ color: '#9333ea' }} />
                    </button>
                </div>
            </div>

            {/* Feedback Placeholer */}
            <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', padding: '2rem', marginTop: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>{lang === 'en' ? 'Live Session Analytics' : 'Jonli sessiya tahlili'}</h4>
                <div style={{ display: 'flex', gap: '2rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                    <div><strong style={{ color: 'var(--color-text-main)' }}>Fluency:</strong> [Data]</div>
                    <div><strong style={{ color: 'var(--color-text-main)' }}>Pronunciation:</strong> [Data]</div>
                    <div><strong style={{ color: 'var(--color-text-main)' }}>Lexical Res:</strong> [Data]</div>
                </div>
            </div>
        </motion.div>
    );
};

export default Speaking;
