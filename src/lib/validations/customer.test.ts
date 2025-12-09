import { describe, it, expect } from "vitest";
import { customerSchema, type CustomerFormData } from "./customer";

describe("customerSchema", () => {
  const validCustomer: CustomerFormData = {
    name: "Test Kunde GmbH",
    street: "Teststraße 123",
    postal_code: "12345",
    city: "Berlin",
    country: "Deutschland",
    email: "test@example.com",
    phone: "+49 30 12345678",
    vat_id: "DE123456789",
    notes: "Test notes",
  };

  describe("name field", () => {
    it("accepts valid customer name", () => {
      const result = customerSchema.safeParse(validCustomer);
      expect(result.success).toBe(true);
    });

    it("rejects empty name", () => {
      const result = customerSchema.safeParse({ ...validCustomer, name: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Kundenname ist erforderlich");
      }
    });

    it("rejects missing name", () => {
      const { name, ...withoutName } = validCustomer;
      const result = customerSchema.safeParse(withoutName);
      expect(result.success).toBe(false);
    });

    it("rejects name longer than 255 characters", () => {
      const result = customerSchema.safeParse({
        ...validCustomer,
        name: "a".repeat(256),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Kundenname ist zu lang");
      }
    });
  });

  describe("optional fields", () => {
    it("accepts minimal data (only name)", () => {
      const result = customerSchema.safeParse({ name: "Minimal Kunde" });
      expect(result.success).toBe(true);
    });

    it("accepts null values for optional fields", () => {
      const result = customerSchema.safeParse({
        name: "Test",
        street: null,
        postal_code: null,
        city: null,
        email: null,
        phone: null,
        vat_id: null,
        notes: null,
      });
      expect(result.success).toBe(true);
    });

    it("uses Deutschland as default country", () => {
      const result = customerSchema.safeParse({ name: "Test" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.country).toBe("Deutschland");
      }
    });
  });

  describe("email validation", () => {
    it("accepts valid email addresses", () => {
      const result = customerSchema.safeParse({
        ...validCustomer,
        email: "test@example.com",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email addresses", () => {
      const result = customerSchema.safeParse({
        ...validCustomer,
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Ungültige E-Mail-Adresse");
      }
    });

    it("accepts empty string for email", () => {
      const result = customerSchema.safeParse({
        ...validCustomer,
        email: "",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("field length limits", () => {
    it("rejects postal code longer than 10 characters", () => {
      const result = customerSchema.safeParse({
        ...validCustomer,
        postal_code: "12345678901",
      });
      expect(result.success).toBe(false);
    });

    it("rejects city longer than 100 characters", () => {
      const result = customerSchema.safeParse({
        ...validCustomer,
        city: "a".repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it("rejects notes longer than 1000 characters", () => {
      const result = customerSchema.safeParse({
        ...validCustomer,
        notes: "a".repeat(1001),
      });
      expect(result.success).toBe(false);
    });
  });
});
