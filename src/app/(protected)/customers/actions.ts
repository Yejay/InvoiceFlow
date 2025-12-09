"use server";

import { createServerSupabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { customerSchema, type CustomerFormData } from "@/lib/validations/customer";
import { revalidatePath } from "next/cache";

export type Customer = {
  id: string;
  user_id: string;
  name: string;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  vat_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function getCustomers(): Promise<Customer[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }

  return data as Customer[];
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Customer;
}

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: Customer;
};

export async function createCustomer(formData: CustomerFormData): Promise<ActionResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Nicht authentifiziert" };
  }

  const validationResult = customerSchema.safeParse(formData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    return { success: false, error: firstError?.message || "Validierungsfehler" };
  }

  const supabase = await createServerSupabaseClient();

  const customerData = {
    user_id: userId,
    name: validationResult.data.name,
    street: validationResult.data.street || null,
    postal_code: validationResult.data.postal_code || null,
    city: validationResult.data.city || null,
    country: validationResult.data.country || "Deutschland",
    email: validationResult.data.email || null,
    phone: validationResult.data.phone || null,
    vat_id: validationResult.data.vat_id || null,
    notes: validationResult.data.notes || null,
  };

  const { data, error } = await supabase
    .from("customers")
    .insert(customerData)
    .select()
    .single();

  if (error) {
    console.error("Error creating customer:", error);
    return { success: false, error: "Fehler beim Erstellen des Kunden" };
  }

  revalidatePath("/customers");
  revalidatePath("/dashboard");

  return { success: true, data: data as Customer };
}

export async function updateCustomer(
  id: string,
  formData: CustomerFormData
): Promise<ActionResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Nicht authentifiziert" };
  }

  const validationResult = customerSchema.safeParse(formData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    return { success: false, error: firstError?.message || "Validierungsfehler" };
  }

  const supabase = await createServerSupabaseClient();

  const customerData = {
    name: validationResult.data.name,
    street: validationResult.data.street || null,
    postal_code: validationResult.data.postal_code || null,
    city: validationResult.data.city || null,
    country: validationResult.data.country || "Deutschland",
    email: validationResult.data.email || null,
    phone: validationResult.data.phone || null,
    vat_id: validationResult.data.vat_id || null,
    notes: validationResult.data.notes || null,
  };

  const { data, error } = await supabase
    .from("customers")
    .update(customerData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating customer:", error);
    return { success: false, error: "Fehler beim Aktualisieren des Kunden" };
  }

  revalidatePath("/customers");

  return { success: true, data: data as Customer };
}

export async function deleteCustomer(id: string): Promise<ActionResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Nicht authentifiziert" };
  }

  const supabase = await createServerSupabaseClient();

  // Check if customer has invoices
  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", id);

  if (count && count > 0) {
    return {
      success: false,
      error: "Kunde kann nicht gelöscht werden, da noch Rechnungen vorhanden sind",
    };
  }

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Fehler beim Löschen des Kunden" };
  }

  revalidatePath("/customers");
  revalidatePath("/dashboard");

  return { success: true };
}
