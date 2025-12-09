# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start dev server with Turbopack (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
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
│   ├── invoices/
│   ├── invoices/new/
│   ├── customers/
│   ├── settings/
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

### Utility Functions (`src/lib/utils.ts`)

- `formatCurrency(amount)` - Euro format (de-DE)
- `formatDate(dateString)` - German short date (dd.MM.yyyy)
- `calculateInvoiceTotals(items)` - Returns { netTotal, vatTotal, grossTotal }
- `generateInvoiceNumber(prefix, nextNumber)` - Pads to 4 digits
- `getStatusColor(status)` / `getStatusLabel(status)` - Badge styling
- `cn(...inputs)` - Tailwind class merging (clsx + tailwind-merge)

### Type Definitions

Database types in `src/types/database.ts`:
- `UserSettings`, `Customer`, `Invoice`, `InvoiceItem` - Base types
- `InvoiceWithCustomer`, `InvoiceWithDetails` - Composite types for queries

## Conventions

- **Language**: All UI text, labels, and validation messages are in German
- **Path aliases**: Use `@/` for imports from `src/` directory
- **Components**: Server components by default; add `"use client"` only when needed
- **Styling**: Tailwind utility classes; use `cn()` helper for conditional classes
- **Preline**: JavaScript auto-initializes via PrelineScript component on route changes
