import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconBgColor = 'bg-blue-50',
  iconColor = 'text-actionBlue',
}) => {
  return (
    <div className="bg-white rounded-md border border-cardBorder p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-mutedText uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-sm ${iconBgColor} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl lg:text-3xl font-bold text-brandNavy tracking-tight">{value}</h3>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {trend.value}%
          </span>
        )}
        <span className="text-mutedText">{subtitle || (trend ? trend.label : '')}</span>
      </div>
    </div>
  );
};
