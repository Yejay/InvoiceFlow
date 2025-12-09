import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import PrelineScript from "@/components/PrelineScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "InvoiceFlow - Invoice Management for Freelancers",
  description: "Simple and fast invoice management for freelancers. Create professional invoices in under 2 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body className="antialiased">
          {children}
          <PrelineScript />
        </body>
      </html>
    </ClerkProvider>
  );
}
