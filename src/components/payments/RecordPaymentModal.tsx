import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PaymentMethod, PaymentStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMemberId?: string;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  preselectedMemberId,
}) => {
  const { members, plans, recordPayment } = useGym();

  const [selectedMemberId, setSelectedMemberId] = useState(preselectedMemberId || '');
  const [amount, setAmount] = useState<number>(1000);
  const [method, setMethod] = useState<PaymentMethod>('Cash');
  const [status, setStatus] = useState<PaymentStatus>('Paid');
  const [planId, setPlanId] = useState<string>('plan-1m');
  const [notes, setNotes] = useState('');

  const selectedMember = members.find((m) => m.id === (selectedMemberId || preselectedMemberId));
  const selectedPlan = plans.find((p) => p.id === planId) || plans[0];

  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId);
    const m = members.find((item) => item.id === memberId);
    if (m) {
      setAmount(m.dueAmount > 0 ? m.dueAmount : m.planPrice);
      const matchedPlan = plans.find((p) => p.name === m.planName);
      if (matchedPlan) setPlanId(matchedPlan.id);
    }
  };

  const handlePlanSelect = (pId: string) => {
    setPlanId(pId);
    const p = plans.find((item) => item.id === pId);
    if (p) {
      setAmount(p.price);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = preselectedMemberId || selectedMemberId;
    if (!targetId) return;

    recordPayment({
      memberId: targetId,
      amount: Number(amount),
      planName: selectedPlan.name,
      planDurationMonths: selectedPlan.durationMonths,
      method: method,
      status: status,
      notes: notes,
    });

    onClose();
    if (!preselectedMemberId) setSelectedMemberId('');
    setNotes('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Member Payment"
      subtitle="Collect membership fee or dues from existing registered member."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Member Select */}
        <div>
          <label className="block text-xs font-semibold text-brandNavy mb-1">
            Select Member <span className="text-rose-500">*</span>
          </label>
          <select
            required
            disabled={!!preselectedMemberId}
            value={preselectedMemberId || selectedMemberId}
            onChange={(e) => handleMemberSelect(e.target.value)}
            className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy font-medium focus:outline-none focus:border-actionBlue"
          >
            <option value="">Choose an existing member...</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.phone}) — {m.id} [Plan: {m.planName} {m.dueAmount > 0 ? `• Due: ₹${m.dueAmount}` : ''}]
              </option>
            ))}
          </select>
        </div>

        {/* Selected Member Quick Info */}
        {selectedMember && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm text-xs grid grid-cols-3 gap-2">
            <div>
              <span className="text-mutedText">Current Plan</span>
              <p className="font-bold text-brandNavy">{selectedMember.planName}</p>
            </div>
            <div>
              <span className="text-mutedText">Expiry Date</span>
              <p className="font-semibold text-brandNavy">{selectedMember.expiryDate}</p>
            </div>
            <div>
              <span className="text-mutedText">Outstanding Due</span>
              <p className="font-bold text-rose-600">{formatCurrency(selectedMember.dueAmount)}</p>
            </div>
          </div>
        )}

        {/* Renewal Plan Option */}
        <div>
          <label className="block text-xs font-semibold text-brandNavy mb-1">
            Membership Plan Renewal Duration
          </label>
          <select
            value={planId}
            onChange={(e) => handlePlanSelect(e.target.value)}
            className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — ₹{p.price.toLocaleString('en-IN')} ({p.durationLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Amount & Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brandNavy mb-1">
              Amount Received (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm font-bold text-brandNavy focus:outline-none focus:border-actionBlue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brandNavy mb-1">
              Payment Method <span className="text-rose-500">*</span>
            </label>
            <select
              value={method}
              onChange={(e: any) => setMethod(e.target.value)}
              className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm font-semibold text-brandNavy focus:outline-none focus:border-actionBlue"
            >
              <option value="Cash">Cash (Front Desk)</option>
              <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
              <option value="Card">Card (POS Terminal)</option>
              <option value="Online">Online Transfer</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brandNavy mb-1">
            Payment Status
          </label>
          <select
            value={status}
            onChange={(e: any) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
          >
            <option value="Paid">Paid (Full Settlement)</option>
            <option value="Partial">Partial Payment</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brandNavy mb-1">
            Notes / Receipt Remarks
          </label>
          <input
            type="text"
            placeholder="e.g. Cash collected by Admin"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cardBorder/60">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={!(preselectedMemberId || selectedMemberId)}
          >
            Confirm Payment & Update Member
          </Button>
        </div>
      </form>
    </Modal>
  );
};
