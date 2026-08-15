import { useState, useEffect, useRef } from 'react';
import { Croissant, X, Send, MessageCircle } from 'lucide-react';
import './Chatbot.css';

const API_URL = 'http://localhost:8000/api/chat';

const WELCOME_MESSAGE =
  "Hi there! I'm your Golden Crust bakery assistant. Ask me anything about our menu, prices, delivery, or bakery hours!";

const SUGGESTIONS = [
  "What's on the menu?",
  'What are your prices?',
  'Do you deliver?',
  'What are your hours?',
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 0, role: 'bot', text: WELCOME_MESSAGE },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || loading) return;

    setInput('');
    setError('');
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: message }]);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'bot', text: data.response }]);
    } catch {
      setError(
        'Sorry, I could not reach the assistant right now. Make sure the chatbot server is running (python rag_chatbot/api_server.py).'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-avatar">
              <Croissant size={20} />
            </div>
            <div className="chatbot-header-text">
              <span className="chatbot-title">Golden Crust Assistant</span>
              <span className="chatbot-subtitle">Artisan Bakery Concierge</span>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-msg chatbot-msg-${msg.role}`}>
                {msg.role === 'bot' && (
                  <div className="chatbot-msg-avatar">
                    <Croissant size={14} />
                  </div>
                )}
                <div className="chatbot-bubble">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-msg chatbot-msg-bot">
                <div className="chatbot-msg-avatar">
                  <Croissant size={14} />
                </div>
                <div className="chatbot-bubble chatbot-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            {!messages.some((m) => m.role === 'user') && (
              <div className="chatbot-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="chatbot-suggestion"
                    onClick={() => {
                      setInput(s);
                      inputRef.current?.focus();
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {error && <div className="chatbot-error">{error}</div>}
            <div ref={endRef} />
          </div>
          <div className="chatbot-input-bar">
            <input
              ref={inputRef}
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about our bakery..."
              maxLength={500}
            />
            <button
              className="chatbot-send"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default Chatbot;
