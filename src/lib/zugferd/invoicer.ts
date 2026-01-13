import { Client } from "@rechnungs-api/client";

// Singleton Client-Instanz
let client: Client | null = null;

/**
 * Gibt den Rechnungs API Client zurück (Singleton)
 */
export function getRechnungsApiClient(): Client {
  if (!client) {
    const apiKey = process.env.RECHNUNGS_API_KEY;
    if (!apiKey) {
      throw new Error(
        "RECHNUNGS_API_KEY ist nicht konfiguriert. Bitte in .env.local hinzufügen."
      );
    }
    client = new Client({ apiKey });
  }
  return client;
}
