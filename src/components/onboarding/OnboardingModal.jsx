import React, { useState } from 'react';
import { useWealth } from '../../context/WealthContext';
import { X, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export function OnboardingModal() {
  const { showOnboarding, setShowOnboarding, updateCashFlow, updateSavings, addDebt, addGoal, addInvestment, formatMoney } = useWealth();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Step 1: Money
  const [income, setIncome] = useState('12000');
  const [incomeSource, setIncomeSource] = useState('Allowance');
  const [expenses, setExpenses] = useState('8000');
  const [savings, setSavings] = useState('20000');

  // Step 2: Debt
  const [hasDebt, setHasDebt] = useState(true);
  const [debtName, setDebtName] = useState('Credit Card / EMI');
  const [debtType, setDebtType] = useState('Credit Card');
  const [debtBalance, setDebtBalance] = useState('5000');
  const [debtPayment, setDebtPayment] = useState('500');
  const [debtRate, setDebtRate] = useState('24');

  // Step 3: Goals
  const [goalName, setGoalName] = useState('Laptop');
  const [goalTarget, setGoalTarget] = useState('50000');
  const [goalSaved, setGoalSaved] = useState('20000');
  const [goalMonths, setGoalMonths] = useState('10');

  // Step 4: Investments
  const [hasInvestments, setHasInvestments] = useState(true);
  const [invName, setInvName] = useState('Nifty 50 Mutual Fund');
  const [invType, setInvType] = useState('mutual_funds');
  const [invCost, setInvCost] = useState('15000');
  const [invValue, setInvValue] = useState('14000');

  if (!showOnboarding) return null;

  const handleNext = () => {
    setError('');

    if (step === 1) {
      const inc = Number(income);
      const exp = Number(expenses);
      const sav = Number(savings);
      if (isNaN(inc) || inc <= 0) {
        setError('Please enter a monthly income amount greater than ₹0.');
        return;
      }
      if (isNaN(exp) || exp < 0) {
        setError('Monthly expenses cannot be negative.');
        return;
      }
      if (isNaN(sav) || sav < 0) {
        setError('Savings cannot be negative.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (hasDebt) {
        const bal = Number(debtBalance);
        const pmt = Number(debtPayment);
        if (isNaN(bal) || bal <= 0) {
          setError('Please enter an outstanding debt balance greater than ₹0, or select "No Debt".');
          return;
        }
        if (isNaN(pmt) || pmt <= 0) {
          setError('Please enter an estimated monthly payment greater than ₹0.');
          return;
        }
      }
      setStep(3);
    } else if (step === 3) {
      const target = Number(goalTarget);
      const saved = Number(goalSaved);
      const months = Number(goalMonths);
      if (!goalName.trim()) {
        setError('Please enter a goal name (e.g., Laptop, Higher Education, Emergency Fund).');
        return;
      }
      if (isNaN(target) || target <= 0) {
        setError('Please enter a goal target amount greater than ₹0.');
        return;
      }
      if (isNaN(saved) || saved < 0) {
        setError('Current saved amount cannot be negative.');
        return;
      }
      if (isNaN(months) || months <= 0) {
        setError('Please enter a valid timeline in months (e.g. 6, 10, 12).');
        return;
      }
      setStep(4);
    }
  };

  const handleComplete = () => {
    // 1. Save cash flow & savings
    updateCashFlow({
      monthlyIncome: Number(income),
      monthlyExpenses: Number(expenses),
      incomeSources: [{ id: 'inc-user', name: incomeSource, amount: Number(income), category: incomeSource }],
      expenseBreakdown: [{ id: 'exp-user', name: 'Monthly Living & College Spends', amount: Number(expenses), category: 'General' }]
    });
    updateSavings(Number(savings));

    // 2. Save debt if any
    if (hasDebt) {
      addDebt({
        name: debtName,
        type: debtType,
        balance: Number(debtBalance),
        monthlyPayment: Number(debtPayment),
        interestRate: Number(debtRate) || 18,
        dueDate: 'Every month'
      });
    }

    // 3. Save goal
    addGoal({
      name: goalName,
      targetAmount: Number(goalTarget),
      currentAmount: Number(goalSaved),
      monthsRemaining: Number(goalMonths),
      category: 'Electronics'
    });

    // 4. Save investment if any
    if (hasInvestments) {
      addInvestment({
        name: invName,
        type: invType,
        costBasis: Number(invCost),
        currentValue: Number(invValue),
        holdingMonths: 8
      });
    }

    setShowOnboarding(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 700, textTransform: 'uppercase' }}>
              Step {step} of 4 • Student Onboarding
            </span>
            <h2 style={{ fontSize: '1.35rem', marginTop: '4px' }}>
              {step === 1 && '🌱 About Your Money'}
              {step === 2 && '💳 Debt & Liabilities'}
              {step === 3 && '🎯 What Are You Saving For?'}
              {step === 4 && '📈 Any Investments?'}
            </h2>
          </div>
          <button
            className="btn-ghost"
            onClick={() => setShowOnboarding(false)}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Progress indicators */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: i <= step ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                transition: 'var(--trans-fast)'
              }}
            />
          ))}
        </div>

        {error && (
          <div className="alert-card danger" style={{ padding: '10px 14px', marginBottom: '16px' }}>
            <ShieldAlert size={16} />
            <div style={{ fontSize: '0.85rem' }}>{error}</div>
          </div>
        )}

        {/* Step 1: Money */}
        {step === 1 && (
          <div>
            <div className="form-group">
              <label className="form-label">How much money do you receive each month?</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 12000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary source of your monthly money?</label>
              <select
                className="form-select"
                value={incomeSource}
                onChange={(e) => setIncomeSource(e.target.value)}
              >
                <option value="Allowance">Allowance from family</option>
                <option value="Part-time">Part-time job / Internship</option>
                <option value="Scholarship">Scholarship / Grant</option>
                <option value="Freelancing">Freelancing / Tutoring</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Approximately how much do you spend each month?</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 8000"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">How much do you currently have saved in your account?</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 20000"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Debt */}
        {step === 2 && (
          <div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Many students have education loans, EMIs, or credit balances. We never judge or shame you.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                className={`btn-secondary ${!hasDebt ? 'active' : ''}`}
                style={{
                  flex: 1,
                  background: !hasDebt ? 'var(--emerald-subtle)' : undefined,
                  borderColor: !hasDebt ? 'var(--emerald)' : undefined
                }}
                onClick={() => setHasDebt(false)}
              >
                🎉 No Debt
              </button>
              <button
                type="button"
                className={`btn-secondary ${hasDebt ? 'active' : ''}`}
                style={{
                  flex: 1,
                  background: hasDebt ? 'var(--amber-subtle)' : undefined,
                  borderColor: hasDebt ? 'var(--amber)' : undefined
                }}
                onClick={() => setHasDebt(true)}
              >
                💳 I Have Liabilities
              </button>
            </div>

            {hasDebt && (
              <div>
                <div className="form-group">
                  <label className="form-label">Debt / Liability Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Credit Card balance, Phone EMI, Student loan"
                    value={debtName}
                    onChange={(e) => setDebtName(e.target.value)}
                  />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Total Outstanding Balance (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 5000"
                      value={debtBalance}
                      onChange={(e) => setDebtBalance(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Payment / EMI (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 500"
                      value={debtPayment}
                      onChange={(e) => setDebtPayment(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              What is your primary financial goal right now?
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {['Coding Laptop', 'College Expenses', 'Emergency Savings', 'Higher Education', 'Travel', 'Vehicle', 'Starting a Business'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="prompt-chip"
                  style={{
                    background: goalName === preset ? 'var(--primary-glow)' : undefined,
                    borderColor: goalName === preset ? 'var(--primary)' : undefined,
                    color: goalName === preset ? '#ffffff' : undefined
                  }}
                  onClick={() => setGoalName(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Goal Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Laptop"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
              />
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Target Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 50000"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Already Saved (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 20000"
                  value={goalSaved}
                  onChange={(e) => setGoalSaved(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Target (Months)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 10"
                  value={goalMonths}
                  onChange={(e) => setGoalMonths(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Investments */}
        {step === 4 && (
          <div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Do you currently own any investments? You can skip this if you don't.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                className={`btn-secondary ${!hasInvestments ? 'active' : ''}`}
                style={{
                  flex: 1,
                  background: !hasInvestments ? 'var(--emerald-subtle)' : undefined,
                  borderColor: !hasInvestments ? 'var(--emerald)' : undefined
                }}
                onClick={() => setHasInvestments(false)}
              >
                No Investments (Skip)
              </button>
              <button
                type="button"
                className={`btn-secondary ${hasInvestments ? 'active' : ''}`}
                style={{
                  flex: 1,
                  background: hasInvestments ? 'var(--primary-glow)' : undefined,
                  borderColor: hasInvestments ? 'var(--primary)' : undefined
                }}
                onClick={() => setHasInvestments(true)}
              >
                📈 I Own Investments
              </button>
            </div>

            {hasInvestments && (
              <div>
                <div className="form-group">
                  <label className="form-label">Investment Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Nifty 50 Mutual Fund or Stock"
                    value={invName}
                    onChange={(e) => setInvName(e.target.value)}
                  />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">What You Paid / Cost Basis (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 15000"
                      value={invCost}
                      onChange={(e) => setInvCost(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current Value Today (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 14000"
                      value={invValue}
                      onChange={(e) => setInvValue(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
          {step > 1 ? (
            <button
              className="btn-secondary"
              onClick={() => { setError(''); setStep(step - 1); }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button className="btn-primary" onClick={handleNext}>
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn-primary" onClick={handleComplete}>
              <CheckCircle2 size={16} />
              <span>Launch My Optimizer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
