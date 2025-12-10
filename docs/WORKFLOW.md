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
10. [Entwicklerinformationen](#entwicklerinformationen)

---

## Einführung

InvoiceFlow ist eine moderne Rechnungsverwaltung für Freiberufler und kleine Unternehmen in Deutschland. Die Anwendung ermöglicht:

- Erstellung professioneller Rechnungen nach deutschen Standards
- Verwaltung von Kundendaten
- Automatische Berechnung von MwSt. und Brutto/Netto-Beträgen
- PDF-Export für den Versand
- Status-Tracking (Entwurf → Offen → Bezahlt → Storniert)
- Übersichtliches Dashboard mit Statistiken

### Technische Grundlagen

| Komponente | Technologie |
|------------|-------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, Preline UI |
| Authentifizierung | Clerk |
| Datenbank | Supabase (PostgreSQL) mit Row-Level Security |
| PDF-Generierung | @react-pdf/renderer |
| Tabellen | AG Grid Community |
| Formularvalidierung | react-hook-form + Zod |
| Tests | Vitest (Unit), Playwright (E2E) |

---

## Erste Schritte

### 1. Registrierung

1. Öffnen Sie die Anwendung unter `http://localhost:3000`
2. Sie werden zur Landing-Page mit "Get Started Free" weitergeleitet
3. Klicken Sie auf **"Get Started Free"** oder **"Sign In"**
4. Erstellen Sie ein Konto mit E-Mail oder Social Login (Google/GitHub)
5. Nach der Registrierung werden Sie automatisch zum Dashboard weitergeleitet

### 2. Initiale Einrichtung

Nach der ersten Anmeldung sollten Sie:

1. **Einstellungen konfigurieren** (`/settings`) - Ihre Firmendaten eingeben (mindestens Firmenname erforderlich)
2. **Ersten Kunden anlegen** (`/customers`) - Mindestens einen Kunden erstellen
3. **Erste Rechnung erstellen** (`/invoices/new`) - Testrechnung zur Überprüfung

> **Wichtig:** Die Anwendung leitet Sie automatisch zu `/settings?setup=required` weiter, wenn Sie versuchen, eine Rechnung ohne konfigurierte Einstellungen zu erstellen.

---

## Dashboard

Das Dashboard (`/dashboard`) bietet eine Übersicht Ihrer Rechnungsaktivitäten.

### Statistik-Karten

| Karte | Beschreibung | Icon-Farbe |
|-------|--------------|------------|
| **Rechnungen gesamt** | Gesamtzahl aller Rechnungen | Blau |
| **Offen** | Anzahl unbezahlter Rechnungen + Gesamtbetrag | Gelb |
| **Bezahlt** | Anzahl bezahlter Rechnungen + Gesamtbetrag | Grün |
| **Kunden** | Gesamtzahl der Kunden | Violett |

### Schnellaktionen

Zentrale Aktions-Buttons für schnellen Zugriff:

- **Neue Rechnung** - Direkt zur Rechnungserstellung (`/invoices/new`)
- **Kunden verwalten** - Zur Kundenliste (`/customers`)
- **Einstellungen** - Zu den Firmendaten (`/settings`)

### Letzte Rechnungen

Tabelle mit den 5 neuesten Rechnungen:

- Rechnungsnummer (klickbar, führt zur Detailansicht)
- Kundenname
- Datum
- Betrag (Brutto)
- Status-Badge (farbcodiert)
- Link "Alle anzeigen →" führt zur vollständigen Rechnungsliste

### Onboarding-Hinweis

Wenn keine Firmendaten oder Kunden vorhanden sind, erscheint ein blauer Info-Banner mit Links zu:

- **Firmendaten** einrichten
- **Kunden** hinzufügen

---

## Einstellungen

Unter `/settings` konfigurieren Sie Ihre Geschäftsdaten.

### Abschnitte im Formular

#### 1. Firmendaten

| Feld | Beschreibung | Pflicht | Platzhalter |
|------|--------------|---------|-------------|
| Firmenname | Ihr Unternehmen oder Name | **Ja** | Ihre Firma GmbH |
| Straße und Hausnummer | Geschäftsadresse | Nein | Musterstraße 123 |
| PLZ | Postleitzahl | Nein | 12345 |
| Stadt | Ort | Nein | Berlin |
| Land | Standard: Deutschland | Nein | Deutschland |
| E-Mail | Geschäfts-E-Mail | Nein | `kontakt@firma.de` |
| Telefon | Geschäftstelefon | Nein | +49 30 12345678 |

#### 2. Steuerinformationen

| Feld | Beschreibung | Platzhalter |
|------|--------------|-------------|
| Steuernummer | Vom Finanzamt zugewiesen | 12/345/67890 |
| USt-IdNr. | Umsatzsteuer-Identifikationsnummer | DE123456789 |
| Standard MwSt.-Satz (%) | Vorausgewählter Satz für neue Positionen | 19 |

#### 3. Bankverbindung

| Feld | Beschreibung | Platzhalter | Hinweis |
|------|--------------|-------------|---------|
| Bank | Name Ihrer Bank | Sparkasse Berlin | |
| IBAN | Internationale Bankkontonummer | DE89370400440532013000 | Ohne Leerzeichen |
| BIC | Bank Identifier Code | COBADEFFXXX | |

#### 4. Rechnungseinstellungen

| Feld | Beschreibung | Standard | Beispiel |
|------|--------------|----------|----------|
| Rechnungsnummern-Präfix | Vorzeichen für Rechnungsnummern | INV- | INV-0001, RE-0001 |

### Speichern

- Button: **"Einstellungen speichern"**
- Bei erfolgreichem Speichern: Grüne Erfolgsmeldung
- Bei Fehler: Rote Fehlermeldung

> **Hinweis:** Die nächste Rechnungsnummer wird automatisch basierend auf dem Präfix und der höchsten existierenden Nummer generiert.

---

## Kundenverwaltung

Unter `/customers` verwalten Sie Ihre Kundenstammdaten.

### Seiten-Header

- Titel: **"Kunden"**
- Button: **"Neuer Kunde"** (oben rechts)

### Kundenliste

#### Spalten in der Tabelle

| Spalte | Beschreibung | Format |
|--------|--------------|--------|
| Name | Kundenname + Straße (zweizeilig) | Fett + Grau |
| Stadt | Ort des Kunden | - wenn leer |
| E-Mail | Klickbarer mailto:-Link | Blau, - wenn leer |
| Telefon | Telefonnummer | - wenn leer |
| Aktionen | Bearbeiten + Löschen Buttons | Rechts ausgerichtet |

#### Tabellen-Features

- Hover-Effekt auf Zeilen (hellgrauer Hintergrund)
- Responsive Design
- Automatisches Scrollen bei vielen Einträgen

### Kunde anlegen

1. Klicken Sie auf **"Neuer Kunde"**
2. Ein Modal öffnet sich mit dem Formular
3. Füllen Sie mindestens den **Namen** aus (Pflichtfeld)
4. Optionale Felder:
   - Straße
   - PLZ, Stadt, Land
   - E-Mail, Telefon
   - USt-IdNr. (wichtig für B2B-Rechnungen)
   - Notizen (interne Vermerke)
5. Klicken Sie auf **"Kunde anlegen"**
6. Bei Erfolg: Modal schließt sich, Liste wird aktualisiert
7. Bei Fehler: Fehlermeldung im Modal

### Kunde bearbeiten

1. Klicken Sie in der Zeile auf **"Bearbeiten"**
2. Modal öffnet sich mit vorausgefüllten Daten
3. Ändern Sie die gewünschten Felder
4. Klicken Sie auf **"Kunde aktualisieren"**

### Kunde löschen

1. Klicken Sie auf **"Löschen"**
2. Bestätigen Sie die Sicherheitsabfrage
3. Bei Erfolg: Kunde wird entfernt
4. Bei Fehler: Rote Fehlermeldung erscheint (z.B. "Kunde kann nicht gelöscht werden, da zugehörige Rechnungen existieren")

> **Achtung:** Kunden mit bestehenden Rechnungen können nicht gelöscht werden! Dies wird durch eine Datenbank-Constraint erzwungen.

### Empty State

Wenn keine Kunden vorhanden sind:

- Großes Icon in der Mitte
- Text: "Noch keine Kunden"
- Untertext: "Fügen Sie Ihren ersten Kunden hinzu, um Rechnungen zu erstellen."
- Button: **"Ersten Kunden anlegen"**

---

## Rechnungserstellung

Unter `/invoices/new` erstellen Sie neue Rechnungen.

### Header der Seite

- Breadcrumb-Navigation: Rechnungen → Neue Rechnung
- Titel: **"Neue Rechnung erstellen"**
- Untertext: "Erstellen Sie eine neue Rechnung für einen Ihrer Kunden"

### Warnung bei fehlenden Kunden

Wenn keine Kunden vorhanden sind:

- Gelber Warn-Banner mit Icon
- Text: "Keine Kunden vorhanden"
- Link: **"Kunden anlegen"** führt zu `/customers`
- Das Formular ist deaktiviert

### Formular-Struktur

#### Abschnitt 1: Rechnungsdetails

| Feld | Typ | Standard | Beschreibung |
|------|-----|----------|--------------|
| **Kunde** * | Dropdown | - | Auswahl aus Ihrer Kundenliste |
| **Status** | Dropdown | Entwurf | Entwurf oder Offen |
| **Rechnungsdatum** * | Datum | Heute | Ausstellungsdatum |
| **Fälligkeitsdatum** | Datum | Heute + 14 Tage | Zahlungsziel |

#### Abschnitt 2: Positionen (AG Grid Tabelle)

Die Tabelle unterstützt **Inline-Bearbeitung**:

| Spalte | Typ | Standard | Bearbeitbar | Beschreibung |
|--------|-----|----------|-------------|--------------|
| Beschreibung | Text | - | Ja | Leistungsbeschreibung |
| Menge | Zahl | 1 | Ja | Anzahl/Stunden/Meter |
| Einheit | Dropdown | Stk. | Ja | Stk., Std., Psch., m, kg, l, etc. |
| Einzelpreis | Zahl | 0 | Ja | Preis pro Einheit (netto) |
| MwSt. | Dropdown | 19% | Ja | 0%, 7%, 19% |
| Netto | Zahl | Berechnet | **Nein** | Automatisch: Menge × Einzelpreis |

**Bedienung:**

- **Doppelklick** oder **Enter** auf Zelle zum Bearbeiten
- **Tab** zum Navigieren zur nächsten Zelle
- **Shift + Tab** zur vorherigen Zelle
- **Papierkorb-Icon** zum Löschen einer Zeile (mindestens 1 Position erforderlich)
- Button **"Position hinzufügen"** für neue Zeile

#### Abschnitt 3: Notizen und Zusammenfassung

**Linke Spalte - Notizen:**

- Textarea für Zahlungsbedingungen, Hinweise
- Beispiele: "Zahlbar innerhalb von 14 Tagen", "Bei Fragen kontaktieren Sie uns"

**Rechte Spalte - Zusammenfassung:**

- **Netto:** Summe aller Netto-Beträge
- **MwSt.:** Summe aller Steuerbeträge (gruppiert nach Satz)
- **Brutto:** Gesamtbetrag (fett formatiert)

### Validierung

- **Kunde auswählen:** Pflichtfeld
- **Mindestens 1 Position:** Mit ausgefüllter Beschreibung erforderlich
- **Datum:** Rechnungsdatum ist Pflichtfeld
- Bei Validierungsfehlern: Rote Fehlermeldung über den Buttons

### Aktions-Buttons

- **Abbrechen** - Zurück zur vorherigen Seite
- **Rechnung erstellen** - Speichert und leitet zur Detailansicht weiter
  - Während des Speicherns: "Wird erstellt..."
  - Deaktiviert, wenn keine Kunden vorhanden

---

## Rechnungsverwaltung

### Rechnungsliste (`/invoices`)

#### Header der Rechnungsliste

- Titel: **"Rechnungen"**
- Untertext: "Verwalten Sie alle Ihre Rechnungen an einem Ort"
- Button: **"Neue Rechnung"** (oben rechts)

#### Status-Filter Tabs

Horizontale Tab-Leiste zum Filtern:

| Tab | Anzeige | URL-Parameter |
|-----|---------|---------------|
| **Alle** | Alle Rechnungen | Kein Parameter |
| **Entwurf** | Noch nicht versendete | `?status=draft` |
| **Offen** | Versendete, unbezahlte | `?status=open` |
| **Bezahlt** | Abgeschlossene | `?status=paid` |
| **Storniert** | Annullierte | `?status=cancelled` |

Aktiver Tab: Blauer Hintergrund und blaue Schrift

#### Tabellenspalten

| Spalte | Beschreibung | Format |
|--------|--------------|--------|
| Rechnungsnr. | Verlinkt zur Detailansicht | Blauer Link |
| Kunde | Kundenname | Text |
| Datum | Rechnungsdatum | dd.MM.yyyy |
| Betrag | Bruttobetrag | Rechtsbündig, EUR |
| Status | Farbiger Badge | Siehe Status-Farben |
| Aktionen | Ansehen, PDF | Icons |

#### Status-Farben (Badges)

| Status | Farbe | Label |
|--------|-------|-------|
| draft | Grauer Hintergrund | Entwurf |
| open | Gelber Hintergrund | Offen |
| paid | Grüner Hintergrund | Bezahlt |
| cancelled | Roter Hintergrund | Storniert |

#### Leerer Zustand

Abhängig vom gewählten Tab:

**Alle Rechnungen:**

- Text: "Noch keine Rechnungen"
- Untertext: "Erstellen Sie Ihre erste Rechnung, um loszulegen."
- Button: **"Erste Rechnung erstellen"**

**Spezifischer Status:**

- Text: "Keine [Status]en Rechnungen"
- Untertext: "Es gibt keine Rechnungen mit diesem Status."
- Kein Button (nur Hinweis)

---

### Rechnungsdetails (`/invoices/[id]`)

#### Header der Detailansicht

- Breadcrumb: Rechnungen → [Rechnungsnummer]
- Titel: **"Rechnung [NUMMER]"**

#### Status- und Aktionskarte

**Linke Seite:**

- Farbiger Status-Badge
- Großer Bruttobetrag

**Rechte Seite - Aktionsbuttons (abhängig vom Status):**

| Aktueller Status | Verfügbare Aktionen |
|------------------|---------------------|
| **Entwurf** | "Als offen markieren" (blau), "Stornieren" (rot), "Löschen" (rot) |
| **Offen** | "Als bezahlt markieren" (grün), "Stornieren" (rot) |
| **Bezahlt** | Nur PDF-Download |
| **Storniert** | Nur PDF-Download |

**Zusätzliche Aktionen:**

- **"PDF herunterladen"** (grauer Button) - In allen Status verfügbar
- Button deaktiviert während der Aktualisierung

#### Rechnungsinformationen

**Kundendaten:**

- Name, Adresse (mehrzeilig)
- E-Mail, Telefon
- USt-IdNr. (falls vorhanden)

**Rechnungsdaten:**

- Rechnungsnummer
- Rechnungsdatum
- Fälligkeitsdatum
- Status-Badge

#### Positionstabelle

Statische Tabelle (nicht bearbeitbar) mit Spalten:

- Pos. (Position)
- Beschreibung
- Menge
- Einheit
- Einzelpreis (netto)
- MwSt.-Satz
- Nettobetrag

#### Zusammenfassung

- Nettobetrag gesamt
- MwSt.-Betrag (aufgeschlüsselt nach Sätzen, falls mehrere)
- **Bruttobetrag gesamt** (hervorgehoben)

#### Notizen

Falls vorhanden: Anzeige der Notizen/Zahlungsbedingungen in einer Box

---

## PDF-Generierung

Die PDF-Generierung erfolgt serverseitig mit `@react-pdf/renderer`.

### PDF-Inhalt (Deutsches Rechnungsformat)

#### 1. Kopfbereich

- Absenderzeile (klein, einzeilig)
- Empfängeradresse (mehrzeilig, positioniert für Fensterumschläge)

#### 2. Rechnungsdetails (rechtsbündig)

- Titel: **"Rechnung"**
- Rechnungsnummer
- Rechnungsdatum
- Fälligkeitsdatum
- Kunden-USt-IdNr. (falls vorhanden)

#### 3. Positionstabelle

| Spalte | Inhalt |
|--------|--------|
| Pos. | Positionsnummer |
| Beschreibung | Leistungsbeschreibung |
| Menge | Anzahl |
| Einheit | Maßeinheit |
| Einzelpreis | Netto-Preis |
| MwSt. | Steuersatz |
| Betrag | Netto-Gesamtbetrag |

#### 4. Summenbereich (rechtsbündig)

```text
Nettobetrag:        XXX,XX EUR
MwSt. 19%:          XXX,XX EUR
MwSt. 7%:           XXX,XX EUR (falls vorhanden)
─────────────────────────────
Gesamtbetrag:       XXX,XX EUR
```

#### 5. Zahlungsinformationen

- Zahlungsziel (berechnet aus Fälligkeitsdatum)
- Notizen/Zahlungsbedingungen (falls vorhanden)

#### 6. Fußzeile (klein, mehrspaltig)

**Spalte 1 - Kontakt:**

- Firmenname
- Adresse
- E-Mail, Telefon

**Spalte 2 - Bankverbindung:**

- IBAN
- BIC
- Bankname

**Spalte 3 - Steuerdaten:**

- Steuernummer
- USt-IdNr.

### PDF herunterladen

**Von der Rechnungsliste:**

1. Klicken Sie auf das PDF-Icon in der Spalte "Aktionen"

**Von der Detailansicht:**

1. Klicken Sie auf **"PDF herunterladen"**

**Ergebnis:**

- Dateiname: `Rechnung_[NUMMER].pdf`
- Browser öffnet Download-Dialog
- PDF wird im Browser angezeigt (je nach Browser-Einstellung)

### API-Endpunkt

- Route: `/invoices/[id]/pdf`
- Methode: GET
- Authentifizierung: Clerk-geschützt
- Response: PDF als `application/pdf`

---

## Typischer Workflow

### Neukunden-Workflow

```text
1. Erste Anmeldung
   └─> Dashboard: Onboarding-Hinweis erscheint

2. Einstellungen → Firmendaten einrichten
   ├─> Firmenname (Pflicht)
   ├─> Adresse, Kontakt
   ├─> Steuerdaten
   ├─> Bankverbindung
   └─> "Einstellungen speichern"

3. Kunden → Neuen Kunden anlegen
   ├─> "Neuer Kunde" Button
   ├─> Modal öffnet sich
   ├─> Mindestens Name eingeben
   └─> "Kunde anlegen"

4. Rechnungen → Neue Rechnung erstellen
   ├─> "Neue Rechnung" Button
   ├─> Kunde auswählen
   ├─> Status: "Entwurf" (zum Prüfen)
   ├─> Positionen in AG Grid eingeben
   ├─> Notizen hinzufügen
   └─> "Rechnung erstellen"

5. Rechnung prüfen
   ├─> Detailansicht öffnet sich automatisch
   ├─> Alle Daten überprüfen
   └─> Falls korrekt: Weiter zu Schritt 6

6. Status ändern: "Als offen markieren"
   └─> Rechnung ist nun offiziell erstellt

7. PDF herunterladen
   ├─> "PDF herunterladen" Button
   └─> PDF per E-Mail an Kunden senden (außerhalb der App)

8. Nach Zahlungseingang
   ├─> Rechnung öffnen
   └─> "Als bezahlt markieren"
```

### Monatlicher Workflow (Stammkunde)

```text
1. Dashboard → "Neue Rechnung"

2. Rechnungserstellung
   ├─> Stammkunde aus Dropdown wählen
   ├─> Datum anpassen
   └─> Positionen eingeben (oder ähnlich wie Vormonat)

3. Direkt als "Offen" speichern
   └─> Wenn bereits geprüft

4. PDF erstellen und direkt versenden
```

### Stornierung

```text
1. Rechnung öffnen (/invoices/[id])

2. "Stornieren" Button klicken
   └─> Bestätigen

3. Status ändert sich zu "Storniert"
   └─> Keine weiteren Änderungen möglich

4. Optional: Korrekturrechnung erstellen
   ├─> Neue Rechnung anlegen
   ├─> Notiz: "Korrektur zu Rechnung [NUMMER]"
   └─> Richtige Beträge/Positionen eingeben
```

### Überfällige Rechnungen verfolgen

```text
1. Dashboard → "Offen" Statistik-Karte
   └─> Zeigt Anzahl und Gesamtbetrag offener Rechnungen

2. Rechnungen → "Offen" Tab
   └─> Alle unbezahlten Rechnungen einsehen

3. Fälligkeitsdatum in Tabelle prüfen
   └─> Rot hervorgehoben bei überfälligen Rechnungen (optional, abhängig von Implementierung)

4. Mahnung erstellen (manuell außerhalb der App)
```

---

## Tastaturkürzel

### AG Grid (Rechnungserstellung)

| Aktion | Kürzel |
|--------|--------|
| Zelle bearbeiten | Doppelklick oder Enter |
| Nächste Zelle | Tab |
| Vorherige Zelle | Shift + Tab |
| Bearbeitung abschließen | Enter |
| Bearbeitung abbrechen | Escape |

### Formular-Navigation

| Aktion | Kürzel |
|--------|--------|
| Zum nächsten Feld | Tab |
| Zum vorherigen Feld | Shift + Tab |
| Formular absenden | Enter (im letzten Feld oder bei fokussiertem Submit-Button) |

---

## Fehlerbehebung

### "Bitte richten Sie zunächst Ihre Firmendaten ein"

**Problem:** Sie werden zu `/settings?setup=required` weitergeleitet.

**Lösung:**

- Füllen Sie mindestens den **Firmennamen** aus
- Klicken Sie auf "Einstellungen speichern"
- Kehren Sie zur Rechnungserstellung zurück

---

### "Kunde kann nicht gelöscht werden"

**Problem:** Rote Fehlermeldung beim Versuch, einen Kunden zu löschen.

**Grund:** Der Kunde hat zugehörige Rechnungen.

**Lösung:**

1. Öffnen Sie `/invoices`
2. Filtern Sie nach dem Kundennamen (oder prüfen Sie alle Rechnungen)
3. Löschen Sie alle Rechnungen des Kunden (nur Entwürfe können gelöscht werden)
4. Oder: Stornieren Sie die Rechnungen und behalten Sie den Kunden

> **Empfehlung:** Behalten Sie Kunden mit historischen Rechnungen für Ihre Buchführung.

---

### "PDF wird nicht erstellt" oder "Fehler beim Herunterladen"

**Mögliche Ursachen:**

1. Firmendaten unvollständig (mindestens Firmenname erforderlich)
2. Netzwerkfehler
3. Rechnung wurde gerade erstellt und ist noch nicht vollständig gespeichert

**Lösung:**

1. Prüfen Sie `/settings` - Firmenname muss ausgefüllt sein
2. Aktualisieren Sie die Seite (F5)
3. Versuchen Sie den Download erneut
4. Prüfen Sie die Browser-Konsole auf Fehler (F12)

---

### Modal schließt sich nicht / Bleibt hängen

**Problem:** Kunden- oder Rechnungs-Modal reagiert nicht.

**Lösung:**

1. Drücken Sie **Escape**
2. Klicken Sie auf den dunklen Hintergrund (Backdrop)
3. Falls nichts funktioniert: Seite neu laden (F5)

---

### AG Grid zeigt keine Daten / Tabelle leer

**Problem:** In der Rechnungserstellung ist die Positionstabelle leer.

**Lösung:**

1. Prüfen Sie die Browser-Konsole (F12) auf JavaScript-Fehler
2. Laden Sie die Seite neu (F5)
3. Falls das Problem weiterhin besteht: Cache leeren (Strg + Shift + R)

---

### "Ein unerwarteter Fehler ist aufgetreten"

**Problem:** Generische Fehlermeldung beim Speichern.

**Häufigste Ursachen:**

1. Datenbankverbindung unterbrochen
2. Clerk-Session abgelaufen
3. Validierungsfehler, der nicht abgefangen wurde

**Lösung:**

1. Prüfen Sie Ihre Internetverbindung
2. Melden Sie sich ab und wieder an
3. Falls der Fehler anhält: Prüfen Sie die Browser-Konsole (F12) und kontaktieren Sie den Support

---

## Rechtliche Hinweise

InvoiceFlow unterstützt die Erstellung von Rechnungen nach deutschen Anforderungen:

### Pflichtangaben nach §14 UStG

Die generierten PDFs enthalten:

- ✓ Vollständiger Name und Anschrift des Rechnungsstellers
- ✓ Vollständiger Name und Anschrift des Leistungsempfängers
- ✓ Steuernummer oder USt-IdNr. des Rechnungsstellers
- ✓ Ausstellungsdatum (Rechnungsdatum)
- ✓ Fortlaufende Rechnungsnummer
- ✓ Menge und Art der gelieferten Gegenstände/Umfang der Leistung
- ✓ Zeitpunkt der Lieferung/Leistung (Rechnungsdatum)
- ✓ Entgelt nach Steuersätzen aufgeschlüsselt
- ✓ Anzuwendender Steuersatz und Steuerbetrag
- ✓ Hinweis auf Aufbewahrungspflicht (optional in Notizen)

### MwSt.-Sätze

- **0%** - Steuerfreie Umsätze (§4 UStG)
- **7%** - Ermäßigter Steuersatz (§12 Abs. 2 UStG)
- **19%** - Regelsteuersatz (§12 Abs. 1 UStG)

### Aufbewahrungspflicht

Rechnungen müssen 10 Jahre aufbewahrt werden (§14b UStG, §147 AO).

> **Disclaimer:** Diese Software ersetzt keine steuerliche Beratung. Bei Fragen zu Ihrer spezifischen steuerlichen Situation konsultieren Sie bitte einen Steuerberater.

---

## Entwicklerinformationen

### Testing

Die Anwendung verfügt über umfassende Tests:

#### Unit Tests (Vitest)

```bash
# Tests im Watch-Modus ausführen
npm run test

# Tests einmalig ausführen
npm run test:run

# Coverage-Report generieren
npm run test:coverage
```

**Test-Coverage:**

- 89 Unit-Tests
- Utility-Funktionen (`src/lib/utils.ts`)
- Zod-Validierungsschemas (`src/lib/validations/`)

#### E2E Tests (Playwright)

```bash
# E2E-Tests ausführen (startet Dev-Server automatisch)
npm run test:e2e

# Tests mit UI (visuelles Debugging)
npm run test:e2e:ui

# Tests im Debug-Modus
npm run test:e2e:debug
```

**Test-Suites:**

- `customers.spec.ts` - Kundenverwaltung (5 Tests)
- `invoices.spec.ts` - Rechnungsverwaltung (7 Tests)
- `pdf-download.spec.ts` - Dashboard, Einstellungen, allgemeine Tests (11 Tests)

**Authentifizierung:**

- Tests verwenden Clerk mit `@clerk/testing`
- Erfordert Test-User mit `+clerk_test` im E-Mail-Format
- Siehe `e2e/README.md` für Setup-Anweisungen

#### CI/CD

- GitHub Actions Workflow (`.github/workflows/e2e.yml`)
- Automatische E2E-Tests bei Push/PR auf main branch
- Playwright-Reports als Artifacts verfügbar

### Development Commands

```bash
# Development Server starten
npm run dev

# Production Build erstellen
npm run build

# Production Server starten
npm run start

# ESLint ausführen
npm run lint
```

### Datenbank-Setup

Siehe `CLAUDE.md` für vollständige Anweisungen:

1. Supabase SQL Editor öffnen
2. `supabase/schema.sql` ausführen (Tabellen + RLS)
3. `supabase/storage.sql` ausführen (PDF Storage Bucket)
4. Nach erster Anmeldung: `supabase/seed.sql` anpassen (Ihre Clerk-User-ID eintragen) und ausführen

### Umgebungsvariablen

Erforderliche `.env.local` Einträge:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# E2E Testing (optional, nur für Tests)
E2E_CLERK_USER_USERNAME=test+clerk_test@example.com
E2E_CLERK_USER_PASSWORD=your-password
TEST_VERIFICATION_CODE=424242
```

---

**Version:** 1.1.0
**Letztes Update:** 10. Dezember 2025
**Dokumentation erstellt für:** InvoiceFlow MVP
