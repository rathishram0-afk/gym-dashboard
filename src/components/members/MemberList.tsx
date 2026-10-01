import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Ban,
  Trash2,
  Send,
  MoreVertical,
  Download,
  Plus,
} from 'lucide-react';

interface MemberListProps {
  onOpenAddMember: () => void;
}

export const MemberList: React.FC<MemberListProps> = ({ onOpenAddMember }) => {
  const {
    members,
    setSelectedMember,
    toggleSuspendMember,
    deleteMember,
    sendWhatsAppReminder,
  } = useGym();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Expiring' | 'Expired' | 'Overdue'>('All');

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'All') return true;
    if (statusFilter === 'Active') return m.status === 'Active';
    if (statusFilter === 'Expiring') return m.status === 'Expiring' || m.daysRemaining <= 7;
    if (statusFilter === 'Expired') return m.status === 'Expired';
    if (statusFilter === 'Overdue') return m.paymentStatus === 'Overdue' || m.dueAmount > 0;
    return true;
  });

  const getStatusBadge = (member: any) => {
    if (member.status === 'Suspended') return <Badge variant="danger">Suspended</Badge>;
    if (member.status === 'Expired') return <Badge variant="danger">Expired</Badge>;
    if (member.status === 'Expiring' || member.daysRemaining <= 7)
      return <Badge variant="warning">{member.daysRemaining} days left</Badge>;
    return <Badge variant="success">Active</Badge>;
  };

  return (
    <div className="bg-white rounded-md border border-cardBorder shadow-card overflow-hidden">
      {/* Search & Filter Header Bar */}
      <div className="p-4 sm:p-5 border-b border-cardBorder/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mutedText" />
          <input
            type="text"
            placeholder="Search by member name, phone or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy placeholder-mutedText focus:outline-none focus:border-actionBlue"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-canvas p-1 rounded-sm border border-cardBorder text-xs font-medium">
          {(['All', 'Active', 'Expiring', 'Expired', 'Overdue'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-sm transition-all ${
                statusFilter === tab
                  ? 'bg-white text-actionBlue font-semibold shadow-xs'
                  : 'text-mutedText hover:text-brandNavy'
              }`}
            >
              {tab === 'Overdue' ? 'Payment Due' : tab}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => alert('Exporting member roster as CSV...')}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={onOpenAddMember}
          >
            + Add Member
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-canvas/75 border-b border-cardBorder/80 text-[11px] font-semibold uppercase tracking-wider text-mutedText">
              <th className="py-3.5 px-4 sm:px-6">Member</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Membership Plan</th>
              <th className="py-3.5 px-4">Validity</th>
              <th className="py-3.5 px-4">Payment Status</th>
              <th className="py-3.5 px-4">Attendance</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cardBorder/50 text-sm">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-canvas/60 transition-colors group"
                >
                  {/* Member info */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => setSelectedMember(member)}
                    >
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-cardBorder flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-semibold text-brandNavy hover:text-actionBlue transition-colors">
                          {member.name}
                        </h4>
                        <span className="text-xs text-mutedText font-medium">{member.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4 text-xs text-brandNavy font-medium">
                    <div>+91 {member.phone}</div>
                    <div className="text-mutedText text-[11px] truncate max-w-[150px]">
                      {member.email || '—'}
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-xs text-brandNavy bg-slate-100 px-2.5 py-1 rounded-sm border border-slate-200">
                      {member.planName}
                    </span>
                  </td>

                  {/* Validity */}
                  <td className="py-3.5 px-4 text-xs">
                    <div className="font-semibold text-brandNavy">{formatDate(member.expiryDate)}</div>
                    <div className="mt-1">{getStatusBadge(member)}</div>
                  </td>

                  {/* Payment Status */}
                  <td className="py-3.5 px-4 text-xs">
                    {member.paymentStatus === 'Paid' ? (
                      <Badge variant="success">Settled</Badge>
                    ) : (
                      <Badge variant="danger">
                        Due: {formatCurrency(member.dueAmount || 1500)}
                      </Badge>
                    )}
                  </td>

                  {/* Attendance */}
                  <td className="py-3.5 px-4 text-xs">
                    <span className="font-semibold text-brandNavy">
                      {member.attendanceCountThisMonth} days
                    </span>
                    <div className="text-[11px] text-mutedText">this month</div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedMember(member)}
                        title="View Full Profile"
                        className="p-1.5 text-mutedText hover:text-actionBlue hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => sendWhatsAppReminder(member)}
                        title="WhatsApp Followup"
                        className="p-1.5 text-mutedText hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleSuspendMember(member.id)}
                        title={member.status === 'Suspended' ? 'Unsuspend' : 'Suspend Access'}
                        className="p-1.5 text-mutedText hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-mutedText text-sm">
                  No gym members found matching the selected filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
