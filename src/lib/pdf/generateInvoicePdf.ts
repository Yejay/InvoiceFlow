import { renderToBuffer } from "@react-pdf/renderer";
import InvoiceTemplate from "./InvoiceTemplate";
import type { InvoiceWithItems } from "@/app/(protected)/invoices/actions";
import type { UserSettings } from "@/app/(protected)/settings/actions";

export async function generateInvoicePdf(
  invoice: InvoiceWithItems,
  settings: UserSettings
): Promise<Buffer> {
  const buffer = await renderToBuffer(
    InvoiceTemplate({ invoice, settings })
  );
  return Buffer.from(buffer);
}
