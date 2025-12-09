-- ===========================================
-- InvoiceFlow Demo Seed Data
-- ===========================================
--
-- IMPORTANT: Before running this script:
-- 1. Sign up/sign in to the application
-- 2. Get your Clerk user_id from the Supabase user_settings table
--    OR from the browser console: await window.Clerk?.user?.id
-- 3. Replace 'YOUR_CLERK_USER_ID' below with your actual user_id
--
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- ===========================================

-- Set your Clerk user_id here (replace with actual ID after signing up)
-- Example: user_2abc123def456...
DO $$
DECLARE
  demo_user_id VARCHAR(255) := 'YOUR_CLERK_USER_ID';  -- <-- REPLACE THIS

  -- Customer IDs (will be generated)
  customer_1_id UUID;
  customer_2_id UUID;
  customer_3_id UUID;
  customer_4_id UUID;
  customer_5_id UUID;

  -- Invoice IDs (will be generated)
  invoice_1_id UUID;
  invoice_2_id UUID;
  invoice_3_id UUID;
  invoice_4_id UUID;
  invoice_5_id UUID;

BEGIN
  -- ===========================================
  -- 1. User Settings (Company Profile)
  -- ===========================================

  INSERT INTO user_settings (
    user_id, company_name, street, postal_code, city, country,
    email, phone, tax_number, vat_id, iban, bic, bank_name,
    default_vat_rate, invoice_prefix, next_invoice_number
  ) VALUES (
    demo_user_id,
    'TechSolutions GmbH',
    'Innovationsstraße 42',
    '10115',
    'Berlin',
    'Deutschland',
    'kontakt@techsolutions.de',
    '+49 30 12345678',
    '27/123/45678',
    'DE123456789',
    'DE89370400440532013000',
    'COBADEFFXXX',
    'Commerzbank AG',
    19.00,
    'TS-',
    6
  ) ON CONFLICT (user_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    next_invoice_number = EXCLUDED.next_invoice_number;

  -- ===========================================
  -- 2. Customers
  -- ===========================================

  -- Customer 1: Müller & Schmidt GmbH
  INSERT INTO customers (user_id, name, street, postal_code, city, country, email, phone, vat_id, notes)
  VALUES (
    demo_user_id,
    'Müller & Schmidt GmbH',
    'Hauptstraße 15',
    '80331',
    'München',
    'Deutschland',
    'buchhaltung@mueller-schmidt.de',
    '+49 89 9876543',
    'DE987654321',
    'Stammkunde seit 2020. Bevorzugt Zahlung per Überweisung innerhalb 14 Tagen.'
  ) RETURNING id INTO customer_1_id;

  -- Customer 2: Weber IT Services
  INSERT INTO customers (user_id, name, street, postal_code, city, country, email, phone, vat_id, notes)
  VALUES (
    demo_user_id,
    'Weber IT Services',
    'Digitalweg 7',
    '60311',
    'Frankfurt am Main',
    'Deutschland',
    'rechnungen@weber-it.de',
    '+49 69 1234567',
    'DE456789012',
    'Monatliche Wartungsverträge. Kontakt: Herr Weber'
  ) RETURNING id INTO customer_2_id;

  -- Customer 3: Innovate AG
  INSERT INTO customers (user_id, name, street, postal_code, city, country, email, phone, vat_id, notes)
  VALUES (
    demo_user_id,
    'Innovate AG',
    'Zukunftsplatz 1',
    '70173',
    'Stuttgart',
    'Deutschland',
    'finanzen@innovate-ag.com',
    '+49 711 5555555',
    'DE111222333',
    'Großkunde. Projekt-basierte Abrechnung.'
  ) RETURNING id INTO customer_3_id;

  -- Customer 4: Startup Hub Berlin
  INSERT INTO customers (user_id, name, street, postal_code, city, country, email, phone, notes)
  VALUES (
    demo_user_id,
    'Startup Hub Berlin UG',
    'Gründerallee 99',
    '10178',
    'Berlin',
    'Deutschland',
    'hello@startuphub.berlin',
    '+49 30 88887777',
    'Kleinunternehmer - keine USt-IdNr. Kurze Zahlungsziele vereinbart.'
  ) RETURNING id INTO customer_4_id;

  -- Customer 5: Austrian Partner
  INSERT INTO customers (user_id, name, street, postal_code, city, country, email, phone, vat_id, notes)
  VALUES (
    demo_user_id,
    'Alpine Software KG',
    'Bergstraße 12',
    '6020',
    'Innsbruck',
    'Österreich',
    'office@alpine-software.at',
    '+43 512 123456',
    'ATU12345678',
    'Internationaler Kunde - Reverse Charge beachten!'
  ) RETURNING id INTO customer_5_id;

  -- ===========================================
  -- 3. Invoices with Items
  -- ===========================================

  -- Invoice 1: Paid invoice from 2 months ago
  INSERT INTO invoices (
    user_id, customer_id, invoice_number, invoice_date, due_date,
    status, net_total, vat_total, gross_total, notes
  ) VALUES (
    demo_user_id, customer_1_id, 'TS-0001',
    CURRENT_DATE - INTERVAL '60 days',
    CURRENT_DATE - INTERVAL '46 days',
    'paid',
    2500.00, 475.00, 2975.00,
    'Vielen Dank für Ihren Auftrag! Zahlbar innerhalb von 14 Tagen.'
  ) RETURNING id INTO invoice_1_id;

  INSERT INTO invoice_items (invoice_id, description, quantity, unit, unit_price, vat_rate, net_amount, vat_amount, gross_amount, position)
  VALUES
    (invoice_1_id, 'Webentwicklung - Responsive Landing Page', 20, 'Std.', 95.00, 19, 1900.00, 361.00, 2261.00, 0),
    (invoice_1_id, 'UI/UX Design - Mockups und Prototyping', 5, 'Std.', 85.00, 19, 425.00, 80.75, 505.75, 1),
    (invoice_1_id, 'Hosting Setup (einmalig)', 1, 'Psch.', 175.00, 19, 175.00, 33.25, 208.25, 2);

  -- Invoice 2: Open invoice from last month
  INSERT INTO invoices (
    user_id, customer_id, invoice_number, invoice_date, due_date,
    status, net_total, vat_total, gross_total, notes
  ) VALUES (
    demo_user_id, customer_2_id, 'TS-0002',
    CURRENT_DATE - INTERVAL '25 days',
    CURRENT_DATE - INTERVAL '11 days',
    'open',
    1200.00, 228.00, 1428.00,
    'Monatliche IT-Wartung November 2024'
  ) RETURNING id INTO invoice_2_id;

  INSERT INTO invoice_items (invoice_id, description, quantity, unit, unit_price, vat_rate, net_amount, vat_amount, gross_amount, position)
  VALUES
    (invoice_2_id, 'IT-Wartungsvertrag - Monatspauschale', 1, 'Psch.', 800.00, 19, 800.00, 152.00, 952.00, 0),
    (invoice_2_id, 'Zusätzlicher Support (Tickets)', 4, 'Std.', 100.00, 19, 400.00, 76.00, 476.00, 1);

  -- Invoice 3: Recent paid invoice
  INSERT INTO invoices (
    user_id, customer_id, invoice_number, invoice_date, due_date,
    status, net_total, vat_total, gross_total, notes
  ) VALUES (
    demo_user_id, customer_3_id, 'TS-0003',
    CURRENT_DATE - INTERVAL '15 days',
    CURRENT_DATE - INTERVAL '1 day',
    'paid',
    8750.00, 1662.50, 10412.50,
    'Projektabschluss Phase 1 - E-Commerce Plattform'
  ) RETURNING id INTO invoice_3_id;

  INSERT INTO invoice_items (invoice_id, description, quantity, unit, unit_price, vat_rate, net_amount, vat_amount, gross_amount, position)
  VALUES
    (invoice_3_id, 'Backend-Entwicklung - API & Datenbank', 40, 'Std.', 110.00, 19, 4400.00, 836.00, 5236.00, 0),
    (invoice_3_id, 'Frontend-Entwicklung - React Components', 30, 'Std.', 105.00, 19, 3150.00, 598.50, 3748.50, 1),
    (invoice_3_id, 'Projektmanagement & Dokumentation', 10, 'Std.', 90.00, 19, 900.00, 171.00, 1071.00, 2),
    (invoice_3_id, 'Code Review & Qualitätssicherung', 3, 'Std.', 100.00, 19, 300.00, 57.00, 357.00, 3);

  -- Invoice 4: Draft invoice (work in progress)
  INSERT INTO invoices (
    user_id, customer_id, invoice_number, invoice_date, due_date,
    status, net_total, vat_total, gross_total, notes
  ) VALUES (
    demo_user_id, customer_4_id, 'TS-0004',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '7 days',
    'draft',
    650.00, 123.50, 773.50,
    'Workshop: Cloud-Migration Grundlagen'
  ) RETURNING id INTO invoice_4_id;

  INSERT INTO invoice_items (invoice_id, description, quantity, unit, unit_price, vat_rate, net_amount, vat_amount, gross_amount, position)
  VALUES
    (invoice_4_id, 'Workshop-Durchführung (halber Tag)', 4, 'Std.', 125.00, 19, 500.00, 95.00, 595.00, 0),
    (invoice_4_id, 'Schulungsunterlagen (digital)', 1, 'Stk.', 150.00, 19, 150.00, 28.50, 178.50, 1);

  -- Invoice 5: Cancelled invoice
  INSERT INTO invoices (
    user_id, customer_id, invoice_number, invoice_date, due_date,
    status, net_total, vat_total, gross_total, notes
  ) VALUES (
    demo_user_id, customer_5_id, 'TS-0005',
    CURRENT_DATE - INTERVAL '45 days',
    CURRENT_DATE - INTERVAL '31 days',
    'cancelled',
    3200.00, 0.00, 3200.00,
    'STORNIERT: Projekt wurde vom Kunden abgebrochen. Reverse Charge (§13b UStG) - Steuerschuldnerschaft des Leistungsempfängers.'
  ) RETURNING id INTO invoice_5_id;

  INSERT INTO invoice_items (invoice_id, description, quantity, unit, unit_price, vat_rate, net_amount, vat_amount, gross_amount, position)
  VALUES
    (invoice_5_id, 'Consulting - Systemanalyse', 16, 'Std.', 120.00, 0, 1920.00, 0.00, 1920.00, 0),
    (invoice_5_id, 'Reisekosten Innsbruck', 1, 'Psch.', 280.00, 0, 280.00, 0.00, 280.00, 1),
    (invoice_5_id, 'Konzepterstellung', 1, 'Psch.', 1000.00, 0, 1000.00, 0.00, 1000.00, 2);

  RAISE NOTICE 'Demo data successfully inserted!';
  RAISE NOTICE 'Created: 5 customers, 5 invoices with items';

END $$;

-- ===========================================
-- Verification Queries (optional)
-- ===========================================

-- Uncomment to verify the data was inserted:
-- SELECT * FROM user_settings;
-- SELECT * FROM customers ORDER BY name;
-- SELECT i.invoice_number, c.name, i.status, i.gross_total
-- FROM invoices i JOIN customers c ON i.customer_id = c.id
-- ORDER BY i.invoice_date DESC;
