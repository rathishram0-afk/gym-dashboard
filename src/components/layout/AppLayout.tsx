import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { ToastContainer } from '../common/ToastContainer';
import { AddMemberModal } from '../members/AddMemberModal';
import { RecordPaymentModal } from '../payments/RecordPaymentModal';
import { PaymentQRModal } from '../common/PaymentQRModal';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas flex flex-col font-sans">
      <ToastContainer />
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="lg:pl-64 flex flex-col flex-1">
        <TopNav
          onMenuToggle={() => setMobileOpen(!mobileOpen)}
          onOpenAddMember={() => setIsAddMemberOpen(true)}
          onOpenRecordPayment={() => setIsRecordPaymentOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
      />
      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
      />
      <PaymentQRModal />
    </div>
  );
};
