"use server";

import { createServerSupabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { userSettingsSchema, type UserSettingsFormData } from "@/lib/validations/settings";
import { revalidatePath } from "next/cache";

export type UserSettings = {
  id: string;
  user_id: string;
  company_name: string;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  tax_number: string | null;
  vat_id: string | null;
  iban: string | null;
  bic: string | null;
  bank_name: string | null;
  default_vat_rate: number;
  invoice_prefix: string;
  next_invoice_number: number;
};

export async function getUserSettings(): Promise<UserSettings | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserSettings;
}

export type SaveSettingsResult = {
  success: boolean;
  error?: string;
};

export async function saveUserSettings(
  formData: UserSettingsFormData
): Promise<SaveSettingsResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Nicht authentifiziert" };
  }

  // Validate the form data
  const validationResult = userSettingsSchema.safeParse(formData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    return { success: false, error: firstError?.message || "Validierungsfehler" };
  }

  const supabase = await createServerSupabaseClient();

  // Check if settings already exist
  const { data: existing } = await supabase
    .from("user_settings")
    .select("id")
    .single();

  const settingsData = {
    user_id: userId,
    company_name: validationResult.data.company_name,
    street: validationResult.data.street || null,
    postal_code: validationResult.data.postal_code || null,
    city: validationResult.data.city || null,
    country: validationResult.data.country || "Deutschland",
    email: validationResult.data.email || null,
    phone: validationResult.data.phone || null,
    tax_number: validationResult.data.tax_number || null,
    vat_id: validationResult.data.vat_id || null,
    iban: validationResult.data.iban || null,
    bic: validationResult.data.bic || null,
    bank_name: validationResult.data.bank_name || null,
    default_vat_rate: validationResult.data.default_vat_rate,
    invoice_prefix: validationResult.data.invoice_prefix,
  };

  let error;

  if (existing) {
    // Update existing settings
    const result = await supabase
      .from("user_settings")
      .update(settingsData)
      .eq("id", existing.id);
    error = result.error;
  } else {
    // Insert new settings
    const result = await supabase
      .from("user_settings")
      .insert(settingsData);
    error = result.error;
  }

  if (error) {
    console.error("Error saving settings:", error);
    return { success: false, error: "Fehler beim Speichern der Einstellungen" };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");

  return { success: true };
}
