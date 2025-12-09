import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Euro currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/**
 * Format a date string in German format (dd.MM.yyyy)
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "dd.MM.yyyy", { locale: de });
  } catch {
    return dateString;
  }
}

/**
 * Format a date string in long German format (d. MMMM yyyy)
 */
export function formatDateLong(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "d. MMMM yyyy", { locale: de });
  } catch {
    return dateString;
  }
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/**
 * Get a date N days from now as YYYY-MM-DD string
 */
export function getDateFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return format(date, "yyyy-MM-dd");
}

/**
 * Calculate invoice totals from items
 */
export function calculateInvoiceTotals(
  items: Array<{
    quantity: number;
    unit_price: number;
    vat_rate: number;
  }>
): {
  net_total: number;
  vat_total: number;
  gross_total: number;
} {
  let net_total = 0;
  let vat_total = 0;

  for (const item of items) {
    const netAmount = item.quantity * item.unit_price;
    const vatAmount = netAmount * (item.vat_rate / 100);
    net_total += netAmount;
    vat_total += vatAmount;
  }

  return {
    net_total: Math.round(net_total * 100) / 100,
    vat_total: Math.round(vat_total * 100) / 100,
    gross_total: Math.round((net_total + vat_total) * 100) / 100,
  };
}

/**
 * Calculate single item amounts
 */
export function calculateItemAmounts(
  quantity: number,
  unit_price: number,
  vat_rate: number
): {
  net_amount: number;
  vat_amount: number;
  gross_amount: number;
} {
  const net_amount = quantity * unit_price;
  const vat_amount = net_amount * (vat_rate / 100);
  const gross_amount = net_amount + vat_amount;

  return {
    net_amount: Math.round(net_amount * 100) / 100,
    vat_amount: Math.round(vat_amount * 100) / 100,
    gross_amount: Math.round(gross_amount * 100) / 100,
  };
}

/**
 * Generate next invoice number
 */
export function generateInvoiceNumber(
  prefix: string,
  nextNumber: number
): string {
  return `${prefix}${nextNumber.toString().padStart(4, "0")}`;
}

/**
 * Get invoice status badge color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    open: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || colors.draft;
}

/**
 * Get invoice status label in German
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "Entwurf",
    open: "Offen",
    paid: "Bezahlt",
    cancelled: "Storniert",
  };
  return labels[status] || status;
}
