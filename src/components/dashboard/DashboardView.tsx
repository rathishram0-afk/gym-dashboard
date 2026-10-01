import React from 'react';
import { useGym } from '../../context/GymContext';
import { StatCard } from '../common/StatCard';
import { RevenueChart } from './RevenueChart';
import { AttendanceChart } from './AttendanceChart';
import { ExpiringMembersCard } from './ExpiringMembersCard';
import { OverdueFollowupCard } from './OverdueFollowupCard';
import { RecentActivityCard } from './RecentActivityCard';
import { QuickAttendanceWidget } from './QuickAttendanceWidget';
import {
  Users,
  UserCheck,
  Clock,
  AlertOctagon,
  Calendar,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { stats } = useGym();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-md border border-cardBorder shadow-card">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandNavy">
            Good morning, Admin 👋
          </h1>
          <p className="text-sm text-mutedText mt-1">
            Here's what's happening with your gym operations at Velachery branch today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-canvas border border-cardBorder rounded-sm text-xs font-medium text-brandNavy">
            <Calendar className="w-3.5 h-3.5 text-actionBlue" />
            <span>Today: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={stats.totalMembers.toLocaleString('en-IN')}
          trend={{ value: stats.totalMembersGrowth, isPositive: true, label: 'this month' }}
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-actionBlue"
        />

        <StatCard
          title="Active Members"
          value={stats.activeMembers.toLocaleString('en-IN')}
          subtitle={`${stats.activeMembersRate}% active rate`}
          icon={UserCheck}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
        />

        <StatCard
          title="Expiring Soon"
          value={stats.expiringSoonCount}
          subtitle="Within next 7 days"
          icon={Clock}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-700"
        />

        <StatCard
          title="Overdue Payments"
          value={stats.overdueCount}
          subtitle="Needs immediate attention"
          icon={AlertOctagon}
          iconBgColor="bg-rose-50"
          iconColor="text-rose-700"
        />
      </div>

      {/* Quick Attendance Widget & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickAttendanceWidget />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityCard />
        </div>
      </div>

      {/* Analytics Section: Revenue + Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <AttendanceChart />
        </div>
      </div>

      {/* Operational Follow-ups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpiringMembersCard />
        <OverdueFollowupCard />
      </div>
    </div>
  );
};
