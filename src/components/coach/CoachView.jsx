import React, { useState, useRef, useEffect } from 'react';
import { useWealth } from '../../context/WealthContext';
import { getCoachResponseAsync } from '../../engine/coachAI';
import { Bot, Send, Sparkles, Key, RotateCcw, ShieldCheck, Check, Settings, X } from 'lucide-react';

export function CoachView() {
  const {
    state,
    cashFlowMetrics,
    debtMetrics,
    goalsMetrics,
    investmentsMetrics
  } = useWealth();

  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gemini_api_key_wealth') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(geminiApiKey);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'coach',
      text: null,
      structured: {
        title: `Hello ${state.profile?.name || 'there'}! I'm your AI Wealth Coach.`,
        whatHappened: `I'm tracking your real-time finances: You have ₹${cashFlowMetrics.available.toLocaleString('en-IN')} available surplus each month, ₹${state.savings.toLocaleString('en-IN')} in savings, and ${debtMetrics.totalDebt > 0 ? '₹' + debtMetrics.totalDebt.toLocaleString('en-IN') + ' in debt liabilities' : 'zero debt'}.`,
        whyItMatters: 'Unlike a generic chatbot, I solve real-life situational questions using your exact rupee amounts, budget buffer, and goals.',
        whatYouCanDo: [
          'Ask any situational question: "Can I afford a ₹3,500 concert ticket?", "I got ₹5,000 extra cash, what should I do?", or "Should I buy a phone on EMI?"',
          'Try clicking the situational question bubbles below for instant math and tailored advice.',
          'Optionally connect your free Google Gemini API key in Settings for live generative answers!'
        ]
      }
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAnalyzing]);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setGeminiApiKey(tempApiKey);
    localStorage.setItem('gemini_api_key_wealth', tempApiKey.trim());
    setShowKeyModal(false);
  };

  const handleSend = async (queryText) => {
    const text = queryText || inputQuery;
    if (!text.trim() || isAnalyzing) return;

    // 1. Add user message
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAnalyzing(true);

    try {
      // 2. Query coach with live student context & optional Gemini key
      const response = await getCoachResponseAsync(text, {
        income: state.cashFlow.monthlyIncome,
        expenses: state.cashFlow.monthlyExpenses,
        availableCash: cashFlowMetrics.available,
        savings: state.savings,
        totalDebt: debtMetrics.totalDebt,
        debts: state.debts,
        goals: state.goals,
        investments: state.investments,
        unrealizedChange: investmentsMetrics.unrealizedChange,
        isLoss: investmentsMetrics.isLoss,
        marketCondition: state.marketCondition,
        geminiApiKey: geminiApiKey.trim() || null
      });

      const coachMsg = {
        id: 'coach-' + Date.now(),
        sender: 'coach',
        text: null,
        structured: response
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error('Error getting coach response:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'coach',
        text: null,
        structured: {
          title: 'Chat Reset! How can I help with your finances today?',
          whatHappened: 'Conversation refreshed. Your live student financial snapshot is ready.',
          whyItMatters: 'You can test any situational trade-off or budget adjustment.',
          whatYouCanDo: [
            'Try: "I got ₹5,000 birthday money, should I pay debt or laptop?"',
            'Try: "Can I afford a ₹3,500 weekend trip with friends?"',
            'Try: "A friend wants to borrow ₹2,000 from me, is it safe?"'
          ]
        }
      }
    ]);
  };

  // Comprehensive situational prompts tailored to real student lives
  const situationalPrompts = [
    { label: '🎁 Got ₹5,000 birthday cash', query: 'I just got ₹5,000 birthday money, should I pay off debt or save for my laptop?' },
    { label: '🎟️ Can I afford a ₹3,500 concert?', query: 'Can I afford to spend ₹3,500 on a concert ticket this month?' },
    { label: '🤝 Friend wants to borrow ₹2,000', query: 'A friend wants to borrow ₹2,000 from me. Should I lend it given my current savings and debt?' },
    { label: '📱 Buy a ₹50,000 phone on EMI?', query: 'Should I buy a new phone for ₹50,000 on EMI?' },
    { label: '📉 Allowance cut by ₹1,000', query: 'My allowance was cut by ₹1,000 this month. What expenses should I adjust?' },
    { label: '🚀 Get my laptop in 5 months', query: 'How can I reach my laptop goal in 5 months instead of 10?' },
    { label: '📈 Should I invest all my savings?', query: 'I have ₹20,000 in savings, should I invest all of it in stocks or mutual funds?' },
    { label: '✂️ Where is my money leaking?', query: 'Where is my money leaking each month and how can I cut expenses?' },
    { label: '📉 Why is my portfolio down ₹1,000?', query: 'Why did my investment go down by ₹1,000 and should I sell?' }
  ];

  return (
    <div className="coach-container">
      {/* Header */}
      <div className="coach-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px var(--primary-glow)'
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Ask Wealth Coach</h3>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: geminiApiKey ? 'rgba(16,185,129,0.15)' : 'var(--primary-glow)',
                  color: geminiApiKey ? '#34d399' : 'var(--primary-light)',
                  fontWeight: 600,
                  border: `1px solid ${geminiApiKey ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)'}`
                }}
              >
                {geminiApiKey ? '⚡ Gemini Flash Live' : '🧠 Situational Math Engine'}
              </span>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Real-time answers personalized with your live cash flow & balance sheet
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="chip-button"
            onClick={() => { setTempApiKey(geminiApiKey); setShowKeyModal(true); }}
            title="Configure optional Google Gemini API Key"
          >
            <Key size={13} style={{ color: geminiApiKey ? '#34d399' : 'inherit' }} />
            <span>{geminiApiKey ? 'AI Connected' : 'AI Key'}</span>
          </button>

          <button className="chip-button" onClick={handleResetChat} title="Reset Chat History">
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="coach-messages-area">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="chat-bubble user">
                <div style={{ fontSize: '0.94rem' }}>{msg.text}</div>
              </div>
            );
          }

          const s = msg.structured;
          return (
            <div key={msg.id} className="chat-bubble coach">
              <div className="coach-structure-card">
                {/* Title */}
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} style={{ color: 'var(--primary-light)' }} />
                    <span>{s.title}</span>
                  </div>
                  {s.source === 'gemini-live' && (
                    <span style={{ fontSize: '0.68rem', background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '2px 6px', borderRadius: '4px' }}>
                      Gemini Live
                    </span>
                  )}
                </div>

                {/* Section 1: What Happened? */}
                <div className="coach-section-block what">
                  <div className="coach-section-title">
                    <span>🔍</span> What this means for your budget
                  </div>
                  <div className="coach-section-body">{s.whatHappened}</div>
                </div>

                {/* Section 2: Why Does It Matter? */}
                <div className="coach-section-block why">
                  <div className="coach-section-title">
                    <span>💡</span> Why does it matter?
                  </div>
                  <div className="coach-section-body">{s.whyItMatters}</div>
                </div>

                {/* Section 3: What Can You Do? */}
                <div className="coach-section-block action">
                  <div className="coach-section-title">
                    <span>🚀</span> What can you do? (Recommended moves)
                  </div>
                  <div className="coach-section-body">
                    <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {s.whatYouCanDo.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {s.disclaimer && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-glass)', paddingTop: '8px' }}>
                    ⚖️ {s.disclaimer}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading / Analyzing indicator */}
        {isAnalyzing && (
          <div className="chat-bubble coach" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px' }}>
            <span className="indicator-dot" style={{ background: 'var(--primary-light)' }} />
            <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Analyzing your student financial ledger & calculating situational math...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar & Suggestion Chips */}
      <div className="coach-input-bar">
        {/* Dynamic situational prompt pills */}
        <div className="coach-prompt-chips">
          {situationalPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="prompt-chip"
              onClick={() => handleSend(p.query)}
              title={p.query}
            >
              {p.label}
            </button>
          ))}
        </div>

        <form
          className="coach-input-row"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="coach-text-input"
            placeholder="Ask any situational question (e.g. Can I afford a ₹3,000 trip? What if my allowance drops?)"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isAnalyzing}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '0 20px', opacity: isAnalyzing ? 0.6 : 1 }}
            disabled={isAnalyzing}
          >
            <Send size={16} />
            <span>Ask</span>
          </button>
        </form>
      </div>

      {/* Optional Gemini API Key Modal */}
      {showKeyModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} style={{ color: 'var(--primary-light)' }} />
                <h3 style={{ fontSize: '1.15rem' }}>AI Coach Engine Settings</h3>
              </div>
              <button className="btn-ghost" onClick={() => setShowKeyModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              The Wealth Optimizer comes with a <strong>built-in Situational Reasoning Engine</strong> that works 100% offline. If you want live neural generative responses, you can enter a free Google Gemini API Key from Google AI Studio.
            </p>

            <form onSubmit={handleSaveApiKey}>
              <div className="form-group">
                <label className="form-label">Google Gemini API Key (Optional)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="AIzaSy..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
                  Keys are stored solely in your browser's localStorage and never transmitted to any third-party server.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                {geminiApiKey && (
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ color: 'var(--rose-light)', fontSize: '0.8rem' }}
                    onClick={() => {
                      setGeminiApiKey('');
                      setTempApiKey('');
                      localStorage.removeItem('gemini_api_key_wealth');
                      setShowKeyModal(false);
                    }}
                  >
                    Clear Key
                  </button>
                )}
                <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                  <button type="button" className="btn-secondary btn-sm" onClick={() => setShowKeyModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary btn-sm">
                    <Check size={14} />
                    <span>Save Key</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
