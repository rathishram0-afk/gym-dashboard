import React, { useState, useEffect } from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { MembersView } from './components/members/MembersView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { PaymentsView } from './components/payments/PaymentsView';
import { PlansView } from './components/plans/PlansView';
import { AutomationView } from './components/automation/AutomationView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { MemberPublicCheckoutView } from './components/checkout/MemberPublicCheckoutView';

const MainRouter: React.FC = () => {
  const { activeNav } = useGym();
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname + window.location.search + window.location.hash);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.search + window.location.hash);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Check if current route is /checkout/<token> or #/checkout/<token> or ?checkout=<token>
  let checkoutToken: string | null = null;
  const path = window.location.pathname;
  if (path.startsWith('/checkout/')) {
    checkoutToken = path.replace('/checkout/', '').split('/')[0].split('?')[0];
  } else if (window.location.hash.startsWith('#/checkout/')) {
    checkoutToken = window.location.hash.replace('#/checkout/', '').split('?')[0];
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('checkout')) {
      checkoutToken = urlParams.get('checkout');
    }
  }

  // If on checkout page, render mobile member public checkout screen (no admin sidebar/topnav)
  if (checkoutToken) {
    return <MemberPublicCheckoutView token={checkoutToken} />;
  }

  // Otherwise render Admin Dashboard Layout
  const renderActiveScreen = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardView />;
      case 'members':
        return <MembersView />;
      case 'attendance':
        return <AttendanceView />;
      case 'payments':
        return <PaymentsView />;
      case 'plans':
        return <PlansView />;
      case 'automation':
        return <AutomationView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'notifications':
        return <DashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return <AppLayout>{renderActiveScreen()}</AppLayout>;
};

export function App() {
  return (
    <GymProvider>
      <MainRouter />
    </GymProvider>
  );
}

export default App;
