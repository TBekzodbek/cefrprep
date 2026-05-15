import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { model } from '../lib/gemini';
import './PageLayout.css';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface Props {
    lang: 'en' | 'uz';
}

const AIChat = ({ lang }: Props) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: lang === 'en'
                ? "Hello! I am Atlas, your CEFR AI tutor. How can I help you with your exam preparation today?"
                : "Salom! Men Atlasman, sizning CEFR AI repetitoringizman. Bugun imtihonga tayyorgarlik ko'rishda sizga qanday yordam bera olaman?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const chat = model.startChat({
                history: messages.map(m => ({
                    role: m.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text }],
                })),
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const result = await chat.sendMessage(input);
            const response = await result.response;
            const botText = response.text();

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: botText,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error: any) {
            console.error("Chat Error:", error);
            const errorMessage = error.message || "Unknown Error";
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: lang === 'en'
                    ? `I'm having trouble: ${errorMessage}. Please check your API Key and connection.`
                    : `Muammo yuzaga keldi: ${errorMessage}. Iltimos, API kalitini va ulanishni tekshiring.`,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="page-container" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '0.5rem' }}><ArrowLeft size={20} /></Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--gradient-primary)', padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Bot size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Atlas AI Tutor</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#16a34a' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
                            Online
                        </div>
                    </div>
                </div>
            </header>

            <div className="glass-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                <div style={{ flexGrow: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                                }}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: msg.sender === 'user' ? 'var(--color-background-alt)' : 'var(--gradient-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: msg.sender === 'user' ? 'var(--color-text-main)' : 'white',
                                    flexShrink: 0
                                }}>
                                    {msg.sender === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                                </div>
                                <div style={{
                                    padding: '1rem 1.25rem',
                                    borderRadius: msg.sender === 'user' ? '1.25rem 1.25rem 0 1.25rem' : '1.25rem 1.25rem 1.25rem 0',
                                    background: msg.sender === 'user' ? 'var(--color-primary)' : 'var(--color-background-alt)',
                                    color: msg.sender === 'user' ? 'white' : 'var(--color-text-main)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <Bot size={16} />
                            </div>
                            <div className="typing-indicator" style={{ background: 'var(--color-background-alt)', padding: '1rem', borderRadius: '1.25rem' }}>
                                <Loader2 size={16} className="animate-spin" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.5)', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={lang === 'en' ? "Type your message..." : "Xabar yozing..."}
                        style={{
                            flexGrow: 1,
                            padding: '1rem 1.25rem',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border)',
                            background: 'white',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }} disabled={!input.trim() || isTyping}>
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChat;
