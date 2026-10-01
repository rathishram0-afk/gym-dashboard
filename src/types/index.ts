export type MembershipStatus = 'Active' | 'Expiring' | 'Expired' | 'Restricted' | 'Suspended';
export type PaymentStatus = 'Paid' | 'Partial' | 'Pending' | 'Overdue';
export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Online' | 'Credit Card' | 'Debit Card' | 'Net Banking';

export interface Member {
  id: string; // e.g. GYM-000101
  name: string;
  email?: string;
  phone: string;
  avatarUrl?: string;
  planId: string;
  planName: string; // '1 Month', '6 Months', '1 Year'
  planPrice: number; // ₹1,000, ₹5,000, ₹10,000
  joiningDate: string; // YYYY-MM-DD
  startDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  daysRemaining: number;
  status: MembershipStatus;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  dueAmount: number;
  discountAmount?: number;
  paymentMethod?: PaymentMethod;
  daysOverdue?: number;
  gracePeriodDaysRemaining?: number;
  lastAttendance?: string;
  attendanceCountThisMonth: number;
  gender: 'Male' | 'Female' | 'Other';
  emergencyContact?: string;
  address?: string;
  notes?: string;
  lastPaymentDate?: string;
  paymentLink?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  memberPlan: string;
  avatarUrl?: string;
  checkInTime: string; // e.g. 06:45 PM
  checkOutTime?: string; // e.g. 08:15 PM
  duration?: string;
  date: string;
  status: 'Inside' | 'Completed';
  checkoutToken?: string;
  checkoutMethod?: 'Self (WhatsApp)' | 'Admin Override';
}

export interface CheckoutSession {
  token: string;
  attendanceId: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  memberPlan: string;
  checkInTime: string;
  date: string;
  createdAt: number;
  isUsed: boolean;
  completedAt?: string;
  duration?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionCode: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  amount: number;
  planName: string;
  method: PaymentMethod;
  date: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Failed' | 'Refunded';
  invoiceNumber: string;
  notes?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  durationLabel: string;
  description?: string;
  features: string[];
  activeMembersCount: number;
  isPopular?: boolean;
}

export interface ActivityEvent {
  id: string;
  type: 'check_in' | 'check_out' | 'payment' | 'renewal' | 'expired' | 'suspended' | 'restricted' | 'join';
  title: string;
  description: string;
  timestamp: string;
  memberId?: string;
}

export interface AutomationSettings {
  reminder15Days: boolean;
  reminder10Days: boolean;
  reminder5Days: boolean;
  reminder2Days: boolean;
  reminderExpiryDay: boolean;
  gracePeriodDays: number;
  autoRestrictAccess: boolean;
  sendPaymentLinksOnExpiry: boolean;
}

export interface GymStats {
  totalMembers: number;
  totalMembersGrowth: number;
  activeMembers: number;
  activeMembersRate: number;
  expiringSoonCount: number;
  overdueCount: number;
  todayCollection: number;
  monthRevenue: number;
  monthRevenueGrowth: number;
  pendingCollection: number;
  overdueCollection: number;
  todayAttendance: number;
  todayCheckedIn: number;
  todayCheckedOut: number;
  currentlyInside: number;
  peakDay: string;
  avgDailyAttendance: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
}
