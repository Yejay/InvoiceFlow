# InvoiceFlow - Technische Präsentation

**E-Business und Entrepreneurship - Abschlusspräsentation**
**Yejay Demirkan - 927077**
**Dauer: ca. 10 Minuten**

---

## Folie 1: Titelfolie

# InvoiceFlow
### Schnelle, einfache Rechnungserstellung

*Technische Präsentation - E-Business und Entrepreneurship*

---

## Folie 2: Anwendungszweck (ca. 0,5 Min)

### Was ist InvoiceFlow?

Eine moderne Rechnungsverwaltung für **Freiberufler** und kleine Unternehmen in Deutschland.

**Kernproblem:**
- Freelancer verbringen 15-30 Minuten pro Rechnung
- Existierende Tools sind komplex und teuer
- Einfache Lösung ohne Feature Bloat gesucht

**Unsere Lösung:**
- Rechnungserstellung in unter 2 Minuten
- Setup in unter 2 Minuten
- Kostenlose Basisversion

---

## Folie 3: Anforderungen - User Story (ca. 1-2 Min)

### Nutzungsszenario: "Max der Freelancer"

> *Max ist Webentwickler und muss nach Abschluss eines Projekts schnell eine Rechnung erstellen.*

**Der Workflow:**

1. **Anmeldung** - Max meldet sich mit Google OAuth an (Clerk)
2. **Ersteinrichtung** - Er gibt einmalig seine Firmendaten ein (Name, Adresse, Steuernummer, Bankverbindung)
3. **Kunde anlegen** - Max legt seinen Kunden "TechStartup GmbH" mit Adresse und USt-IdNr. an
4. **Rechnung erstellen** - Er wählt den Kunden, fügt Positionen hinzu (Beschreibung, Menge, Einheit, Preis, MwSt.)
5. **PDF generieren** - Mit einem Klick wird ein professionelles PDF erstellt
6. **Versenden & Tracken** - Max lädt das PDF herunter, versendet es, und markiert die Rechnung später als "bezahlt"

<!-- Screenshot: Workflow-Übersicht oder Dashboard -->
![Dashboard](screenshots/dashboard.png)

---

## Folie 4: Muss-Anforderungen (Must-Have)

| Anforderung | Status |
|-------------|--------|
| Benutzerauthentifizierung (E-Mail/OAuth) | Umgesetzt |
| Firmendaten-Einstellungen | Umgesetzt |
| Kundenverwaltung (CRUD) | Umgesetzt |
| Rechnungserstellung mit Positionen | Umgesetzt |
| Automatische Berechnung (Netto/MwSt./Brutto) | Umgesetzt |
| PDF-Generierung nach deutschen Standards | Umgesetzt |
| Status-Tracking (Entwurf → Offen → Bezahlt) | Umgesetzt |

---

## Folie 5: Nice-to-Have Anforderungen

| Anforderung | Status |
|-------------|--------|
| E-Mail-Versand von Rechnungen | Offen |
| Mehrere Rechnungstemplates | Offen |
| Recurring Invoices | Offen |
| Multi-Tenant / Team-Funktionalität | Offen |
| Tier-basierte Preisgestaltung (Clerk) | Vorbereitet |

---

## Folie 6: Architektur - Übersicht (ca. 4-5 Min)

### Client-Server Architektur

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 16 (React 19)                                          │
│  ├── React Server Components (Standard)                         │
│  ├── Client Components ("use client" bei Interaktivität)        │
│  ├── Tailwind CSS + Preline UI (Styling)                        │
│  └── AG Grid (Tabellen für Rechnungspositionen)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER (Next.js)                         │
├─────────────────────────────────────────────────────────────────┤
│  Server Actions ("use server")                                  │
│  ├── Dashboard: getDashboardStats()                             │
│  ├── Customers: CRUD Operations                                 │
│  ├── Invoices: getInvoices(), createInvoice(), updateStatus()   │
│  ├── Settings: get/saveUserSettings()                           │
│  └── PDF: generateInvoicePdf() via @react-pdf/renderer          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNE DIENSTE                               │
├──────────────────────────┬──────────────────────────────────────┤
│       Clerk              │           Supabase                    │
│  ├── Authentifizierung   │  ├── PostgreSQL Datenbank            │
│  ├── Session Management  │  ├── Row-Level Security (RLS)        │
│  ├── OAuth Provider      │  └── Storage (PDF Bucket)            │
│  └── JWT für Supabase    │                                      │
└──────────────────────────┴──────────────────────────────────────┘
```

---

## Folie 7: Datenmodell (ER-Diagramm)

### Entitäten und Beziehungen

```
┌─────────────────┐
│     Users       │
│  (Clerk-managed)│
│─────────────────│
│  user_id (PK)   │
└────────┬────────┘
         │
         │ 1:1 (Komposition)
         ▼
