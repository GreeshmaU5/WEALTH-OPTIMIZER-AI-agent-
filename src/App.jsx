import React from 'react';
import { WealthProvider, useWealth } from './context/WealthContext';
import { Header } from './components/common/Header';
import { Navbar } from './components/common/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { MoneyView } from './components/money/MoneyView';
import { DebtView } from './components/debt/DebtView';
import { GoalsView } from './components/goals/GoalsView';
import { InvestmentsView } from './components/investments/InvestmentsView';
import { TaxCheckerView } from './components/tax/TaxCheckerView';
import { CoachView } from './components/coach/CoachView';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

function MainLayout() {
  const { activeTab } = useWealth();

  return (
    <div className="app-container">
      <Header />
      <Navbar />

      <main className="main-content">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'money' && <MoneyView />}
        {activeTab === 'debt' && <DebtView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'investments' && <InvestmentsView />}
        {activeTab === 'tax' && <TaxCheckerView />}
        {activeTab === 'coach' && <CoachView />}
      </main>

      {/* Progressive Onboarding Modal */}
      <OnboardingModal />

      {/* Student Educational Disclaimer Footer */}
      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '24px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', background: 'rgba(10, 14, 23, 0.95)' }}>
        <p>
          🌱 <strong>Wealth Optimizer</strong> — AI Financial Wellness & Wealth-Planning Assistant for Students.
        </p>
        <p style={{ marginTop: '4px', maxWidth: '800px', margin: '4px auto 0 auto', opacity: 0.8 }}>
          Educational tool designed to build financial literacy and sound habits. Not a registered investment advisor, credit rating agency, or tax consultancy. Always verify significant decisions with official guidelines.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WealthProvider>
      <MainLayout />
    </WealthProvider>
  );
}
