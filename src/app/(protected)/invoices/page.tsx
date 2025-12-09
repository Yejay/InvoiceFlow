import Link from "next/link";
import { getInvoices } from "./actions";
import InvoiceList from "@/components/invoices/InvoiceList";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function InvoicesPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const invoices = await getInvoices(status);

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rechnungen</h1>
          <p className="mt-1 text-sm text-gray-500">
            Verwalten Sie alle Ihre Rechnungen an einem Ort
          </p>
        </div>
        <Link
          href="/invoices/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Neue Rechnung
        </Link>
      </div>

      <InvoiceList invoices={invoices} currentStatus={status || "all"} />
    </>
  );
}