┌─────────────────┐       1:n (Komposition)      ┌─────────────────┐
│  UserSettings   │◄──────────────────────────────│    Customers    │
│─────────────────│                               │─────────────────│
│  id (PK)        │                               │  id (PK)        │
│  user_id (FK)   │                               │  user_id (FK)   │
│  company_name   │                               │  name           │
│  street         │                               │  street         │
│  tax_number     │                               │  city           │
│  vat_id         │                               │  vat_id         │
│  iban           │                               │  email          │
│  invoice_prefix │                               └────────┬────────┘
│  next_number    │                                        │
└─────────────────┘                                        │
                                                           │ n:1 (Aggregation)
         ┌─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐       1:n (Komposition)      ┌─────────────────┐
│    Invoices     │─────────────────────────────►│  InvoiceItems   │
│─────────────────│                               │─────────────────│
│  id (PK)        │                               │  id (PK)        │
│  user_id (FK)   │                               │  invoice_id(FK) │
│  customer_id(FK)│                               │  description    │
│  invoice_number │                               │  quantity       │
│  status         │                               │  unit           │
│  invoice_date   │                               │  unit_price     │
│  due_date       │                               │  vat_rate       │
│  net_total      │                               │  net_amount     │
│  vat_total      │                               │  vat_amount     │
│  gross_total    │                               │  gross_amount   │
└─────────────────┘                               └─────────────────┘
```

**Beziehungstypen:**
- **Users → UserSettings**: Komposition (1:1) - Einstellungen gehören zum User
- **Users → Customers**: Komposition (1:n) - Kunden gehören zum User
- **Users → Invoices**: Komposition (1:n) - Rechnungen gehören zum User
- **Customers → Invoices**: Aggregation (n:1) - Kunde kann in mehreren Rechnungen vorkommen
- **Invoices → InvoiceItems**: Komposition (1:n) - Positionen gehören zur Rechnung

---

## Folie 8: Sicherheitskonzept

### Mehrstufige Absicherung

| Ebene | Technologie | Funktion |
|-------|-------------|----------|
| **Authentifizierung** | Clerk | Email/OAuth Login, Session Management |
| **Autorisierung** | Clerk JWT + Supabase | JWT-Token für API-Zugriff |
| **Input Validation** | Zod Schemas | Server-seitige Validierung aller Eingaben |
| **Row-Level Security** | Supabase RLS | `user_id = auth.uid()` auf allen Tabellen |

**RLS Policy Beispiel:**
```sql
CREATE POLICY "Users can only access own data"
ON invoices FOR ALL
USING (user_id = auth.uid());
```

---

## Folie 9: Deployment

### Hosting-Architektur

| Service | Anbieter | Funktion |
|---------|----------|----------|
| **Frontend + API** | Vercel | Next.js Hosting, Edge Functions, CI/CD |
| **Datenbank** | Supabase | PostgreSQL, Storage, RLS |
| **Authentifizierung** | Clerk | User Management, OAuth |

**Kosten (Free Tier):**
- Vercel: 0€/Monat
- Supabase: 0€/Monat
- Clerk: 0€/Monat (bis 10.000 MAU)
- **Total: 0€** für MVP-Phase

---

## Folie 10: Schwerpunktthema - Clerk + Supabase Integration (ca. 3-4 Min)

### Warum dieses Thema?

Die Integration von **Clerk** (Authentifizierung) mit **Supabase** (Datenbank) ist das technische Herzstück der Anwendung. Beide Services arbeiten eng zusammen und bieten eine vollständige Backend-as-a-Service Lösung.

---

## Folie 11: Clerk - Authentifizierung

### Was ist Clerk?

- Modernes Authentication-as-a-Service
- Out-of-the-box UI-Komponenten (Sign-In, Sign-Up, User Profile)
- Multi-Provider OAuth (Google, GitHub, etc.)
- Session Management mit JWTs
- Webhooks für User-Events

**Integration in Next.js:**
```tsx
// layout.tsx
<ClerkProvider>
  <html>
    <body>{children}</body>
  </html>
</ClerkProvider>
```

<!-- Screenshot: Clerk Sign-In Page -->
![Clerk Sign-In](screenshots/sign-in.png)

---

## Folie 12: Supabase - Backend-as-a-Service

### Was ist Supabase?

- Open-Source Alternative zu Firebase
- PostgreSQL Datenbank mit REST/GraphQL API
- Row-Level Security (RLS) für Datenisolation
- Storage für Dateien (PDF-Bucket)
- Realtime Subscriptions (nicht genutzt)

**Vorteile:**
- Vollwertige SQL-Datenbank (kein NoSQL)
- RLS ermöglicht sichere Client-Queries
- Generous Free Tier

---

## Folie 13: Clerk + Supabase Integration

### Der Authentifizierungsfluss

```
┌──────────┐     1. Login      ┌──────────┐
│  Browser │──────────────────►│  Clerk   │
└────┬─────┘                   └────┬─────┘
     │                              │
     │◄─────── 2. JWT Token ────────┘
     │
     │      3. Request + JWT
     ▼
┌──────────┐                   ┌──────────┐
│ Next.js  │──────────────────►│ Supabase │
│  Server  │   4. JWT + Query  │    DB    │
└──────────┘                   └────┬─────┘
                                    │
                    5. RLS prüft: user_id = jwt.sub
                                    │
                                    ▼
                            Nur eigene Daten!
