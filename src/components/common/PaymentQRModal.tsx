import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { formatCurrency } from '../../utils/formatters';
import { QrCode, Copy, Check, ExternalLink, Send, Zap, ShieldCheck } from 'lucide-react';

export const PaymentQRModal: React.FC = () => {
  const { qrModalMember, setQrModalMember, sendWhatsAppReminder, simulateOnlinePaymentSuccess } = useGym();
  const [copied, setCopied] = useState(false);

  if (!qrModalMember) return null;

  const paymentLink = qrModalMember.paymentLink || `https://pay.gymos.fit/r/${qrModalMember.name.toLowerCase().replace(/\s+/g, '-')}-${qrModalMember.id.slice(-4)}`;
  const amount = qrModalMember.dueAmount > 0 ? qrModalMember.dueAmount : qrModalMember.planPrice;

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={!!qrModalMember}
      onClose={() => setQrModalMember(null)}
      title="Member Renewal QR & Payment Link"
      subtitle={`Unique payment link for ${qrModalMember.name} (${qrModalMember.id})`}
      maxWidth="md"
    >
      <div className="space-y-5 text-center">
        {/* Member & Amount Header */}
        <div className="bg-canvas p-4 rounded-md border border-cardBorder text-left">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-brandNavy text-base">{qrModalMember.name}</h4>
              <p className="text-xs text-mutedText">{qrModalMember.phone} • Plan: <span className="font-semibold text-brandNavy">{qrModalMember.planName}</span></p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-mutedText uppercase">Renewal Due</span>
              <div className="text-lg font-bold text-actionBlue">{formatCurrency(amount)}</div>
            </div>
          </div>
        </div>

        {/* QR Code Simulation Box */}
        <div className="flex flex-col items-center justify-center p-6 bg-white border border-cardBorder rounded-md shadow-xs">
          <div className="relative p-3 bg-white border-2 border-actionBlue rounded-md shadow-sm">
            {/* SVG simulated QR Code with GYMOS logo in center */}
            <svg viewBox="0 0 100 100" className="w-44 h-44">
              <rect width="100" height="100" fill="#FFFFFF" />
              {/* Corner squares */}
              <rect x="5" y="5" width="25" height="25" fill="#253053" />
              <rect x="9" y="9" width="17" height="17" fill="#FFFFFF" />
              <rect x="13" y="13" width="9" height="9" fill="#253053" />

              <rect x="70" y="5" width="25" height="25" fill="#253053" />
              <rect x="74" y="9" width="17" height="17" fill="#FFFFFF" />
              <rect x="78" y="13" width="9" height="9" fill="#253053" />

              <rect x="5" y="70" width="25" height="25" fill="#253053" />
              <rect x="9" y="74" width="17" height="17" fill="#FFFFFF" />
              <rect x="13" y="78" width="9" height="9" fill="#253053" />

              {/* Data matrix dots */}
              <rect x="35" y="10" width="8" height="8" fill="#0000EE" />
              <rect x="48" y="10" width="8" height="8" fill="#253053" />
              <rect x="58" y="15" width="8" height="8" fill="#0000EE" />
              <rect x="35" y="25" width="8" height="8" fill="#253053" />
              <rect x="48" y="25" width="8" height="8" fill="#0000EE" />
              <rect x="10" y="38" width="8" height="8" fill="#253053" />
              <rect x="25" y="38" width="8" height="8" fill="#0000EE" />
              <rect x="38" y="38" width="8" height="8" fill="#253053" />
              <rect x="52" y="38" width="8" height="8" fill="#0000EE" />
              <rect x="65" y="38" width="8" height="8" fill="#253053" />
              <rect x="80" y="38" width="8" height="8" fill="#0000EE" />

              <rect x="35" y="52" width="8" height="8" fill="#0000EE" />
              <rect x="52" y="52" width="8" height="8" fill="#253053" />
              <rect x="70" y="52" width="8" height="8" fill="#0000EE" />
              <rect x="85" y="52" width="8" height="8" fill="#253053" />

              <rect x="38" y="70" width="8" height="8" fill="#253053" />
              <rect x="52" y="70" width="8" height="8" fill="#0000EE" />
              <rect x="68" y="70" width="8" height="8" fill="#253053" />
              <rect x="82" y="70" width="8" height="8" fill="#0000EE" />

              <rect x="38" y="85" width="8" height="8" fill="#0000EE" />
              <rect x="52" y="85" width="8" height="8" fill="#253053" />
              <rect x="75" y="85" width="8" height="8" fill="#0000EE" />
            </svg>
          </div>
          <span className="text-xs text-mutedText mt-2">Scan with GPay / PhonePe / Paytm / Camera</span>
        </div>

        {/* Unique Payment URL */}
        <div className="bg-canvas p-3 rounded-md border border-cardBorder flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-actionBlue truncate select-all">{paymentLink}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 bg-white hover:bg-slate-100 border border-cardBorder rounded-sm text-xs text-brandNavy font-semibold flex items-center gap-1 transition-colors flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            variant="whatsapp"
            size="md"
            icon={<Send className="w-4 h-4" />}
            onClick={() => sendWhatsAppReminder(qrModalMember)}
          >
            Send over WhatsApp
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<Zap className="w-4 h-4" />}
            onClick={() => simulateOnlinePaymentSuccess(qrModalMember.id)}
          >
            Simulate Online Paid
          </Button>
        </div>
      </div>
    </Modal>
  );
};
