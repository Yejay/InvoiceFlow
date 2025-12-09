"use server";

import { createServerSupabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export type DashboardStats = {
  totalInvoices: number;
  openInvoices: number;
  paidInvoices: number;
  totalCustomers: number;
  openAmount: number;
  paidAmount: number;
};

export type RecentInvoice = {
  id: string;
  invoice_number: string;
  customer_name: string;
  invoice_date: string;
  gross_total: number;
  status: "draft" | "open" | "paid" | "cancelled";
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const { userId } = await auth();

  if (!userId) {
    return {
      totalInvoices: 0,
      openInvoices: 0,
      paidInvoices: 0,
      totalCustomers: 0,
      openAmount: 0,
      paidAmount: 0,
    };
  }

  const supabase = await createServerSupabaseClient();

  // Get invoice counts and amounts by status
  const { data: invoices } = await supabase
    .from("invoices")
    .select("status, gross_total");

  // Get customer count
  const { count: customerCount } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });

  const stats: DashboardStats = {
    totalInvoices: invoices?.length || 0,
    openInvoices: 0,
    paidInvoices: 0,
    totalCustomers: customerCount || 0,
    openAmount: 0,
    paidAmount: 0,
  };

  if (invoices) {
    for (const invoice of invoices) {
      if (invoice.status === "open") {
        stats.openInvoices++;
        stats.openAmount += Number(invoice.gross_total) || 0;
      } else if (invoice.status === "paid") {
        stats.paidInvoices++;
        stats.paidAmount += Number(invoice.gross_total) || 0;
      }
    }
  }

  return stats;
}

export async function getRecentInvoices(limit: number = 5): Promise<RecentInvoice[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const supabase = await createServerSupabaseClient();

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select(`
      id,
      invoice_number,
      invoice_date,
      gross_total,
      status,
      customers (
        name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !invoices) {
    console.error("Error fetching recent invoices:", error);
    return [];
  }

  return invoices.map((invoice) => ({
    id: invoice.id,
    invoice_number: invoice.invoice_number,
    customer_name: (invoice.customers as { name: string })?.name || "Unbekannt",
    invoice_date: invoice.invoice_date,
    gross_total: Number(invoice.gross_total) || 0,
    status: invoice.status as RecentInvoice["status"],
  }));
}

export async function hasUserSettings(): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("user_settings")
    .select("id")
    .single();

  return !!data;
}
