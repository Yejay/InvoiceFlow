import { z } from "zod";

export const userSettingsSchema = z.object({
  company_name: z
    .string()
    .min(1, "Firmenname ist erforderlich")
    .max(255, "Firmenname ist zu lang"),
  street: z.string().max(255).optional().nullable(),
  postal_code: z.string().max(10).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).default("Deutschland"),
  email: z.string().email("Ungültige E-Mail-Adresse").optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  tax_number: z.string().max(50).optional().nullable(),
  vat_id: z.string().max(50).optional().nullable(),
  iban: z
    .string()
    .max(34)
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/, "Ungültige IBAN")
    .optional()
    .nullable()
    .or(z.literal("")),
  bic: z
    .string()
    .max(11)
    .regex(/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "Ungültige BIC")
    .optional()
    .nullable()
    .or(z.literal("")),
  bank_name: z.string().max(255).optional().nullable(),
  default_vat_rate: z.coerce
    .number()
    .min(0, "MwSt.-Satz muss mindestens 0% sein")
    .max(100, "MwSt.-Satz darf maximal 100% sein")
    .default(19),
  invoice_prefix: z.string().max(10).default("INV-"),
});

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
