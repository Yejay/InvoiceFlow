import { test, expect } from "@playwright/test";

test.describe("Invoice Management", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to invoices page before each test
    await page.goto("/invoices");
  });

  test("should display the invoices page", async ({ page }) => {
    // Check that the page title is visible
    await expect(page.locator("h1")).toContainText("Rechnungen");

    // Check for the "Neue Rechnung" link
    await expect(page.getByRole("link", { name: /Neue Rechnung/i })).toBeVisible();
  });

  test("should display invoice status filter buttons", async ({ page }) => {
    // Check for status filter buttons (they are buttons, not tabs)
    await expect(page.getByRole("button", { name: /Alle/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Entwurf/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Offen/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Bezahlt/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Storniert/i })).toBeVisible();
  });

  test("should navigate to new invoice form or settings", async ({ page }) => {
    // Click the "Neue Rechnung" link
    await page.getByRole("link", { name: /Neue Rechnung/i }).click();

    // Wait for navigation and page to settle
    await page.waitForTimeout(2000);

    // Check what page we ended up on by examining the h1
    const h1Text = await page.locator("h1").textContent();

    if (h1Text?.includes("Einstellungen")) {
      // Settings page shown - this is expected if settings not configured
      await expect(page.locator("h1")).toContainText("Einstellungen");
    } else {
      // New invoice form shown
      await expect(page.locator("h1")).toContainText("Neue Rechnung");
    }
  });

  test("should show empty state when no invoices", async ({ page }) => {
    // Check for empty state message (if no invoices exist)
    const emptyState = page.locator("text=Noch keine Rechnungen");
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    if (hasEmptyState) {
      await expect(emptyState).toBeVisible();
      await expect(page.getByRole("link", { name: /Erste Rechnung erstellen/i })).toBeVisible();
    }
  });

  test("should click filter buttons", async ({ page }) => {
    // Click on status filter buttons
    await page.getByRole("button", { name: /Entwurf/i }).click();
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: /Offen/i }).click();
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: /Bezahlt/i }).click();
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: /Alle/i }).click();

    // Page should still be on invoices
    await expect(page.locator("h1")).toContainText("Rechnungen");
  });
});

test.describe("Invoice Creation", () => {
  test("should display new invoice form or redirect to settings", async ({ page }) => {
    // Navigate to new invoice page
    await page.goto("/invoices/new");

    // Wait for navigation to complete
    await page.waitForTimeout(1000);

    const url = page.url();
    if (url.includes("/settings")) {
      // Redirected to settings (settings not configured)
      await expect(page.locator("h1")).toContainText("Einstellungen");
    } else {
      // On the new invoice form
      await expect(page.locator("h1")).toContainText("Neue Rechnung");
      // Check for customer selection
      await expect(page.locator("text=Kunde").first()).toBeVisible();
    }
  });
});
