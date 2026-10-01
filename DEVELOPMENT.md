# GymOS — Development Specification & Technical Architecture

> **Project**: GymOS — SaaS Admin Dashboard for Gym Management  
> **Type**: Frontend SPA MVP / Production-Ready Architecture  
> **Color Theme**: Hubstaff Palette (`#F2F8FF` Canvas, `#FFFFFF` Surface, `#253053` Navy Text, `#0000EE` Action Blue, `#C6C6DD` Border, `#636B83` Muted Text)  
> **Typography**: Poppins, Arial, sans-serif  
> **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts  

---

## 1. Project Directory Structure

```
gymos-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopNav.tsx
│   │   ├── common/
│   │   │   ├── StatCard.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── SlideDrawer.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── dashboard/
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── AttendanceChart.tsx
│   │   │   ├── ExpiringMembersCard.tsx
│   │   │   ├── OverdueFollowupCard.tsx
│   │   │   └── RecentActivityCard.tsx
│   │   ├── members/
│   │   │   ├── MemberList.tsx
│   │   │   ├── MemberProfileDrawer.tsx
│   │   │   ├── AddMemberModal.tsx
│   │   │   └── EditMemberModal.tsx
│   │   ├── attendance/
│   │   │   ├── AttendanceStats.tsx
│   │   │   ├── LiveCheckInBar.tsx
│   │   │   └── AttendanceTable.tsx
│   │   ├── payments/
│   │   │   ├── PaymentStats.tsx
│   │   │   ├── PaymentLedgerTable.tsx
│   │   │   ├── RecordPaymentModal.tsx
│   │   │   └── InvoiceModal.tsx
│   │   ├── plans/
│   │   │   ├── PlanCards.tsx
│   │   │   └── CreatePlanModal.tsx
│   │   ├── automation/
│   │   │   └── AutomationWorkflow.tsx
│   │   ├── reports/
│   │   │   └── ReportsView.tsx
│   │   └── settings/
│   │       └── SettingsView.tsx
│   ├── context/
│   │   ├── GymContext.tsx
│   │   └── ToastContext.tsx
│   ├── data/
│   │   └── mockData.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── dateUtils.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── DESIGN.md
└── DEVELOPMENT.md
```

---

## 2. Core Data Models (TypeScript Interfaces)

```typescript
// Member Status
export type MembershipStatus = 'Active' | 'Expiring' | 'Expired' | 'Suspended';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  planId: string;
  planName: string;
  startDate: string; // YYYY-MM-DD
  expiryDate: string;
  daysRemaining: number;
  status: MembershipStatus;
  paymentStatus: PaymentStatus;
  dueAmount: number;
  daysOverdue?: number;
  lastAttendance?: string;
  attendanceCountThisMonth: number;
  emergencyContact?: string;
  gender: 'Male' | 'Female' | 'Other';
  address?: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  checkInTime: string; // e.g. "06:45 AM"
  checkOutTime?: string; // e.g. "08:15 AM" or undefined
  duration?: string; // e.g. "1h 30m"
  date: string; // YYYY-MM-DD
  status: 'Inside' | 'Completed';
}

export interface PaymentTransaction {
  id: string;
  transactionCode: string; // e.g. "TXN-98421"
  memberId: string;
  memberName: string;
  amount: number;
  planName: string;
  method: 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Net Banking';
  date: string; // YYYY-MM-DD HH:mm
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  invoiceNumber: string; // e.g. "INV-2026-0891"
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  durationLabel: string;
  features: string[];
  activeMembersCount: number;
  isPopular?: boolean;
}

export interface ActivityEvent {
  id: string;
  type: 'check_in' | 'check_out' | 'payment' | 'renewal' | 'expired' | 'suspended';
  title: string;
  description: string;
  timestamp: string; // e.g. "2 minutes ago"
  memberId?: string;
}
```

---

## 3. Tailwind Configuration for Token Mapping

