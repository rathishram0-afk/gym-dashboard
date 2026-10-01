import React from 'react';
import { useGym } from '../../context/GymContext';
import { Button } from '../common/Button';
import {
  Zap,
  CheckCircle2,
  Clock,
  ShieldBan,
  MessageSquare,
  Link,
  CreditCard,
  QrCode,
  ShieldAlert,
} from 'lucide-react';

export const AutomationView: React.FC = () => {
  const { automationSettings, setAutomationSettings, showToast } = useGym();

  const handleToggle = (key: keyof typeof automationSettings) => {
    setAutomationSettings((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
    showToast('success', 'Automation Rule Updated', 'Rule configuration saved.');
  };

  const steps = [
    { title: 'Member Joins', desc: '1M / 6M / 1Y Plan Enrolled', icon: CheckCircle2 },
    { title: '15 / 10 / 5 / 2 Days', desc: 'WhatsApp Auto-reminders + Link', icon: MessageSquare },
    { title: 'Expiry Date', desc: 'Membership term ends', icon: Clock },
    { title: 'Grace Period (4 Days)', desc: 'Access allowed with dues warning', icon: ShieldAlert },
    { title: 'Access Restricted', desc: 'Turnstile check-in blocked', icon: ShieldBan },
    { title: 'Cash / QR Payment', desc: 'Direct walk-in or UPI link', icon: CreditCard },
    { title: 'Access Restored', desc: 'Auto-reactivated & renewed', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brandNavy">
          Membership Renewal & Access Automation
        </h1>
        <p className="text-sm text-mutedText mt-0.5">
          Configure automated WhatsApp renewal reminders, grace periods, and access restriction triggers.
        </p>
      </div>

      {/* Lifecycle Flowchart */}
      <div className="bg-white p-6 rounded-md border border-cardBorder shadow-card">
        <h3 className="text-base font-bold text-brandNavy mb-2">Automated Renewal & Restriction Lifecycle</h3>
        <p className="text-xs text-mutedText mb-6">
          Visual lifecycle of a gym member from joining to automated reminders, grace period, restriction, and renewal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-canvas p-4 rounded-md border border-cardBorder flex flex-col items-center text-center group hover:border-actionBlue transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-cardBorder flex items-center justify-center text-actionBlue shadow-xs mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-brandNavy">{step.title}</h4>
                <p className="text-[10px] text-mutedText mt-1">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configurable Reminder Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pre-Expiry Reminders */}
        <div className="bg-white p-6 rounded-md border border-cardBorder shadow-card">
          <h3 className="text-base font-bold text-brandNavy mb-1">Pre-Expiry WhatsApp Reminders</h3>
          <p className="text-xs text-mutedText mb-4">
            Automated WhatsApp notifications with member's unique payment link.
          </p>

          <div className="divide-y divide-cardBorder/60 text-sm">
            <div className="py-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-brandNavy">15 Days Before Expiry</h4>
                <p className="text-xs text-mutedText">Early courtesy renewal notification.</p>
              </div>
              <input
                type="checkbox"
                checked={automationSettings.reminder15Days}
                onChange={() => handleToggle('reminder15Days')}
                className="w-5 h-5 accent-actionBlue cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-brandNavy">10 Days Before Expiry</h4>
                <p className="text-xs text-mutedText">Second reminder with UPI payment link.</p>
              </div>
              <input
                type="checkbox"
                checked={automationSettings.reminder10Days}
                onChange={() => handleToggle('reminder10Days')}
                className="w-5 h-5 accent-actionBlue cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-brandNavy">5 Days Before Expiry</h4>
                <p className="text-xs text-mutedText">Upcoming expiry alert.</p>
              </div>
              <input
                type="checkbox"
                checked={automationSettings.reminder5Days}
                onChange={() => handleToggle('reminder5Days')}
                className="w-5 h-5 accent-actionBlue cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-brandNavy">2 Days Before Expiry</h4>
                <p className="text-xs text-mutedText">Final upcoming expiry notice.</p>
              </div>
              <input
                type="checkbox"
                checked={automationSettings.reminder2Days}
                onChange={() => handleToggle('reminder2Days')}
                className="w-5 h-5 accent-actionBlue cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-brandNavy">Expiry Date Notification</h4>
                <p className="text-xs text-mutedText">Dispatched on the exact day membership expires.</p>
              </div>
              <input
                type="checkbox"
                checked={automationSettings.reminderExpiryDay}
                onChange={() => handleToggle('reminderExpiryDay')}
                className="w-5 h-5 accent-actionBlue cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Grace Period & Access Restriction Settings */}
        <div className="bg-white p-6 rounded-md border border-cardBorder shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-brandNavy mb-1">Grace Period & Access Control</h3>
            <p className="text-xs text-mutedText mb-4">
              Configure grace days before turnstile check-in is blocked.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-canvas rounded-md border border-cardBorder">
                <label className="block text-xs font-bold text-brandNavy mb-1">
                  Grace Period Window (Days)
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={automationSettings.gracePeriodDays}
                    onChange={(e) =>
                      setAutomationSettings((prev) => ({
                        ...prev,
                        gracePeriodDays: Number(e.target.value),
                      }))
                    }
                    className="w-24 px-3 py-2 bg-white border border-cardBorder rounded-sm text-base font-bold text-brandNavy focus:outline-none focus:border-actionBlue"
                  />
                  <span className="text-xs text-mutedText">
                    Days after expiry before access is strictly restricted.
                  </span>
                </div>
              </div>

              <div className="p-4 bg-canvas rounded-md border border-cardBorder flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-brandNavy">Automatic Access Restriction</h4>
                  <p className="text-xs text-mutedText mt-0.5">
                    Block front desk check-in when overdue exceeds {automationSettings.gracePeriodDays} days.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={automationSettings.autoRestrictAccess}
                  onChange={() => handleToggle('autoRestrictAccess')}
                  className="w-5 h-5 accent-actionBlue cursor-pointer"
                />
              </div>

              <div className="p-4 bg-canvas rounded-md border border-cardBorder flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-brandNavy">Auto-dispatch Payment QR Link</h4>
                  <p className="text-xs text-mutedText mt-0.5">
                    Send unique renewal link upon entering grace period.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={automationSettings.sendPaymentLinksOnExpiry}
                  onChange={() => handleToggle('sendPaymentLinksOnExpiry')}
                  className="w-5 h-5 accent-actionBlue cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-cardBorder/60 flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={() => showToast('success', 'Settings Saved', 'Automation configurations updated.')}
            >
              Save All Automation Rules
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
