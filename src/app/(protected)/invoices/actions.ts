"use server";

import { createServerSupabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  vat_rate: number;
  net_amount: number;
  vat_amount: number;
  gross_amount: number;
  position: number;
};

export type Invoice = {
  id: string;
  user_id: string;
  customer_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  status: "draft" | "open" | "paid" | "cancelled";
  notes: string | null;
  net_total: number;
  vat_total: number;
  gross_total: number;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
  customers: {
    id: string;
    name: string;
    street: string | null;
    postal_code: string | null;
    city: string | null;
    country: string | null;
    email: string | null;
    phone: string | null;
    vat_id: string | null;
  };
};

export type InvoiceWithItems = Invoice & {
  invoice_items: InvoiceItem[];
};

export type InvoiceListItem = {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  status: "draft" | "open" | "paid" | "cancelled";
  gross_total: number;
  pdf_url: string | null;
  customers: {
    id: string;
    name: string;
  };
};

export async function getInvoices(status?: string): Promise<InvoiceListItem[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("invoices")
    .select(`
      id,
      invoice_number,
      invoice_date,
      due_date,
      status,
      gross_total,
      pdf_url,
      customers (id, name)
    `)
    .order("invoice_date", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status as "draft" | "open" | "paid" | "cancelled");
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }

  return data as InvoiceListItem[];
}

export async function getInvoice(id: string): Promise<InvoiceWithItems | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      customers (
        id,
        name,
        street,
        postal_code,
        city,
        country,
        email,
        phone,
        vat_id
      ),
      invoice_items (*)
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching invoice:", error);
    return null;
  }

  // Sort items by position
  if (data.invoice_items) {
    data.invoice_items.sort((a: InvoiceItem, b: InvoiceItem) => a.position - b.position);
  }

  return data as InvoiceWithItems;
}

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function updateInvoiceStatus(
  id: string,
  status: "draft" | "open" | "paid" | "cancelled"
): Promise<ActionResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Nicht authentifiziert" };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating invoice status:", error);
    return { success: false, error: "Fehler beim Aktualisieren des Status" };
  }

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${id}`);
  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteInvoice(id: string): Promise<ActionResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Nicht authentifiziert" };
  }

  const supabase = await createServerSupabaseClient();

  // First delete invoice items
  const { error: itemsError } = await supabase
    .from("invoice_items")
    .delete()
    .eq("invoice_id", id);

  if (itemsError) {
    console.error("Error deleting invoice items:", itemsError);
    return { success: false, error: "Fehler beim Löschen der Rechnungspositionen" };
  }

  // Then delete the invoice
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting invoice:", error);
    return { success: false, error: "Fehler beim Löschen der Rechnung" };
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");

  return { success: true };
}
