import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PaymentTransaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Printer, Download, Dumbbell } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!transaction) return null;

  const basePrice = Math.round((transaction.amount / 1.18) * 100) / 100;
  const gstAmount = Math.round((transaction.amount - basePrice) * 100) / 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tax Invoice & Receipt"
      subtitle={`Invoice No: ${transaction.invoiceNumber}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Printable Card */}
        <div className="bg-canvas p-6 rounded-md border border-cardBorder font-sans">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-cardBorder/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-actionBlue flex items-center justify-center text-white">
                <Dumbbell className="w-5 h-5 transform -rotate-45" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brandNavy">GYMOS Fitness Pvt Ltd</h3>
                <p className="text-xs text-mutedText">GSTIN: 33AAACG0123M1ZT</p>
                <p className="text-xs text-mutedText">Velachery Main Rd, Chennai 600042</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-actionBlue bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-200">
                PAID INVOICE
              </span>
              <p className="text-xs text-mutedText mt-1">Date: {transaction.date}</p>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-4 my-4 text-xs">
            <div>
              <span className="text-mutedText uppercase text-[10px] font-semibold">Billed To</span>
              <h4 className="font-bold text-brandNavy text-sm mt-0.5">{transaction.memberName}</h4>
              <p className="text-mutedText">Member ID: {transaction.memberId}</p>
              <p className="text-mutedText">Mobile: +91 {transaction.memberPhone}</p>
            </div>
            <div className="text-right">
              <span className="text-mutedText uppercase text-[10px] font-semibold">Transaction Details</span>
              <p className="font-semibold text-brandNavy mt-0.5">Code: {transaction.transactionCode}</p>
              <p className="text-mutedText">Mode: {transaction.method}</p>
            </div>
          </div>

          {/* Line Items */}
          <table className="w-full text-xs text-left border-collapse my-4">
            <thead>
              <tr className="bg-white border-y border-cardBorder font-semibold text-brandNavy">
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3 text-right">Base Amount</th>
                <th className="py-2 px-3 text-right">GST (18%)</th>
                <th className="py-2 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-cardBorder/60">
                <td className="py-3 px-3 font-medium text-brandNavy">{transaction.planName}</td>
                <td className="py-3 px-3 text-right">{formatCurrency(basePrice)}</td>
                <td className="py-3 px-3 text-right">{formatCurrency(gstAmount)}</td>
                <td className="py-3 px-3 text-right font-bold text-brandNavy">{formatCurrency(transaction.amount)}</td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end pt-2">
            <div className="text-right space-y-1">
              <div className="text-xs text-mutedText">Grand Total Received</div>
              <div className="text-xl font-bold text-actionBlue">{formatCurrency(transaction.amount)}</div>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" icon={<Printer className="w-3.5 h-3.5" />} onClick={() => window.print()}>
            Print Receipt
          </Button>
          <Button variant="primary" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={onClose}>
            Download PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};
