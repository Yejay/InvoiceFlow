"use server";

import { createServerSupabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { invoiceSchema, type InvoiceFormData } from "@/lib/validations/invoice";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { calculateItemAmounts, calculateInvoiceTotals, generateInvoiceNumber } from "@/lib/utils";

export type ActionResult = {
  success: boolean;
  error?: string;
  invoiceId?: string;
};

export async function createInvoice(formData: InvoiceFormData): Promise<ActionResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Nicht authentifiziert" };
  }

  // Validate the form data
  const validationResult = invoiceSchema.safeParse(formData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    return { success: false, error: firstError?.message || "Validierungsfehler" };
  }

  const supabase = await createServerSupabaseClient();

  // Get user settings for invoice number
  const { data: settings } = await supabase
    .from("user_settings")
    .select("invoice_prefix, next_invoice_number")
    .single();

  if (!settings) {
    return {
      success: false,
      error: "Bitte richten Sie zunächst Ihre Firmendaten ein",
    };
  }

  const invoiceNumber = generateInvoiceNumber(
    settings.invoice_prefix,
    settings.next_invoice_number
  );

  // Calculate item amounts and totals
  const itemsWithCalculations = validationResult.data.items.map((item, index) => {
    const amounts = calculateItemAmounts(
      item.quantity,
      item.unit_price,
      item.vat_rate
    );
    return {
      ...item,
      net_amount: amounts.net_amount,
      vat_amount: amounts.vat_amount,
      gross_amount: amounts.gross_amount,
      position: index,
    };
  });

  const totals = calculateInvoiceTotals(itemsWithCalculations);

  // Create invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      user_id: userId,
      customer_id: validationResult.data.customer_id,
      invoice_number: invoiceNumber,
      invoice_date: validationResult.data.invoice_date,
      due_date: validationResult.data.due_date || null,
      status: validationResult.data.status,
      notes: validationResult.data.notes || null,
      net_total: totals.net_total,
      vat_total: totals.vat_total,
      gross_total: totals.gross_total,
    })
    .select()
    .single();

  if (invoiceError || !invoice) {
    console.error("Error creating invoice:", invoiceError);
    return { success: false, error: "Fehler beim Erstellen der Rechnung" };
  }

  // Create invoice items
  const invoiceItems = itemsWithCalculations.map((item) => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    unit: item.unit,
    unit_price: item.unit_price,
    vat_rate: item.vat_rate,
    net_amount: item.net_amount,
    vat_amount: item.vat_amount,
    gross_amount: item.gross_amount,
    position: item.position,
  }));

  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(invoiceItems);

  if (itemsError) {
    console.error("Error creating invoice items:", itemsError);
    // Rollback: delete the invoice
    await supabase.from("invoices").delete().eq("id", invoice.id);
    return { success: false, error: "Fehler beim Erstellen der Rechnungspositionen" };
  }

  // Increment next invoice number
  await supabase
    .from("user_settings")
    .update({ next_invoice_number: settings.next_invoice_number + 1 })
    .eq("user_id", userId);

  revalidatePath("/invoices");
  revalidatePath("/dashboard");

  return { success: true, invoiceId: invoice.id };
}

export async function redirectToInvoice(invoiceId: string) {
  redirect(`/invoices/${invoiceId}`);
}
