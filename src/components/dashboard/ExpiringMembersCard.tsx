import React from 'react';
import { useGym } from '../../context/GymContext';
import { formatDate } from '../../utils/formatters';
import { Clock, Send, ChevronRight } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ExpiringMembersCard: React.FC = () => {
  const { members, sendWhatsAppReminder, setSelectedMember, setActiveNav } = useGym();

  const expiringList = members
    .filter((m) => m.status === 'Expiring' || m.daysRemaining <= 7)
    .slice(0, 4);

  return (
    <div className="bg-white rounded-md border border-cardBorder p-5 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-cardBorder/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="text-base font-bold text-brandNavy">Members Expiring Soon</h3>
          </div>
          <button
            onClick={() => setActiveNav('members')}
            className="text-xs font-semibold text-actionBlue hover:underline flex items-center gap-0.5"
          >
            View All ({members.filter((m) => m.daysRemaining <= 7).length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-cardBorder/60 mt-2">
          {expiringList.map((member) => (
            <div
              key={member.id}
              className="py-3 flex items-center justify-between gap-3 hover:bg-canvas/50 px-2 rounded-sm transition-colors"
            >
              <div
                className="flex items-center gap-3 cursor-pointer min-w-0"
                onClick={() => {
                  setSelectedMember(member);
                  setActiveNav('members');
                }}
              >
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-9 h-9 rounded-full object-cover border border-cardBorder flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-brandNavy truncate hover:text-actionBlue">
                    {member.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-mutedText mt-0.5">
                    <span>{member.planName}</span>
                    <span>•</span>
                    <span>Expires {formatDate(member.expiryDate)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="warning" size="sm">
                  {member.daysRemaining} days left
                </Badge>
                <button
                  onClick={() => sendWhatsAppReminder(member)}
                  title="Send Reminder"
                  className="p-1.5 text-actionBlue hover:bg-blue-50 border border-blue-200 rounded-sm text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span className="hidden sm:inline">Remind</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