```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F2F8FF",      // color-6
        surface: "#DFDFDF",     // color-5
        brandNavy: "#253053",   // color-1 (Text Primary & Headings)
        actionBlue: "#0000EE",  // color-2 (CTA & Active Items)
        mutedText: "#636B83",   // color-3 (Secondary & Meta text)
        cardBorder: "#C6C6DD",  // color-4 (Borders & Dividers)
      },
      fontFamily: {
        sans: ["Poppins", "Arial", "sans-serif"],
      },
      borderRadius: {
        'sm': '12px',
        'md': '16px',
        'lg': '32px',
      },
      boxShadow: {
        'card': '0 2px 8px -1px rgba(37, 48, 83, 0.05), 0 1px 4px -1px rgba(37, 48, 83, 0.03)',
        'modal': '0 20px 40px -15px rgba(37, 48, 83, 0.15)',
      }
    },
  },
  plugins: [],
}
```

---

## 4. Priority Screen Implementation & Workflows

### Screen 1: Dashboard (`/dashboard`)
- **KPI Metrics (4 Cards)**: Total Members (`1,248`), Active Members (`1,086`), Expiring Soon (`42`), Overdue Payments (`18`).
- **Revenue Analytics**: Monthly Collection `₹4,82,500` (+12.5%), interactive Recharts chart with 7D, 30D, 6M, 1Y filters using `#0000EE` & `#253053` gradients.
- **Attendance Overview**: Mon-Sun bar chart with Peak Day (Saturday) and Daily Average (`186`).
- **Overdue Payment Follow-ups**: List with ₹ due amounts, days overdue, and direct WhatsApp 1-Click Reminder button.
- **Expiring Soon Members**: List with remaining days pill and quick renewal button.
- **Recent Activity Feed**: Real-time style timeline.

### Screen 2: Members Management (`/members`)
- **Search & Filter Bar**: Search by name/phone + filter tabs (`All`, `Active`, `Expiring Soon`, `Expired`, `Payment Due`).
- **Interactive Table**: Full member attributes, badges, and instant actions (`View`, `Edit`, `Suspend`, `Delete`).
- **Add/Edit Member Modal**: Comprehensive form with validation, plan dropdown, and start date.
- **Member Profile Slide-over Drawer**:
  - Profile header with photo avatar, name, ID, phone, and quick actions.
  - Tab 1: Personal & Membership Information
  - Tab 2: Payment History (invoices, transaction IDs)
  - Tab 3: Attendance Logs (check-in/out times, duration)
  - Tab 4: Audit Timeline

### Screen 3: Attendance Hub (`/attendance`)
- **Live Counters**: Today's Attendance (`186`), Checked In (`142`), Checked Out (`98`), Currently Inside (`44`).
- **1-Click Check-in / Check-out Bar**: Fast member search and instant status toggle.
- **Live Attendance Table**: Live status badges (`Inside` in green, `Completed` in slate), duration calculation, and action button.

### Screen 4: Payments & Billing (`/payments`)
- **Financial Counters**: Today's Collection (`₹32,500`), This Month (`₹4,82,500`), Pending (`₹42,000`), Overdue (`₹18,500`).
- **Transactions Table**: Search, filter by status (`Paid`, `Pending`, `Failed`, `Refunded`), method badges (UPI, Card, Cash).
- **Record Payment Modal**: Member selector, amount, payment method, date, receipt generator.
- **Printable GST Invoice Modal**: Clean, professional branded receipt with gym details and tax calculation.

---

## 5. Supplementary Modules
- **Plans Management**: Plan cards with features, pricing, active member counts, and create plan modal.
- **Automation Engine**: Visual step-by-step workflow (Due $\to$ 3 Days Overdue $\to$ Access Restricted $\to$ WhatsApp Reminder $\to$ Payment Link $\to$ Payment Received $\to$ Access Restored).
- **Reports**: Overview charts and mock CSV/PDF export.
- **Gym Settings**: Gym profile, contact details, operating hours, and staff management.
