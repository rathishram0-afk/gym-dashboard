import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { revenueChartData } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, Calendar } from 'lucide-react';

export const RevenueChart: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '6m' | '1y'>('6m');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-cardBorder rounded-sm shadow-md">
          <p className="text-xs font-semibold text-brandNavy">{label} 2026</p>
          <p className="text-sm font-bold text-actionBlue mt-1">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-[11px] text-mutedText">
            Members: {payload[0].payload.members}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-md border border-cardBorder p-5 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cardBorder/60">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-brandNavy">Revenue Overview</h3>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <TrendingUp className="w-3 h-3" />
                +12.5% vs last month
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-bold text-brandNavy">₹4,82,500</span>
              <span className="text-xs text-mutedText">Sep Monthly Revenue</span>
            </div>
          </div>

          {/* Time Filter Tabs */}
          <div className="flex items-center bg-canvas p-1 rounded-sm border border-cardBorder text-xs font-medium">
            {(['7d', '30d', '6m', '1y'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 rounded-sm transition-all ${
                  timeFilter === filter
                    ? 'bg-white text-actionBlue font-semibold shadow-xs'
                    : 'text-mutedText hover:text-brandNavy'
                }`}
              >
                {filter === '7d' ? '7 Days' : filter === '30d' ? '30 Days' : filter === '6m' ? '6 Months' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0000EE" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0000EE" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#636B83" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#636B83"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0000EE"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pt-3 border-t border-cardBorder/60 flex items-center justify-between text-xs text-mutedText">
        <span>Highest collection in Sep (₹4.82L)</span>
        <span className="font-semibold text-actionBlue cursor-pointer hover:underline">
          View Detailed Ledger →
        </span>
      </div>
    </div>
  );
};
