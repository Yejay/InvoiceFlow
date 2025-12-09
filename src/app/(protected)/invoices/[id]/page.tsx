import { notFound } from "next/navigation";
import Link from "next/link";
import { getInvoice } from "../actions";
import { getUserSettings } from "../../settings/actions";
import InvoiceDetail from "@/components/invoices/InvoiceDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const [invoice, settings] = await Promise.all([
    getInvoice(id),
    getUserSettings(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <nav className="flex items-center text-sm text-gray-500 mb-2">
            <Link href="/invoices" className="hover:text-gray-700">
              Rechnungen
            </Link>
            <svg
              className="w-4 h-4 mx-2"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
            <span>{invoice.invoice_number}</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">
            Rechnung {invoice.invoice_number}
          </h1>
        </div>
      </div>

      <InvoiceDetail invoice={invoice} settings={settings} />
    </>
  );
}
