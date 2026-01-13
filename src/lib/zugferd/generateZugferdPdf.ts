import { getRechnungsApiClient } from "./invoicer";
import { mapInvoiceToRechnungsApi } from "./mapInvoiceToZugferd";
import type { InvoiceWithItems } from "@/app/(protected)/invoices/actions";
import type { UserSettings } from "@/app/(protected)/settings/actions";

/**
 * Generiert eine ZUGFeRD-konforme PDF/A-3 Rechnung über die Rechnungs API
 *
 * Diese Funktion:
 * 1. Mappt die Rechnungsdaten zum API-Format
 * 2. Sendet die Daten an die Rechnungs API
 * 3. Erhält eine valide ZUGFeRD PDF/A-3 zurück
 */
export async function generateZugferdPdf(
  invoice: InvoiceWithItems,
  settings: UserSettings
): Promise<Buffer> {
  const client = getRechnungsApiClient();

  // 1. Mappe Rechnungsdaten zum API-Format
  const documentRequest = mapInvoiceToRechnungsApi(invoice, settings);

  // 2. Erstelle das Dokument über die API
  const document = await client.createDocument(documentRequest);

  // 3. Lade die PDF herunter
  const pdfArrayBuffer = await client.readDocument(document.id, "pdf");

  return Buffer.from(pdfArrayBuffer);
}

/**
 * Generiert das ZUGFeRD-XML über die Rechnungs API (für Debugging/Export)
 */
export async function generateZugferdXml(
  invoice: InvoiceWithItems,
  settings: UserSettings
): Promise<string> {
  const client = getRechnungsApiClient();

  // 1. Mappe Rechnungsdaten zum API-Format
  const documentRequest = mapInvoiceToRechnungsApi(invoice, settings);

  // 2. Erstelle das Dokument über die API
  const document = await client.createDocument(documentRequest);

  // 3. Lade das XML herunter (API gibt direkt einen String zurück)
  return await client.readDocument(document.id, "xml");
}
