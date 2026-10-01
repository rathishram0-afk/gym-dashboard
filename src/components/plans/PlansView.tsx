import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { MembershipPlan } from '../../types';
import { EditPlanModal } from './EditPlanModal';
import { Check, Edit2, Tag, Users } from 'lucide-react';

export const PlansView: React.FC = () => {
  const { plans } = useGym();
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandNavy">
            Membership Plans & Duration Pricing
          </h1>
          <p className="text-sm text-mutedText mt-0.5">
            Duration-based memberships: 1 Month, 6 Months, and 1 Year. Edit prices at any time.
          </p>
        </div>
      </div>

      {/* 3 Duration Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-md border p-6 flex flex-col justify-between shadow-card relative ${
              plan.isPopular ? 'border-actionBlue ring-2 ring-actionBlue/20' : 'border-cardBorder'
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-actionBlue text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Best Value
              </span>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-brandNavy">{plan.name}</h3>
                <span className="text-xs font-semibold text-actionBlue bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-200">
                  {plan.durationLabel}
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-brandNavy">{formatCurrency(plan.price)}</span>
                <span className="text-xs text-mutedText font-medium">/ {plan.durationLabel}</span>
              </div>

              <p className="text-xs text-mutedText mt-2">{plan.description}</p>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-actionBlue font-semibold">
                <Users className="w-3.5 h-3.5" />
                <span>{plan.activeMembersCount} Active Subscribers</span>
              </div>

              <div className="my-6 border-t border-cardBorder/60" />

              <ul className="space-y-2.5 text-xs text-brandNavy">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-actionBlue flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <Button
                variant="outline"
                size="sm"
                icon={<Edit2 className="w-3.5 h-3.5" />}
                onClick={() => setEditingPlan(plan)}
                className="w-full"
              >
                Edit Price
              </Button>
            </div>
          </div>
        ))}
      </div>

      <EditPlanModal
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        plan={editingPlan}
      />
    </div>
  );
};
