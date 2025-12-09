// Database types for Supabase
// These types match the schema defined in supabase/schema.sql

export type InvoiceStatus = "draft" | "open" | "paid" | "cancelled";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          street: string | null;
          postal_code: string | null;
          city: string | null;
          country: string;
          email: string | null;
          phone: string | null;
          tax_number: string | null;
          vat_id: string | null;
          iban: string | null;
          bic: string | null;
          bank_name: string | null;
          default_vat_rate: number;
          invoice_prefix: string;
          next_invoice_number: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          street?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string;
          email?: string | null;
          phone?: string | null;
          tax_number?: string | null;
          vat_id?: string | null;
          iban?: string | null;
          bic?: string | null;
          bank_name?: string | null;
          default_vat_rate?: number;
          invoice_prefix?: string;
          next_invoice_number?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          street?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string;
          email?: string | null;
          phone?: string | null;
          tax_number?: string | null;
          vat_id?: string | null;
          iban?: string | null;
          bic?: string | null;
          bank_name?: string | null;
          default_vat_rate?: number;
          invoice_prefix?: string;
          next_invoice_number?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          street: string | null;
          postal_code: string | null;
          city: string | null;
          country: string;
          email: string | null;
          phone: string | null;
          vat_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          street?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string;
          email?: string | null;
          phone?: string | null;
          vat_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          street?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string;
          email?: string | null;
          phone?: string | null;
          vat_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string;
          invoice_number: string;
          invoice_date: string;
          due_date: string | null;
          status: InvoiceStatus;
          net_total: number;
          vat_total: number;
          gross_total: number;
          notes: string | null;
          pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          customer_id: string;
          invoice_number: string;
          invoice_date: string;
          due_date?: string | null;
          status?: InvoiceStatus;
          net_total: number;
          vat_total: number;
          gross_total: number;
          notes?: string | null;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          customer_id?: string;
          invoice_number?: string;
          invoice_date?: string;
          due_date?: string | null;
          status?: InvoiceStatus;
          net_total?: number;
          vat_total?: number;
          gross_total?: number;
          notes?: string | null;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit: string;
          unit_price: number;
          vat_rate: number;
          net_amount: number;
          vat_amount: number;
          gross_amount: number;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit?: string;
          unit_price: number;
          vat_rate?: number;
          net_amount: number;
          vat_amount: number;
          gross_amount: number;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          description?: string;
          quantity?: number;
          unit?: string;
          unit_price?: number;
          vat_rate?: number;
          net_amount?: number;
          vat_amount?: number;
          gross_amount?: number;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      invoice_status: InvoiceStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenience type aliases
export type UserSettings = Database["public"]["Tables"]["user_settings"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceItem = Database["public"]["Tables"]["invoice_items"]["Row"];

// Invoice with customer data (for displaying in lists)
export interface InvoiceWithCustomer extends Invoice {
  customer: Customer;
}

// Invoice with all related data
export interface InvoiceWithDetails extends Invoice {
  customer: Customer;
  items: InvoiceItem[];
}
