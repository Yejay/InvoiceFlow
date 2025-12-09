import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { InvoiceWithItems } from "@/app/(protected)/invoices/actions";
import type { UserSettings } from "@/app/(protected)/settings/actions";

// Register German font for proper umlauts
// Note: In production, consider registering a custom font like Inter or Open Sans

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
  },
  senderLine: {
    fontSize: 8,
    color: "#666666",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 5,
  },
  recipientSection: {
    marginBottom: 40,
  },
  recipientName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 2,
  },
  recipientAddress: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  metaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  metaLeft: {
    flex: 1,
  },
  metaRight: {
    width: 200,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  metaLabel: {
    width: 100,
    color: "#666666",
  },
  metaValue: {
    fontWeight: "bold",
  },
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    fontSize: 9,
    color: "#374151",
  },
  tableCell: {
    fontSize: 9,
  },
  colDescription: {
    flex: 3,
  },
  colQuantity: {
    width: 50,
    textAlign: "right",
  },
  colUnit: {
    width: 40,
    textAlign: "center",
  },
  colPrice: {
    width: 70,
    textAlign: "right",
  },
  colVat: {
    width: 40,
    textAlign: "right",
  },
  colNet: {
    width: 70,
    textAlign: "right",
  },
  totalsSection: {
    alignItems: "flex-end",
    marginBottom: 30,
  },
  totalsBox: {
    width: 220,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalsLabel: {
    color: "#666666",
  },
  totalsValue: {},
  totalsDivider: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginVertical: 4,
  },
  totalsFinal: {
    fontWeight: "bold",
    fontSize: 12,
  },
  notesSection: {
    marginBottom: 30,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  notesTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  notesText: {
    color: "#374151",
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
  },
  footerDivider: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginBottom: 15,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerColumn: {
    flex: 1,
  },
  footerTitle: {
    fontWeight: "bold",
    fontSize: 8,
    color: "#666666",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  footerText: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.4,
  },
});

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

type InvoiceTemplateProps = {
  invoice: InvoiceWithItems;
  settings: UserSettings;
};

export default function InvoiceTemplate({ invoice, settings }: InvoiceTemplateProps) {
  // Build sender line
  const senderParts = [settings.company_name];
  if (settings.street) senderParts.push(settings.street);
  if (settings.postal_code || settings.city) {
    senderParts.push(`${settings.postal_code || ""} ${settings.city || ""}`.trim());
  }
  const senderLine = senderParts.join(" · ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sender Line (small address above recipient) */}
        <View style={styles.header}>
          <Text style={styles.senderLine}>{senderLine}</Text>
        </View>

        {/* Recipient Address */}
        <View style={styles.recipientSection}>
          <Text style={styles.recipientName}>{invoice.customers.name}</Text>
          <View style={styles.recipientAddress}>
            {invoice.customers.street && (
              <Text>{invoice.customers.street}</Text>
            )}
            {(invoice.customers.postal_code || invoice.customers.city) && (
              <Text>
                {invoice.customers.postal_code} {invoice.customers.city}
              </Text>
            )}
            {invoice.customers.country && invoice.customers.country !== "Deutschland" && (
              <Text>{invoice.customers.country}</Text>
            )}
          </View>
        </View>

        {/* Invoice Title and Meta */}
        <View style={styles.metaSection}>
          <View style={styles.metaLeft}>
            <Text style={styles.invoiceTitle}>Rechnung</Text>
          </View>
          <View style={styles.metaRight}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Rechnungsnr.:</Text>
              <Text style={styles.metaValue}>{invoice.invoice_number}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Datum:</Text>
              <Text style={styles.metaValue}>{formatDate(invoice.invoice_date)}</Text>
            </View>
            {invoice.due_date && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Faellig am:</Text>
                <Text style={styles.metaValue}>{formatDate(invoice.due_date)}</Text>
              </View>
            )}
            {invoice.customers.vat_id && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>USt-IdNr. Kunde:</Text>
                <Text style={styles.metaValue}>{invoice.customers.vat_id}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>
              Beschreibung
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colQuantity]}>Menge</Text>
            <Text style={[styles.tableHeaderCell, styles.colUnit]}>Einh.</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Einzelpreis</Text>
            <Text style={[styles.tableHeaderCell, styles.colVat]}>MwSt.</Text>
            <Text style={[styles.tableHeaderCell, styles.colNet]}>Netto</Text>
          </View>

          {/* Table Rows */}
          {invoice.invoice_items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colDescription]}>
                {item.description}
              </Text>
              <Text style={[styles.tableCell, styles.colQuantity]}>
                {item.quantity.toLocaleString("de-DE")}
              </Text>
              <Text style={[styles.tableCell, styles.colUnit]}>{item.unit}</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>
                {formatCurrency(item.unit_price)}
              </Text>
              <Text style={[styles.tableCell, styles.colVat]}>{item.vat_rate}%</Text>
              <Text style={[styles.tableCell, styles.colNet]}>
                {formatCurrency(item.net_amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Nettobetrag</Text>
              <Text style={styles.totalsValue}>{formatCurrency(invoice.net_total)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>MwSt.</Text>
              <Text style={styles.totalsValue}>{formatCurrency(invoice.vat_total)}</Text>
            </View>
            <View style={styles.totalsDivider} />
            <View style={styles.totalsRow}>
              <Text style={[styles.totalsLabel, styles.totalsFinal]}>Gesamtbetrag</Text>
              <Text style={[styles.totalsValue, styles.totalsFinal]}>
                {formatCurrency(invoice.gross_total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Hinweise</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer with Bank Details */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <View style={styles.footerContent}>
            {/* Company Info */}
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Firma</Text>
              <Text style={styles.footerText}>{settings.company_name}</Text>
              {settings.street && (
                <Text style={styles.footerText}>{settings.street}</Text>
              )}
              {(settings.postal_code || settings.city) && (
                <Text style={styles.footerText}>
                  {settings.postal_code} {settings.city}
                </Text>
              )}
            </View>

            {/* Contact Info */}
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Kontakt</Text>
              {settings.email && (
                <Text style={styles.footerText}>{settings.email}</Text>
              )}
              {settings.phone && (
                <Text style={styles.footerText}>{settings.phone}</Text>
              )}
            </View>

            {/* Tax Info */}
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Steuerdaten</Text>
              {settings.tax_number && (
                <Text style={styles.footerText}>Steuernr.: {settings.tax_number}</Text>
              )}
              {settings.vat_id && (
                <Text style={styles.footerText}>USt-IdNr.: {settings.vat_id}</Text>
              )}
            </View>

            {/* Bank Info */}
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Bankverbindung</Text>
              {settings.bank_name && (
                <Text style={styles.footerText}>{settings.bank_name}</Text>
              )}
              {settings.iban && (
                <Text style={styles.footerText}>IBAN: {settings.iban}</Text>
              )}
              {settings.bic && (
                <Text style={styles.footerText}>BIC: {settings.bic}</Text>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
