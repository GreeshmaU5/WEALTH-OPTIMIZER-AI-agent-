/**
 * Storage and Demo Data Utilities for Wealth Optimizer
 * Includes preloaded student persona defined in Section 26 & 21.
 */

export const DEMO_DATA = {
  profile: {
    name: 'Aarav',
    educationLevel: 'College Student (Undergraduate)',
    primaryIncomeSource: 'Allowance & Part-time tutoring'
  },
  currency: 'INR',
  cashFlow: {
    monthlyIncome: 12000,
    incomeSources: [
      { id: 'inc-1', name: 'Monthly College Allowance', amount: 9000, category: 'Allowance' },
      { id: 'inc-2', name: 'Weekend Peer Tutoring', amount: 3000, category: 'Part-time' }
    ],
    monthlyExpenses: 8000,
    expenseBreakdown: [
      { id: 'exp-1', name: 'Mess & Food Spends', amount: 3500, category: 'Food' },
      { id: 'exp-2', name: 'Hostel / Travel & Transit', amount: 2000, category: 'Commute' },
      { id: 'exp-3', name: 'Books, Study & Printing', amount: 1000, category: 'Education' },
      { id: 'exp-4', name: 'Mobile, Internet & Subscriptions', amount: 700, category: 'Utilities' },
      { id: 'exp-5', name: 'Outing / Discretionary', amount: 800, category: 'Personal' }
    ]
  },
  savings: 20000,
  debts: [
    {
      id: 'debt-1',
      name: 'Credit Card / EMI Balance',
      type: 'Credit Card',
      balance: 5000,
      monthlyPayment: 500,
      interestRate: 24, // 24% annual
      dueDate: '15th of month',
      notes: 'Purchased academic reference books and headphones on EMI'
    }
  ],
  goals: [
    {
      id: 'goal-1',
      name: 'Coding Laptop',
      category: 'Electronics',
      targetAmount: 50000,
      currentAmount: 20000,
      monthsRemaining: 10,
      targetDate: new Date(Date.now() + 10 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      icon: '💻'
    }
  ],
  investments: [
    {
      id: 'inv-1',
      name: 'Nifty 50 Index Mutual Fund',
      type: 'equity_shares',
      costBasis: 15000,
      currentValue: 14000, // -₹1,000 unrealized change
      units: 125.5,
      purchaseDate: '2025-11-15',
      holdingMonths: 9
    }
  ],
  marketCondition: 'uncertain', // 'stable' | 'uncertain' | 'volatile'
  isDemoMode: true,
  theme: 'dark'
};

const STORAGE_KEY = 'wealth_optimizer_student_state_v1';

export function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_DATA;
    const parsed = JSON.parse(raw);
    return { ...DEMO_DATA, ...parsed };
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
    return DEMO_DATA;
  }
}

export function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}

export function clearSavedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear state', e);
  }
}
