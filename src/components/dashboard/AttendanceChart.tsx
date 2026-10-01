import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { attendanceChartData } from '../../data/mockData';
import { Users, Flame } from 'lucide-react';

export const AttendanceChart: React.FC = () => {
  return (
    <div className="bg-white rounded-md border border-cardBorder p-5 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-cardBorder/60">
          <div>
            <h3 className="text-base font-bold text-brandNavy">Attendance Overview</h3>
            <p className="text-xs text-mutedText mt-0.5">Weekly check-in distribution pattern</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              Peak: Saturday
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 bg-canvas rounded-sm border border-cardBorder/80">
            <span className="text-[11px] font-semibold text-mutedText uppercase tracking-wider">
              Avg Daily Attendance
            </span>
            <div className="text-xl font-bold text-brandNavy mt-0.5">186</div>
          </div>
          <div className="p-3 bg-canvas rounded-sm border border-cardBorder/80">
            <span className="text-[11px] font-semibold text-mutedText uppercase tracking-wider">
              Saturday Peak Count
            </span>
            <div className="text-xl font-bold text-actionBlue mt-0.5">224 Members</div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#636B83" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#636B83" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(242, 248, 255, 0.8)' }}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#C6C6DD',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#253053',
                }}
              />
              <Bar dataKey="count" fill="#253053" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pt-3 border-t border-cardBorder/60 flex items-center justify-between text-xs text-mutedText">
        <span>Weekend footfall is +28% higher</span>
        <span className="font-semibold text-actionBlue cursor-pointer hover:underline">
          Live Tracker →
        </span>
      </div>
    </div>
  );
};
