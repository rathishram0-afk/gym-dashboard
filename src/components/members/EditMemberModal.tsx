import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Member } from '../../types';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({ isOpen, onClose, member }) => {
  const { plans, updateMember } = useGym();
  const [formData, setFormData] = useState<Partial<Member>>({});

  useEffect(() => {
    if (member) {
      setFormData({ ...member });
    }
  }, [member]);

  if (!member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMember(member.id, formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Member: ${member.name}`}
      subtitle={`Member ID: ${member.id}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brandNavy mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brandNavy mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brandNavy mb-1">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brandNavy mb-1">Membership Plan</label>
            <select
              value={formData.planId || ''}
              onChange={(e) => {
                const plan = plans.find((p) => p.id === e.target.value);
                setFormData({
                  ...formData,
                  planId: e.target.value,
                  planName: plan ? plan.name : formData.planName,
                });
              }}
              className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (₹{p.price})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brandNavy mb-1">Status</label>
            <select
              value={formData.status || 'Active'}
              onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
            >
              <option value="Active">Active</option>
              <option value="Expiring">Expiring</option>
              <option value="Expired">Expired</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-brandNavy mb-1">Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate || ''}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brandNavy mb-1">Notes</label>
          <textarea
            rows={2}
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cardBorder/60">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
