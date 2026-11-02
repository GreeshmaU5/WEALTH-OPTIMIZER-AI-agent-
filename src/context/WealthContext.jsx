import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { loadSavedState, persistState, DEMO_DATA } from '../utils/storage';
import {
  calculateCashFlow,
  calculateGoalMetrics,
  calculateDebtMetrics,
  calculateInvestmentMetrics,
  calculateFinancialHealth,
  formatCurrency
} from '../engine/calculations';
import { generatePersonalizedActionPlan } from '../engine/recommendations';
import { evaluateSmartAlerts } from '../engine/alertsEngine';

const WealthContext = createContext(null);

export function WealthProvider({ children }) {
  const [state, setState] = useState(() => loadSavedState());
  const [completedActions, setCompletedActions] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    persistState(state);
  }, [state]);

  // Calculations
  const cashFlowMetrics = useMemo(() => {
    return calculateCashFlow(state.cashFlow.monthlyIncome, state.cashFlow.monthlyExpenses);
  }, [state.cashFlow]);

  const debtMetrics = useMemo(() => {
    return calculateDebtMetrics(state.debts, state.cashFlow.monthlyIncome);
  }, [state.debts, state.cashFlow.monthlyIncome]);

  const goalsMetrics = useMemo(() => {
    return state.goals.map((g) => calculateGoalMetrics(g, cashFlowMetrics.available));
  }, [state.goals, cashFlowMetrics.available]);

  const investmentsMetrics = useMemo(() => {
    return calculateInvestmentMetrics(state.investments);
  }, [state.investments]);

  const netWorth = useMemo(() => {
    const assets = Number(state.savings || 0) + Number(investmentsMetrics.currentValue || 0);
    return assets - Number(debtMetrics.totalDebt || 0);
  }, [state.savings, investmentsMetrics.currentValue, debtMetrics.totalDebt]);

  const financialHealth = useMemo(() => {
    return calculateFinancialHealth({
      monthlyIncome: state.cashFlow.monthlyIncome,
      monthlyExpenses: state.cashFlow.monthlyExpenses,
      savings: state.savings,
      totalDebt: debtMetrics.totalDebt,
      totalMonthlyDebt: debtMetrics.totalMonthlyPayment,
      goals: state.goals
    });
  }, [state.cashFlow, state.savings, debtMetrics, state.goals]);

  const actionPlan = useMemo(() => {
    return generatePersonalizedActionPlan({
      monthlyIncome: state.cashFlow.monthlyIncome,
      monthlyExpenses: state.cashFlow.monthlyExpenses,
      savings: state.savings,
      debts: state.debts,
      goals: state.goals,
      investments: state.investments,
      marketCondition: state.marketCondition
    });
  }, [state.cashFlow, state.savings, state.debts, state.goals, state.investments, state.marketCondition]);

  const alerts = useMemo(() => {
    return evaluateSmartAlerts({
      cashFlow: cashFlowMetrics,
      debtMetrics,
      investmentsMetrics,
      goals: state.goals,
      marketCondition: state.marketCondition,
      debts: state.debts
    });
  }, [cashFlowMetrics, debtMetrics, investmentsMetrics, state.goals, state.marketCondition, state.debts]);

  // Mutators
  const setCurrency = (cur) => {
    setState((prev) => ({ ...prev, currency: cur }));
  };

  const updateCashFlow = (updates) => {
    setState((prev) => ({
      ...prev,
      cashFlow: { ...prev.cashFlow, ...updates }
    }));
  };

  const updateSavings = (amount) => {
    setState((prev) => ({ ...prev, savings: Math.max(0, Number(amount) || 0) }));
  };

  const addDebt = (debt) => {
    setState((prev) => ({
      ...prev,
      debts: [...prev.debts, { ...debt, id: debt.id || 'debt-' + Date.now() }]
    }));
  };

  const updateDebt = (id, updated) => {
    setState((prev) => ({
      ...prev,
      debts: prev.debts.map((d) => (d.id === id ? { ...d, ...updated } : d))
    }));
  };

  const removeDebt = (id) => {
    setState((prev) => ({
      ...prev,
      debts: prev.debts.filter((d) => d.id !== id)
    }));
  };

  const addGoal = (goal) => {
    setState((prev) => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: goal.id || 'goal-' + Date.now() }]
    }));
  };

  const updateGoal = (id, updated) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updated } : g))
    }));
  };

  const removeGoal = (id) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id)
    }));
  };

  const addInvestment = (inv) => {
    setState((prev) => ({
      ...prev,
      investments: [...prev.investments, { ...inv, id: inv.id || 'inv-' + Date.now() }]
    }));
  };

  const updateInvestment = (id, updated) => {
    setState((prev) => ({
      ...prev,
      investments: prev.investments.map((i) => (i.id === id ? { ...i, ...updated } : i))
    }));
  };

  const removeInvestment = (id) => {
    setState((prev) => ({
      ...prev,
      investments: prev.investments.filter((i) => i.id !== id)
    }));
  };

  const setMarketCondition = (cond) => {
    setState((prev) => ({ ...prev, marketCondition: cond }));
  };

  const toggleActionComplete = (index) => {
    setCompletedActions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const resetToDemo = () => {
    setState(DEMO_DATA);
    setCompletedActions({});
  };

  const startFresh = () => {
    setState({
      profile: { name: 'Student', educationLevel: 'College Student', primaryIncomeSource: 'Allowance' },
      currency: 'INR',
      cashFlow: {
        monthlyIncome: 0,
        incomeSources: [],
        monthlyExpenses: 0,
        expenseBreakdown: []
      },
      savings: 0,
      debts: [],
      goals: [],
      investments: [],
      marketCondition: 'stable',
      isDemoMode: false,
      theme: 'dark'
    });
    setCompletedActions({});
    setShowOnboarding(true);
  };

  const value = {
    state,
    currency: state.currency,
    formatMoney: (amount) => formatCurrency(amount, state.currency),
    cashFlowMetrics,
    debtMetrics,
    goalsMetrics,
    investmentsMetrics,
    netWorth,
    financialHealth,
    actionPlan,
    alerts,
    completedActions,
    activeTab,
    showOnboarding,
    setActiveTab,
    setShowOnboarding,
    setCurrency,
    updateCashFlow,
    updateSavings,
    addDebt,
    updateDebt,
    removeDebt,
    addGoal,
    updateGoal,
    removeGoal,
    addInvestment,
    updateInvestment,
    removeInvestment,
    setMarketCondition,
    toggleActionComplete,
    resetToDemo,
    startFresh
  };

  return <WealthContext.Provider value={value}>{children}</WealthContext.Provider>;
}

export function useWealth() {
  const context = useContext(WealthContext);
  if (!context) throw new Error('useWealth must be used within WealthProvider');
  return context;
}
