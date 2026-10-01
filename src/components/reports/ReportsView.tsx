import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { StatCard } from '../common/StatCard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  dailyRevenueData,
  paymentMethodData,
  membershipSalesData,
  hourlyUsageData,
} from '../../data/mockData';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Users,
  Calendar,
  Download,
  Flame,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  UserPlus,
  RefreshCw,
  UserMinus,
  IndianRupee,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { stats, payments, showToast } = useGym();
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '6m' | '1y'>('30d');
  const [revenueGranularity, setRevenueGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handleExport = (type: 'CSV' | 'PDF') => {
    showToast('success', `Exporting ${type} Report`, `Comprehensive GymOS business analytics downloaded as ${type}.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Global Date Range Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-md border border-cardBorder shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-actionBlue" />
            <h1 className="text-2xl font-bold tracking-tight text-brandNavy">
              Reports & Business Analytics
            </h1>
          </div>
          <p className="text-sm text-mutedText mt-1">
            Track daily revenue, member retention cohorts, attendance peak hours, and plan sales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Filter Tabs */}
          <div className="flex items-center bg-canvas p-1 rounded-sm border border-cardBorder text-xs font-medium">
            {(['today', '7d', '30d', '6m', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-sm transition-all ${
                  dateRange === range
                    ? 'bg-white text-actionBlue font-bold shadow-xs'
                    : 'text-mutedText hover:text-brandNavy'
                }`}
              >
                {range === 'today' ? 'Today' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '6m' ? '6 Months' : '1 Year'}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<FileSpreadsheet className="w-3.5 h-3.5 text-actionBlue" />}
            onClick={() => handleExport('CSV')}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => handleExport('PDF')}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* 2. REVENUE SUMMARY (4 Top Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"
          value="₹18,500"
          trend={{ value: 8.4, isPositive: true, label: 'vs yesterday' }}
          icon={IndianRupee}
          iconBgColor="bg-blue-50"
          iconColor="text-actionBlue"
        />

        <StatCard
          title="This Week's Revenue"
          value="₹1,12,500"
          trend={{ value: 14.2, isPositive: true, label: 'vs last week' }}
          icon={TrendingUp}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
        />

        <StatCard
          title="This Month's Revenue"
          value="₹4,82,500"
          trend={{ value: 12.5, isPositive: true, label: 'vs target' }}
          icon={CreditCard}
          iconBgColor="bg-blue-50"
          iconColor="text-actionBlue"
        />

        <StatCard
          title="Pending Payments"
          value="₹42,000"
          subtitle="Awaiting member renewal"
          icon={Clock}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-700"
        />
      </div>

      {/* 3. REVENUE TREND (Line/Bar) & PAYMENT METHODS (Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-md border border-cardBorder p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cardBorder/60">
              <div>
                <h3 className="text-base font-bold text-brandNavy">Revenue Overview</h3>
                <p className="text-xs text-mutedText mt-0.5">Daily collection trend across the week (Peak: Saturday ₹28,000)</p>
              </div>

              <div className="flex items-center gap-1 bg-canvas p-1 rounded-sm border border-cardBorder text-xs font-medium">
                {(['daily', 'weekly', 'monthly'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setRevenueGranularity(g)}
                    className={`px-2.5 py-1 rounded-sm capitalize transition-colors ${
                      revenueGranularity === g
                        ? 'bg-white text-actionBlue font-bold shadow-xs'
                        : 'text-mutedText hover:text-brandNavy'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="repRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0000EE" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0000EE" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" stroke="#636B83" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#636B83"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#C6C6DD',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#253053',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0000EE"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#repRevGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-cardBorder/60 flex items-center justify-between text-xs text-mutedText">
            <span>Average Daily Collection: <strong>₹19,000 / day</strong></span>
            <span className="font-semibold text-actionBlue">Total: ₹1,12,500</span>
          </div>
        </div>

        {/* Payment Method Analytics (Donut) */}
        <div className="lg:col-span-1 bg-white rounded-md border border-cardBorder p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-cardBorder/60">
              <h3 className="text-base font-bold text-brandNavy">Payment Method Share</h3>
              <p className="text-xs text-mutedText mt-0.5">UPI dominates 52% of all transactions</p>
            </div>

            <div className="h-48 w-full mt-2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val}% (${name})`, 'Share']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#C6C6DD',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend List */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {paymentMethodData.map((item) => (
                <div key={item.name} className="p-2 bg-canvas rounded-sm border border-cardBorder flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-brandNavy">{item.name}</span>
                  </div>
                  <span className="font-bold text-brandNavy">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-cardBorder/60 text-xs text-center text-mutedText">
            Total Digital Payments: <strong>72% (UPI + Card + Online)</strong>
          </div>
        </div>
      </div>

      {/* 4. MEMBERSHIP SALES & PEAK HOURS HEATMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Sales */}
        <div className="bg-white rounded-md border border-cardBorder p-5 shadow-card">
          <div className="pb-3 border-b border-cardBorder/60 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-brandNavy">Membership Sales Breakdown</h3>
              <p className="text-xs text-mutedText mt-0.5">Enrolled members and revenue by duration plan</p>
            </div>
            <span className="text-xs font-bold text-actionBlue bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-200">
              122 Plans Sold
            </span>
          </div>

          <div className="space-y-4 mt-4">
            {membershipSalesData.map((item) => (
              <div key={item.plan} className="p-3.5 bg-canvas rounded-md border border-cardBorder space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-brandNavy">{item.plan}</span>
                    <span className="text-xs text-mutedText font-semibold">({item.price})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-actionBlue">{formatCurrency(item.revenue)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-mutedText">
                  <span>{item.members} members enrolled</span>
                  <span>{Math.round((item.revenue / 326000) * 100)}% of plan revenue</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-actionBlue h-full rounded-full"
                    style={{ width: `${(item.revenue / 120000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gym Peak Usage Hours (Heatmap / Bar) */}
        <div className="bg-white rounded-md border border-cardBorder p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-cardBorder/60 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-brandNavy">Hourly Gym Peak Usage</h3>
                <p className="text-xs text-mutedText mt-0.5">Footfall density by time of day</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                Peak: 6 PM – 8 PM
              </span>
            </div>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="time" stroke="#636B83" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#636B83" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    formatter={(value: any, name: any, item: any) => [`${value} Members (${item.payload.label})`, 'Attendance']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#C6C6DD',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#253053"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-cardBorder/60 text-xs text-mutedText flex items-center justify-between">
            <span>Morning Peak: <strong>6 AM – 8 AM</strong></span>
            <span>Evening Peak: <strong>6 PM – 8 PM</strong></span>
          </div>
        </div>
      </div>

      {/* 5. MEMBER ANALYTICS & RETENTION COHORTS */}
      <div className="bg-white p-6 rounded-md border border-cardBorder shadow-card">
        <h3 className="text-base font-bold text-brandNavy mb-1">Member Analytics & Renewal Cohorts</h3>
        <p className="text-xs text-mutedText mb-4">Lifecycle status of all 1,248 registered members.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-3.5 bg-canvas rounded-md border border-cardBorder text-center">
            <span className="text-[11px] font-semibold text-mutedText uppercase">Total Members</span>
            <div className="text-2xl font-bold text-brandNavy mt-1">1,248</div>
            <span className="text-[10px] text-emerald-600 font-semibold">+8.2% this mo</span>
          </div>

          <div className="p-3.5 bg-canvas rounded-md border border-cardBorder text-center">
            <span className="text-[11px] font-semibold text-mutedText uppercase">New Members</span>
            <div className="text-2xl font-bold text-actionBlue mt-1">86</div>
            <span className="text-[10px] text-mutedText">Enrolled in Sep</span>
          </div>

          <div className="p-3.5 bg-canvas rounded-md border border-cardBorder text-center">
            <span className="text-[11px] font-semibold text-mutedText uppercase">Active</span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">1,086</div>
            <span className="text-[10px] text-emerald-600 font-semibold">87% Active Rate</span>
          </div>

          <div className="p-3.5 bg-canvas rounded-md border border-cardBorder text-center">
            <span className="text-[11px] font-semibold text-mutedText uppercase">Renewals</span>
            <div className="text-2xl font-bold text-brandNavy mt-1">58</div>
            <span className="text-[10px] text-actionBlue font-semibold">66.7% Renewed</span>
          </div>

          <div className="p-3.5 bg-canvas rounded-md border border-cardBorder text-center">
            <span className="text-[11px] font-semibold text-mutedText uppercase">Expired</span>
            <div className="text-2xl font-bold text-amber-700 mt-1">74</div>
            <span className="text-[10px] text-amber-600 font-semibold">In Grace Period</span>
          </div>

          <div className="p-3.5 bg-canvas rounded-md border border-cardBorder text-center">
            <span className="text-[11px] font-semibold text-mutedText uppercase">Churned</span>
            <div className="text-2xl font-bold text-rose-700 mt-1">30</div>
            <span className="text-[10px] text-rose-600 font-semibold">2.4% Churn Rate</span>
          </div>
        </div>
      </div>

      {/* 6. TOP LEVEL RECENT TRANSACTIONS TABLE */}
      <div className="bg-white rounded-md border border-cardBorder shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-cardBorder/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-brandNavy">Recent Revenue Transactions</h3>
            <p className="text-xs text-mutedText mt-0.5">Real-time payment settlements ledger</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')}>
            Download Roster
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas/75 border-b border-cardBorder/80 text-[11px] font-semibold uppercase tracking-wider text-mutedText">
                <th className="py-3 px-4 sm:px-6">Date</th>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Plan Duration</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 sm:px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardBorder/50 text-sm">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-canvas/60">
                  <td className="py-3 px-4 sm:px-6 text-xs text-mutedText">{p.date}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-brandNavy">{p.memberName}</span>
                    <span className="text-xs text-mutedText block">{p.memberId}</span>
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-brandNavy">{p.planName}</td>
                  <td className="py-3 px-4 text-xs font-bold text-brandNavy">{formatCurrency(p.amount)}</td>
                  <td className="py-3 px-4 text-xs">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-brandNavy border border-slate-200">
                      {p.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <Badge variant={p.status === 'Paid' ? 'success' : 'warning'} size="sm">
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
