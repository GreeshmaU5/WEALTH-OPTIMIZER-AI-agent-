import React from 'react';
import { useWealth } from '../../context/WealthContext';
import { Sparkles, ShieldCheck, AlertTriangle, AlertCircle, RotateCcw, UserPlus, Wallet } from 'lucide-react';

export function Header() {
  const {
    state,
    currency,
    setCurrency,
    formatMoney,
    netWorth,
    financialHealth,
    resetToDemo,
    startFresh,
    setShowOnboarding
  } = useWealth();

  const getHealthIcon = () => {
    switch (financialHealth.status) {
      case 'good':
        return <ShieldCheck size={16} />;
      case 'attention':
        return <AlertTriangle size={16} />;
      case 'priority':
        return <AlertCircle size={16} />;
      default:
        return <ShieldCheck size={16} />;
    }
  };

  return (
    <header className="top-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand-section">
          <div className="brand-logo-badge">
            <span>🌱</span>
          </div>
          <div>
            <h1 className="brand-title">
              Wealth Optimizer
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-light)', padding: '2px 8px', borderRadius: '12px', background: 'var(--primary-glow)' }}>
                AI Student Edition
              </span>
            </h1>
            <p className="brand-tagline">Financial Wellness & AI Wealth Companion</p>
          </div>
        </div>

        {/* Global Key Stats & Quick Actions */}
        <div className="header-actions">
          {/* Net Worth Pill */}
          <div className="chip-button" title="Total Assets (Savings + Investments) minus Total Liabilities (Debt)">
            <Wallet size={14} style={{ color: 'var(--emerald-light)' }} />
            <span>Net Worth:</span>
            <strong style={{ color: netWorth >= 0 ? '#34d399' : '#fb7185' }}>
              {formatMoney(netWorth)}
            </strong>
          </div>

          {/* Health Badge */}
          <div
            className={`health-badge ${financialHealth.status}`}
            title={financialHealth.summary}
          >
            <span className="indicator-dot" />
            {getHealthIcon()}
            <span>{financialHealth.title}</span>
          </div>

          {/* Currency Switcher */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
            {['INR', 'USD', 'EUR'].map((curr) => (
              <button
                key={curr}
                className={`chip-button ${currency === curr ? 'active' : ''}`}
                style={{ padding: '3px 9px', fontSize: '0.75rem', border: 'none' }}
                onClick={() => setCurrency(curr)}
              >
                {curr === 'INR' ? '₹ INR' : curr === 'USD' ? '$ USD' : '€ EUR'}
              </button>
            ))}
          </div>

          {/* Demo Mode / Reset */}
          <button
            className="chip-button"
            onClick={resetToDemo}
            title="Reload standard sample student data (Section 26)"
          >
            <RotateCcw size={13} />
            <span>Demo Data</span>
          </button>

          {/* New Student Onboarding */}
          <button
            className="btn-primary btn-sm"
            onClick={() => setShowOnboarding(true)}
          >
            <UserPlus size={14} />
            <span>Onboarding</span>
          </button>
        </div>
      </div>
    </header>
  );
}
