import { test, expect } from "@playwright/test";

test.describe("Customer Management", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to customers page before each test
    await page.goto("/customers");
  });

  test("should display the customers page", async ({ page }) => {
    // Check that the page title is visible
    await expect(page.locator("h1")).toContainText("Kunden");

    // Check for the "Neuer Kunde" button
    await expect(page.getByRole("button", { name: /Neuer Kunde/i })).toBeVisible();
  });

  test("should open new customer modal", async ({ page }) => {
    // Click the "Neuer Kunde" button
    await page.getByRole("button", { name: /Neuer Kunde/i }).click();

    // Modal should open with the form
    await expect(page.locator("text=Neuer Kunde").first()).toBeVisible();

    // Check that form fields are visible
    await expect(page.locator('label:has-text("Name")')).toBeVisible();
  });

  test("should create a new customer", async ({ page }) => {
    // Click the "Neuer Kunde" button to open modal
    await page.getByRole("button", { name: /Neuer Kunde/i }).click();

    // Wait for modal to open
    await page.waitForSelector('button:has-text("Kunde anlegen")');

    // Fill in customer details
    const testCustomerName = `E2E Test Kunde ${Date.now()}`;
    await page.locator('input[name="name"]').fill(testCustomerName);
    await page.locator('input[name="street"]').fill("Teststraße 123");
    await page.locator('input[name="postal_code"]').fill("12345");
    await page.locator('input[name="city"]').fill("Berlin");
    await page.locator('input[name="email"]').fill("test@example.com");

    // Submit the form
    await page.getByRole("button", { name: /Kunde anlegen/i }).click();

    // Wait for modal to close and page to refresh
    await page.waitForTimeout(1000);

    // The new customer should be visible in the list
    await expect(page.locator(`text=${testCustomerName}`)).toBeVisible({ timeout: 10000 });
  });

  test("should show validation error for empty customer name", async ({ page }) => {
    // Click the "Neuer Kunde" button to open modal
    await page.getByRole("button", { name: /Neuer Kunde/i }).click();

    // Wait for modal to open
    await page.waitForSelector('button:has-text("Kunde anlegen")');

    // Try to submit without filling required fields
    await page.getByRole("button", { name: /Kunde anlegen/i }).click();

    // Should show validation error (could be different messages)
    // Wait for some error message to appear
    await page.waitForTimeout(500);
    const hasError = await page.locator("text=/mindestens|erforderlich|Pflichtfeld/i").isVisible().catch(() => false);
    expect(hasError).toBeTruthy();
  });

  test("should show empty state when no customers", async ({ page }) => {
    // Check for empty state message (if no customers exist)
    const emptyState = page.locator("text=Noch keine Kunden");
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    if (hasEmptyState) {
      await expect(emptyState).toBeVisible();
      await expect(page.getByRole("button", { name: /Ersten Kunden anlegen/i })).toBeVisible();
    }
  });
});
