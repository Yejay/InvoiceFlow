import { getResendClient, FROM_EMAIL } from "./resend";
import type { InvoiceWithItems } from "@/app/(protected)/invoices/actions";
import type { UserSettings } from "@/app/(protected)/settings/actions";
import { formatCurrency } from "@/lib/utils";

export type SendInvoiceEmailResult = {
  success: boolean;
  error?: string;
  messageId?: string;
};

/**
 * Sendet eine Rechnung per E-Mail an den Kunden
 */
export async function sendInvoiceEmail(
  invoice: InvoiceWithItems,
  settings: UserSettings,
  pdfBuffer: Buffer
): Promise<SendInvoiceEmailResult> {
  // Prüfe ob Kunde E-Mail hat
  if (!invoice.customers.email) {
    return {
      success: false,
      error: "Kunde hat keine E-Mail-Adresse hinterlegt",
    };
  }

  const customerEmail = invoice.customers.email;
  const invoiceNumber = invoice.invoice_number;
  const companyName = settings.company_name;
  const grossTotal = formatCurrency(invoice.gross_total);

  try {
    const resend = getResendClient();

    const { data, error } = await resend.emails.send({
      from: `${companyName} <${FROM_EMAIL}>`,
      to: [customerEmail],
      subject: `Rechnung ${invoiceNumber} von ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
            Rechnung ${invoiceNumber}
          </h2>

          <p style="color: #555; line-height: 1.6;">
            Sehr geehrte Damen und Herren,
          </p>

          <p style="color: #555; line-height: 1.6;">
            anbei erhalten Sie Ihre Rechnung <strong>${invoiceNumber}</strong>
            über <strong>${grossTotal}</strong>.
          </p>

          ${invoice.due_date ? `
          <p style="color: #555; line-height: 1.6;">
            Bitte beachten Sie das Zahlungsziel.
          </p>
          ` : ""}

          <p style="color: #555; line-height: 1.6; margin-top: 30px;">
            Mit freundlichen Grüßen,<br>
            <strong>${companyName}</strong>
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <div style="color: #888; font-size: 12px;">
            ${settings.street ? `<p style="margin: 5px 0;">${settings.street}</p>` : ""}
            ${settings.postal_code || settings.city ? `<p style="margin: 5px 0;">${settings.postal_code || ""} ${settings.city || ""}</p>` : ""}
            ${settings.email ? `<p style="margin: 5px 0;">E-Mail: ${settings.email}</p>` : ""}
            ${settings.phone ? `<p style="margin: 5px 0;">Telefon: ${settings.phone}</p>` : ""}
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Rechnung_${invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        error: `E-Mail-Versand fehlgeschlagen: ${error.message}`,
      };
    }

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (err) {
    console.error("Email sending error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unbekannter Fehler beim E-Mail-Versand",
    };
  }
}
