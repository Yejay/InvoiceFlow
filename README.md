# InvoiceFlow

Eine moderne, deutschsprachige Rechnungsverwaltung für Freelancer mit ZUGFeRD E-Rechnung und E-Mail-Versand.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Features

- **Kundenverwaltung** - Stammdaten verwalten mit schnellem Zugriff
- **Rechnungserstellung** - Professionelle Rechnungen in unter 2 Minuten
- **ZUGFeRD E-Rechnung** - PDF/A-3 mit eingebettetem XML (XRechnung-konform)
- **E-Mail-Versand** - Rechnungen direkt an Kunden senden
- **Dashboard** - Übersicht über Umsätze und offene Rechnungen
- **Automatische Nummerierung** - Fortlaufende Rechnungsnummern
- **MwSt-Berechnung** - Automatische Steuerberechnung pro Position
- **Statusverwaltung** - Entwurf, Offen, Bezahlt, Storniert

---

## Tech Stack

| Kategorie | Technologie |
|-----------|-------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Sprache | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Auth | [Clerk](https://clerk.com/) |
| Datenbank | [Supabase](https://supabase.com/) (PostgreSQL) |
| E-Mail | [Resend](https://resend.com/) |
| E-Rechnung | [Rechnungs API](https://www.rechnungs-api.de/) |
| Tabellen | [AG Grid](https://www.ag-grid.com/) |
| Formulare | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Testing | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) |

---

## Schnellstart

### Voraussetzungen

- Node.js 18+
- npm oder yarn
- Accounts bei: [Clerk](https://clerk.com/), [Supabase](https://supabase.com/), [Resend](https://resend.com/), [Rechnungs API](https://www.rechnungs-api.de/)

### Installation

```bash
# Repository klonen
git clone https://github.com/Yejay/InvoiceFlow.git
cd InvoiceFlow

# Dependencies installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env.local
# .env.local mit eigenen Keys befüllen

# Datenbank einrichten
# 1. Supabase SQL Editor öffnen
# 2. supabase/schema.sql ausführen
# 3. supabase/storage.sql ausführen

# Development Server starten
npm run dev
```

Die App ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

### Umgebungsvariablen

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Resend (E-Mail)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev

# Rechnungs API (ZUGFeRD)
RECHNUNGS_API_KEY=test_...
```

---

## Verfügbare Scripts

```bash
npm run dev           # Development Server (Turbopack)
npm run build         # Production Build
npm run start         # Production Server

npm run lint          # ESLint

npm run test          # Unit Tests (Watch Mode)
npm run test:run      # Unit Tests (Single Run)
npm run test:coverage # Test Coverage

npm run test:e2e      # E2E Tests
npm run test:e2e:ui   # E2E Tests mit UI
```

---

## Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth Routes (sign-in, sign-up)
│   ├── (protected)/       # Geschützte Routes
│   │   ├── dashboard/
│   │   ├── customers/
│   │   ├── invoices/
│   │   └── settings/
│   └── page.tsx           # Landing Page
│
├── components/            # React Components
│   ├── customers/
│   ├── invoices/
│   ├── layout/
│   └── settings/
│
├── lib/                   # Utilities & Services
│   ├── email/            # Resend Integration
│   ├── pdf/              # PDF Templates
│   ├── validations/      # Zod Schemas
│   ├── zugferd/          # ZUGFeRD/XRechnung
│   ├── supabase.ts
│   └── utils.ts
│
└── types/                # TypeScript Types
```

---

## Datenbank

### Schema einrichten

```bash
# In Supabase SQL Editor ausführen:
# 1. supabase/schema.sql - Tabellen & RLS Policies
# 2. supabase/storage.sql - Storage Bucket für PDFs
```

### Tabellen

- `user_settings` - Firmendaten des Nutzers
- `customers` - Kundenstammdaten
- `invoices` - Rechnungen
- `invoice_items` - Rechnungspositionen

### Row Level Security

Alle Tabellen sind durch RLS geschützt. Nutzer können nur ihre eigenen Daten sehen und bearbeiten.

---

## ZUGFeRD E-Rechnung

InvoiceFlow generiert vollständig konforme ZUGFeRD-Rechnungen:

- **Format**: PDF/A-3b (ISO 19005-3)
- **Profil**: XRechnung 3.0
- **Standard**: EN 16931 (EU-Norm)

### Funktionsweise

1. Rechnung wird mit allen Pflichtfeldern erstellt
2. Daten werden zum XRechnung-Format gemappt
3. Rechnungs API generiert PDF mit eingebettetem XML
4. PDF kann heruntergeladen oder per E-Mail versendet werden

### Validierung

Generierte PDFs können mit dem [Mustang Validator](https://www.mustangproject.org/) geprüft werden.

---

## E-Mail-Versand

Rechnungen können direkt an Kunden versendet werden:

- **Service**: Resend
- **Anhang**: ZUGFeRD-konforme PDF
- **Template**: Professionelle deutsche E-Mail

### Entwicklung

Für die Entwicklung wird `onboarding@resend.dev` als Absender verwendet. Für Produktion muss eine eigene Domain bei Resend verifiziert werden.

---

## Testing

### Unit Tests

```bash
npm run test          # Watch Mode
npm run test:run      # Single Run
npm run test:coverage # Mit Coverage
```

Getestet werden:
- Berechnungsfunktionen
- Formatierungsfunktionen
- Validierungsschemas

### E2E Tests

```bash
npm run test:e2e      # Headless
npm run test:e2e:ui   # Mit UI
```

E2E Tests benötigen konfigurierte Testbenutzer-Credentials in `.env.local`.

---

## Dokumentation

Ausführliche technische Dokumentation findet sich in:

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Systemarchitektur, UML-Diagramme, Datenflüsse
- **[CLAUDE.md](CLAUDE.md)** - Entwickler-Referenz für Claude Code

---

## Screenshots

| Dashboard | Rechnungsübersicht |
|-----------|-------------------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Invoices](docs/screenshots/invoices.png) |

| Rechnungsdetail | Kundenverwaltung |
|-----------------|------------------|
| ![Detail](docs/screenshots/invoice-detail.png) | ![Customers](docs/screenshots/customers.png) |

---

## Roadmap

- [ ] Recurring Invoices (Wiederkehrende Rechnungen)
- [ ] Multi-Currency Support
- [ ] PDF-Templates anpassbar
- [ ] Reporting & Statistiken
- [ ] Mahnwesen

---

## Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

---

## Autor

Entwickelt als Universitätsprojekt.

---

## Danksagung

- [Next.js](https://nextjs.org/) - React Framework
- [Clerk](https://clerk.com/) - Authentication
- [Supabase](https://supabase.com/) - Backend as a Service
- [Resend](https://resend.com/) - Email API
- [Rechnungs API](https://www.rechnungs-api.de/) - ZUGFeRD Generation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [AG Grid](https://www.ag-grid.com/) - Data Grid
