import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { Dumbbell, CheckCircle2, Clock, Smartphone, MessageSquare, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

export const MemberSelfCheckoutModal: React.FC = () => {
  const { activeCheckoutSession, setActiveCheckoutSession, memberSelfCheckOut } = useGym();
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<{ time: string; duration: string } | null>(null);

  if (!activeCheckoutSession) return null;

  const handlePerformCheckout = () => {
    const res = memberSelfCheckOut(activeCheckoutSession.token);
    if (res.success) {
      const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      setCheckoutResult({
        time: now,
        duration: res.duration || '1h 24m',
      });
      setIsCheckedOut(true);
    }
  };

  const handleClose = () => {
    setActiveCheckoutSession(null);
    setIsCheckedOut(false);
    setCheckoutResult(null);
  };

  return (
    <Modal
      isOpen={!!activeCheckoutSession}
      onClose={handleClose}
      title="Member's Mobile Phone Simulation (WhatsApp Link)"
      subtitle="Demonstrates the member self-checkout flow triggered from WhatsApp."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Mobile Phone Device Frame */}
        <div className="mx-auto max-w-sm bg-white rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden font-sans">
          {/* Mobile Top Bar */}
          <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between text-[11px]">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>4G / VoLTE</span>
            </div>
          </div>

          {/* WhatsApp Message Notification Banner */}
          <div className="bg-emerald-700 text-white p-3 flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold">GYMOS Fitness WhatsApp</span>
              <p className="text-[11px] opacity-90 mt-0.5">
                "Hi {activeCheckoutSession.memberName} 👋 You are checked in at {activeCheckoutSession.checkInTime}. Tap below when leaving."
              </p>
            </div>
          </div>

          {/* Member Web Checkout Page */}
          <div className="p-6 text-center bg-canvas min-h-[320px] flex flex-col justify-between">
            {!isCheckedOut ? (
              <>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-actionBlue mx-auto flex items-center justify-center text-white shadow-sm mb-3">
                    <Dumbbell className="w-6 h-6 transform -rotate-45" />
                  </div>
                  <h3 className="text-lg font-bold text-brandNavy">GYMOS Fitness</h3>
                  <p className="text-xs text-mutedText mt-0.5">Velachery Branch</p>

                  <div className="my-5 p-4 bg-white rounded-md border border-cardBorder text-left space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-mutedText">Member</span>
                      <span className="text-xs font-bold text-brandNavy">{activeCheckoutSession.memberName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-mutedText">Check-In Time</span>
                      <span className="text-xs font-bold text-actionBlue">{activeCheckoutSession.checkInTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-mutedText">Current Workout</span>
                      <span className="text-xs font-bold text-emerald-600">1h 24m (Active)</span>
                    </div>
                    <div className="pt-2 border-t border-cardBorder/60 flex items-center gap-1 text-[10px] text-mutedText">
                      <ShieldCheck className="w-3.5 h-3.5 text-actionBlue" />
                      <span>One-Time Secure Token: {activeCheckoutSession.token.slice(0, 14)}...</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handlePerformCheckout}
                    className="w-full py-3.5 bg-actionBlue hover:bg-blue-700 text-white font-bold rounded-md shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    <span>CHECK OUT (Tap to Leave)</span>
                  </button>
                  <span className="text-[10px] text-mutedText block">
                    Tapping will record checkout and update gym turnstile instantly.
                  </span>
                </div>
              </>
            ) : (
              <div className="py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brandNavy">Checked out successfully ✅</h3>
                  <p className="text-xs text-mutedText mt-1">Thank you for visiting GYMOS Fitness!</p>
                </div>

                <div className="p-4 bg-white rounded-md border border-cardBorder text-left space-y-2 shadow-xs text-xs">
                  <div className="flex justify-between">
                    <span className="text-mutedText">Check-In:</span>
                    <span className="font-semibold text-brandNavy">{activeCheckoutSession.checkInTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mutedText">Check-Out:</span>
                    <span className="font-semibold text-actionBlue">{checkoutResult?.time}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t border-cardBorder/60">
                    <span>Total Workout:</span>
                    <span className="text-emerald-700">{checkoutResult?.duration}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={handleClose} className="w-full">
                  Close Phone Preview
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center pt-2">
          <span className="text-xs text-mutedText">
            In production, this page opens securely on the member's browser when clicking the WhatsApp button.
          </span>
        </div>
      </div>
    </Modal>
  );
};
