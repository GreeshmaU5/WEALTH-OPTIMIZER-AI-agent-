import React from 'react';
import { useWealth } from '../../context/WealthContext';
import { LayoutDashboard, Wallet, CreditCard, Target, TrendingUp, ReceiptText, Bot } from 'lucide-react';

export function Navbar() {
  const { activeTab, setActiveTab, debtMetrics, goalsMetrics, alerts } = useWealth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { id: 'money', label: 'Money', icon: <Wallet size={17} /> },
    {
      id: 'debt',
      label: 'Debt Optimizer',
      icon: <CreditCard size={17} />,
      badge: debtMetrics.totalDebt > 0 ? (debtMetrics.status === 'priority' ? '🔴' : '🟡') : null
    },
    {
      id: 'goals',
      label: 'Goals',
      icon: <Target size={17} />,
      count: goalsMetrics.length
    },
    { id: 'investments', label: 'Investments & Risk', icon: <TrendingUp size={17} /> },
    { id: 'tax', label: 'Tax Impact', icon: <ReceiptText size={17} /> },
    {
      id: 'coach',
      label: 'Ask Wealth Coach',
      icon: <Bot size={17} style={{ color: 'var(--primary-light)' }} />,
      isCoach: true
    }
  ];

  return (
    <nav className="nav-bar-wrapper">
      <div className="nav-bar-inner">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && <span style={{ fontSize: '0.7rem' }}>{item.badge}</span>}
              {item.count !== undefined && item.count > 0 && (
                <span className="badge-count">{item.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
