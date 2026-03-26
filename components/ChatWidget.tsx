import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'ai' | 'user';
  text: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'ai',
  text: "Hey! I'm Aria 👋 I help coaches & consultants figure out how to get more booked discovery calls. Are you currently running a coaching or consulting business?",
};

const QUICK_REPLIES = [
  "Yes, I'm a coach",
  "I'm a consultant",
  "I want more clients",
  "Tell me more",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Show widget after 6 seconds with a bounce
  const [wiggle, setWiggle] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWiggle(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setShowQuickReplies(false);

    const userMsg: Message = { role: 'user', text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    // Build Gemini-format history
    const history = updatedMessages.map((m) => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const reply = data.reply || "I'm having a quick think — could you rephrase that?";
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: "Sorry, I'm having a moment. Drop Abu Bakar a message directly via the form below!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="chat-widget">
      {/* Window */}
      {open && (
        <div className="chat-window-widget">
          {/* Header */}
          <div className="cw-header">
            <div className="cw-av">A</div>
            <div className="cw-info">
              <div className="cw-name">Aria — Abrise AI</div>
              <div className="cw-status">Online now</div>
            </div>
            <button className="cw-close" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>

          {/* Messages */}
          <div className="cw-msgs" ref={msgsRef}>
            {messages.map((m, i) => (
              <div key={i} className={`cw-msg ${m.role}`}>
                <div className={`cw-msg-av ${m.role === 'ai' ? 'ai' : 'u'}`}>
                  {m.role === 'ai' ? 'A' : 'U'}
                </div>
                <div className="cw-bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="cw-msg ai">
                <div className="cw-msg-av ai">A</div>
                <div className="cw-bubble">
                  <div className="cw-typing">
                    <div className="ct" />
                    <div className="ct" />
                    <div className="ct" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {showQuickReplies && (
            <div className="cw-quick-replies">
              {QUICK_REPLIES.map((qr) => (
                <button key={qr} className="cw-qr" onClick={() => sendMessage(qr)}>
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="cw-input-row">
            <input
              ref={inputRef}
              className="cw-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="cw-send"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        className="chat-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI chat"
        style={wiggle && !open ? { animation: 'wigglePop 0.6s ease' } : {}}
      >
        {open ? '✕' : '🤖'}
        {!open && <span className="chat-toggle-badge" />}
      </button>

      <style>{`
        @keyframes wigglePop {
          0%{transform:scale(1) rotate(0deg)}
          25%{transform:scale(1.15) rotate(-8deg)}
          50%{transform:scale(1.15) rotate(8deg)}
          75%{transform:scale(1.1) rotate(-4deg)}
          100%{transform:scale(1) rotate(0deg)}
        }
      `}</style>
    </div>
  );
}
