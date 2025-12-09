"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { updateInvoiceStatus, deleteInvoice, type InvoiceWithItems } from "@/app/(protected)/invoices/actions";
import type { UserSettings } from "@/app/(protected)/settings/actions";

type InvoiceDetailProps = {
  invoice: InvoiceWithItems;
  settings: UserSettings | null;
};

export default function InvoiceDetail({ invoice, settings }: InvoiceDetailProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: "draft" | "open" | "paid" | "cancelled") => {
    setIsUpdating(true);
    setError(null);

    const result = await updateInvoiceStatus(invoice.id, newStatus);

    if (!result.success) {
      setError(result.error || "Fehler beim Aktualisieren");
    }

    setIsUpdating(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Möchten Sie diese Rechnung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteInvoice(invoice.id);

    if (result.success) {
      router.push("/invoices");
    } else {
      setError(result.error || "Fehler beim Löschen");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Status and Actions Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
              {getStatusLabel(invoice.status)}
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(invoice.gross_total)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Change Buttons */}
            {invoice.status === "draft" && (
              <button
                type="button"
                onClick={() => handleStatusChange("open")}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Als offen markieren
              </button>
            )}
            {invoice.status === "open" && (
              <button
                type="button"
                onClick={() => handleStatusChange("paid")}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Als bezahlt markieren
              </button>
            )}
            {(invoice.status === "draft" || invoice.status === "open") && (
              <button
                type="button"
                onClick={() => handleStatusChange("cancelled")}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                Stornieren
              </button>
            )}

            {/* PDF Download Button */}
            <a
              href={`/invoices/${invoice.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              PDF herunterladen
            </a>

            {/* Delete Button */}
            {invoice.status === "draft" && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Löschen..." : "Löschen"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invoice Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rechnungsdetails</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Rechnungsnummer</dt>
              <dd className="text-sm font-medium text-gray-900">{invoice.invoice_number}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Rechnungsdatum</dt>
              <dd className="text-sm font-medium text-gray-900">{formatDate(invoice.invoice_date)}</dd>
            </div>
            {invoice.due_date && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Fälligkeitsdatum</dt>
                <dd className="text-sm font-medium text-gray-900">{formatDate(invoice.due_date)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Erstellt am</dt>
              <dd className="text-sm font-medium text-gray-900">{formatDate(invoice.created_at)}</dd>
            </div>
          </dl>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kunde</h2>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{invoice.customers.name}</p>
            {invoice.customers.street && (
              <p className="text-sm text-gray-600">{invoice.customers.street}</p>
            )}
            {(invoice.customers.postal_code || invoice.customers.city) && (
              <p className="text-sm text-gray-600">
                {invoice.customers.postal_code} {invoice.customers.city}
              </p>
            )}
            {invoice.customers.country && invoice.customers.country !== "Deutschland" && (
              <p className="text-sm text-gray-600">{invoice.customers.country}</p>
            )}
            {invoice.customers.email && (
              <p className="text-sm text-gray-600 mt-3">
                <a href={`mailto:${invoice.customers.email}`} className="text-blue-600 hover:text-blue-700">
                  {invoice.customers.email}
                </a>
              </p>
            )}
            {invoice.customers.phone && (
              <p className="text-sm text-gray-600">{invoice.customers.phone}</p>
            )}
            {invoice.customers.vat_id && (
              <p className="text-sm text-gray-600 mt-2">USt-IdNr.: {invoice.customers.vat_id}</p>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Positionen</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beschreibung
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Menge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Einheit
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Einzelpreis
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MwSt.
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Netto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.invoice_items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {item.quantity.toLocaleString("de-DE")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">
                    {item.vat_rate} %
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(item.net_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <dl className="space-y-2 w-64">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Netto</dt>
                <dd className="font-medium text-gray-900">{formatCurrency(invoice.net_total)}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">MwSt.</dt>
                <dd className="font-medium text-gray-900">{formatCurrency(invoice.vat_total)}</dd>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                <dt className="font-semibold text-gray-900">Brutto</dt>
                <dd className="font-bold text-gray-900">{formatCurrency(invoice.gross_total)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Notizen</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      {/* Sender Info (from settings) */}
      {settings && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Absender</h2>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{settings.company_name}</p>
            {settings.street && <p className="text-sm text-gray-600">{settings.street}</p>}
            {(settings.postal_code || settings.city) && (
              <p className="text-sm text-gray-600">
                {settings.postal_code} {settings.city}
              </p>
            )}
            {settings.email && <p className="text-sm text-gray-600">{settings.email}</p>}
            {settings.phone && <p className="text-sm text-gray-600">{settings.phone}</p>}
            {settings.tax_number && (
              <p className="text-sm text-gray-600 mt-2">Steuernr.: {settings.tax_number}</p>
            )}
            {settings.vat_id && (
              <p className="text-sm text-gray-600">USt-IdNr.: {settings.vat_id}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
