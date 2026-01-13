"use server";

import { auth } from "@clerk/nextjs/server";
import { getInvoice } from "../actions";
import { getUserSettings } from "../../settings/actions";
import { generateZugferdPdf } from "@/lib/zugferd/generateZugferdPdf";
import { sendInvoiceEmail } from "@/lib/email/sendInvoiceEmail";

export type SendEmailResult = {
  success: boolean;
  error?: string;
};

/**
 * Server Action: Sendet eine Rechnung per E-Mail an den Kunden
 */
export async function sendInvoiceByEmail(invoiceId: string): Promise<SendEmailResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Nicht authentifiziert" };
  }

  // Lade Rechnung und Einstellungen parallel
  const [invoice, settings] = await Promise.all([
    getInvoice(invoiceId),
    getUserSettings(),
  ]);

  if (!invoice) {
    return { success: false, error: "Rechnung nicht gefunden" };
  }

  if (!settings) {
    return {
      success: false,
      error: "Bitte richten Sie zunächst Ihre Firmendaten in den Einstellungen ein",
    };
  }

  // Prüfe ob Kunde E-Mail hat
  if (!invoice.customers.email) {
    return {
      success: false,
      error: "Der Kunde hat keine E-Mail-Adresse. Bitte fügen Sie eine E-Mail-Adresse in den Kundendaten hinzu.",
    };
  }

  try {
    // Generiere ZUGFeRD-PDF
    const pdfBuffer = await generateZugferdPdf(invoice, settings);

    // Sende E-Mail
    const result = await sendInvoiceEmail(invoice, settings, pdfBuffer);

    return result;
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return {
      success: false,
      error: "Fehler beim Erstellen oder Versenden der Rechnung",
    };
  }
}
