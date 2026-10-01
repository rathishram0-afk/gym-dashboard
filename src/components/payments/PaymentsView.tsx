import React, { useState } from 'react';
import { PaymentStats } from './PaymentStats';
import { PaymentLedgerTable } from './PaymentLedgerTable';
import { RecordPaymentModal } from './RecordPaymentModal';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const [isRecordOpen, setIsRecordOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandNavy">
            Financial & Payment Management
          </h1>
          <p className="text-sm text-mutedText mt-0.5">
            Track daily UPI collections, outstanding overdue dues, and official GST tax receipts.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsRecordOpen(true)}
        >
          Record Payment
        </Button>
      </div>

      <PaymentStats />
      <PaymentLedgerTable />

      <RecordPaymentModal
        isOpen={isRecordOpen}
        onClose={() => setIsRecordOpen(false)}
      />
    </div>
  );
};
