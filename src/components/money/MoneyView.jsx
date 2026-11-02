import React, { useState } from 'react';
import { useWealth } from '../../context/WealthContext';
import { Plus, Trash2, Edit3, ArrowUpRight, ArrowDownRight, PiggyBank, Check } from 'lucide-react';

export function MoneyView() {
  const { state, updateCashFlow, updateSavings, formatMoney, cashFlowMetrics, financialHealth } = useWealth();

  const [isEditingSavings, setIsEditingSavings] = useState(false);
  const [savingsInput, setSavingsInput] = useState(state.savings.toString());

  // Quick Add Income state
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [incName, setIncName] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incCategory, setIncCategory] = useState('Allowance');

  // Quick Add Expense state
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expName, setExpName] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Food');

  const handleSaveSavings = () => {
    const val = Number(savingsInput);
    if (!isNaN(val) && val >= 0) {
      updateSavings(val);
      setIsEditingSavings(false);
    }
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    const val = Number(incAmount);
    if (!incName || isNaN(val) || val <= 0) return;

    const newSources = [
      ...state.cashFlow.incomeSources,
      { id: 'inc-' + Date.now(), name: incName, amount: val, category: incCategory }
    ];
    const newTotal = newSources.reduce((acc, s) => acc + s.amount, 0);

    updateCashFlow({
      monthlyIncome: newTotal,
      incomeSources: newSources
    });

    setIncName('');
    setIncAmount('');
    setShowAddIncome(false);
  };

  const handleRemoveIncome = (id) => {
    const newSources = state.cashFlow.incomeSources.filter((s) => s.id !== id);
    const newTotal = newSources.reduce((acc, s) => acc + s.amount, 0);
    updateCashFlow({
      monthlyIncome: newTotal,
      incomeSources: newSources
    });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const val = Number(expAmount);
    if (!expName || isNaN(val) || val <= 0) return;

    const newExpenses = [
      ...state.cashFlow.expenseBreakdown,
      { id: 'exp-' + Date.now(), name: expName, amount: val, category: expCategory }
    ];
    const newTotal = newExpenses.reduce((acc, s) => acc + s.amount, 0);

    updateCashFlow({
      monthlyExpenses: newTotal,
      expenseBreakdown: newExpenses
    });

    setExpName('');
    setExpAmount('');
    setShowAddExpense(false);
  };

  const handleRemoveExpense = (id) => {
    const newExpenses = state.cashFlow.expenseBreakdown.filter((e) => e.id !== id);
    const newTotal = newExpenses.reduce((acc, s) => acc + s.amount, 0);
    updateCashFlow({
      monthlyExpenses: newTotal,
      expenseBreakdown: newExpenses
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner: Cash Flow Summary */}
      <div className="glass-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--cyan-light)', fontWeight: 700, textTransform: 'uppercase' }}>
              Monthly Cash Flow & Savings Buffer
            </span>
            <h2 style={{ fontSize: '1.45rem', marginTop: '4px' }}>
              Where Your Student Money Goes
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Keeping your expenses lower than income ensures you can save and pay down debt without taking high-cost loans.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            {/* Savings Buffer Card */}
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Savings</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                {isEditingSavings ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="number"
                      value={savingsInput}
                      onChange={(e) => setSavingsInput(e.target.value)}
                      style={{ width: '90px', padding: '4px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--primary)' }}
                    />
                    <button className="btn-primary btn-sm" onClick={handleSaveSavings}>
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <strong style={{ fontSize: '1.25rem', color: '#34d399' }}>{formatMoney(state.savings)}</strong>
                    <button
                      className="btn-ghost"
                      style={{ padding: '2px 6px' }}
                      onClick={() => { setIsEditingSavings(true); setSavingsInput(state.savings.toString()); }}
                      title="Edit savings amount"
                    >
                      <Edit3 size={13} />
                    </button>
                  </>
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Runway: {financialHealth.emergencyMonths} months
              </div>
            </div>

            {/* Monthly Net Available */}
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Net Available / Month</div>
              <strong style={{ fontSize: '1.25rem', color: cashFlowMetrics.available >= 0 ? '#34d399' : '#fb7185' }}>
                {formatMoney(cashFlowMetrics.available)}
              </strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {cashFlowMetrics.savingsRate}% of income
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Incomes vs Expenses */}
      <div className="grid-2">
        {/* Income Column */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--emerald-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                <ArrowUpRight size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Monthly Inflow</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Total: {formatMoney(state.cashFlow.monthlyIncome)}/month
                </span>
              </div>
            </div>
            <button className="btn-secondary btn-sm" onClick={() => setShowAddIncome(true)}>
              <Plus size={14} />
              <span>Add Source</span>
            </button>
          </div>

          {showAddIncome && (
            <form onSubmit={handleAddIncome} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '14px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Source name"
                  className="form-input"
                  style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  value={incName}
                  onChange={(e) => setIncName(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  className="form-input"
                  style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  value={incAmount}
                  onChange={(e) => setIncAmount(e.target.value)}
                  required
                />
                <select
                  className="form-select"
                  style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  value={incCategory}
                  onChange={(e) => setIncCategory(e.target.value)}
                >
                  <option value="Allowance">Allowance</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Freelancing">Freelancing</option>
                </select>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button type="submit" className="btn-primary btn-sm">Save</button>
                  <button type="button" className="btn-ghost btn-sm" onClick={() => setShowAddIncome(false)}>Cancel</button>
                </div>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {state.cashFlow.incomeSources.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.name}</div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>+{formatMoney(item.amount)}</strong>
                  {state.cashFlow.incomeSources.length > 1 && (
                    <button
                      className="btn-ghost"
                      style={{ padding: '4px', color: 'var(--text-muted)' }}
                      onClick={() => handleRemoveIncome(item.id)}
                      title="Remove source"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Column */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--rose-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>
                <ArrowDownRight size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Monthly Expenses</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Total: {formatMoney(state.cashFlow.monthlyExpenses)}/month
                </span>
              </div>
            </div>
            <button className="btn-secondary btn-sm" onClick={() => setShowAddExpense(true)}>
              <Plus size={14} />
              <span>Add Expense</span>
            </button>
          </div>

          {showAddExpense && (
            <form onSubmit={handleAddExpense} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '14px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Expense title"
                  className="form-input"
                  style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  value={expName}
                  onChange={(e) => setExpName(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  className="form-input"
                  style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  required
                />
                <select
                  className="form-select"
                  style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                >
                  <option value="Food">Food / Mess</option>
                  <option value="Commute">Commute / Travel</option>
                  <option value="Education">Books / Study</option>
                  <option value="Utilities">Mobile & Utilities</option>
                  <option value="Personal">Personal / Leisure</option>
                </select>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button type="submit" className="btn-primary btn-sm">Save</button>
                  <button type="button" className="btn-ghost btn-sm" onClick={() => setShowAddExpense(false)}>Cancel</button>
                </div>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {state.cashFlow.expenseBreakdown.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.name}</div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ color: '#fb7185', fontSize: '0.95rem' }}>-{formatMoney(item.amount)}</strong>
                  {state.cashFlow.expenseBreakdown.length > 1 && (
                    <button
                      className="btn-ghost"
                      style={{ padding: '4px', color: 'var(--text-muted)' }}
                      onClick={() => handleRemoveExpense(item.id)}
                      title="Remove expense"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
