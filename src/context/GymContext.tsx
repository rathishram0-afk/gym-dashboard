import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Member,
  AttendanceRecord,
  PaymentTransaction,
  MembershipPlan,
  ActivityEvent,
  GymStats,
  ToastMessage,
  PaymentMethod,
  PaymentStatus,
  AutomationSettings,
  CheckoutSession,
} from '../types';
import {
  initialMembers,
  initialAttendance,
  initialPayments,
  initialPlans,
  initialActivities,
  initialStats,
  initialAutomationSettings,
} from '../data/mockData';

interface AddMemberPayload {
  name: string;
  phone: string;
  email?: string;
  gender: 'Male' | 'Female' | 'Other';
  planId: string;
  planName: string;
  planPrice: number;
  joiningDate: string;
  startDate: string;
  expiryDate: string;
  amount: number;
  discountAmount?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  emergencyContact?: string;
  address?: string;
  notes?: string;
}

interface RecordPaymentPayload {
  memberId: string;
  amount: number;
  planName: string;
  planDurationMonths?: number;
  method: PaymentMethod;
  status: PaymentStatus;
  notes?: string;
}

interface NetworkInfo {
  ip: string;
  port: number;
  appUrl: string;
  configuredUrl: string | null;
  isConfigured: boolean;
}

