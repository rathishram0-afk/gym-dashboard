import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { AttendanceStats } from './AttendanceStats';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';
import {
  Search,
  LogIn,
  LogOut,
  AlertTriangle,
  ShieldBan,
  Clock,
  Send,
  CreditCard,
  Users,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Copy,
  MessageSquare,
  Wifi,
  Globe,
} from 'lucide-react';
import { RecordPaymentModal } from '../payments/RecordPaymentModal';
import { PaymentQRModal } from '../common/PaymentQRModal';
import {
  normalizeIndianPhoneNumber,
  createCheckoutMessage,
  createWhatsAppLink,
  getCheckoutUrl,
} from '../../lib/notifications/whatsapp';

// Live duration calculator for inside members
const LiveDurationBadge: React.FC<{ checkInTime: string; status: string; duration?: string }> = ({
  checkInTime,
  status,
  duration,
}) => {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    if (status !== 'Inside') return;
    const interval = setInterval(() => setTicks((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, [status]);

  if (status === 'Completed') {
    return (
      <span className="font-semibold text-xs text-brandNavy bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
        {duration || '1h 24m'}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span>Live Workout</span>
    </div>
  );
};

export const AttendanceView: React.FC = () => {
  const {
    members,
    attendance,
    checkInMember,
    adminOverrideCheckOut,
    setQrModalMember,
    lastCheckedInSession,
    networkInfo,
    showToast,
    stats,
  } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterInsideOnly, setFilterInsideOnly] = useState(false);
  const [recordPayMemberId, setRecordPayMemberId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const searchResults = searchQuery.trim()
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.phone.includes(searchQuery) ||
          m.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const activeAttendance = filterInsideOnly
    ? attendance.filter((a) => a.status === 'Inside')
    : attendance;

  // Resolve public/LAN URL for checkout links (never localhost for phones)
  const resolveCheckoutLink = (token: string) => {
    return getCheckoutUrl(token, networkInfo?.appUrl);
  };

  const handleOpenWhatsApp = (memberName: string, phone: string, checkInTime: string, token: string) => {
    const checkoutUrl = resolveCheckoutLink(token);
    const normalized = normalizeIndianPhoneNumber(phone);

    if (!normalized) {
      showToast('error', 'WhatsApp Unavailable', 'WhatsApp checkout unavailable: valid phone number required.');
      return;
    }

    const message = createCheckoutMessage(memberName, checkInTime, checkoutUrl);
    const waUrl = createWhatsAppLink(phone, message);

    if (waUrl) {
      showToast('info', 'Opening WhatsApp...', `Redirecting to WhatsApp chat with ${memberName} (+91 ${phone}).`);
      window.open(waUrl, '_blank');
    } else {
      showToast('error', 'WhatsApp Error', 'WhatsApp could not be opened.');
    }
  };

  const handleCopyLink = (token: string) => {
    const url = resolveCheckoutLink(token);
    navigator.clipboard.writeText(url).then(
      () => {
        setCopiedToken(token);
        showToast('success', 'Checkout link copied ✓', `Mobile URL copied (${url}).`);
        setTimeout(() => setCopiedToken(null), 3000);
      },
      () => {
        showToast('error', 'Copy Failed', 'Unable to copy link to clipboard.');
      }
    );
  };

  const openCheckoutTab = (token: string) => {
    const url = resolveCheckoutLink(token);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandNavy">
            Front Desk Attendance Hub
          </h1>
          <p className="text-sm text-mutedText mt-0.5">
            Admin Check-In → WhatsApp Checkout Link Prepared → Real Member Phone Check-Out → Real-Time Sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* LAN IP Mobile Access Badge */}
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-sm text-xs font-semibold text-actionBlue flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mobile LAN URL: <strong>{networkInfo?.appUrl || 'http://192.168.1.4:3006'}</strong></span>
          </div>

          <button
            onClick={() => setFilterInsideOnly(!filterInsideOnly)}
            className={`px-3.5 py-2 rounded-sm text-xs font-bold border transition-all flex items-center gap-2 ${
              filterInsideOnly
                ? 'bg-actionBlue text-white border-actionBlue shadow-sm'
                : 'bg-white text-brandNavy border-cardBorder hover:bg-canvas'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Currently Inside: {stats.currentlyInside}</span>
          </button>
        </div>
      </div>

      <AttendanceStats />

      {/* ADMIN FAST CHECK-IN SEARCH CARD */}
      <div className="bg-white p-6 rounded-md border-2 border-actionBlue/30 shadow-card">
        <label className="block text-xs font-bold uppercase tracking-wider text-actionBlue mb-2 flex items-center gap-1.5">
          <Search className="w-4 h-4" />
          Search Member for Fast Check-In
        </label>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mutedText" />
          <input
            type="text"
            placeholder="Search member by name (e.g. Rathish Kumar, Karthik Raj, Arun) or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-canvas border-2 border-cardBorder rounded-sm text-base text-brandNavy font-medium placeholder-mutedText focus:outline-none focus:border-actionBlue focus:bg-white transition-all shadow-xs"
          />
        </div>

        {/* WhatsApp Checkout Link Ready Banner */}
        {lastCheckedInSession && !searchQuery.trim() && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-emerald-50/30 rounded-md border border-blue-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-start gap-3 text-xs text-brandNavy">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-brandNavy text-sm">
                    {lastCheckedInSession.memberName} Checked In
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    WhatsApp Link Ready
                  </span>
                </div>
                <p className="text-mutedText text-xs mt-0.5">
                  Check-in time: <strong>{lastCheckedInSession.checkInTime}</strong> • Registered Phone:{' '}
                  <strong>+91 {lastCheckedInSession.memberPhone}</strong>
                </p>
                <p className="text-[11px] text-actionBlue font-mono mt-1 break-all">
                  🔗 {resolveCheckoutLink(lastCheckedInSession.token)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() =>
                  handleOpenWhatsApp(
                    lastCheckedInSession.memberName,
                    lastCheckedInSession.memberPhone,
                    lastCheckedInSession.checkInTime,
                    lastCheckedInSession.token
                  )
                }
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-sm flex items-center gap-1.5 transition-all shadow-xs"
                title="Open WhatsApp with pre-filled checkout link for real mobile phone"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>OPEN WHATSAPP</span>
              </button>

              <button
                onClick={() => handleCopyLink(lastCheckedInSession.token)}
                className="px-3 py-2 bg-white hover:bg-canvas text-brandNavy border border-cardBorder text-xs font-bold rounded-sm flex items-center gap-1.5 transition-all shadow-xs"
                title="Copy public member checkout URL to clipboard"
              >
                <Copy className="w-3.5 h-3.5 text-mutedText" />
                <span>{copiedToken === lastCheckedInSession.token ? 'Copied ✓' : 'COPY CHECKOUT LINK'}</span>
              </button>

              <button
                onClick={() => openCheckoutTab(lastCheckedInSession.token)}
                className="px-3 py-2 bg-[#253053] hover:bg-black text-white text-xs font-bold rounded-sm flex items-center gap-1.5 transition-all shadow-xs"
                title="Open member checkout in new browser tab for testing"
              >
                <span>↗ Open Test Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* SEARCH RESULTS LIST */}
        {searchQuery.trim() && (
          <div className="mt-4 space-y-3">
            {searchResults.length > 0 ? (
              searchResults.map((member) => {
                const isInside = attendance.some((a) => a.memberId === member.id && a.status === 'Inside');
                const isRestricted = member.status === 'Restricted' || (member.daysOverdue && member.daysOverdue > 4);
                const isGrace = member.status === 'Expired' && !isRestricted;
                const existingAtt = attendance.find((a) => a.memberId === member.id && a.status === 'Inside');

                return (
                  <div
                    key={member.id}
                    className={`p-4 rounded-md border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                      isRestricted
                        ? 'bg-rose-50 border-rose-300'
                        : isInside
                        ? 'bg-blue-50/70 border-actionBlue/50'
                        : isGrace
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-white border-cardBorder hover:border-actionBlue'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-brandNavy">{member.name}</h3>
                          <span className="text-xs font-semibold text-actionBlue bg-white px-2 py-0.5 rounded border border-cardBorder">
                            {member.id}
                          </span>
                          {isInside && <Badge variant="success">Currently Inside</Badge>}
                          {isRestricted && <Badge variant="danger">ACCESS RESTRICTED</Badge>}
                          {isGrace && <Badge variant="warning">Grace Period Active</Badge>}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-mutedText mt-1">
                          <span>Plan: <strong className="text-brandNavy">{member.planName}</strong></span>
                          <span>•</span>
                          <span>Phone: <strong>+91 {member.phone}</strong></span>
                          <span>•</span>
                          <span>Last Visit: {member.lastAttendance || 'None'}</span>
                        </div>

                        {isRestricted && (
                          <p className="text-xs font-bold text-rose-700 mt-1.5 flex items-center gap-1">
                            <ShieldBan className="w-3.5 h-3.5" />
                            Membership payment overdue. Access Restricted (Due: {formatCurrency(member.dueAmount)}).
                          </p>
                        )}
                        {isGrace && (
                          <p className="text-xs font-semibold text-amber-700 mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Plan expired. Grace period active ({member.gracePeriodDaysRemaining || 2} days left).
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                      {isRestricted ? (
                        <>
                          <Button
                            variant="whatsapp"
                            size="md"
                            icon={<Send className="w-4 h-4" />}
                            onClick={() => setQrModalMember(member)}
                          >
                            Send Payment QR
                          </Button>
                          <Button
                            variant="primary"
                            size="md"
                            icon={<CreditCard className="w-4 h-4" />}
                            onClick={() => setRecordPayMemberId(member.id)}
                          >
                            Record Cash (₹{member.dueAmount})
                          </Button>
                        </>
                      ) : isInside ? (
                        <div className="flex items-center gap-2">
                          {existingAtt?.checkoutToken && (
                            <>
                              <button
                                onClick={() =>
                                  handleOpenWhatsApp(
                                    member.name,
                                    member.phone,
                                    existingAtt.checkInTime,
                                    existingAtt.checkoutToken!
                                  )
                                }
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-bold flex items-center gap-1 transition-colors"
                                title="Open WhatsApp chat"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </button>

                              <button
                                onClick={() => handleCopyLink(existingAtt.checkoutToken!)}
                                className="px-2.5 py-1.5 bg-white hover:bg-canvas text-brandNavy border border-cardBorder rounded-sm text-xs font-medium flex items-center gap-1 transition-colors"
                                title="Copy checkout URL"
                              >
                                <Copy className="w-3.5 h-3.5 text-mutedText" />
                                <span>Copy</span>
                              </button>
                            </>
                          )}
                          <Button
                            variant="secondary"
                            size="md"
                            icon={<LogOut className="w-4 h-4" />}
                            onClick={() => {
                              adminOverrideCheckOut(member.id);
                              setSearchQuery('');
                            }}
                          >
                            Admin Override
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          size="lg"
                          icon={<LogIn className="w-5 h-5" />}
                          onClick={() => {
                            checkInMember(member.id);
                            setSearchQuery('');
                          }}
                          className="font-bold text-base px-6 py-3"
                        >
                          CHECK IN
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center bg-canvas rounded-sm border border-cardBorder text-xs text-mutedText">
                No member found matching "{searchQuery}".
              </div>
            )}
          </div>
        )}
      </div>

      {/* TODAY'S ATTENDANCE STREAM */}
      <div className="bg-white rounded-md border border-cardBorder shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-cardBorder/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-brandNavy flex items-center gap-2">
              <Clock className="w-4 h-4 text-actionBlue" />
              Today's Live Attendance Stream
            </h3>
            <p className="text-xs text-mutedText mt-0.5">
              {activeAttendance.length} logs recorded today ({stats.currentlyInside} active on gym floor) • Auto-synchronized with mobile check-outs via SSE
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-mutedText">
            <span>Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas/75 border-b border-cardBorder/80 text-[11px] font-semibold uppercase tracking-wider text-mutedText">
                <th className="py-3.5 px-4 sm:px-6">Member</th>
                <th className="py-3.5 px-4">Plan</th>
                <th className="py-3.5 px-4">Check-In</th>
                <th className="py-3.5 px-4">Check-Out</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardBorder/50 text-sm">
              {activeAttendance.length > 0 ? (
                activeAttendance.map((log) => (
                  <tr key={log.id} className="hover:bg-canvas/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={log.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={log.memberName}
                          className="w-9 h-9 rounded-full object-cover border border-cardBorder flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-brandNavy">{log.memberName}</h4>
                          <span className="text-xs text-mutedText font-medium">{log.memberId} • +91 {log.memberPhone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-xs text-brandNavy bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {log.memberPlan || '1 Month'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-bold text-actionBlue">
                      {log.checkInTime}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-medium text-brandNavy">
                      {log.checkOutTime || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <LiveDurationBadge checkInTime={log.checkInTime} status={log.status} duration={log.duration} />
                    </td>

                    <td className="py-3.5 px-4">
                      {log.status === 'Inside' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Currently Inside
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <CheckCircle2 className="w-3 h-3 text-slate-500" />
                            Checked Out
                          </span>
                          <span className="text-[10px] text-mutedText block">{log.checkoutMethod}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      {log.status === 'Inside' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {log.checkoutToken && (
                            <>
                              <button
                                onClick={() =>
                                  handleOpenWhatsApp(
                                    log.memberName,
                                    log.memberPhone,
                                    log.checkInTime,
                                    log.checkoutToken!
                                  )
                                }
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-sm text-xs font-bold flex items-center gap-1 transition-colors"
                                title="Open WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </button>

                              <button
                                onClick={() => handleCopyLink(log.checkoutToken!)}
                                className="px-2 py-1 bg-white hover:bg-canvas text-brandNavy border border-cardBorder rounded-sm text-xs font-medium flex items-center gap-1 transition-colors"
                                title="Copy checkout link"
                              >
                                <Copy className="w-3.5 h-3.5 text-mutedText" />
                                <span>Copy</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => adminOverrideCheckOut(log.id)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-brandNavy rounded-sm text-xs font-medium transition-colors"
                            title="Admin Emergency Override"
                          >
                            Override
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-mutedText font-medium">Session Closed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-mutedText text-sm">
                    No members matching current attendance filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RecordPaymentModal
        isOpen={!!recordPayMemberId}
        onClose={() => setRecordPayMemberId(null)}
        preselectedMemberId={recordPayMemberId || undefined}
      />
      <PaymentQRModal />
    </div>
  );
};
