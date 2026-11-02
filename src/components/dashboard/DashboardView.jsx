import React from 'react';
import { useWealth } from '../../context/WealthContext';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  CreditCard,
  Target,
  TrendingUp,
  Sparkles,
  Check,
  ArrowRight,
  AlertTriangle,
  Info,
  ShieldCheck,
  Lightbulb
} from 'lucide-react';

export function DashboardView() {
  const {
    state,
    formatMoney,
    cashFlowMetrics,
    debtMetrics,
    goalsMetrics,
    investmentsMetrics,
    financialHealth,
    actionPlan,
    alerts,
    completedActions,
    toggleActionComplete,
    setActiveTab
  } = useWealth();

  const topGoal = goalsMetrics[0] || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome & Student Health Banner */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.9) 0%, rgba(18, 26, 43, 0.9) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '24px 28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.2rem' }}>👋</span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
                Welcome back, {state.profile?.name || 'Student'}
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '680px' }}>
              {financialHealth.summary} You have <strong>{formatMoney(cashFlowMetrics.available)}</strong> left after routine expenses this month.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={`health-badge ${financialHealth.status}`} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              <span className="indicator-dot" />
              <span>{financialHealth.title}</span>
            </div>
            <button
              className="btn-secondary btn-sm"
              onClick={() => setActiveTab('coach')}
            >
              <Sparkles size={14} style={{ color: 'var(--primary-light)' }} />
              <span>Ask Coach</span>
            </button>
          </div>
        </div>

        {/* Health factors pill list */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
          {financialHealth.strengths.map((str, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.78rem',
                color: '#34d399',
                background: 'var(--emerald-subtle)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}
            >
              <ShieldCheck size={12} />
              {str}
            </span>
          ))}
          {financialHealth.issues.map((iss, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.78rem',
                color: '#fbbf24',
                background: 'var(--amber-subtle)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}
            >
              <AlertTriangle size={12} />
              {iss}
            </span>
          ))}
        </div>
      </div>

      {/* Smart Alerts Section if any */}
      {alerts.length > 0 && (
        <div>
          {alerts.slice(0, 2).map((alert) => (
            <div
              key={alert.id}
              className={`alert-card ${alert.type}`}
              onClick={() => alert.actionView && setActiveTab(alert.actionView)}
              style={{ cursor: alert.actionView ? 'pointer' : 'default' }}
            >
              <span className="alert-icon">{alert.icon}</span>
              <div className="alert-content">
                <div className="alert-title">{alert.title}</div>
                <div className="alert-desc">{alert.message}</div>
              </div>
              {alert.actionView && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', opacity: 0.8, alignSelf: 'center' }}>
                  <span>View</span>
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 5 Core Snapshot Cards (Questions 1 to 5) */}
      <div>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Financial Snapshot
        </h3>

        <div className="grid-4">
          {/* 1. Cash Flow */}
          <div className="metric-card" onClick={() => setActiveTab('money')} style={{ cursor: 'pointer' }}>
            <div className="metric-header">
              <span className="metric-title">
                <Wallet size={15} style={{ color: 'var(--cyan-light)' }} />
                Monthly Cash Flow
              </span>
              <div className="metric-icon-box" style={{ background: 'var(--cyan-subtle)' }}>
                💧
              </div>
            </div>
            <div>
              <div className="metric-value">{formatMoney(cashFlowMetrics.available)}</div>
              <div className="metric-subtext" style={{ marginTop: '4px' }}>
                <span>Income: {formatMoney(cashFlowMetrics.income)}</span>
                <span>•</span>
                <span>Spent: {formatMoney(cashFlowMetrics.expenses)}</span>
              </div>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill emerald"
                style={{ width: `${Math.min(100, Math.max(10, cashFlowMetrics.savingsRate))}%` }}
              />
            </div>
          </div>

          {/* 2. Savings Buffer */}
          <div className="metric-card" onClick={() => setActiveTab('money')} style={{ cursor: 'pointer' }}>
            <div className="metric-header">
              <span className="metric-title">
                <PiggyBank size={15} style={{ color: 'var(--emerald-light)' }} />
                Current Savings
              </span>
              <div className="metric-icon-box" style={{ background: 'var(--emerald-subtle)' }}>
                🏦
              </div>
            </div>
            <div>
              <div className="metric-value" style={{ color: '#34d399' }}>
                {formatMoney(state.savings)}
              </div>
              <div className="metric-subtext" style={{ marginTop: '4px' }}>
                <span>~{financialHealth.emergencyMonths} months living buffer</span>
              </div>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Keeps you protected without resorting to debt
            </div>
          </div>

          {/* 3. Debt & Liabilities */}
          <div className="metric-card" onClick={() => setActiveTab('debt')} style={{ cursor: 'pointer' }}>
            <div className="metric-header">
              <span className="metric-title">
                <CreditCard size={15} style={{ color: 'var(--amber-light)' }} />
                Outstanding Debt
              </span>
              <div className="metric-icon-box" style={{ background: 'var(--amber-subtle)' }}>
                💳
              </div>
            </div>
            <div>
              <div className="metric-value" style={{ color: debtMetrics.totalDebt > 0 ? '#fbbf24' : '#34d399' }}>
                {formatMoney(debtMetrics.totalDebt)}
              </div>
              <div className="metric-subtext" style={{ marginTop: '4px' }}>
                {debtMetrics.totalDebt > 0 ? (
                  <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🟡 {debtMetrics.statusText} • {formatMoney(debtMetrics.totalMonthlyPayment)}/mo
                  </span>
                ) : (
                  <span style={{ color: '#34d399' }}>🟢 Debt Free</span>
                )}
              </div>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              {debtMetrics.totalDebt > 0 ? 'Prioritize high-interest balance' : 'Zero interest dragging you down!'}
            </div>
          </div>

          {/* 4. Active Goal */}
          <div className="metric-card" onClick={() => setActiveTab('goals')} style={{ cursor: 'pointer' }}>
            <div className="metric-header">
              <span className="metric-title">
                <Target size={15} style={{ color: 'var(--purple-light)' }} />
                Top Goal: {topGoal ? topGoal.name : 'None'}
              </span>
              <div className="metric-icon-box" style={{ background: 'var(--purple-subtle)' }}>
                💻
              </div>
            </div>
            <div>
              <div className="metric-value">
                {topGoal ? formatMoney(topGoal.current) : '₹0'}
              </div>
              <div className="metric-subtext" style={{ marginTop: '4px' }}>
                {topGoal ? (
                  <span>
                    of {formatMoney(topGoal.target)} ({topGoal.progressPct}% complete)
                  </span>
                ) : (
                  <span>No goals configured</span>
                )}
              </div>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill indigo"
                style={{ width: `${topGoal ? topGoal.progressPct : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Action Plan ("What to do next") vs Investments & Quick Coach */}
      <div className="grid-dashboard-main">
        {/* Left: Section 15 Personalized Action Plan ("Your Next 3 Steps") */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800 }}>Your Next 3 Steps</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Prioritized based on essential expenses, debt, and savings buffers.
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', background: 'var(--primary-glow)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
              Tailored for you
            </span>
          </div>

          <div>
            {actionPlan.next3Steps.map((step, idx) => {
              const isDone = !!completedActions[idx];
              return (
                <div
                  key={idx}
                  className={`action-item ${isDone ? 'completed' : ''}`}
                  onClick={() => toggleActionComplete(idx)}
                >
                  <div className={`action-checkbox ${isDone ? 'checked' : ''}`}>
                    {isDone && <Check size={14} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="action-rank">
                        Step {idx + 1} • {step.priority}
                      </div>
                      <span style={{ fontSize: '0.8rem' }}>{step.icon}</span>
                    </div>
                    <div className="action-title">{step.title}</div>
                    <div className="action-explanation">{step.explanation}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>✓ Click steps to mark progress</span>
            <button
              className="btn-ghost"
              style={{ fontSize: '0.8rem', padding: '4px 8px' }}
              onClick={() => setActiveTab('coach')}
            >
              Ask Coach why these steps matter →
            </button>
          </div>
        </div>

        {/* Right: Section 10 Investment & Unrealized Gain/Loss Snapshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Investment Snapshot */}
          <div className="glass-card" onClick={() => setActiveTab('investments')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} style={{ color: 'var(--primary-light)' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Investments & Portfolio</h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                View details →
              </span>
            </div>

            <div className="grid-2" style={{ marginBottom: '14px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Invested</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>
                  {formatMoney(investmentsMetrics.totalCost)}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Value</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>
                  {formatMoney(investmentsMetrics.currentValue)}
                </div>
              </div>
            </div>

            {/* Unrealized Gain/Loss Notice */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: investmentsMetrics.isLoss ? 'var(--rose-subtle)' : 'var(--emerald-subtle)',
                border: `1px solid ${investmentsMetrics.isLoss ? 'rgba(244,63,94,0.25)' : 'rgba(16,185,129,0.25)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Unrealized {investmentsMetrics.isLoss ? 'Loss' : 'Gain'}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: investmentsMetrics.isLoss ? '#fb7185' : '#34d399' }}>
                  {investmentsMetrics.isLoss ? '-' : '+'}{formatMoney(Math.abs(investmentsMetrics.unrealizedChange))} ({investmentsMetrics.unrealizedPct}%)
                </div>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', maxWidth: '170px', textAlign: 'right', lineHeight: 1.3 }}>
                Paper change only. Still in your hands.
              </span>
            </div>
          </div>

          {/* Quick Ask Coach Teaser */}
          <div
            className="glass-card"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(16,185,129,0.08) 100%)',
              border: '1px solid rgba(99,102,241,0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--primary-light)' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Ask Wealth Coach</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Confused about your money, debt, or whether to sell an investment? Ask in plain English.
            </p>
            <button
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.85rem' }}
              onClick={() => setActiveTab('coach')}
            >
              Open AI Wealth Coach Chat →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