interface GymContextType {
  members: Member[];
  attendance: AttendanceRecord[];
  payments: PaymentTransaction[];
  plans: MembershipPlan[];
  activities: ActivityEvent[];
  stats: GymStats;
  toasts: ToastMessage[];
  automationSettings: AutomationSettings;
  selectedMember: Member | null;
  activeNav: string;
  qrModalMember: Member | null;
  lastCheckedInSession: CheckoutSession | null;
  networkInfo: NetworkInfo | null;
  setQrModalMember: (m: Member | null) => void;
  setActiveNav: (nav: string) => void;
  setSelectedMember: (member: Member | null) => void;
  setAutomationSettings: React.Dispatch<React.SetStateAction<AutomationSettings>>;
  showToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
  addMember: (payload: AddMemberPayload) => void;
  updateMember: (id: string, updated: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  toggleSuspendMember: (id: string) => void;
  checkInMember: (memberId: string) => { success: boolean; message: string; session?: CheckoutSession; restricted?: boolean };
  memberSelfCheckOut: (token: string) => { success: boolean; message: string; duration?: string };
  adminOverrideCheckOut: (attendanceIdOrMemberId: string) => void;
  recordPayment: (payload: RecordPaymentPayload) => void;
  updatePlanPrice: (planId: string, newPrice: number) => void;
  sendWhatsAppReminder: (member: Member) => void;
  simulateOnlinePaymentSuccess: (memberId: string) => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem('gymos_members');
      return saved ? JSON.parse(saved) : initialMembers;
    } catch {
      return initialMembers;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('gymos_attendance');
      return saved ? JSON.parse(saved) : initialAttendance;
    } catch {
      return initialAttendance;
    }
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('gymos_payments');
      return saved ? JSON.parse(saved) : initialPayments;
    } catch {
      return initialPayments;
    }
  });

  const [plans, setPlans] = useState<MembershipPlan[]>(() => {
    try {
      const saved = localStorage.getItem('gymos_plans');
      return saved ? JSON.parse(saved) : initialPlans;
    } catch {
      return initialPlans;
    }
  });

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    try {
      const saved = localStorage.getItem('gymos_activities');
      return saved ? JSON.parse(saved) : initialActivities;
    } catch {
      return initialActivities;
    }
  });

  const [stats, setStats] = useState<GymStats>(() => {
    try {
      const saved = localStorage.getItem('gymos_stats');
      return saved ? JSON.parse(saved) : initialStats;
    } catch {
      return initialStats;
    }
  });

  const [automationSettings, setAutomationSettings] = useState<AutomationSettings>(initialAutomationSettings);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [qrModalMember, setQrModalMember] = useState<Member | null>(null);
  const [lastCheckedInSession, setLastCheckedInSession] = useState<CheckoutSession | null>(null);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [activeNav, setActiveNav] = useState<string>('attendance');

  // Fetch Network LAN Info on mount
  useEffect(() => {
    fetch('/api/network-info')
      .then((res) => res.json())
      .then((data: NetworkInfo) => {
        setNetworkInfo(data);
      })
      .catch((err) => {
        console.warn('Network info fetch error:', err);
        setNetworkInfo({
          ip: '192.168.1.4',
          port: 3006,
          appUrl: 'http://192.168.1.4:3006',
          configuredUrl: null,
          isConfigured: false,
        });
      });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gymos_members', JSON.stringify(members));
      localStorage.setItem('gymos_attendance', JSON.stringify(attendance));
      localStorage.setItem('gymos_payments', JSON.stringify(payments));
      localStorage.setItem('gymos_plans', JSON.stringify(plans));
      localStorage.setItem('gymos_activities', JSON.stringify(activities));
      localStorage.setItem('gymos_stats', JSON.stringify(stats));
    } catch (e) {
      console.error('Storage sync error:', e);
    }
  }, [members, attendance, payments, plans, activities, stats]);

  // MULTI-DEVICE REAL-TIME SYNCHRONIZATION: Server-Sent Events (SSE) + BroadcastChannel + Storage
  useEffect(() => {
    const handleCheckoutEvent = (data: any) => {
      if (data.type === 'MEMBER_CHECKED_OUT') {
        const { attendanceId, token, checkOutTime, duration, memberName, memberId } = data;

        setAttendance((prev) =>
          prev.map((rec) => {
            if (rec.id === attendanceId || rec.checkoutToken === token || (memberId && rec.memberId === memberId && rec.status === 'Inside')) {
              return {
                ...rec,
                checkOutTime: checkOutTime,
                duration: duration,
                status: 'Completed',
                checkoutMethod: 'Self (WhatsApp)',
                checkoutToken: undefined,
              };
            }
            return rec;
          })
        );

        setStats((prev) => ({
          ...prev,
          todayCheckedOut: prev.todayCheckedOut + 1,
          currentlyInside: Math.max(0, prev.currentlyInside - 1),
        }));

        const newActivity: ActivityEvent = {
          id: 'ACT-' + Date.now(),
          type: 'check_out',
          title: `${memberName || 'Member'} checked out via WhatsApp`,
          description: `Logged at ${checkOutTime} • Duration: ${duration}`,
          timestamp: 'Just now',
          memberId: memberId,
        };
        setActivities((prev) => [newActivity, ...prev]);

        showToast(
          'info',
          'Real-Time Mobile Check-Out',
          `${memberName || 'Member'} checked out from mobile phone (${duration}).`
        );
      }
    };

    // 1. Establish Server-Sent Events (SSE) connection to sync real mobile devices with Admin PC
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          handleCheckoutEvent(parsed);
        } catch {}
      };
      eventSource.onerror = () => {
        // SSE reconnects automatically
      };
    } catch (e) {
      console.warn('SSE not supported:', e);
    }

    // 2. BroadcastChannel for same-PC tabs
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('gymos_realtime');
      channel.onmessage = (e) => {
        if (e.data) handleCheckoutEvent(e.data);
      };
    }

    // 3. Storage event listener
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'gymos_attendance' && e.newValue) {
        try {
          setAttendance(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === 'gymos_stats' && e.newValue) {
        try {
          setStats(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === 'gymos_activities' && e.newValue) {
        try {
          setActivities(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      if (eventSource) eventSource.close();
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const showToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // CHECK IN: Admin does fast Check-In -> Creates attendance session & posts to server
  const checkInMember = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) {
      showToast('error', 'Member Not Found', 'No member matching the provided ID.');
      return { success: false, message: 'Member not found' };
    }

    const isAlreadyInside = attendance.some((a) => a.memberId === member.id && a.status === 'Inside');
    if (isAlreadyInside) {
      showToast('warning', 'Already Inside', `${member.name} is already checked in on the floor.`);
      return { success: false, message: 'Already checked in' };
    }

    if (member.status === 'Restricted' || (member.daysOverdue && member.daysOverdue > automationSettings.gracePeriodDays)) {
      showToast(
        'error',
        'ACCESS RESTRICTED',
        `${member.name}'s membership is overdue (Due: ₹${member.dueAmount.toLocaleString('en-IN')}). Collect payment to allow entry.`
      );
      return { success: false, message: 'Access Restricted - Overdue', restricted: true };
    }

    if (member.status === 'Suspended') {
      showToast('error', 'Access Suspended', `${member.name}'s access was manually suspended.`);
      return { success: false, message: 'Access Suspended', restricted: true };
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const attId = 'ATT-' + Math.floor(1000 + Math.random() * 9000);
    const token = 'tok_live_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);

    const newRecord: AttendanceRecord = {
      id: attId,
      memberId: member.id,
      memberName: member.name,
      memberPhone: member.phone,
      memberPlan: member.planName,
      avatarUrl: member.avatarUrl,
      checkInTime: timeStr,
      date: now.toISOString().split('T')[0],
      status: 'Inside',
      checkoutToken: token,
    };

    const session: CheckoutSession = {
      token: token,
      attendanceId: attId,
      memberId: member.id,
      memberName: member.name,
      memberPhone: member.phone,
      memberPlan: member.planName,
      checkInTime: timeStr,
      date: now.toISOString().split('T')[0],
      createdAt: Date.now(),
      isUsed: false,
    };

    // Post to Server sync endpoint
    fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    }).catch((e) => console.warn('Sync server checkin error:', e));

    // Save session into shared localStorage
    try {
      const storedSessionsRaw = localStorage.getItem('gymos_checkout_sessions');
      const storedSessions: CheckoutSession[] = storedSessionsRaw ? JSON.parse(storedSessionsRaw) : [];
      storedSessions.unshift(session);
      localStorage.setItem('gymos_checkout_sessions', JSON.stringify(storedSessions));
    } catch (e) {}

    setAttendance((prev) => [newRecord, ...prev]);
    setLastCheckedInSession(session);

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === member.id) {
          return {
            ...m,
            lastAttendance: `Today, ${timeStr}`,
            attendanceCountThisMonth: m.attendanceCountThisMonth + 1,
          };
        }
        return m;
      })
    );

    setStats((prev) => ({
      ...prev,
      todayAttendance: prev.todayAttendance + 1,
      todayCheckedIn: prev.todayCheckedIn + 1,
      currentlyInside: prev.currentlyInside + 1,
    }));

    const newActivity: ActivityEvent = {
      id: 'ACT-' + Date.now(),
      type: 'check_in',
      title: `${member.name} checked in`,
      description: `Logged at ${timeStr} • WhatsApp checkout link ready for +91 ${member.phone}`,
      timestamp: 'Just now',
      memberId: member.id,
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Toast: "{MEMBER_NAME} checked in successfully."
    showToast('success', `${member.name} checked in successfully.`, 'WhatsApp checkout link ready.');

    return { success: true, message: 'Checked in successfully', session };
  };

  // MEMBER SELF CHECK-OUT
  const memberSelfCheckOut = (token: string) => {
    const targetRecord = attendance.find((a) => a.checkoutToken === token && a.status === 'Inside');
    if (!targetRecord) {
      return { success: false, message: 'Invalid, expired, or already used checkout token.' };
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const duration = '1h 24m';

    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, duration, attendanceId: targetRecord.id, memberName: targetRecord.memberName, checkInTime: targetRecord.checkInTime }),
    }).catch((e) => console.warn('Sync server checkout error:', e));

    setAttendance((prev) =>
      prev.map((rec) => {
        if (rec.id === targetRecord.id) {
          return {
            ...rec,
            checkOutTime: timeStr,
            duration: duration,
            status: 'Completed',
            checkoutMethod: 'Self (WhatsApp)',
            checkoutToken: undefined,
          };
        }
        return rec;
      })
    );

    setStats((prev) => ({
      ...prev,
      todayCheckedOut: prev.todayCheckedOut + 1,
      currentlyInside: Math.max(0, prev.currentlyInside - 1),
    }));

    const newActivity: ActivityEvent = {
      id: 'ACT-' + Date.now(),
      type: 'check_out',
      title: `${targetRecord.memberName} checked out via WhatsApp`,
      description: `Completed workout (${targetRecord.checkInTime} → ${timeStr} • ${duration})`,
      timestamp: 'Just now',
      memberId: targetRecord.memberId,
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast('info', 'Member Checked Out', `${targetRecord.memberName} checked out via WhatsApp (${duration}).`);

    return { success: true, message: 'Checked out successfully', duration };
  };

  // ADMIN OVERRIDE CHECK-OUT
  const adminOverrideCheckOut = (idOrMemberId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    let memberName = 'Member';
    let duration = '1h 15m';

    setAttendance((prev) =>
      prev.map((rec) => {
        if ((rec.id === idOrMemberId || rec.memberId === idOrMemberId) && rec.status === 'Inside') {
          memberName = rec.memberName;
          return {
            ...rec,
            checkOutTime: timeStr,
            duration: duration,
            status: 'Completed',
            checkoutMethod: 'Admin Override',
            checkoutToken: undefined,
          };
        }
        return rec;
      })
    );

    setStats((prev) => ({
      ...prev,
      todayCheckedOut: prev.todayCheckedOut + 1,
      currentlyInside: Math.max(0, prev.currentlyInside - 1),
    }));

    const newActivity: ActivityEvent = {
      id: 'ACT-' + Date.now(),
      type: 'check_out',
      title: `${memberName} checked out (Admin Override)`,
      description: `Manually clocked out by receptionist at ${timeStr}`,
      timestamp: 'Just now',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast('info', 'Admin Override Check-Out', `${memberName} checked out at ${timeStr}.`);
  };

  const addMember = (payload: AddMemberPayload) => {
    const count = members.length + 101;
    const padded = String(count).padStart(6, '0');
    const newId = 'GYM-' + padded;

    const expDate = new Date(payload.expiryDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const isPaid = payload.paymentStatus === 'Paid';
    const isPartial = payload.paymentStatus === 'Partial';
    const dueAmount = isPaid ? 0 : Math.max(0, payload.planPrice - payload.amount);

    const slug = payload.name.toLowerCase().replace(/\s+/g, '-');
    const paymentLink = `https://pay.gymos.fit/r/${slug}-${padded.slice(-4)}`;

    const newMember: Member = {
      id: newId,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      gender: payload.gender,
      planId: payload.planId,
      planName: payload.planName,
      planPrice: payload.planPrice,
      joiningDate: payload.joiningDate,
      startDate: payload.startDate,
      expiryDate: payload.expiryDate,
      daysRemaining: daysRemaining,
      status: 'Active',
      paymentStatus: payload.paymentStatus,
      amountPaid: payload.amount,
      dueAmount: dueAmount,
      discountAmount: payload.discountAmount || 0,
      paymentMethod: payload.paymentMethod,
      attendanceCountThisMonth: 0,
      emergencyContact: payload.emergencyContact,
      address: payload.address,
      notes: payload.notes,
      lastPaymentDate: (isPaid || isPartial) ? payload.joiningDate : undefined,
      paymentLink: paymentLink,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    setMembers((prev) => [newMember, ...prev]);

    if (payload.amount > 0 && (isPaid || isPartial)) {
      const newTxn: PaymentTransaction = {
        id: 'PAY-' + Math.floor(500 + Math.random() * 500),
        transactionCode: 'TXN-' + Math.floor(90000 + Math.random() * 9999),
        memberId: newId,
        memberName: newMember.name,
        memberPhone: newMember.phone,
        amount: payload.amount,
        planName: newMember.planName,
        method: payload.paymentMethod,
        date: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: isPaid ? 'Paid' : 'Partial',
        invoiceNumber: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
      };
      setPayments((prev) => [newTxn, ...prev]);
    }

    setStats((prev) => ({
      ...prev,
      totalMembers: prev.totalMembers + 1,
      activeMembers: prev.activeMembers + 1,
      todayCollection: prev.todayCollection + ((isPaid || isPartial) ? payload.amount : 0),
      monthRevenue: prev.monthRevenue + ((isPaid || isPartial) ? payload.amount : 0),
      pendingCollection: prev.pendingCollection + dueAmount,
    }));

    const newActivities: ActivityEvent[] = [
      {
        id: 'ACT-' + Date.now(),
        type: 'join',
        title: `${newMember.name} joined the gym`,
        description: `Plan: ${newMember.planName} (${newMember.id})`,
        timestamp: 'Just now',
        memberId: newId,
      },
    ];

    if (payload.amount > 0) {
      newActivities.unshift({
        id: 'ACT-' + (Date.now() + 1),
        type: 'payment',
        title: `₹${payload.amount.toLocaleString('en-IN')} payment received from ${newMember.name}`,
        description: `Method: ${payload.paymentMethod} | Status: ${payload.paymentStatus}`,
        timestamp: 'Just now',
        memberId: newId,
      });
    }

    setActivities((prev) => [...newActivities, ...prev]);

    showToast(
      'success',
      'Member Created & Active',
      `${newMember.name} (${newId}) enrolled with ${newMember.planName} plan.`
    );
  };

  const recordPayment = (payload: RecordPaymentPayload) => {
    const member = members.find((m) => m.id === payload.memberId);
    if (!member) return;

    const isPaid = payload.status === 'Paid';
    const matchedPlan = plans.find((p) => p.name === payload.planName) || plans[0];
    const durationMonths = payload.planDurationMonths || matchedPlan.durationMonths || 1;

    const base = new Date(member.expiryDate);
    const curr = new Date();
    const startFrom = (base < curr) ? curr : base;
    startFrom.setMonth(startFrom.getMonth() + durationMonths);
    startFrom.setDate(startFrom.getDate() - 1);
    const newExpiry = startFrom.toISOString().split('T')[0];

    const expDate = new Date(newExpiry);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const newTxn: PaymentTransaction = {
      id: 'PAY-' + Math.floor(500 + Math.random() * 500),
      transactionCode: 'TXN-' + Math.floor(90000 + Math.random() * 9999),
      memberId: member.id,
      memberName: member.name,
      memberPhone: member.phone,
      amount: payload.amount,
      planName: payload.planName || member.planName,
      method: payload.method,
      date: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: payload.status,
      invoiceNumber: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
      notes: payload.notes,
    };

    setPayments((prev) => [newTxn, ...prev]);

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === member.id) {
          const updated: Member = {
            ...m,
            paymentStatus: payload.status,
            status: 'Active',
            amountPaid: m.amountPaid + payload.amount,
            dueAmount: isPaid ? 0 : Math.max(0, m.dueAmount - payload.amount),
            daysOverdue: 0,
            gracePeriodDaysRemaining: undefined,
            expiryDate: newExpiry,
            daysRemaining: daysRemaining,
            lastPaymentDate: new Date().toISOString().split('T')[0],
            paymentMethod: payload.method,
          };
          if (selectedMember && selectedMember.id === m.id) {
            setSelectedMember(updated);
          }
          return updated;
        }
        return m;
      })
    );

    setStats((prev) => ({
      ...prev,
      todayCollection: prev.todayCollection + payload.amount,
      monthRevenue: prev.monthRevenue + payload.amount,
      pendingCollection: Math.max(0, prev.pendingCollection - payload.amount),
      overdueCount: Math.max(0, prev.overdueCount - (member.dueAmount > 0 && isPaid ? 1 : 0)),
    }));

    const newActivity: ActivityEvent = {
      id: 'ACT-' + Date.now(),
      type: 'payment',
      title: `${member.name} renewed membership for ₹${payload.amount.toLocaleString('en-IN')}`,
      description: `Plan: ${payload.planName} (Expires ${newExpiry}) | Method: ${payload.method}`,
      timestamp: 'Just now',
      memberId: member.id,
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(
      'success',
      'Payment Recorded & Access Restored',
      `${member.name}'s membership renewed to ${newExpiry}.`
    );
  };

  const simulateOnlinePaymentSuccess = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    recordPayment({
      memberId: member.id,
      amount: member.dueAmount > 0 ? member.dueAmount : member.planPrice,
      planName: member.planName,
      method: 'Online',
      status: 'Paid',
      notes: 'Online Payment Link webhook verified',
    });

    setQrModalMember(null);
  };

  const updatePlanPrice = (planId: string, newPrice: number) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          return { ...p, price: newPrice };
        }
        return p;
      })
    );
    showToast('success', 'Plan Price Updated', `Plan price updated to ₹${newPrice.toLocaleString('en-IN')}.`);
  };

  const updateMember = (id: string, updated: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const mod = { ...m, ...updated };
          if (selectedMember && selectedMember.id === id) {
            setSelectedMember(mod);
          }
          return mod;
        }
        return m;
      })
    );
    showToast('success', 'Member Updated', 'Member details updated successfully.');
  };

  const deleteMember = (id: string) => {
    const target = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (selectedMember && selectedMember.id === id) {
      setSelectedMember(null);
    }
    setStats((prev) => ({
      ...prev,
      totalMembers: Math.max(0, prev.totalMembers - 1),
    }));
    showToast('info', 'Member Removed', `${target?.name || 'Member'} removed from database.`);
  };

  const toggleSuspendMember = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newStatus = m.status === 'Suspended' ? 'Active' : 'Suspended';
          const updated = { ...m, status: newStatus };
          if (selectedMember && selectedMember.id === id) {
            setSelectedMember(updated);
          }
          showToast(
            newStatus === 'Suspended' ? 'warning' : 'success',
            newStatus === 'Suspended' ? 'Access Suspended' : 'Access Restored',
            `${m.name}'s biometric access is now ${newStatus.toLowerCase()}.`
          );
          return updated;
        }
        return m;
      })
    );
  };

  const sendWhatsAppReminder = (member: Member) => {
    const link = member.paymentLink || `https://pay.gymos.fit/r/${member.name.toLowerCase().replace(/\s+/g, '-')}-${member.id.slice(-4)}`;
    const text = `Hi ${member.name} 👋\n\nYour GYMOS membership is expiring soon.\n\nPlan: ${member.planName}\nExpiry Date: ${member.expiryDate}\nRenewal Amount: ₹${(member.dueAmount || member.planPrice).toLocaleString('en-IN')}\n\nYou can renew your membership using the payment link below:\n\n${link}\n\nThank you,\nGYMOS Fitness`;
    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/91${member.phone}?text=${encoded}`;
    window.open(waUrl, '_blank');
    showToast('success', 'WhatsApp Triggered', `Reminder dispatched to ${member.name} (${member.phone}).`);
  };

  return (
    <GymContext.Provider
      value={{
        members,
        attendance,
        payments,
        plans,
        activities,
        stats,
        toasts,
        automationSettings,
        selectedMember,
        activeNav,
        qrModalMember,
        lastCheckedInSession,
        networkInfo,
        setQrModalMember,
        setActiveNav,
        setSelectedMember,
        setAutomationSettings,
        showToast,
        removeToast,
        addMember,
        updateMember,
        deleteMember,
        toggleSuspendMember,
        checkInMember,
        memberSelfCheckOut,
        adminOverrideCheckOut,
        recordPayment,
        updatePlanPrice,
        sendWhatsAppReminder,
        simulateOnlinePaymentSuccess,
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
