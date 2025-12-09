import { redirect } from "next/navigation";
import { getCustomers } from "../../customers/actions";
import { getUserSettings } from "../../settings/actions";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import Link from "next/link";

export default async function NewInvoicePage() {
  const [customers, settings] = await Promise.all([
    getCustomers(),
    getUserSettings(),
  ]);

  // Redirect to settings if not configured
  if (!settings) {
    redirect("/settings?setup=required");
  }

  const customerOptions = customers.map((c) => ({
    id: c.id,
    name: c.name,
  }));

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
            <span>Neue Rechnung</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Neue Rechnung erstellen</h1>
          <p className="mt-1 text-sm text-gray-500">
            Erstellen Sie eine neue Rechnung für einen Ihrer Kunden
          </p>
        </div>
      </div>

      {/* Warning if no customers */}
      {customers.length === 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-amber-400 mt-0.5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-amber-800">
                Keine Kunden vorhanden
              </h3>
              <p className="mt-1 text-sm text-amber-700">
                Sie müssen zuerst mindestens einen Kunden anlegen, bevor Sie eine
                Rechnung erstellen können.
              </p>
              <Link
                href="/customers"
                className="mt-2 inline-flex items-center text-sm font-medium text-amber-800 hover:text-amber-900"
              >
                Kunden anlegen
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Form */}
      <InvoiceForm
        customers={customerOptions}
        defaultVatRate={settings.default_vat_rate}
      />
    </>
  );
}
