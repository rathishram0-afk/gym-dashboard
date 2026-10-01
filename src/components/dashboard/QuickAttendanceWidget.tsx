import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Button } from '../common/Button';
import { Search, LogIn, LogOut, CheckCircle2, ShieldBan, Send, CreditCard } from 'lucide-react';
import { RecordPaymentModal } from '../payments/RecordPaymentModal';
import { PaymentQRModal } from '../common/PaymentQRModal';

export const QuickAttendanceWidget: React.FC = () => {
  const { members, attendance, checkInMember, adminOverrideCheckOut, setQrModalMember } = useGym();
  const [search, setSearch] = useState('');
  const [recordPayId, setRecordPayId] = useState<string | null>(null);

  const results = search.trim()
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.phone.includes(search) ||
          m.id.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 3)
    : [];

  return (
    <div className="bg-white p-5 rounded-md border border-cardBorder shadow-card">
      <div className="flex items-center justify-between pb-3 border-b border-cardBorder/60">
        <div className="flex items-center gap-2">
          <LogIn className="w-4 h-4 text-actionBlue" />
          <h3 className="text-base font-bold text-brandNavy">Front Desk Quick Check-In</h3>
        </div>
        <span className="text-xs font-semibold text-mutedText">Instant 2-Click Entry</span>
      </div>

      <div className="mt-3 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mutedText" />
        <input
          type="text"
          placeholder="Search member name or phone for instant check-in..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy placeholder-mutedText focus:outline-none focus:border-actionBlue"
        />
      </div>

      {search.trim() && (
        <div className="mt-3 space-y-2">
          {results.length > 0 ? (
            results.map((m) => {
              const isInside = attendance.some((a) => a.memberId === m.id && a.status === 'Inside');
              const isRestricted = m.status === 'Restricted' || (m.daysOverdue && m.daysOverdue > 4);

              return (
                <div
                  key={m.id}
                  className="p-3 bg-canvas rounded-sm border border-cardBorder flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-brandNavy truncate">{m.name}</h4>
                    <p className="text-xs text-mutedText">{m.id} • {m.planName}</p>
                    {isRestricted && (
                      <span className="text-[11px] font-bold text-rose-600 block mt-0.5">
                        Access Restricted (Due: ₹{m.dueAmount})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isRestricted ? (
                      <>
                        <button
                          onClick={() => setQrModalMember(m)}
                          className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
                          title="WhatsApp QR Link"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setRecordPayId(m.id)}
                        >
                          Pay ₹{m.dueAmount}
                        </Button>
                      </>
                    ) : isInside ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<LogOut className="w-3.5 h-3.5" />}
                        onClick={() => {
                          adminOverrideCheckOut(m.id);
                          setSearch('');
                        }}
                      >
                        Check Out
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<LogIn className="w-3.5 h-3.5" />}
                        onClick={() => {
                          checkInMember(m.id);
                          setSearch('');
                        }}
                      >
                        Check In
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-3 text-center text-xs text-mutedText">
              No matching member found.
            </div>
          )}
        </div>
      )}

      <RecordPaymentModal
        isOpen={!!recordPayId}
        onClose={() => setRecordPayId(null)}
        preselectedMemberId={recordPayId || undefined}
      />
      <PaymentQRModal />
    </div>
  );
};
