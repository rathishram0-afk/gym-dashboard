import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { MemberList } from './MemberList';
import { MemberProfileDrawer } from './MemberProfileDrawer';
import { AddMemberModal } from './AddMemberModal';

export const MembersView: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandNavy">
            Member Directory
          </h1>
          <p className="text-sm text-mutedText mt-0.5">
            Manage memberships, emergency records, renewals, and turnstile access.
          </p>
        </div>
      </div>

      {/* Main Members List Table */}
      <MemberList onOpenAddMember={() => setIsAddOpen(true)} />

      {/* Slide-over Profile Drawer & Modal */}
      <MemberProfileDrawer />
      <AddMemberModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
