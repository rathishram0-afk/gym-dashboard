import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Button } from '../common/Button';
import { Search, UserCheck, Plus, ScanLine } from 'lucide-react';

export const LiveCheckInBar: React.FC = () => {
  const { members, checkInMember } = useGym();
  const [searchMemberId, setSearchMemberId] = useState('');

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchMemberId.trim()) return;
    checkInMember(searchMemberId);
    setSearchMemberId('');
  };

  return (
    <div className="bg-white p-5 rounded-md border border-cardBorder shadow-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-actionBlue" />
            <h3 className="text-base font-bold text-brandNavy">Front Desk Quick Check-In</h3>
          </div>
          <p className="text-xs text-mutedText mt-0.5">
            Scan RFID card or select registered member from directory to log attendance.
          </p>
        </div>

        <form onSubmit={handleManualCheckIn} className="flex items-center gap-2.5 max-w-md w-full">
          <select
            value={searchMemberId}
            onChange={(e) => setSearchMemberId(e.target.value)}
            className="flex-1 px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy focus:outline-none focus:border-actionBlue"
          >
            <option value="">Select Member to Check In...</option>
            {members
              .filter((m) => m.status === 'Active')
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.phone}) — {m.planName}
                </option>
              ))}
          </select>

          <Button
            variant="primary"
            size="md"
            type="submit"
            icon={<UserCheck className="w-4 h-4" />}
            disabled={!searchMemberId}
          >
            Check In
          </Button>
        </form>
      </div>
    </div>
  );
};
