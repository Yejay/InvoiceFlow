import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatDateLong,
  getTodayString,
  getDateFromNow,
  calculateInvoiceTotals,
  calculateItemAmounts,
  generateInvoiceNumber,
  getStatusColor,
  getStatusLabel,
  cn,
} from "./utils";

describe("formatCurrency", () => {
  // Note: Intl.NumberFormat uses non-breaking space (U+00A0) before €
  // We use regex to match any whitespace character

  it("formats positive amounts in Euro format", () => {
    expect(formatCurrency(1234.56)).toMatch(/^1\.234,56\s€$/);
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toMatch(/^0,00\s€$/);
  });

  it("formats negative amounts", () => {
    expect(formatCurrency(-99.99)).toMatch(/^-99,99\s€$/);
  });

  it("formats large amounts with thousand separators", () => {
    expect(formatCurrency(1000000)).toMatch(/^1\.000\.000,00\s€$/);
  });

  it("rounds to 2 decimal places", () => {
    expect(formatCurrency(99.999)).toMatch(/^100,00\s€$/);
  });
});

describe("formatDate", () => {
  it("formats ISO date string to German format (dd.MM.yyyy)", () => {
    expect(formatDate("2024-03-15")).toBe("15.03.2024");
  });

  it("handles ISO datetime strings", () => {
    expect(formatDate("2024-12-25T10:30:00")).toBe("25.12.2024");
  });

  it("returns original string for invalid dates", () => {
    expect(formatDate("invalid-date")).toBe("invalid-date");
  });
});

describe("formatDateLong", () => {
  it("formats date in long German format", () => {
    expect(formatDateLong("2024-03-15")).toBe("15. März 2024");
  });

  it("handles different months correctly", () => {
    expect(formatDateLong("2024-01-01")).toBe("1. Januar 2024");
    expect(formatDateLong("2024-12-31")).toBe("31. Dezember 2024");
  });
});

