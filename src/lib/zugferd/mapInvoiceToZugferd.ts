import type { InvoiceWithItems } from "@/app/(protected)/invoices/actions";
import type { UserSettings } from "@/app/(protected)/settings/actions";
import type { CountryCode, UnitCode } from "@rechnungs-api/client";
import { format } from "date-fns";

/**
 * Mappt die App-internen Rechnungsdaten zum Rechnungs-API Format
 */
export function mapInvoiceToRechnungsApi(
  invoice: InvoiceWithItems,
  settings: UserSettings
) {
  return {
    type: "invoice" as const,
    locale: "de-DE" as const,
    number: invoice.invoice_number,
    issueDate: format(new Date(invoice.invoice_date), "yyyy-MM-dd"),
    dueDate: invoice.due_date
      ? format(new Date(invoice.due_date), "yyyy-MM-dd")
      : format(new Date(invoice.invoice_date), "yyyy-MM-dd"), // Fallback auf Rechnungsdatum

    // Käufer-Referenz (Pflicht für E-Rechnungen, "00" wenn nicht anwendbar)
    buyerReference: "00",

    // Lieferzeitraum (Pflicht für XRechnung - BR-DE-TMP-32)
    deliveryPeriod: {
      startDate: format(new Date(invoice.invoice_date), "yyyy-MM-dd"),
      endDate: format(new Date(invoice.invoice_date), "yyyy-MM-dd"),
    },

    // Absender (Verkäufer)
    sender: {
      name: settings.company_name,
      address: {
        line1: settings.street || "N/A",
        postalCode: settings.postal_code || "00000",
        city: settings.city || "N/A",
        country: mapCountryToISO(settings.country),
      },
      // Elektronische Adresse (Pflicht für E-Rechnungen)
      electronicAddress: {
        scheme: "EM" as const, // Email
        value: settings.email || "noreply@example.com",
      },
      contact: {
        // BR-DE-5: Kontaktperson ist Pflicht für XRechnung
        name: settings.company_name,
        ...(settings.email && { email: settings.email }),
        ...(settings.phone && { phone: settings.phone }),
      },
      ...(settings.vat_id && { vatId: settings.vat_id }),
      ...(settings.tax_number && { taxNumber: settings.tax_number }),
    },

    // Empfänger (Käufer)
    recipient: {
      name: invoice.customers.name,
      address: {
        line1: invoice.customers.street || "N/A",
        postalCode: invoice.customers.postal_code || "00000",
        city: invoice.customers.city || "N/A",
        country: mapCountryToISO(invoice.customers.country),
      },
      // Elektronische Adresse (Pflicht für E-Rechnungen)
      electronicAddress: {
        scheme: "EM" as const, // Email
        value: invoice.customers.email || "noreply@example.com",
      },
      contact: {
        ...(invoice.customers.email && { email: invoice.customers.email }),
      },
      ...(invoice.customers.vat_id && { vatId: invoice.customers.vat_id }),
    },

    // Zahlungsinformationen
    payment: {
      means: settings.iban
        ? [
            {
              code: "30" as const, // Bank Transfer (Credit Transfer)
              bankAccount: {
                iban: settings.iban,
                bic: settings.bic || "NOTPROVIDED",
                bankName: settings.bank_name || "N/A",
              },
            },
          ]
        : [
            {
              code: "1" as const, // Instrument not defined
            },
          ],
    },

    // Rechnungspositionen
    lines: invoice.invoice_items.map((item) => ({
      unitPrice: {
        value: item.unit_price.toFixed(2),
        currency: "EUR" as const,
      },
      quantity: {
        value: item.quantity.toString(),
        unit: mapUnitToUNECE(item.unit),
      },
      item: {
        name: item.description,
        vat: {
          code: "S" as const, // Standard rate
          rate: item.vat_rate.toFixed(2),
        },
      },
    })),

    // Standard-Text vor der Tabelle (verhindert leere Notiz-Elemente)
    preTableText: "Rechnung",

    // E-Invoice Konfiguration für ZUGFeRD/XRechnung
    eInvoice: {
      type: "zugferd" as const,
      profile: "xrechnung" as const, // XRechnung - deutscher E-Rechnungsstandard
    },

    // Notizen nach der Tabelle (optional)
    ...(invoice.notes?.trim() && { postTableText: invoice.notes.trim() }),
  };
}

/**
 * Konvertiert deutsche Ländernamen zu ISO 3166-1 alpha-2 Codes
 */
function mapCountryToISO(country: string | null | undefined): CountryCode {
  if (!country) return "DE";

  const mapping: Record<string, CountryCode> = {
    Deutschland: "DE",
    Österreich: "AT",
    Schweiz: "CH",
    Frankreich: "FR",
    Italien: "IT",
    Spanien: "ES",
    Niederlande: "NL",
    Belgien: "BE",
    Luxemburg: "LU",
    Polen: "PL",
    Tschechien: "CZ",
    Dänemark: "DK",
    Schweden: "SE",
    Norwegen: "NO",
    Finnland: "FI",
    "Vereinigtes Königreich": "GB",
    Großbritannien: "GB",
    "Vereinigte Staaten": "US",
    USA: "US",
    Germany: "DE",
    Austria: "AT",
    Switzerland: "CH",
    France: "FR",
    Italy: "IT",
    Spain: "ES",
    Netherlands: "NL",
    Belgium: "BE",
    Luxembourg: "LU",
    Poland: "PL",
    "Czech Republic": "CZ",
    Czechia: "CZ",
    Denmark: "DK",
    Sweden: "SE",
    Norway: "NO",
    Finland: "FI",
    "United Kingdom": "GB",
    "United States": "US",
  };

  return mapping[country] ?? "DE";
}

/**
 * Konvertiert deutsche Einheiten zu UN/ECE Recommendation 20 Codes
 */
function mapUnitToUNECE(unit: string): UnitCode {
  const mapping: Record<string, UnitCode> = {
    // Stück
    Stk: "C62",
    Stück: "C62",
    Stck: "C62",
    pcs: "C62",
    pc: "C62",
    // Zeit
    Std: "HUR",
    Stunde: "HUR",
    Stunden: "HUR",
    h: "HUR",
    Tag: "DAY",
    Tage: "DAY",
    Monat: "MON",
    Monate: "MON",
    Min: "MIN",
    Minute: "MIN",
    Minuten: "MIN",
    // Gewicht
    kg: "KGM",
    Kilogramm: "KGM",
    g: "GRM",
    Gramm: "GRM",
    t: "TNE",
    Tonne: "TNE",
    // Länge
    m: "MTR",
    Meter: "MTR",
    km: "KMT",
    Kilometer: "KMT",
    // Fläche
    m2: "MTK",
    "m²": "MTK",
    qm: "MTK",
    // Volumen
    l: "LTR",
    Liter: "LTR",
    // Pauschal
    Pauschal: "C62",
    pauschal: "C62",
    Pauschale: "C62",
  };

  return mapping[unit] ?? "C62";
}
