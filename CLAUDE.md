# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev           # Start dev server with Turbopack (http://localhost:3000)
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint

# Unit tests (Vitest)
npm run test          # Run Vitest in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run tests with coverage report

# E2E tests (Playwright)
npm run test:e2e      # Run E2E tests (starts dev server automatically)
npm run test:e2e:ui   # Run E2E tests with Playwright UI
npm run test:e2e:debug # Debug E2E tests
```

## Database Setup

```bash
# Run schema in Supabase SQL Editor
supabase/schema.sql    # Tables + RLS policies
supabase/storage.sql   # Storage bucket for PDFs

# Demo data (after signing in to get your Clerk user_id)
supabase/seed.sql      # 5 customers, 5 invoices with items
```

## Project Overview

InvoiceFlow is a German-language invoice management application for freelancers built with Next.js 16 (App Router), Clerk authentication, and Supabase (PostgreSQL).

## Architecture

### Route Structure

```
src/app/
├── (auth)/                    # Public auth routes (Clerk components)
│   ├── sign-in/[[...sign-in]]/
│   └── sign-up/[[...sign-up]]/
├── (protected)/               # Authenticated routes (middleware-protected)
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── actions.ts         # getDashboardStats()
│   ├── customers/
│   │   ├── page.tsx
│   │   └── actions.ts         # CRUD operations
│   ├── invoices/
│   │   ├── page.tsx           # Invoice list with status filter
│   │   ├── actions.ts         # getInvoices(), updateStatus(), delete()
│   │   ├── new/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts     # createInvoice()
│   │   └── [id]/
│   │       ├── page.tsx       # Invoice detail view
│   │       └── pdf/
│   │           └── route.ts   # PDF download API route
│   ├── settings/
│   │   ├── page.tsx
│   │   └── actions.ts         # get/saveUserSettings()
│   └── layout.tsx             # Sidebar layout wrapper
├── page.tsx                   # Landing page
└── layout.tsx                 # Root layout (ClerkProvider + PrelineScript)
```

### Authentication Flow

1. `ClerkProvider` wraps the app in root layout
2. `middleware.ts` protects routes matching `/dashboard`, `/invoices`, `/customers`, `/settings`
3. Server-side Supabase client receives Clerk JWT for Row-Level Security enforcement
4. Use `createServerSupabaseClient()` from `src/lib/supabase.ts` for authenticated database queries

### Database Schema (Supabase)

Four main tables with RLS policies restricting access to user's own data:

- **user_settings**: Company info, tax details, bank info, invoice numbering config
- **customers**: Client contact information
- **invoices**: Invoice headers with status (draft/open/paid/cancelled), totals, PDF URL
- **invoice_items**: Line items with quantity, pricing, VAT calculations

Schema files: `supabase/schema.sql`, `supabase/storage.sql`

### Key Libraries & Patterns

- **Forms**: react-hook-form + @hookform/resolvers + zod
- **Validation**: Zod schemas in `src/lib/validations/` (German error messages)
- **Data Grid**: ag-grid-react for tables
- **PDF**: @react-pdf/renderer for invoice generation
- **UI**: Tailwind CSS + Preline components + @tailwindcss/forms
- **Dates**: date-fns with German locale
- **Testing**: Vitest for unit tests, Playwright for E2E tests

### Utility Functions (`src/lib/utils.ts`)

- `formatCurrency(amount)` - Euro format (de-DE)
- `formatDate(dateString)` - German short date (dd.MM.yyyy)
- `calculateInvoiceTotals(items)` - Returns { net_total, vat_total, gross_total }
- `calculateItemAmounts(qty, price, vat)` - Returns { net_amount, vat_amount, gross_amount }
- `generateInvoiceNumber(prefix, nextNumber)` - Pads to 4 digits
- `getStatusColor(status)` / `getStatusLabel(status)` - Badge styling
- `cn(...inputs)` - Tailwind class merging (clsx + tailwind-merge)

### PDF Generation (`src/lib/pdf/`)

- `InvoiceTemplate.tsx` - @react-pdf/renderer template for German invoices
- `generateInvoicePdf.ts` - Server-side PDF generation function
- PDF download via `/invoices/[id]/pdf` API route

### Type Definitions

Database types in `src/types/database.ts`:
- `UserSettings`, `Customer`, `Invoice`, `InvoiceItem` - Base types
- `InvoiceWithCustomer`, `InvoiceWithDetails` - Composite types for queries

## Conventions

- **Language**: All UI text, labels, and validation messages are in German
- **Path aliases**: Use `@/` for imports from `src/` directory
- **Components**: Server components by default; add `"use client"` only when needed
- **Server Actions**: Co-located `actions.ts` files with `"use server"` directive
- **Styling**: Tailwind utility classes; use `cn()` helper for conditional classes
- **Preline**: JavaScript auto-initializes via PrelineScript component on route changes

## Known Workarounds

- **Zod v4 + @hookform/resolvers**: Use `zodResolver(schema) as any` due to type mismatch
- **Zod errors**: Access via `error.issues[0]` (not `error.errors[0]`)
- **PDF Buffer**: Convert to `new Uint8Array(buffer)` for Response body
