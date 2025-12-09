-- ===========================================
-- InvoiceFlow Storage Setup
-- ===========================================
-- Run this SQL in your Supabase SQL Editor AFTER running schema.sql
-- Or create the bucket manually in the Supabase Dashboard

-- ===========================================
-- 1. Create Storage Bucket for PDFs
-- ===========================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'invoices',
  'invoices',
  false,
  5242880, -- 5MB limit
  ARRAY['application/pdf']
);

-- ===========================================
-- 2. Storage Policies
-- ===========================================

-- Allow authenticated users to upload PDFs to their own folder
CREATE POLICY "Users can upload their own invoices"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'invoices' AND
  (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);

-- Allow authenticated users to read their own PDFs
CREATE POLICY "Users can read their own invoices"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'invoices' AND
  (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);

-- Allow authenticated users to delete their own PDFs
CREATE POLICY "Users can delete their own invoices"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'invoices' AND
  (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);
