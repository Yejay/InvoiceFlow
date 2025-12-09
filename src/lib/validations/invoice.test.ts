import { describe, it, expect } from "vitest";
import {
  invoiceItemSchema,
  invoiceSchema,
  invoiceStatusSchema,
  type InvoiceItemFormData,
  type InvoiceFormData,
} from "./invoice";

describe("invoiceItemSchema", () => {
  const validItem: InvoiceItemFormData = {
    description: "Webentwicklung",
    quantity: 10,
    unit: "Std.",
    unit_price: 95,
    vat_rate: 19,
    position: 0,
  };

  describe("description field", () => {
    it("accepts valid description", () => {
      const result = invoiceItemSchema.safeParse(validItem);
      expect(result.success).toBe(true);
    });

    it("rejects empty description", () => {
      const result = invoiceItemSchema.safeParse({
        ...validItem,
        description: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Beschreibung ist erforderlich");
      }
    });

    it("rejects description longer than 500 characters", () => {
      const result = invoiceItemSchema.safeParse({
        ...validItem,
        description: "a".repeat(501),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Beschreibung ist zu lang");
      }
    });
  });

  describe("quantity field", () => {
    it("accepts positive quantities", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, quantity: 5 });
      expect(result.success).toBe(true);
    });

    it("accepts fractional quantities", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, quantity: 1.5 });
      expect(result.success).toBe(true);
    });

    it("rejects zero quantity", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, quantity: 0 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Menge muss größer als 0 sein");
      }
    });

    it("rejects negative quantity", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, quantity: -1 });
      expect(result.success).toBe(false);
    });

    it("coerces string to number", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, quantity: "5" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.quantity).toBe(5);
      }
    });
  });

  describe("unit_price field", () => {
    it("accepts positive prices", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, unit_price: 100 });
      expect(result.success).toBe(true);
    });

    it("accepts zero price", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, unit_price: 0 });
      expect(result.success).toBe(true);
    });

    it("rejects negative price", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, unit_price: -10 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Preis darf nicht negativ sein");
      }
    });

    it("rejects price exceeding max limit", () => {
      const result = invoiceItemSchema.safeParse({
        ...validItem,
        unit_price: 10000000,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("vat_rate field", () => {
    it("accepts 19% VAT rate", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, vat_rate: 19 });
      expect(result.success).toBe(true);
    });

    it("accepts 7% VAT rate", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, vat_rate: 7 });
      expect(result.success).toBe(true);
    });

    it("accepts 0% VAT rate", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, vat_rate: 0 });
      expect(result.success).toBe(true);
    });

    it("rejects negative VAT rate", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, vat_rate: -5 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("MwSt.-Satz muss mindestens 0% sein");
      }
    });

    it("rejects VAT rate over 100%", () => {
      const result = invoiceItemSchema.safeParse({ ...validItem, vat_rate: 101 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("MwSt.-Satz darf maximal 100% sein");
      }
    });

    it("defaults to 19% VAT rate", () => {
      const { vat_rate, ...withoutVat } = validItem;
      const result = invoiceItemSchema.safeParse(withoutVat);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.vat_rate).toBe(19);
      }
    });
  });

  describe("unit field", () => {
    it("accepts standard units", () => {
      const units = ["Stk.", "Std.", "Psch.", "m", "kg"];
      for (const unit of units) {
        const result = invoiceItemSchema.safeParse({ ...validItem, unit });
        expect(result.success).toBe(true);
      }
    });

    it("defaults to Stk.", () => {
      const { unit, ...withoutUnit } = validItem;
      const result = invoiceItemSchema.safeParse(withoutUnit);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.unit).toBe("Stk.");
      }
    });
  });
});

describe("invoiceSchema", () => {
  const validInvoice: InvoiceFormData = {
    customer_id: "550e8400-e29b-41d4-a716-446655440000",
    invoice_date: "2024-03-15",
    due_date: "2024-03-29",
    status: "draft",
    notes: "Test notes",
    items: [
      {
        description: "Webentwicklung",
        quantity: 10,
        unit: "Std.",
        unit_price: 95,
        vat_rate: 19,
        position: 0,
      },
    ],
  };

  describe("customer_id field", () => {
    it("accepts valid UUID", () => {
      const result = invoiceSchema.safeParse(validInvoice);
      expect(result.success).toBe(true);
    });

    it("rejects invalid UUID", () => {
      const result = invoiceSchema.safeParse({
        ...validInvoice,
        customer_id: "invalid-uuid",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Kunde ist erforderlich");
      }
    });
  });

  describe("date fields", () => {
    it("accepts valid date format", () => {
      const result = invoiceSchema.safeParse(validInvoice);
      expect(result.success).toBe(true);
    });

    it("rejects invalid invoice_date format", () => {
      const result = invoiceSchema.safeParse({
        ...validInvoice,
        invoice_date: "15-03-2024",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Ungültiges Datum");
      }
    });

    it("accepts null due_date", () => {
      const result = invoiceSchema.safeParse({
        ...validInvoice,
        due_date: null,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("status field", () => {
    it("accepts valid statuses", () => {
      const statuses = ["draft", "open", "paid", "cancelled"] as const;
      for (const status of statuses) {
        const result = invoiceSchema.safeParse({ ...validInvoice, status });
        expect(result.success).toBe(true);
      }
    });

    it("rejects invalid status", () => {
      const result = invoiceSchema.safeParse({
        ...validInvoice,
        status: "invalid",
      });
      expect(result.success).toBe(false);
    });

    it("defaults to draft status", () => {
      const { status, ...withoutStatus } = validInvoice;
      const result = invoiceSchema.safeParse(withoutStatus);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("draft");
      }
    });
  });

  describe("items field", () => {
    it("accepts one or more items", () => {
      const result = invoiceSchema.safeParse(validInvoice);
      expect(result.success).toBe(true);
    });

    it("rejects empty items array", () => {
      const result = invoiceSchema.safeParse({
        ...validInvoice,
        items: [],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Mindestens eine Position ist erforderlich");
      }
    });

    it("accepts multiple items", () => {
      const result = invoiceSchema.safeParse({
        ...validInvoice,
        items: [
          { description: "Item 1", quantity: 1, unit: "Stk.", unit_price: 100, vat_rate: 19, position: 0 },
          { description: "Item 2", quantity: 2, unit: "Std.", unit_price: 50, vat_rate: 7, position: 1 },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("validates nested item schema", () => {
      const result = invoiceSchema.safeParse({
        ...validInvoice,
        items: [{ description: "", quantity: 0, unit: "Stk.", unit_price: 100, vat_rate: 19, position: 0 }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("notes field", () => {
    it("accepts notes up to 2000 characters", () => {
      const result = invoiceSchema.safeParse({
        ...validInvoice,
        notes: "a".repeat(2000),
      });
      expect(result.success).toBe(true);
    });

    it("rejects notes longer than 2000 characters", () => {
      const result = invoiceSchema.safeParse({
        ...validInvoice,
        notes: "a".repeat(2001),
      });
      expect(result.success).toBe(false);
    });

    it("accepts null notes", () => {
      const result = invoiceSchema.safeParse({
        ...validInvoice,
        notes: null,
      });
      expect(result.success).toBe(true);
    });
  });
});

describe("invoiceStatusSchema", () => {
  it("accepts valid statuses", () => {
    const statuses = ["draft", "open", "paid", "cancelled"] as const;
    for (const status of statuses) {
      const result = invoiceStatusSchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    const result = invoiceStatusSchema.safeParse({ status: "invalid" });
    expect(result.success).toBe(false);
  });
});
