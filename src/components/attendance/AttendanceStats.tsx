import React from 'react';
import { useGym } from '../../context/GymContext';
import { StatCard } from '../common/StatCard';
import { Users, LogIn, LogOut, Activity } from 'lucide-react';

export const AttendanceStats: React.FC = () => {
  const { stats } = useGym();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Today's Total Attendance"
        value={stats.todayAttendance}
        subtitle="Across all morning & evening batches"
        icon={Users}
        iconBgColor="bg-blue-50"
        iconColor="text-actionBlue"
      />
      <StatCard
        title="Checked In"
        value={stats.todayCheckedIn}
        subtitle="Turnstile scans recorded"
        icon={LogIn}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-700"
      />
      <StatCard
        title="Checked Out"
        value={stats.todayCheckedOut}
        subtitle="Completed workout sessions"
        icon={LogOut}
        iconBgColor="bg-slate-100"
        iconColor="text-brandNavy"
      />
      <StatCard
        title="Currently Inside"
        value={stats.currentlyInside}
        subtitle="Active on gym floor right now"
        icon={Activity}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
      />
    </div>
  );
};
