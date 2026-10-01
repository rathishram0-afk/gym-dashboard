import React from 'react';
import { useGym } from '../../context/GymContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  Tag,
  Zap,
  BarChart3,
  Bell,
  Settings,
  Dumbbell,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeNav, setActiveNav } = useGym();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users, badge: '1,248' },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, badge: '186' },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'plans', label: 'Plans & Pricing', icon: Tag },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (id: string) => {
    setActiveNav(id);
    setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-brandNavy/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-cardBorder flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b border-cardBorder/70">
          <div className="w-10 h-10 rounded-sm bg-actionBlue flex items-center justify-center text-white shadow-sm">
            <Dumbbell className="w-5 h-5 transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold tracking-tight text-brandNavy">GYMOS</span>
              <span className="w-2 h-2 rounded-full bg-actionBlue"></span>
            </div>
            <p className="text-[11px] text-mutedText font-medium tracking-wide">FITNESS SAAS ADMIN</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-mutedText uppercase tracking-wider mb-2">
            Main Management
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-canvas text-actionBlue border-l-4 border-actionBlue font-semibold shadow-xs'
                    : 'text-mutedText hover:text-brandNavy hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-actionBlue' : 'text-mutedText'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-blue-100 text-actionBlue' : 'bg-slate-100 text-mutedText'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-cardBorder/80 bg-canvas/70">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Admin"
                className="w-9 h-9 rounded-full object-cover border border-cardBorder"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-brandNavy truncate">Rathish Kumar</h4>
              <p className="text-[11px] text-mutedText truncate">Gym Owner • Velachery</p>
            </div>
            <button
              title="Logout"
              className="p-1.5 text-mutedText hover:text-rose-600 rounded hover:bg-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
