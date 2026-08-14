import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  HelpCircle,
  TrendingDown,
  ShieldAlert,
  Lightbulb,
  Zap
} from 'lucide-react';

export const AiAssistant = () => {
  const { user } = useAuth();

  const initialGreeting = {
    id: 1,
    sender: 'ai',
    text: `Hello **${user?.name ? user.name.split(' ')[0] : 'there'}**! 👋 I'm **FinTrack AI**, your personal wealth and finance advisor.\n\nI analyze your live PostgreSQL cash flows, UPI transactions, and savings metrics to help you make informed financial decisions. Ask me about **career transitions, car/home affordability, retirement planning (FIRE), 50/30/20 budgeting, or investment strategies**!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    aiGenerated: false,
  };

  const [messages, setMessages] = useState([initialGreeting]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'How much can I manage if I quit my job for 3 months?',
    'Can I buy a car now with my income?',
    'Give me a 50/30/20 budget breakdown',
    'How much do I need to retire early (FIRE)?',
    'What is my maximum safe home loan EMI?',
    'Where did I spend the most this month?',
    'How to invest my monthly surplus?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : inputMessage;
    if (!query || !query.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await aiService.chat(query.trim());
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aiGenerated: response.aiGenerated,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Sorry, I encountered an error analyzing your data. Please try asking again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([initialGreeting]);
  };

  // Helper to format bold markdown, headers, and bullet points cleanly
  const renderFormattedText = (text) => {
    return text.split('\n').map((rawLine, idx) => {
      let line = rawLine.trim();

      if (!line) {
        return <div key={idx} style={{ height: '8px' }} />;
      }

      // H3 Header
      if (line.startsWith('### ')) {
        const title = line.substring(4);
        return (
          <h4 key={idx} style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', marginTop: '10px', marginBottom: '6px' }}>
            {title}
          </h4>
        );
      }

      // H4 Header
      if (line.startsWith('#### ')) {
        const title = line.substring(5);
        return (
          <h5 key={idx} style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E293B', marginTop: '8px', marginBottom: '4px' }}>
            {title}
          </h5>
        );
      }

      // Bullet Point
      const isBullet = line.startsWith('• ') || line.startsWith('* ') || line.startsWith('- ');
      const isNumbered = /^\d+\.\s/.test(line);

      let content = line;
      if (isBullet) {
        content = line.substring(2);
      }

      // Parse bold & italic inside line
      const parts = content.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      const parsed = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ color: '#0F172A', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={pIdx} style={{ color: '#475569' }}>{part.slice(1, -1)}</em>;
        }
        return part;
      });

      return (
        <div
          key={idx}
          style={{
            display: isBullet ? 'flex' : 'block',
            gap: isBullet ? '6px' : undefined,
            marginBottom: '4px',
            paddingLeft: isNumbered ? '4px' : undefined,
          }}
        >
          {isBullet && <span style={{ color: '#FF6B00', fontWeight: 800 }}>•</span>}
          <span>{parsed}</span>
        </div>
      );
    });
  };

  return (
    <div>
      <Navbar
        title="FinTrack AI Financial Advisor"
        subtitle="Deep multi-scenario financial reasoning powered by Gemini & your real PostgreSQL transaction history"
      />

      <div className="content-area" style={{ maxWidth: '1050px' }}>
        <div className="chat-container">
          {/* Chat Header Bar */}
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-orange)',
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>FinTrack AI Wealth Advisor</span>
                  <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: '#ECFDF5', color: '#059669', fontWeight: 700 }}>
                    ACTIVE ENGINE
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Trained on 25+ real-world financial decision models (Job switches, Car/Home affordability, 50/30/20, FIRE)
                </div>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="btn btn-secondary btn-sm"
              title="Reset Conversation"
            >
              <Trash2 size={14} />
              <span>Clear Chat</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-bubble ${msg.sender}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  {msg.sender === 'ai' ? (
                    <Sparkles size={14} color="#FF6B00" />
                  ) : (
                    <User size={14} color="white" />
                  )}
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    {msg.sender === 'ai' ? 'FinTrack AI Advisor' : 'You'}
                  </span>
                  {msg.aiGenerated && (
                    <span style={{ fontSize: '0.65rem', background: '#ECFDF5', color: '#059669', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                      Gemini 1.5
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.925rem', lineHeight: 1.6 }}>
                  {renderFormattedText(msg.text)}
                </div>

                <div className="message-meta">
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-bubble ai" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '16px', height: '16px', border: '2px solid #FFEDD5', borderTop: '2px solid #FF6B00', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>FinTrack AI is evaluating your cashflow & running simulations...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips & Input Form */}
          <div className="chat-input-area">
            <div className="chat-chips">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="chip-btn"
                  disabled={loading}
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              className="chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                className="form-input"
                placeholder="Ask any financial question (e.g. 'Can I quit my job for 3 months?', 'Can I buy a car?')..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !inputMessage.trim()}
              >
                <Send size={16} />
                <span>Ask AI</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
