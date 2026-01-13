import { Resend } from "resend";

// Resend-Client (lazy initialization)
let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY ist nicht konfiguriert. Bitte in .env.local hinzufügen.");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

// Absender-E-Mail (Test-Domain für Entwicklung)
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