```

---

## Folie 14: Code-Beispiel - Supabase Client

### Server-seitige Integration

```typescript
// src/lib/supabase.ts
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function createServerSupabaseClient() {
  const { getToken } = await auth();
  const supabaseToken = await getToken({ template: "supabase" });

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseToken}`,
        },
      },
    }
  );
}
```

**Der Clerk JWT enthält die `user_id`, die Supabase für RLS verwendet.**

---

## Folie 15: Lessons Learned - Clerk + Supabase

### Erfahrungswerte

| Thema | Erkenntnis |
|-------|------------|
| **JWT Template** | Clerk muss mit "supabase" Template konfiguriert werden |
| **RLS ist mächtig** | Einmal konfiguriert, automatische Datenisolation |
| **Server Components** | Supabase-Calls nur serverseitig für Sicherheit |
| **Testing** | Clerk bietet Test-Mode mit `+clerk_test` E-Mails |
| **Type Safety** | Supabase generiert TypeScript-Types aus Schema |

### Herausforderungen

- Initiale Konfiguration erfordert Verständnis beider Systeme
- JWT-Token muss bei jedem Server-Request neu geholt werden
- Debug schwieriger bei RLS-Fehlern (Silent Failures)

---

## Folie 16: PDF-Generierung

### @react-pdf/renderer

**Warum diese Library?**
- React-basierte PDF-Erstellung
- Volle Kontrolle über Layout
- Server-side rendering möglich

<!-- Screenshot: Generated PDF -->
![PDF Example](screenshots/pdf-example.png)

**Struktur:**
```tsx
<Document>
  <Page size="A4">
    <View style={styles.header}>...</View>
    <View style={styles.positions}>...</View>
    <View style={styles.footer}>...</View>
  </Page>
</Document>
```

---

## Folie 17: Aktueller Entwicklungsstand (ca. 0,5-1 Min)

### Implementierungsstatus

```
┌─────────────────────────────────────────────────────────────────┐
│                    VOLLSTÄNDIG UMGESETZT                         │
├─────────────────────────────────────────────────────────────────┤
│  ✓ Authentifizierung (Clerk)                                    │
│  ✓ Dashboard mit Statistiken                                    │
│  ✓ Kundenverwaltung (CRUD)                                      │
│  ✓ Rechnungserstellung mit AG Grid                              │
│  ✓ Rechnungsliste mit Statusfilter                              │
│  ✓ PDF-Generierung (deutsche Standards)                         │
│  ✓ Einstellungen (Firmendaten, Steuern, Bank)                   │
│  ✓ Row-Level Security                                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         TESTING                                  │
├─────────────────────────────────────────────────────────────────┤
│  ✓ 89 Unit Tests (Vitest)                                       │
│  ✓ 23 E2E Tests (Playwright)                                    │
│  ✓ CI/CD Pipeline (GitHub Actions)                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        OFFEN (Nice-to-Have)                      │
├─────────────────────────────────────────────────────────────────┤
│  ○ E-Mail-Versand                                               │
│  ○ Premium Templates                                            │
│  ○ Tier-System (Clerk Billing)                                  │
└─────────────────────────────────────────────────────────────────┘
```

<!-- Screenshot: Application Overview (Dashboard + Invoice) -->
![Current State](screenshots/current-state.png)

---

## Folie 18: Demo-Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Rechnungserstellung
![Invoice Creation](screenshots/invoice-new.png)

### Kundenverwaltung
![Customers](screenshots/customers.png)

### Einstellungen
![Settings](screenshots/settings.png)

---

## Anhang: Technologie-Referenzen

| Technologie | Version | Verwendung |
|-------------|---------|------------|
| Next.js | 16 | Full-Stack Framework |
| React | 19 | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| Clerk | Latest | Authentication |
| Supabase | Latest | Database + Storage |
| AG Grid | Community | Data Tables |
| @react-pdf/renderer | Latest | PDF Generation |
| Zod | 4.x | Validation |
| Vitest | Latest | Unit Testing |
| Playwright | Latest | E2E Testing |

---

## Sprechnotizen

### Folie 2 (0,5 Min)
- Kurz das Problem wiederholen aus erster Präsentation
- Fokus auf Einfachheit und Geschwindigkeit

### Folien 3-5 (1-2 Min)
- Story aus Nutzersicht erzählen
- Screenshots zeigen wenn verfügbar
- Must-Have vs Nice-to-Have klar trennen

### Folien 6-9 (4-5 Min)
- Architekturdiagramm erklären: Was läuft wo?
- Client vs Server klar trennen
- Datenmodell: Komposition vs Aggregation erklären
- Sicherheit: Mehrere Ebenen
- Deployment als separate Dimension erwähnen

### Folien 10-15 (3-4 Min)
- **Schwerpunkt**: Clerk + Supabase Integration
- Warum diese Kombination?
- Wie funktioniert der Auth-Flow?
- Code-Beispiel zeigen
- Lessons Learned teilen

### Folien 16-17 (0,5-1 Min)
- PDF kurz erwähnen
- Status-Übersicht zeigen
- Was ist fertig, was nicht

