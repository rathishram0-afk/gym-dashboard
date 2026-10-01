import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { MembershipPlan } from '../../types';

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
}

export const EditPlanModal: React.FC<EditPlanModalProps> = ({ isOpen, onClose, plan }) => {
  const { updatePlanPrice } = useGym();
  const [price, setPrice] = useState<number>(1000);

  useEffect(() => {
    if (plan) {
      setPrice(plan.price);
    }
  }, [plan]);

  if (!plan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlanPrice(plan.id, Number(price));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Plan Price: ${plan.name}`}
      subtitle="Update the duration pricing dynamically without altering code."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-brandNavy mb-1">
            Plan Duration
          </label>
          <input
            type="text"
            disabled
            value={plan.name}
            className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy font-semibold opacity-75"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brandNavy mb-1">
            New Plan Price (₹ INR) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            required
            min={100}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-base font-bold text-brandNavy focus:outline-none focus:border-actionBlue"
          />
          <p className="text-xs text-mutedText mt-1">
            This updated price will automatically reflect in new member registrations.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cardBorder/60">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save New Price
          </Button>
        </div>
      </form>
    </Modal>
  );
};
