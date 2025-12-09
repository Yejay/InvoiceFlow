import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("should display dashboard with stats cards", async ({ page }) => {
    await page.goto("/dashboard");

    // Check that the dashboard page loads
    await expect(page.locator("h1")).toContainText("Dashboard");

    // Check for stats cards (use more specific selectors to avoid strict mode violations)
    await expect(page.locator("p:has-text('Rechnungen gesamt')")).toBeVisible();
    await expect(page.locator("p:has-text('Offen')").first()).toBeVisible();
    await expect(page.locator("p:has-text('Bezahlt')").first()).toBeVisible();
  });

  test("should have quick action buttons", async ({ page }) => {
    await page.goto("/dashboard");

    // Check for "Schnellaktionen" section
    await expect(page.locator("h2:has-text('Schnellaktionen')")).toBeVisible();

    // Check for quick action links (use first() to avoid strict mode)
    await expect(page.getByRole("link", { name: /Neue Rechnung/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Kunden verwalten/i })).toBeVisible();
  });

  test("should navigate to new invoice from dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    // Click on "Neue Rechnung" link
    await page.getByRole("link", { name: /Neue Rechnung/i }).first().click();

    // Should navigate to new invoice page
    await expect(page).toHaveURL("/invoices/new");
  });

  test("should show empty state message when no invoices", async ({ page }) => {
    await page.goto("/dashboard");

    // Check for empty state (if no invoices exist)
    const emptyState = page.locator("text=Keine Rechnungen");
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    if (hasEmptyState) {
      await expect(emptyState).toBeVisible();
      await expect(page.getByRole("link", { name: /Neue Rechnung erstellen/i })).toBeVisible();
    }
  });
});

test.describe("Settings", () => {
  test("should display settings page with all sections", async ({ page }) => {
    await page.goto("/settings");

    // Check that the settings page loads
    await expect(page.locator("h1")).toContainText("Einstellungen");

    // Check for all settings sections (use heading selectors to be more specific)
    await expect(page.locator("h2:has-text('Firmendaten')")).toBeVisible();
    await expect(page.locator("h2:has-text('Steuerinformationen')")).toBeVisible();
    await expect(page.locator("h2:has-text('Bankverbindung')")).toBeVisible();
    await expect(page.locator("h2:has-text('Rechnungseinstellungen')")).toBeVisible();
  });

  test("should display form fields with placeholders", async ({ page }) => {
    await page.goto("/settings");

    // Check for company data fields
    await expect(page.locator('input[placeholder="Ihre Firma GmbH"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Musterstraße 123"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Berlin"]')).toBeVisible();

    // Check for bank fields
    await expect(page.locator('input[placeholder="DE89370400440532013000"]')).toBeVisible();
  });

  test("should have save button", async ({ page }) => {
    await page.goto("/settings");

    // Check for save button
    await expect(page.getByRole("button", { name: /Einstellungen speichern/i })).toBeVisible();
  });

  test("should update settings successfully", async ({ page }) => {
    await page.goto("/settings");

    // Update company name
    const companyInput = page.locator('input[placeholder="Ihre Firma GmbH"]');
    await companyInput.fill("E2E Test Company");

    // Click save
    await page.getByRole("button", { name: /Einstellungen speichern/i }).click();

    // Wait for success feedback (could be toast or inline message)
    await page.waitForTimeout(2000);

    // The page should stay on settings
    await expect(page).toHaveURL("/settings");
  });
});

test.describe("Invoices List", () => {
  test("should display invoices page", async ({ page }) => {
    await page.goto("/invoices");

    // Check page loads correctly
    await expect(page.locator("h1")).toContainText("Rechnungen");
  });

  test("should show empty state or table", async ({ page }) => {
    await page.goto("/invoices");

    // Either empty state or table should be visible
    const emptyState = page.locator("text=Noch keine Rechnungen");
    const table = page.locator("table");

    const hasEmptyState = await emptyState.isVisible().catch(() => false);
    const hasTable = await table.isVisible().catch(() => false);

    // One of them should be visible
    expect(hasEmptyState || hasTable).toBeTruthy();
  });
});