describe("getTodayString", () => {
  it("returns date in YYYY-MM-DD format", () => {
    const result = getTodayString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("returns today's date", () => {
    const today = new Date();
    const expected = today.toISOString().split("T")[0];
    expect(getTodayString()).toBe(expected);
  });
});

describe("getDateFromNow", () => {
  it("returns date N days from now in YYYY-MM-DD format", () => {
    const result = getDateFromNow(14);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("correctly adds days", () => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    const expected = today.toISOString().split("T")[0];
    expect(getDateFromNow(7)).toBe(expected);
  });

  it("handles negative days (past dates)", () => {
    const today = new Date();
    today.setDate(today.getDate() - 5);
    const expected = today.toISOString().split("T")[0];
    expect(getDateFromNow(-5)).toBe(expected);
  });
});

describe("calculateInvoiceTotals", () => {
  it("calculates totals for single item with 19% VAT", () => {
    const items = [{ quantity: 1, unit_price: 100, vat_rate: 19 }];
    const result = calculateInvoiceTotals(items);

    expect(result.net_total).toBe(100);
    expect(result.vat_total).toBe(19);
    expect(result.gross_total).toBe(119);
  });

  it("calculates totals for multiple items", () => {
    const items = [
      { quantity: 2, unit_price: 50, vat_rate: 19 },
      { quantity: 1, unit_price: 200, vat_rate: 7 },
    ];
    const result = calculateInvoiceTotals(items);

    expect(result.net_total).toBe(300); // 2*50 + 1*200
    expect(result.vat_total).toBe(33); // 100*0.19 + 200*0.07 = 19 + 14
    expect(result.gross_total).toBe(333);
  });

  it("handles 0% VAT rate", () => {
    const items = [{ quantity: 3, unit_price: 100, vat_rate: 0 }];
    const result = calculateInvoiceTotals(items);

    expect(result.net_total).toBe(300);
    expect(result.vat_total).toBe(0);
    expect(result.gross_total).toBe(300);
  });

  it("handles empty items array", () => {
    const result = calculateInvoiceTotals([]);

    expect(result.net_total).toBe(0);
    expect(result.vat_total).toBe(0);
    expect(result.gross_total).toBe(0);
  });

  it("rounds to 2 decimal places", () => {
    const items = [{ quantity: 1, unit_price: 33.33, vat_rate: 19 }];
    const result = calculateInvoiceTotals(items);

    expect(result.net_total).toBe(33.33);
    expect(result.vat_total).toBe(6.33); // 33.33 * 0.19 = 6.3327 → 6.33
    expect(result.gross_total).toBe(39.66);
  });

  it("handles fractional quantities", () => {
    const items = [{ quantity: 1.5, unit_price: 100, vat_rate: 19 }];
    const result = calculateInvoiceTotals(items);

    expect(result.net_total).toBe(150);
    expect(result.vat_total).toBe(28.5);
    expect(result.gross_total).toBe(178.5);
  });
});

describe("calculateItemAmounts", () => {
  it("calculates amounts for single item with 19% VAT", () => {
    const result = calculateItemAmounts(1, 100, 19);

    expect(result.net_amount).toBe(100);
    expect(result.vat_amount).toBe(19);
    expect(result.gross_amount).toBe(119);
  });

  it("calculates with quantity > 1", () => {
    const result = calculateItemAmounts(5, 20, 19);

    expect(result.net_amount).toBe(100);
    expect(result.vat_amount).toBe(19);
    expect(result.gross_amount).toBe(119);
  });

  it("handles 7% VAT rate", () => {
    const result = calculateItemAmounts(2, 50, 7);

    expect(result.net_amount).toBe(100);
    expect(result.vat_amount).toBe(7);
    expect(result.gross_amount).toBe(107);
  });

  it("handles 0% VAT rate", () => {
    const result = calculateItemAmounts(10, 15, 0);

    expect(result.net_amount).toBe(150);
    expect(result.vat_amount).toBe(0);
    expect(result.gross_amount).toBe(150);
  });

  it("rounds amounts to 2 decimal places", () => {
    const result = calculateItemAmounts(1, 33.33, 19);

    expect(result.net_amount).toBe(33.33);
    expect(result.vat_amount).toBe(6.33);
    expect(result.gross_amount).toBe(39.66);
  });

  it("handles fractional quantities", () => {
    const result = calculateItemAmounts(2.5, 40, 19);

    expect(result.net_amount).toBe(100);
    expect(result.vat_amount).toBe(19);
    expect(result.gross_amount).toBe(119);
  });
});

describe("generateInvoiceNumber", () => {
  it("generates invoice number with prefix and padded number", () => {
    expect(generateInvoiceNumber("INV-", 1)).toBe("INV-0001");
    expect(generateInvoiceNumber("INV-", 42)).toBe("INV-0042");
    expect(generateInvoiceNumber("INV-", 999)).toBe("INV-0999");
  });

  it("handles numbers with 4+ digits", () => {
    expect(generateInvoiceNumber("INV-", 1234)).toBe("INV-1234");
    expect(generateInvoiceNumber("INV-", 12345)).toBe("INV-12345");
  });

  it("works with different prefixes", () => {
    expect(generateInvoiceNumber("RE-", 5)).toBe("RE-0005");
    expect(generateInvoiceNumber("TS-", 100)).toBe("TS-0100");
    expect(generateInvoiceNumber("", 1)).toBe("0001");
  });
});

describe("getStatusColor", () => {
  it("returns correct colors for each status", () => {
    expect(getStatusColor("draft")).toBe("bg-gray-100 text-gray-800");
    expect(getStatusColor("open")).toBe("bg-yellow-100 text-yellow-800");
    expect(getStatusColor("paid")).toBe("bg-green-100 text-green-800");
    expect(getStatusColor("cancelled")).toBe("bg-red-100 text-red-800");
  });

  it("returns draft color for unknown status", () => {
    expect(getStatusColor("unknown")).toBe("bg-gray-100 text-gray-800");
  });
});

describe("getStatusLabel", () => {
  it("returns German labels for each status", () => {
    expect(getStatusLabel("draft")).toBe("Entwurf");
    expect(getStatusLabel("open")).toBe("Offen");
    expect(getStatusLabel("paid")).toBe("Bezahlt");
    expect(getStatusLabel("cancelled")).toBe("Storniert");
  });

  it("returns original status for unknown status", () => {
    expect(getStatusLabel("unknown")).toBe("unknown");
  });
});

describe("cn (class name merger)", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", true && "active", false && "inactive")).toBe("base active");
  });

  it("merges Tailwind classes correctly (removes conflicts)", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("handles undefined and null", () => {
    expect(cn("base", undefined, null, "other")).toBe("base other");
  });

  it("handles arrays", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });
});
