"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import InvoiceItemsGrid, { type InvoiceItem } from "./InvoiceItemsGrid";
import InvoiceSummary from "./InvoiceSummary";
import { createInvoice, redirectToInvoice } from "@/app/(protected)/invoices/new/actions";
import { getTodayString, getDateFromNow, calculateInvoiceTotals } from "@/lib/utils";
import type { InvoiceFormData } from "@/lib/validations/invoice";

type Customer = {
  id: string;
  name: string;
};

type InvoiceFormProps = {
  customers: Customer[];
  defaultVatRate?: number;
};

export default function InvoiceForm({
  customers,
  defaultVatRate = 19,
}: InvoiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [customerId, setCustomerId] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>(getTodayString());
  const [dueDate, setDueDate] = useState<string>(getDateFromNow(14));
  const [status, setStatus] = useState<"draft" | "open">("draft");
  const [notes, setNotes] = useState<string>("");

  // Invoice items state
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: Math.random().toString(36).substring(2, 9),
      description: "",
      quantity: 1,
      unit: "Stk.",
      unit_price: 0,
      vat_rate: defaultVatRate,
      position: 0,
      net_amount: 0,
    },
  ]);

  // Calculate totals
  const totals = useMemo(() => {
    return calculateInvoiceTotals(items);
  }, [items]);

  const handleItemsChange = useCallback((newItems: InvoiceItem[]) => {
    setItems(newItems);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate customer selection
    if (!customerId) {
      setError("Bitte wählen Sie einen Kunden aus");
      return;
    }

    // Validate items
    const validItems = items.filter(item => item.description.trim() !== "");
    if (validItems.length === 0) {
      setError("Mindestens eine Position mit Beschreibung ist erforderlich");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: InvoiceFormData = {
        customer_id: customerId,
        invoice_date: invoiceDate,
        due_date: dueDate || null,
        status,
        notes: notes || null,
        items: validItems.map((item, index) => ({
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          vat_rate: item.vat_rate,
          position: index,
        })),
      };

      const result = await createInvoice(formData);

      if (result.success && result.invoiceId) {
        await redirectToInvoice(result.invoiceId);
      } else {
        setError(result.error || "Fehler beim Erstellen der Rechnung");
      }
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer and Date Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Rechnungsdetails
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kunde *
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className={inputClassName}
              required
            >
              <option value="">Kunde auswählen...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            {customers.length === 0 && (
              <p className="mt-1 text-sm text-amber-600">
                <button
                  type="button"
                  onClick={() => router.push("/customers")}
                  className="underline hover:no-underline"
                >
                  Erstellen Sie zuerst einen Kunden
                </button>
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "open")}
              className={inputClassName}
            >
              <option value="draft">Entwurf</option>
              <option value="open">Offen</option>
            </select>
          </div>

          {/* Invoice Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rechnungsdatum *
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className={inputClassName}
              required
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fälligkeitsdatum
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      {/* Invoice Items Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <InvoiceItemsGrid
          items={items}
          onItemsChange={handleItemsChange}
          defaultVatRate={defaultVatRate}
        />
      </div>

      {/* Summary and Notes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notizen / Zahlungsbedingungen
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Zusätzliche Informationen..."
            className={inputClassName}
          />
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Zusammenfassung</h3>
          <InvoiceSummary
            netTotal={totals.net_total}
            vatTotal={totals.vat_total}
            grossTotal={totals.gross_total}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={isSubmitting || customers.length === 0}
          className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Wird erstellt..." : "Rechnung erstellen"}
        </button>
      </div>
    </form>
  );
}
