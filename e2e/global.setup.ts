import { clerkSetup, setupClerkTestingToken } from "@clerk/testing/playwright";
import { test as setup, expect } from "@playwright/test";
import path from "path";

// Configure setup tests to run serially
setup.describe.configure({ mode: "serial" });

// First setup: Initialize Clerk
setup("global setup", async ({}) => {
  await clerkSetup();
});

// Path to store authenticated state
const authFile = path.join(__dirname, "../playwright/.clerk/user.json");

// Second setup: Authenticate and save state
setup("authenticate and save state", async ({ page }) => {
  // Set up Clerk testing token for bypassing bot detection
  await setupClerkTestingToken({ page });

  // Navigate to the sign-in page
  await page.goto("/sign-in");

  // Wait for Clerk to be ready - look for the email input field
  await page.waitForSelector('input[name="identifier"]', { timeout: 10000 });

  // Fill in the email/username field
  await page.fill('input[name="identifier"]', process.env.E2E_CLERK_USER_USERNAME!);

  // Check if password field is already visible (single-step form)
  const passwordField = page.locator('input[name="password"]');
  if (await passwordField.isVisible()) {
    // Single-step form: fill password and submit
    await page.fill('input[name="password"]', process.env.E2E_CLERK_USER_PASSWORD!);
    // Click the Continue button (not the Google one) - use role locator
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  } else {
    // Two-step form: click continue first, then fill password
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.waitForSelector('input[name="password"]', { timeout: 10000 });
    await page.fill('input[name="password"]', process.env.E2E_CLERK_USER_PASSWORD!);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }

  // Handle 2FA/email verification if needed (new device verification)
  // Wait for either dashboard or factor-two page
  await page.waitForURL(/\/(dashboard|sign-in\/factor-two)/, { timeout: 15000 });

  // Check if we're on the factor-two page (email verification for new device)
  if (page.url().includes("factor-two")) {
    // Enter the test verification code (424242 is Clerk's test code for development)
    const verificationCode = process.env.TEST_VERIFICATION_CODE || "424242";

    // Wait for the verification input to be ready
    const otpInput = page.getByRole("textbox", { name: /verification code/i });
    await otpInput.waitFor({ state: "visible", timeout: 10000 });

    // Focus the input and try multiple methods to enter the code
    await otpInput.click();

    // Method 1: Try pressSequentially (for OTP-style inputs)
    await page.keyboard.press("Control+A"); // Select all
    await page.keyboard.press("Backspace"); // Clear
    await otpInput.pressSequentially(verificationCode, { delay: 100 });

    // If that didn't work, try direct evaluation
    const inputValue = await otpInput.inputValue();
    if (!inputValue || inputValue.length < 6) {
      // Method 2: Set value directly via JavaScript
      await otpInput.evaluate((el: HTMLInputElement, code: string) => {
        el.value = code;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }, verificationCode);
    }

    // Small delay to ensure the code is processed
    await page.waitForTimeout(500);

    // Check if we're already on the dashboard (auto-submit may have happened)
    if (!page.url().includes("dashboard")) {
      // Click continue after entering the code
      const continueButton = page.getByRole("button", { name: "Continue", exact: true });
      if (await continueButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await continueButton.click();
      }
    }

    // Wait for dashboard redirect
    await page.waitForURL("**/dashboard**", { timeout: 15000 });
  } else {
    // No 2FA needed - wait for redirect after sign-in
    await page.waitForURL("**/dashboard**", { timeout: 15000 });
  }

  // Verify we're on the dashboard
  await expect(page.locator("h1")).toContainText("Dashboard", { timeout: 10000 });

  // Save the authenticated state for reuse in tests
  await page.context().storageState({ path: authFile });
});
