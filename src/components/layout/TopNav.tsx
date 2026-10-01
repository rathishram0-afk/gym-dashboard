import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  Plus,
  CreditCard,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../common/Button';

interface TopNavProps {
  onMenuToggle: () => void;
  onOpenAddMember: () => void;
  onOpenRecordPayment: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onMenuToggle,
  onOpenAddMember,
  onOpenRecordPayment,
}) => {
  const { members, setSelectedMember, setActiveNav } = useGym();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredMembers = searchQuery.trim()
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.phone.includes(searchQuery) ||
          m.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSearchResult = (member: any) => {
    setSelectedMember(member);
    setActiveNav('members');
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-cardBorder px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left section: Hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-brandNavy hover:bg-canvas rounded-sm transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mutedText" />
            <input
              type="text"
              placeholder="Search member by name, phone or ID... (Ctrl + K)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-9 pr-4 py-2 bg-canvas text-brandNavy placeholder-mutedText text-sm rounded-sm border border-cardBorder focus:outline-none focus:ring-2 focus:ring-actionBlue/30 focus:border-actionBlue transition-all"
            />
          </div>

          {/* Quick Search Dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-sm border border-cardBorder shadow-lg overflow-hidden z-50 max-h-64 overflow-y-auto">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSelectSearchResult(m)}
                    className="p-3 hover:bg-canvas cursor-pointer flex items-center justify-between border-b border-cardBorder/40 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatarUrl}
                        alt={m.name}
                        className="w-8 h-8 rounded-full object-cover border border-cardBorder"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-brandNavy">{m.name}</h4>
                        <p className="text-xs text-mutedText">{m.phone} • {m.planName}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-actionBlue">{m.id}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-mutedText">
                  No member found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Actions, Branch, Profile */}
      <div className="flex items-center gap-3">
        {/* Branch Selector */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-canvas border border-cardBorder rounded-sm text-xs font-medium text-brandNavy">
          <Building2 className="w-3.5 h-3.5 text-actionBlue" />
          <span>GYMOS Main • Velachery</span>
          <ChevronDown className="w-3 h-3 text-mutedText" />
        </div>

        {/* Action Buttons */}
        <Button
          variant="outline"
          size="sm"
          icon={<CreditCard className="w-3.5 h-3.5 text-actionBlue" />}
          onClick={onOpenRecordPayment}
          className="hidden sm:inline-flex"
        >
          Record Payment
        </Button>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={onOpenAddMember}
        >
          Add Member
        </Button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 text-brandNavy hover:bg-canvas rounded-sm border border-cardBorder transition-colors relative">
            <Bell className="w-4 h-4 text-mutedText" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
