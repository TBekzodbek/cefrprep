import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Radio, Pause, Sparkles, Loader2, Play, CheckCircle } from 'lucide-react';
import { transcribeAudio, getAIResponse, extractJSON } from '../lib/ai';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

interface SpeakingFeedback {
    transcription: string;
    fluency: number;
    pronunciation: string;
    grammar: string;
    cefr_level: string;
    tips: string[];
}

const Speaking = ({ lang }: Props) => {
    const [isRecording, setIsRecording] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const chunks = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.current.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks.current, { type: 'audio/webm' });
                setAudioUrl(URL.createObjectURL(blob));
                analyzeSpeaking(blob);
                chunks.current = [];
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
            setFeedback(null);
        } catch (err) {
            console.error("Mic error:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const analyzeSpeaking = async (blob: Blob) => {
        setAnalyzing(true);
        try {
            // 1. Transcription via Groq Whisper
            const file = new File([blob], "recording.webm", { type: 'audio/webm' });
            const text = await transcribeAudio(file);

            // 2. Analysis via Groq Llama 3
            const prompt = `
                Act as a professional CEFR Speaking Examiner for the Uzbekistan DTM National Exam.
                Evaluate this student transcription: "${text}"
                
                Provide detailed feedback in JSON format:
                {
                    "transcription": "${text}",
                    "fluency": 0-10 score,
                    "pronunciation": "Brief feedback",
                    "grammar": "Brief feedback",
                    "cefr_level": "B1/B2/C1",
                    "tips": ["3 actionable tips"]
                }
                Language for tips/feedback: ${lang === 'en' ? 'English' : 'Uzbek (lotin)'}
            `;

            const resText = await getAIResponse(prompt);
            const parsed = extractJSON(resText);

            setFeedback({
                transcription: text,
                fluency: Number(parsed.fluency) || 0,
                pronunciation: parsed.pronunciation?.toString() || "N/A",
                grammar: parsed.grammar?.toString() || "N/A",
                cefr_level: parsed.cefr_level?.toString() || "B1",
                tips: Array.isArray(parsed.tips) ? parsed.tips : []
            });
        } catch (error) {
            console.error("Speaking AI Error:", error);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '4rem' }}
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

            <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', background: 'var(--color-background-alt)', width: '100%', maxWidth: '700px', marginBottom: '2rem' }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}>PART 1: Interview</button>
                <button className="btn btn-ghost" style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}>PART 2: Card</button>
                <button className="btn btn-ghost" style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}>PART 3: Discuss</button>
            </div>

            {/* AI Robot / Visualizer Space */}
            <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>

                <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '50%', background: 'var(--gradient-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(249, 115, 22, 0.2)', border: '2px solid rgba(249, 115, 22, 0.4)' }}>
                    {isRecording ? (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '4px solid #f97316', opacity: 0.5 }}
                        />
                    ) : null}
                    <Radio size={64} style={{ color: '#f97316' }} />
                </div>

                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', background: 'rgba(249, 115, 22, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                        {lang === 'en'
                            ? 'Topic: Sports and Healthy Lifestyle'
                            : 'Mavzu: Sport va sog\'lom turmush tarzi'}
                    </h3>
                    <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', minHeight: '1.5em' }}>
                        {analyzing ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Loader2 className="animate-spin" size={20} /> Analyzing...
                            </span>
                        ) : (
                            lang === 'en' ? 'AI: "What do you do to stay healthy?"' : 'AI: "Sog\'lom qolish uchun nima qilasiz?"'
                        )}
                    </h4>
                    <p className="text-muted">
                        {isRecording ? (lang === 'en' ? 'Listening...' : 'Eshitilmoqda...') : (lang === 'en' ? 'Press the microphone to respond.' : 'Javob berish uchun mikrofonni bosing.')}
                    </p>
                </div>

                {/* User Controls */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {audioUrl && (
                        <button onClick={() => new Audio(audioUrl).play()} className="btn btn-outline" style={{ padding: '1rem', borderRadius: '50%' }}>
                            <Play size={24} />
                        </button>
                    )}
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className="btn"
                        style={{
                            padding: '1.5rem',
                            borderRadius: '50%',
                            background: isRecording ? '#dc2626' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                            color: 'white',
                            boxShadow: '0 10px 25px rgba(249, 115, 22, 0.4)',
                            transition: 'all 0.3s'
                        }}
                    >
                        {isRecording ? <Pause size={32} /> : <Mic size={32} />}
                    </button>
                    <button className="btn btn-outline" style={{ padding: '1rem', borderRadius: '50%' }}>
                        <Sparkles size={24} style={{ color: '#9333ea' }} />
                    </button>
                </div>
            </div>

            {/* Feedback Section */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel"
                        style={{ width: '100%', maxWidth: '700px', padding: '2rem', marginTop: '2rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: 0 }}>{lang === 'en' ? 'AI Scoring & Analysis' : 'AI Baholash va Tahlili'}</h4>
                            <div style={{ background: 'var(--color-primary)', color: 'white', padding: '0.4rem 1rem', borderRadius: '2rem', fontWeight: 700 }}>
                                {feedback.cefr_level}
                            </div>
                        </div>

                        <div style={{ background: 'var(--color-background-alt)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', fontStyle: 'italic' }}>
                            "{feedback.transcription}"
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <strong style={{ fontSize: '0.8rem', opacity: 0.7 }}>Fluency:</strong>
                                <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px', marginTop: '4px' }}>
                                    <div style={{ width: `${feedback.fluency * 10}%`, height: '100%', background: 'var(--color-secondary)', borderRadius: '4px' }} />
                                </div>
                            </div>
                            <div>
                                <strong style={{ fontSize: '0.8rem', opacity: 0.7 }}>Pronunciation:</strong>
                                <p style={{ fontSize: '0.85rem', margin: '4px 0 0 0' }}>{feedback.pronunciation}</p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                            <h5 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={16} className="text-secondary" /> {lang === 'en' ? 'Tips for Improvement' : 'Yaxshilash uchun tavsiyalar'}
                            </h5>
                            <ul style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {feedback.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Speaking;
