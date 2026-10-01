import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { SlideDrawer } from '../common/SlideDrawer';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Phone,
  Mail,
  Calendar,
  CreditCard,
  UserCheck,
  Ban,
  Edit2,
  FileText,
  Clock,
  Send,
  Trash2,
  Plus,
} from 'lucide-react';
import { EditMemberModal } from './EditMemberModal';
import { RecordPaymentModal } from '../payments/RecordPaymentModal';

export const MemberProfileDrawer: React.FC = () => {
  const {
    selectedMember,
    setSelectedMember,
    toggleSuspendMember,
    deleteMember,
    sendWhatsAppReminder,
    payments,
    attendance,
  } = useGym();

  const [activeTab, setActiveTab] = useState<'info' | 'payments' | 'attendance' | 'timeline'>('info');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  if (!selectedMember) return null;

  const memberPayments = payments.filter((p) => p.memberId === selectedMember.id);
  const memberAttendance = attendance.filter((a) => a.memberId === selectedMember.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">Active Member</Badge>;
      case 'Expiring':
        return <Badge variant="warning">Expiring Soon</Badge>;
      case 'Expired':
        return <Badge variant="danger">Expired</Badge>;
      case 'Suspended':
        return <Badge variant="danger">Access Suspended</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <>
      <SlideDrawer
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title="Member Profile Details"
      >
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-canvas p-5 rounded-md border border-cardBorder flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={selectedMember.avatarUrl}
                alt={selectedMember.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-actionBlue shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-brandNavy">{selectedMember.name}</h2>
                  {getStatusBadge(selectedMember.status)}
                </div>
                <p className="text-xs text-mutedText mt-0.5">
                  Member ID: <span className="font-bold text-actionBlue">{selectedMember.id}</span> • Joined {formatDate(selectedMember.joiningDate || selectedMember.startDate)}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-mutedText">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-actionBlue" />
                    +91 {selectedMember.phone}
                  </span>
                  {selectedMember.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-actionBlue" />
                      {selectedMember.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button
                variant="primary"
                size="sm"
                icon={<CreditCard className="w-3.5 h-3.5" />}
                onClick={() => setIsRecordPaymentOpen(true)}
              >
                Record Payment
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Edit2 className="w-3.5 h-3.5" />}
                onClick={() => setIsEditOpen(true)}
              >
                Edit
              </Button>
              <Button
                variant={selectedMember.status === 'Suspended' ? 'primary' : 'danger'}
                size="sm"
                icon={<Ban className="w-3.5 h-3.5" />}
                onClick={() => toggleSuspendMember(selectedMember.id)}
              >
                {selectedMember.status === 'Suspended' ? 'Restore' : 'Suspend'}
              </Button>
              <button
                onClick={() => sendWhatsAppReminder(selectedMember)}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-sm text-xs shadow-xs"
                title="Send WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-cardBorder text-xs font-semibold">
            {[
              { id: 'info', label: 'Membership & Personal' },
              { id: 'payments', label: `Payment History (${memberPayments.length})` },
              { id: 'attendance', label: `Attendance Logs (${selectedMember.attendanceCountThisMonth} days)` },
              { id: 'timeline', label: 'Timeline' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-4 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-actionBlue text-actionBlue'
                    : 'border-transparent text-mutedText hover:text-brandNavy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Personal & Plan Info */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Membership Plan Box */}
              <div className="bg-white p-4 rounded-md border border-cardBorder shadow-xs">
                <h4 className="text-xs font-semibold text-mutedText uppercase tracking-wider mb-3">
                  Current Membership Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[11px] text-mutedText">Duration Plan</span>
                    <p className="text-sm font-bold text-brandNavy">{selectedMember.planName}</p>
                    <p className="text-xs text-actionBlue font-semibold">{formatCurrency(selectedMember.planPrice)}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-mutedText">Joining / Start</span>
                    <p className="text-sm font-semibold text-brandNavy">{formatDate(selectedMember.startDate)}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-mutedText">Expiry Date</span>
                    <p className="text-sm font-semibold text-brandNavy">{formatDate(selectedMember.expiryDate)}</p>
                    <span className="text-[10px] text-mutedText">{selectedMember.daysRemaining} days remaining</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-mutedText">Payment Status</span>
                    <p className="mt-0.5">
                      {selectedMember.paymentStatus === 'Paid' ? (
                        <Badge variant="success" size="sm">Paid (Cash/Online)</Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          Due: {formatCurrency(selectedMember.dueAmount)}
                        </Badge>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white p-4 rounded-md border border-cardBorder shadow-xs">
                <h4 className="text-xs font-semibold text-mutedText uppercase tracking-wider mb-3">
                  Personal & Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-mutedText">Gender:</span>
                    <span className="ml-2 font-semibold text-brandNavy">{selectedMember.gender}</span>
                  </div>
                  <div>
                    <span className="text-mutedText">Emergency Contact:</span>
                    <span className="ml-2 font-semibold text-brandNavy">{selectedMember.emergencyContact || 'N/A'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-mutedText">Address:</span>
                    <p className="font-semibold text-brandNavy mt-0.5">{selectedMember.address || 'Chennai, Tamil Nadu'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-mutedText">Notes:</span>
                    <p className="font-semibold text-brandNavy mt-0.5 bg-canvas p-2.5 rounded-sm border border-cardBorder">
                      {selectedMember.notes || 'No notes added.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 flex items-center justify-between border-t border-cardBorder/60">
                <span className="text-xs text-mutedText">Permanently remove member profile from system</span>
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => deleteMember(selectedMember.id)}
                >
                  Delete Member
                </Button>
              </div>
            </div>
          )}

          {/* Tab 2: Payments History */}
          {activeTab === 'payments' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs font-semibold text-brandNavy">Recorded Transactions</span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsRecordPaymentOpen(true)}
                >
                  + Record Payment
                </Button>
              </div>

              {memberPayments.length > 0 ? (
                memberPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-3.5 bg-white rounded-md border border-cardBorder flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-brandNavy">{formatCurrency(pay.amount)}</span>
                        <Badge variant="success" size="sm">{pay.status}</Badge>
                      </div>
                      <p className="text-xs text-mutedText mt-0.5">
                        {pay.invoiceNumber} • Method: <span className="font-semibold text-brandNavy">{pay.method}</span>
                      </p>
                      <span className="text-[11px] text-mutedText">{pay.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-canvas rounded-md border border-dashed border-cardBorder text-xs text-mutedText">
                  No previous transactions found for this member.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Attendance Logs */}
          {activeTab === 'attendance' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-md border border-blue-200 text-xs text-actionBlue flex items-center justify-between">
                <span>Monthly Check-in Attendance</span>
                <span className="font-bold">{selectedMember.attendanceCountThisMonth} Sessions this Month</span>
              </div>

              {memberAttendance.length > 0 ? (
                memberAttendance.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 bg-white rounded-md border border-cardBorder flex items-center justify-between text-xs shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-full">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-brandNavy">{att.date}</h4>
                        <p className="text-mutedText">In: {att.checkInTime} {att.checkOutTime ? `• Out: ${att.checkOutTime}` : ''}</p>
                      </div>
                    </div>
                    <Badge variant={att.status === 'Inside' ? 'success' : 'neutral'} size="sm">
                      {att.status === 'Inside' ? 'Currently Inside' : att.duration}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-canvas rounded-md border border-dashed border-cardBorder text-xs text-mutedText">
                  No attendance records logged for today yet.
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Audit Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-actionBlue mt-1.5 ring-4 ring-blue-100" />
                <div>
                  <h4 className="font-semibold text-brandNavy">Membership Registered</h4>
                  <p className="text-mutedText mt-0.5">Enrolled into {selectedMember.planName} plan.</p>
                  <span className="text-[10px] text-mutedText">{selectedMember.joiningDate}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </SlideDrawer>

      <EditMemberModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        member={selectedMember}
      />

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        preselectedMemberId={selectedMember.id}
      />
    </>
  );
};
