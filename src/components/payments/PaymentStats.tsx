import React from 'react';
import { useGym } from '../../context/GymContext';
import { StatCard } from '../common/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { IndianRupee, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

export const PaymentStats: React.FC = () => {
  const { stats } = useGym();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Today's Collection"
        value={formatCurrency(stats.todayCollection)}
        subtitle="14 transactions processed"
        icon={IndianRupee}
        iconBgColor="bg-blue-50"
        iconColor="text-actionBlue"
      />
      <StatCard
        title="This Month Collection"
        value={formatCurrency(stats.monthRevenue)}
        trend={{ value: stats.monthRevenueGrowth, isPositive: true, label: 'vs target' }}
        icon={TrendingUp}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-700"
      />
      <StatCard
        title="Pending Invoices"
        value={formatCurrency(stats.pendingCollection)}
        subtitle="Awaiting online confirmation"
        icon={Clock}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-700"
      />
      <StatCard
        title="Overdue Dues"
        value={formatCurrency(stats.overdueCollection)}
        subtitle="18 members delayed"
        icon={AlertTriangle}
        iconBgColor="bg-rose-50"
        iconColor="text-rose-700"
      />
    </div>
  );
};
