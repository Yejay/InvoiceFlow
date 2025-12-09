-- ===========================================
-- InvoiceFlow Database Schema
-- ===========================================
-- Run this SQL in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- ===========================================
-- 1. Create Custom Types
-- ===========================================

CREATE TYPE invoice_status AS ENUM ('draft', 'open', 'paid', 'cancelled');

-- ===========================================
-- 2. Create Tables
-- ===========================================

-- User Settings Table
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  street TEXT,
  postal_code VARCHAR(10),
  city TEXT,
  country TEXT DEFAULT 'Deutschland',
  email TEXT,
  phone VARCHAR(50),
  tax_number VARCHAR(50),
  vat_id VARCHAR(50),
  iban VARCHAR(34),
  bic VARCHAR(11),
  bank_name TEXT,
  default_vat_rate DECIMAL(5,2) DEFAULT 19.00,
  invoice_prefix VARCHAR(10) DEFAULT 'INV-',
  next_invoice_number INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  name TEXT NOT NULL,
  street TEXT,
  postal_code VARCHAR(10),
  city TEXT,
  country TEXT DEFAULT 'Deutschland',
  email TEXT,
  phone VARCHAR(50),
  vat_id VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  invoice_number VARCHAR(50) NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status invoice_status DEFAULT 'draft',
  net_total DECIMAL(12,2) DEFAULT 0,
  vat_total DECIMAL(12,2) DEFAULT 0,
  gross_total DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, invoice_number)
);

-- Invoice Items Table
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit VARCHAR(20) DEFAULT 'Stk.',
  unit_price DECIMAL(12,2) NOT NULL,
  vat_rate DECIMAL(5,2) NOT NULL DEFAULT 19.00,
  net_amount DECIMAL(12,2) NOT NULL,
  vat_amount DECIMAL(12,2) NOT NULL,
  gross_amount DECIMAL(12,2) NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 3. Create Performance Indexes
-- ===========================================

CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- ===========================================
-- 4. Enable Row Level Security
-- ===========================================

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- 5. Create RLS Policies
-- ===========================================

-- user_settings: users can only access their own settings
CREATE POLICY "users_own_settings" ON user_settings FOR ALL
USING (user_id = auth.jwt() ->> 'sub')
WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- customers: users can only access their own customers
CREATE POLICY "users_own_customers" ON customers FOR ALL
USING (user_id = auth.jwt() ->> 'sub')
WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- invoices: users can only access their own invoices
CREATE POLICY "users_own_invoices" ON invoices FOR ALL
USING (user_id = auth.jwt() ->> 'sub')
WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- invoice_items: access through parent invoice
CREATE POLICY "items_via_invoice" ON invoice_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.jwt() ->> 'sub'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.jwt() ->> 'sub'
  )
);

-- ===========================================
-- 6. Create Updated_at Trigger Function
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
