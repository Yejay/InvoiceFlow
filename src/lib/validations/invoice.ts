import { z } from "zod";

// Invoice Item Schema
export const invoiceItemSchema = z.object({
  description: z
    .string()
    .min(1, "Beschreibung ist erforderlich")
    .max(500, "Beschreibung ist zu lang"),
  quantity: z.coerce
    .number()
    .min(0.01, "Menge muss größer als 0 sein")
    .max(999999, "Menge ist zu groß"),
  unit: z.string().max(20).default("Stk."),
  unit_price: z.coerce
    .number()
    .min(0, "Preis darf nicht negativ sein")
    .max(9999999.99, "Preis ist zu hoch"),
  vat_rate: z.coerce
    .number()
    .min(0, "MwSt.-Satz muss mindestens 0% sein")
    .max(100, "MwSt.-Satz darf maximal 100% sein")
    .default(19),
  position: z.coerce.number().int().min(0).default(0),
});

// Invoice Schema
export const invoiceSchema = z.object({
  customer_id: z.string().uuid("Kunde ist erforderlich"),
  invoice_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datum"),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datum")
    .optional()
    .nullable(),
  status: z.enum(["draft", "open", "paid", "cancelled"]).default("draft"),
  notes: z.string().max(2000).optional().nullable(),
  items: z
    .array(invoiceItemSchema)
    .min(1, "Mindestens eine Position ist erforderlich"),
});

// Schema for updating invoice status only
export const invoiceStatusSchema = z.object({
  status: z.enum(["draft", "open", "paid", "cancelled"]),
});

export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type InvoiceStatusFormData = z.infer<typeof invoiceStatusSchema>;
