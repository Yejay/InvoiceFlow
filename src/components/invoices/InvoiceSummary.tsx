"use client";

import { formatCurrency } from "@/lib/utils";

type InvoiceSummaryProps = {
  netTotal: number;
  vatTotal: number;
  grossTotal: number;
};

export default function InvoiceSummary({
  netTotal,
  vatTotal,
  grossTotal,
}: InvoiceSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Netto</span>
        <span className="font-medium">{formatCurrency(netTotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">MwSt.</span>
        <span className="font-medium">{formatCurrency(vatTotal)}</span>
      </div>
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="flex justify-between text-base">
          <span className="font-semibold text-gray-900">Brutto</span>
          <span className="font-bold text-gray-900">{formatCurrency(grossTotal)}</span>
        </div>
      </div>
    </div>
  );
}
