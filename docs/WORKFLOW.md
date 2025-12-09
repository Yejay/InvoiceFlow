# InvoiceFlow - Benutzerhandbuch & Workflow

## Inhaltsverzeichnis

1. [Einführung](#einführung)
2. [Erste Schritte](#erste-schritte)
3. [Dashboard](#dashboard)
4. [Einstellungen](#einstellungen)
5. [Kundenverwaltung](#kundenverwaltung)
6. [Rechnungserstellung](#rechnungserstellung)
7. [Rechnungsverwaltung](#rechnungsverwaltung)
8. [PDF-Generierung](#pdf-generierung)
9. [Typischer Workflow](#typischer-workflow)

---

## Einführung

InvoiceFlow ist eine moderne Rechnungsverwaltung für Freiberufler und kleine Unternehmen in Deutschland. Die Anwendung ermöglicht:

- Erstellung professioneller Rechnungen nach deutschen Standards
- Verwaltung von Kundendaten
- Automatische Berechnung von MwSt. und Brutto/Netto-Beträgen
- PDF-Export für den Versand
- Status-Tracking (Entwurf → Offen → Bezahlt)

### Technische Grundlagen

| Komponente | Technologie |
|------------|-------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS, Preline UI |
| Authentifizierung | Clerk |
| Datenbank | Supabase (PostgreSQL) |
| PDF-Generierung | @react-pdf/renderer |
| Tabellen | AG Grid Community |

---

## Erste Schritte

### 1. Registrierung

1. Öffnen Sie die Anwendung unter `http://localhost:3000`
2. Klicken Sie auf **"Registrieren"**
3. Erstellen Sie ein Konto mit E-Mail oder Social Login (Google/GitHub)
4. Nach der Registrierung werden Sie zum Dashboard weitergeleitet

### 2. Initiale Einrichtung

Nach der ersten Anmeldung sollten Sie:

1. **Einstellungen konfigurieren** - Ihre Firmendaten eingeben
2. **Ersten Kunden anlegen** - Mindestens einen Kunden erstellen
3. **Erste Rechnung erstellen** - Optional: Testrechnung erstellen

---

## Dashboard

Das Dashboard bietet eine Übersicht Ihrer Rechnungsaktivitäten.

### Statistik-Karten

| Karte | Beschreibung |
|-------|--------------|
| **Offene Rechnungen** | Anzahl und Gesamtwert aller unbezahlten Rechnungen |
| **Diesen Monat bezahlt** | Summe der im aktuellen Monat erhaltenen Zahlungen |
| **Gesamtumsatz** | Kumulierter Bruttoumsatz aller bezahlten Rechnungen |

### Aktuelle Rechnungen

Eine Liste der letzten 5 Rechnungen mit:
- Rechnungsnummer (verlinkt zur Detailansicht)
- Kundenname
- Datum
- Betrag
- Status-Badge

### Schnellaktionen

- **"Neue Rechnung erstellen"** Button für direkten Zugriff

---

## Einstellungen

Unter `/settings` konfigurieren Sie Ihre Geschäftsdaten.

### Firmendaten

| Feld | Beschreibung | Pflicht |
|------|--------------|---------|
| Firmenname | Ihr Unternehmen oder Name | Ja |
| Straße | Geschäftsadresse | Nein |
| PLZ/Stadt | Postleitzahl und Ort | Nein |
| Land | Standard: Deutschland | Nein |
| E-Mail | Geschäfts-E-Mail | Nein |
| Telefon | Geschäftstelefon | Nein |

### Steuerdaten

| Feld | Beschreibung | Beispiel |
|------|--------------|----------|
| Steuernummer | Vom Finanzamt zugewiesen | 27/123/45678 |
| USt-IdNr. | Umsatzsteuer-Identifikationsnummer | DE123456789 |

### Bankverbindung

| Feld | Beschreibung |
|------|--------------|
| IBAN | Internationale Bankkontonummer |
| BIC | Bank Identifier Code |
| Bankname | Name Ihrer Bank |

### Rechnungseinstellungen

| Feld | Beschreibung | Standard |
|------|--------------|----------|
| Standard-MwSt.-Satz | Vorausgewählter MwSt.-Satz | 19% |
| Rechnungsnummer-Präfix | Vorzeichen für Rechnungsnummern | INV- |

> **Hinweis:** Die nächste Rechnungsnummer wird automatisch hochgezählt.

---

## Kundenverwaltung

Unter `/customers` verwalten Sie Ihre Kundenstammdaten.

### Kunde anlegen

1. Klicken Sie auf **"Neuer Kunde"**
2. Füllen Sie das Formular aus:
   - **Name** (Pflichtfeld)
   - Adressdaten (Straße, PLZ, Stadt, Land)
   - Kontaktdaten (E-Mail, Telefon)
   - USt-IdNr. (wichtig für B2B)
   - Notizen (interne Vermerke)
3. Klicken Sie auf **"Kunde anlegen"**

### Kunde bearbeiten

1. Finden Sie den Kunden in der Tabelle
2. Klicken Sie auf **"Bearbeiten"**
3. Ändern Sie die Daten im Modal
4. Speichern Sie mit **"Kunde aktualisieren"**

### Kunde löschen

1. Klicken Sie auf **"Löschen"**
2. Bestätigen Sie die Aktion

> **Achtung:** Kunden mit bestehenden Rechnungen können nicht gelöscht werden!

### Kundenliste

Die Tabelle zeigt:
- Name (mit Straße als Unterzeile)
- Stadt
- E-Mail (anklickbar für mailto:)
- Telefon
- Aktions-Buttons

---

## Rechnungserstellung

Unter `/invoices/new` erstellen Sie neue Rechnungen.

### Schritt 1: Grunddaten eingeben

| Feld | Beschreibung |
|------|--------------|
| **Kunde** | Auswahl aus Ihrer Kundenliste |
| **Status** | Entwurf oder Offen |
| **Rechnungsdatum** | Standard: heute |
| **Fälligkeitsdatum** | Standard: 14 Tage ab heute |

### Schritt 2: Positionen hinzufügen

Die AG Grid Tabelle ermöglicht Inline-Bearbeitung:

| Spalte | Beschreibung | Bearbeitung |
|--------|--------------|-------------|
| Beschreibung | Leistungsbeschreibung | Freier Text |
| Menge | Anzahl/Stunden | Nummer |
| Einheit | Stk., Std., Psch., m, etc. | Dropdown |
| Einzelpreis | Preis pro Einheit | Nummer |
| MwSt. | Steuersatz | Dropdown (0%, 7%, 19%) |
| Netto | Automatisch berechnet | Schreibgeschützt |

**Bedienung:**
- Klicken Sie auf eine Zelle zum Bearbeiten
- Tab zum Navigieren zwischen Zellen
- **"Position hinzufügen"** für neue Zeile
- Papierkorb-Icon zum Löschen (min. 1 Position)

### Schritt 3: Notizen (optional)

Fügen Sie Zahlungsbedingungen oder Hinweise hinzu:
- "Zahlbar innerhalb von 14 Tagen"
- "Bei Fragen wenden Sie sich an..."

### Schritt 4: Prüfen und Speichern

Die Zusammenfassung zeigt:
- **Netto**: Summe aller Netto-Beträge
- **MwSt.**: Summe aller Steuerbeträge
- **Brutto**: Gesamtbetrag

Klicken Sie auf **"Rechnung erstellen"** um zu speichern.

---

## Rechnungsverwaltung

### Rechnungsliste (`/invoices`)

#### Statusfilter

Tabs oben ermöglichen Filterung:
- **Alle**: Alle Rechnungen
- **Entwurf**: Noch nicht versendete Rechnungen
- **Offen**: Versendete, unbezahlte Rechnungen
- **Bezahlt**: Abgeschlossene Rechnungen
- **Storniert**: Annullierte Rechnungen

#### Tabellenspalten

| Spalte | Beschreibung |
|--------|--------------|
| Nummer | Verlinkt zur Detailansicht |
| Kunde | Kundenname |
| Datum | Rechnungsdatum + Fälligkeit |
| Status | Farbiger Badge |
| Betrag | Bruttobetrag |
| Aktionen | Ansehen, PDF |

### Rechnungsdetails (`/invoices/[id]`)

Die Detailseite zeigt alle Rechnungsinformationen.

#### Statusänderungen

| Aktueller Status | Mögliche Aktionen |
|------------------|-------------------|
| Entwurf | → Offen markieren, → Stornieren, Löschen |
| Offen | → Bezahlt markieren, → Stornieren |
| Bezahlt | Keine Änderung möglich |
| Storniert | Keine Änderung möglich |

#### Verfügbare Aktionen

- **"Als offen markieren"**: Rechnung als versendet markieren
- **"Als bezahlt markieren"**: Zahlung eingegangen
- **"Stornieren"**: Rechnung annullieren
- **"PDF herunterladen"**: PDF-Export
- **"Löschen"**: Nur für Entwürfe

---

## PDF-Generierung

### PDF-Inhalt

Das generierte PDF enthält:

1. **Kopfbereich**
   - Absenderzeile (klein)
   - Empfängeradresse

2. **Rechnungsdetails**
   - Titel "Rechnung"
   - Rechnungsnummer
   - Datum
   - Fälligkeitsdatum
   - Kunden-USt-IdNr. (falls vorhanden)

3. **Positionstabelle**
   - Beschreibung
   - Menge
   - Einheit
   - Einzelpreis
   - MwSt.-Satz
   - Nettobetrag

4. **Summenbereich**
   - Nettobetrag
   - MwSt.-Betrag
   - **Gesamtbetrag (Brutto)**

5. **Fußzeile**
   - Firmendaten
   - Kontaktdaten
   - Steuerdaten
   - Bankverbindung

### PDF herunterladen

1. Öffnen Sie eine Rechnung (`/invoices/[id]`)
2. Klicken Sie auf **"PDF herunterladen"**
3. Die Datei wird als `Rechnung_[NUMMER].pdf` gespeichert

---

## Typischer Workflow

### Neukunden-Workflow

```
1. Einstellungen → Firmendaten einrichten (einmalig)
2. Kunden → Neuen Kunden anlegen
3. Rechnungen → Neue Rechnung erstellen
4. Positionen eingeben
5. Als "Entwurf" speichern → Prüfen
6. Status → "Offen" markieren
7. PDF herunterladen → Per E-Mail versenden
8. Nach Zahlungseingang → "Bezahlt" markieren
```

### Monatlicher Workflow (Stammkunde)

```
1. Rechnungen → Neue Rechnung
2. Stammkunde auswählen
3. Positionen aus Vormonat übernehmen (manuell)
4. Anpassen und speichern
5. PDF erstellen und versenden
```

### Stornierung

```
1. Rechnung öffnen
2. "Stornieren" klicken
3. Ggf. Gutschrift/Korrekturrechnung erstellen
```

---

## Tastaturkürzel

| Aktion | Kürzel |
|--------|--------|
| Zelle bearbeiten (AG Grid) | Doppelklick oder Enter |
| Nächste Zelle | Tab |
| Vorherige Zelle | Shift + Tab |
| Speichern (Formular) | Enter |

---

## Fehlerbehebung

### "Bitte richten Sie zunächst Ihre Firmendaten ein"

→ Gehen Sie zu `/settings` und füllen Sie mindestens den Firmennamen aus.

### "Kunde kann nicht gelöscht werden"

→ Der Kunde hat zugehörige Rechnungen. Löschen Sie zuerst alle Rechnungen dieses Kunden.

### PDF wird nicht erstellt

→ Stellen Sie sicher, dass alle Pflichtfelder in den Einstellungen ausgefüllt sind.

---

## Rechtliche Hinweise

InvoiceFlow unterstützt die Erstellung von Rechnungen nach deutschen Anforderungen:

- Pflichtangaben nach §14 UStG
- Fortlaufende Rechnungsnummern
- Netto/Brutto-Ausweisung
- MwSt.-Sätze (0%, 7%, 19%)

> **Disclaimer:** Diese Software ersetzt keine steuerliche Beratung. Konsultieren Sie bei Fragen Ihren Steuerberater.
