import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { LogOut, Calendar, Search } from 'lucide-react';

export const AttendanceTable: React.FC = () => {
  const { attendance, adminOverrideCheckOut } = useGym();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-09-27');

  const filteredLogs = attendance.filter(
    (item) =>
      item.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.memberPhone.includes(searchTerm) ||
      item.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-md border border-cardBorder shadow-card overflow-hidden">
      {/* Header controls */}
      <div className="p-4 sm:p-5 border-b border-cardBorder/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mutedText" />
          <input
            type="text"
            placeholder="Search today's check-in log..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy placeholder-mutedText focus:outline-none focus:border-actionBlue"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-canvas px-3 py-1.5 rounded-sm border border-cardBorder text-xs text-brandNavy font-medium">
            <Calendar className="w-3.5 h-3.5 text-actionBlue" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-0 focus:outline-none text-brandNavy cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-canvas/75 border-b border-cardBorder/80 text-[11px] font-semibold uppercase tracking-wider text-mutedText">
              <th className="py-3.5 px-4 sm:px-6">Member</th>
              <th className="py-3.5 px-4">Phone</th>
              <th className="py-3.5 px-4">Check-In</th>
              <th className="py-3.5 px-4">Check-Out</th>
              <th className="py-3.5 px-4">Duration</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cardBorder/50 text-sm">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-canvas/60 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={log.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={log.memberName}
                        className="w-9 h-9 rounded-full object-cover border border-cardBorder"
                      />
                      <div>
                        <h4 className="font-semibold text-brandNavy">{log.memberName}</h4>
                        <span className="text-xs text-mutedText">{log.memberId}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs font-medium text-brandNavy">
                    +91 {log.memberPhone}
                  </td>

                  <td className="py-3.5 px-4 text-xs font-semibold text-actionBlue">
                    {log.checkInTime}
                  </td>

                  <td className="py-3.5 px-4 text-xs font-medium text-brandNavy">
                    {log.checkOutTime || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-mutedText">
                    {log.duration || 'Active Session'}
                  </td>

                  <td className="py-3.5 px-4">
                    {log.status === 'Inside' ? (
                      <Badge variant="success">Currently Inside</Badge>
                    ) : (
                      <Badge variant="neutral">Completed</Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    {log.status === 'Inside' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<LogOut className="w-3.5 h-3.5" />}
                        onClick={() => adminOverrideCheckOut(log.id)}
                      >
                        Check Out
                      </Button>
                    ) : (
                      <span className="text-xs text-mutedText font-medium">Logged Out</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-mutedText text-sm">
                  No attendance records found for the selected query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
