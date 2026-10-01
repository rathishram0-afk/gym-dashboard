import React from 'react';
import { useGym } from '../../context/GymContext';
import {
  Activity,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export const RecentActivityCard: React.FC = () => {
  const { activities } = useGym();

  const getIcon = (type: string) => {
    switch (type) {
      case 'check_in':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-actionBlue" />;
      case 'renewal':
        return <RefreshCw className="w-4 h-4 text-emerald-600" />;
      case 'expired':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Activity className="w-4 h-4 text-mutedText" />;
    }
  };

  return (
    <div className="bg-white rounded-md border border-cardBorder p-5 shadow-card">
      <div className="flex items-center justify-between pb-3 border-b border-cardBorder/60">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-actionBlue" />
          <h3 className="text-base font-bold text-brandNavy">Recent Activity</h3>
        </div>
        <span className="text-xs text-mutedText">Live Feed</span>
      </div>

      <div className="space-y-4 mt-3">
        {activities.slice(0, 5).map((act) => (
          <div key={act.id} className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-canvas border border-cardBorder mt-0.5">
              {getIcon(act.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-brandNavy truncate">{act.title}</h4>
              <p className="text-[11px] text-mutedText mt-0.5">{act.description}</p>
            </div>
            <span className="text-[10px] text-mutedText whitespace-nowrap">{act.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
