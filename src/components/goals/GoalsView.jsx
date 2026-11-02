import React, { useState } from 'react';
import { useWealth } from '../../context/WealthContext';
import { Target, Plus, Trash2, CheckCircle, AlertTriangle, Sparkles, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export function GoalsView() {
  const { state, goalsMetrics, formatMoney, cashFlowMetrics, addGoal, removeGoal, updateGoal } = useWealth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [monthsRemaining, setMonthsRemaining] = useState('10');
  const [category, setCategory] = useState('Electronics');

  const handleAddGoal = (e) => {
    e.preventDefault();
    const target = Number(targetAmount);
    const curr = Number(currentAmount) || 0;
    const months = Number(monthsRemaining) || 10;
    if (!name || isNaN(target) || target <= 0) return;

    addGoal({
      name,
      targetAmount: target,
      currentAmount: curr,
      monthsRemaining: months,
      category
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setShowAddModal(false);
  };

  const handleContribute = (goalId, addAmount) => {
    const goal = state.goals.find((g) => g.id === goalId);
    if (!goal) return;
    const newCurrent = Math.min(goal.targetAmount, Number(goal.currentAmount || 0) + addAmount);
    updateGoal(goalId, { currentAmount: newCurrent });

    if (newCurrent >= goal.targetAmount) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleUpdateMonths = (goalId, newMonths) => {
    updateGoal(goalId, { monthsRemaining: Math.max(1, Number(newMonths)) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.85) 0%, rgba(18, 26, 43, 0.85) 100%)',
          padding: '24px 28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--purple-light)', fontWeight: 700, textTransform: 'uppercase' }}>
              Goal Optimizer & Feasibility Engine
            </span>
            <h2 style={{ fontSize: '1.45rem', marginTop: '4px' }}>
              Save Steadily For What Matters
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px', marginTop: '4px' }}>
              Whether it's a coding laptop, semester fees, or emergency cushion, we check your required monthly savings against your actual available cash so you never feel pressured.
            </p>
          </div>

          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>New Financial Goal</span>
          </button>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid-2">
        {goalsMetrics.map((goal) => {
          const isComplete = goal.remaining === 0;

          return (
            <div key={goal.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--purple-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    {goal.icon || '🎯'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{goal.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Category: {goal.category || 'General'}
                    </span>
                  </div>
                </div>

                <button
                  className="btn-ghost"
                  style={{ color: 'var(--rose-light)' }}
                  onClick={() => removeGoal(goal.id)}
                  title="Delete goal"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Progress & Metrics */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                  <span>
                    Saved: <strong style={{ color: '#34d399' }}>{formatMoney(goal.current)}</strong>
                  </span>
                  <span>
                    Target: <strong>{formatMoney(goal.target)}</strong>
                  </span>
                </div>

                <div className="progress-bar-track" style={{ height: '10px' }}>
                  <div
                    className="progress-bar-fill indigo"
                    style={{ width: `${goal.progressPct}%` }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  <span>{goal.progressPct}% complete</span>
                  <span>{formatMoney(goal.remaining)} remaining</span>
                </div>
              </div>

              {/* Feasibility Alert / Insight */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isComplete ? 'var(--emerald-subtle)' : goal.isFeasible ? 'rgba(99,102,241,0.1)' : 'var(--amber-subtle)',
                  border: `1px solid ${isComplete ? 'rgba(16,185,129,0.3)' : goal.isFeasible ? 'rgba(99,102,241,0.25)' : 'rgba(245,158,11,0.3)'}`,
                  fontSize: '0.84rem',
                  lineHeight: 1.45,
                  display: 'flex',
                  gap: '10px'
                }}
              >
                {isComplete ? (
                  <CheckCircle size={18} style={{ color: '#34d399', flexShrink: 0 }} />
                ) : goal.isFeasible ? (
                  <Sparkles size={18} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                ) : (
                  <AlertTriangle size={18} style={{ color: '#fbbf24', flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>
                    {isComplete ? 'Goal Achieved!' : `Requires ~${formatMoney(goal.requiredMonthly)}/month for ${goal.monthsRemaining} months`}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {goal.insight}
                  </div>
                </div>
              </div>

              {/* Timeline Adjuster Slider if not complete */}
              {!isComplete && (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Adjust Target Timeline:</span>
                    <strong>{goal.monthsRemaining} months</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={goal.monthsRemaining}
                    onChange={(e) => handleUpdateMonths(goal.id, e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>1 mo</span>
                    <span>12 mo</span>
                    <span>24 mo</span>
                  </div>
                </div>
              )}

              {/* Quick Add Contribution Buttons */}
              {!isComplete && (
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button
                    className="btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleContribute(goal.id, 500)}
                  >
                    +₹500
                  </button>
                  <button
                    className="btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleContribute(goal.id, 1000)}
                  >
                    +₹1,000
                  </button>
                  <button
                    className="btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleContribute(goal.id, goal.requiredMonthly)}
                  >
                    +₹{goal.requiredMonthly} (Month)
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Set a New Student Goal</h3>
            <form onSubmit={handleAddGoal}>
              <div className="form-group">
                <label className="form-label">Goal Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Laptop, Trip with Friends, Higher Education, Emergency Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Electronics">Electronics & Tech (Laptop, Phone)</option>
                  <option value="Education">Education & Courses</option>
                  <option value="Emergency">Emergency Savings Cushion</option>
                  <option value="Travel">Travel & Trips</option>
                  <option value="Vehicle">Vehicle / Bike</option>
                  <option value="Personal">Personal Milestone</option>
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Target Amount (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 50000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Already Saved (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 10000"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Timeline (Months)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 10"
                  value={monthsRemaining}
                  onChange={(e) => setMonthsRemaining(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
