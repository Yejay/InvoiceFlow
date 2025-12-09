import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .min(1, "Kundenname ist erforderlich")
    .max(255, "Kundenname ist zu lang"),
  street: z.string().max(255).optional().nullable(),
  postal_code: z.string().max(10).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).default("Deutschland"),
  email: z.string().email("Ungültige E-Mail-Adresse").optional().nullable().or(z.literal("")),
  phone: z.string().max(50).optional().nullable(),
  vat_id: z.string().max(50).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
