import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { PaymentTransaction } from '../../types';
import { Search, Download, FileText } from 'lucide-react';
import { InvoiceModal } from './InvoiceModal';

export const PaymentLedgerTable: React.FC = () => {
  const { payments } = useGym();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Failed'>('All');
  const [viewInvoice, setViewInvoice] = useState<PaymentTransaction | null>(null);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'All') return true;
    return p.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge variant="success">Paid</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Failed':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="bg-white rounded-md border border-cardBorder shadow-card overflow-hidden">
        {/* Table controls */}
        <div className="p-4 sm:p-5 border-b border-cardBorder/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mutedText" />
            <input
              type="text"
              placeholder="Search by transaction ID, member or invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy placeholder-mutedText focus:outline-none focus:border-actionBlue"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-canvas p-1 rounded-sm border border-cardBorder text-xs font-medium">
            {(['All', 'Paid', 'Pending', 'Failed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-sm transition-all ${
                  statusFilter === tab
                    ? 'bg-white text-actionBlue font-semibold shadow-xs'
                    : 'text-mutedText hover:text-brandNavy'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => alert('Exporting Payment Ledger as CSV...')}
          >
            Export Ledger
          </Button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas/75 border-b border-cardBorder/80 text-[11px] font-semibold uppercase tracking-wider text-mutedText">
                <th className="py-3.5 px-4 sm:px-6">Transaction ID</th>
                <th className="py-3.5 px-4">Member</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Plan</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardBorder/50 text-sm">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-canvas/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 text-xs font-semibold text-actionBlue">
                      {pay.transactionCode}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-brandNavy">{pay.memberName}</div>
                      <span className="text-xs text-mutedText">{pay.memberId}</span>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-bold text-brandNavy">
                      {formatCurrency(pay.amount)}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-mutedText">
                      {pay.planName}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-medium text-brandNavy bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {pay.method}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-mutedText">
                      {pay.date}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(pay.status)}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<FileText className="w-3.5 h-3.5 text-actionBlue" />}
                        onClick={() => setViewInvoice(pay)}
                      >
                        Receipt
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-mutedText text-sm">
                    No transactions matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal
        isOpen={!!viewInvoice}
        onClose={() => setViewInvoice(null)}
        transaction={viewInvoice}
      />
    </>
  );
};
