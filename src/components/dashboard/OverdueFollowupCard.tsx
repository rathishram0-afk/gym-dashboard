import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { formatCurrency } from '../../utils/formatters';
import { MessageSquare, AlertCircle, ChevronRight, QrCode, CreditCard } from 'lucide-react';
import { Badge } from '../common/Badge';
import { RecordPaymentModal } from '../payments/RecordPaymentModal';
import { PaymentQRModal } from '../common/PaymentQRModal';

export const OverdueFollowupCard: React.FC = () => {
  const { members, sendWhatsAppReminder, setQrModalMember, setActiveNav } = useGym();
  const [payMemberId, setPayMemberId] = useState<string | null>(null);

  const overdueList = members
    .filter((m) => m.paymentStatus === 'Overdue' || m.dueAmount > 0 || m.status === 'Restricted')
    .slice(0, 4);

  return (
    <>
      <div className="bg-white rounded-md border border-cardBorder p-5 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-cardBorder/60">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <h3 className="text-base font-bold text-brandNavy">Payment Follow-ups (Overdue)</h3>
            </div>
            <button
              onClick={() => setActiveNav('payments')}
              className="text-xs font-semibold text-actionBlue hover:underline flex items-center gap-0.5"
            >
              Ledger View
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-cardBorder/60 mt-2">
            {overdueList.map((member) => {
              const isRestricted = member.status === 'Restricted' || (member.daysOverdue && member.daysOverdue > 4);

              return (
                <div
                  key={member.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-canvas/50 px-2 rounded-sm transition-colors"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-brandNavy truncate">
                      {member.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-mutedText mt-0.5">
                      <span className="font-bold text-rose-600">{formatCurrency(member.dueAmount || 1000)}</span>
                      <span>•</span>
                      <span>{member.daysOverdue || 2} days overdue</span>
                      <span>•</span>
                      {isRestricted ? (
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">Restricted</span>
                      ) : (
                        <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Grace Active</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => setQrModalMember(member)}
                      title="View QR Code & Unique Link"
                      className="p-1.5 text-actionBlue hover:bg-blue-50 border border-blue-200 rounded-sm text-xs font-medium transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => sendWhatsAppReminder(member)}
                      title="Send WhatsApp Link"
                      className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white rounded-sm text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-3 h-3 fill-current" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <RecordPaymentModal
        isOpen={!!payMemberId}
        onClose={() => setPayMemberId(null)}
        preselectedMemberId={payMemberId || undefined}
      />
      <PaymentQRModal />
    </>
  );
};
