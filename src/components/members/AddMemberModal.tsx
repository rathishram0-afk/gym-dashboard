import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PaymentMethod, PaymentStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { User, Calendar, CreditCard, Tag, CheckCircle2, IndianRupee } from 'lucide-react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
  const { plans, addMember } = useGym();

  const todayStr = new Date().toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || 'plan-1m');
  const [joiningDate, setJoiningDate] = useState(todayStr);
  const [startDate, setStartDate] = useState(todayStr);
  const [expiryDate, setExpiryDate] = useState('');

  const [amount, setAmount] = useState<number>(1000);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');

  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  // Helper to calculate exact expiry date based on joining/start date + duration
  const calculateExpiry = (start: string, planMonths: number): string => {
    if (!start) return '';
    const date = new Date(start);
    date.setMonth(date.getMonth() + planMonths);
    date.setDate(date.getDate() - 1); // 1 day before next cycle (e.g. 27 Sep -> 26 Oct)
    return date.toISOString().split('T')[0];
  };

  // Recalculate expiry and default amount whenever plan or start date changes
  useEffect(() => {
    if (selectedPlan) {
      const exp = calculateExpiry(startDate || joiningDate, selectedPlan.durationMonths);
      setExpiryDate(exp);
      const finalPrice = Math.max(0, selectedPlan.price - discount);
      setAmount(finalPrice);
    }
  }, [selectedPlanId, startDate, joiningDate, selectedPlan?.price]);

  // Update amount when discount is adjusted
  const handleDiscountChange = (val: number) => {
    setDiscount(val);
    if (selectedPlan) {
      setAmount(Math.max(0, selectedPlan.price - val));
    }
  };

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      const exp = calculateExpiry(startDate || joiningDate, plan.durationMonths);
      setExpiryDate(exp);
      setAmount(Math.max(0, plan.price - discount));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addMember({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      gender: gender,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      planPrice: selectedPlan.price,
      joiningDate: joiningDate,
      startDate: startDate,
      expiryDate: expiryDate,
      amount: Number(amount),
      discountAmount: Number(discount),
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      emergencyContact: emergencyContact.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
    // Reset form
    setName('');
    setPhone('');
    setEmail('');
    setGender('Male');
    setDiscount(0);
    setPaymentMethod('Cash');
    setPaymentStatus('Paid');
    setEmergencyContact('');
    setAddress('');
    setNotes('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Member"
      subtitle="Register gym member, select duration-based plan, and record direct payment."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Personal Information */}
        <div className="bg-canvas p-4 rounded-md border border-cardBorder">
          <h4 className="text-xs font-bold uppercase tracking-wider text-actionBlue flex items-center gap-1.5 mb-3">
            <User className="w-3.5 h-3.5" />
            1. Personal Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Karthik Raj"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-cardBorder rounded-sm text-sm text-brandNavy placeholder-mutedText focus:outline-none focus:border-actionBlue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9884567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-cardBorder rounded-sm text-sm text-brandNavy placeholder-mutedText focus:outline-none focus:border-actionBlue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. karthik@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-cardBorder rounded-sm text-sm text-brandNavy placeholder-mutedText focus:outline-none focus:border-actionBlue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e: any) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Membership Duration & Automated Expiry */}
        <div className="bg-canvas p-4 rounded-md border border-cardBorder">
          <h4 className="text-xs font-bold uppercase tracking-wider text-actionBlue flex items-center gap-1.5 mb-3">
            <Tag className="w-3.5 h-3.5" />
            2. Membership Duration & Validity
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-brandNavy mb-1">
                Membership Plan (Duration) <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-cardBorder rounded-sm text-sm font-semibold text-brandNavy focus:outline-none focus:border-actionBlue"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{p.price.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">
                Joining Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={joiningDate}
                onChange={(e) => {
                  setJoiningDate(e.target.value);
                  setStartDate(e.target.value);
                }}
                className="w-full px-3 py-2 bg-white border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
              />
            </div>

            <div className="sm:col-span-2 p-3 bg-blue-50 border border-blue-200 rounded-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-actionBlue uppercase tracking-wider">
                  Automated Expiry Date
                </span>
                <div className="text-sm font-bold text-brandNavy mt-0.5">
                  {expiryDate ? new Date(expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Calculating...'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-actionBlue uppercase tracking-wider">
                  Plan Base Price
                </span>
                <div className="text-base font-bold text-actionBlue mt-0.5">
                  ₹{selectedPlan.price.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Payment Details & Manual Cash Payment */}
        <div className="bg-canvas p-4 rounded-md border border-cardBorder">
          <h4 className="text-xs font-bold uppercase tracking-wider text-actionBlue flex items-center gap-1.5 mb-3">
            <CreditCard className="w-3.5 h-3.5" />
            3. Payment Details (Cash / UPI / Card / Online)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">
                Discount Given (₹)
              </label>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={discount || ''}
                onChange={(e) => handleDiscountChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">
                Amount Paid (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-cardBorder rounded-sm text-sm font-bold text-brandNavy focus:outline-none focus:border-actionBlue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">
                Payment Method <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e: any) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-cardBorder rounded-sm text-sm font-semibold text-brandNavy focus:outline-none focus:border-actionBlue"
              >
                <option value="Cash">Cash (Direct Walk-in)</option>
                <option value="UPI">UPI (GPay / PhonePe / QR)</option>
                <option value="Card">Card (POS Terminal)</option>
                <option value="Online">Online Payment</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-brandNavy mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e: any) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-cardBorder rounded-sm text-sm font-semibold text-brandNavy focus:outline-none focus:border-actionBlue"
              >
                <option value="Paid">Paid (Full Settlement — Member Active Immediately)</option>
                <option value="Partial">Partial Payment (Remaining added to due fees)</option>
                <option value="Pending">Pending (Payment to be collected later)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-cardBorder/60">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" size="md">
            Create Member & Activate
          </Button>
        </div>
      </form>
    </Modal>
  );
};
