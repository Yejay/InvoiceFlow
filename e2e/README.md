# E2E Tests with Playwright & Clerk

## Prerequisites

1. **Install Playwright browsers** (one-time):
   ```bash
   npx playwright install
   ```

2. **Create a test user** in your Clerk Dashboard:
   - **IMPORTANT**: Use the `+clerk_test` email format (e.g., `test+clerk_test@example.com`)
   - This allows using the test verification code `424242` for email verification
   - Enable username/password authentication in Clerk settings

3. **Set environment variables** in `.env.local`:
   ```env
   # Required for Clerk testing
   CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # Test user credentials (MUST use +clerk_test in email!)
   E2E_CLERK_USER_USERNAME=test+clerk_test@yourdomain.com
   E2E_CLERK_USER_PASSWORD=your-test-password
   TEST_VERIFICATION_CODE=424242
   ```

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with Playwright UI (visual debugging)
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test customers.spec.ts

# Run specific test by name
npx playwright test -g "should create a new customer"
```

## How It Works

1. **Global Setup** (`global.setup.ts`):
   - Calls `clerkSetup()` to initialize Clerk testing mode
   - Signs in using `clerk.signIn()` with test user credentials
   - Saves authenticated state to `playwright/.clerk/user.json`

2. **Test Files**:
   - Load the saved auth state automatically via `playwright.config.ts`
   - All tests run as the authenticated user

## Test Files

| File | Description |
|------|-------------|
| `global.setup.ts` | Clerk authentication setup |
| `customers.spec.ts` | Customer CRUD operations |
| `invoices.spec.ts` | Invoice creation and management |
| `pdf-download.spec.ts` | PDF download, dashboard, and settings |

## CI/CD (GitHub Actions)

Add these secrets to your GitHub repository:
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `E2E_CLERK_USER_USERNAME`
- `E2E_CLERK_USER_PASSWORD`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Troubleshooting

### "Sign in failed" or authentication errors
- Ensure your test user exists in Clerk Dashboard
- Verify username/password authentication is enabled in Clerk
- Check that `E2E_CLERK_USER_USERNAME` and `E2E_CLERK_USER_PASSWORD` are set
- **IMPORTANT**: Make sure the email includes `+clerk_test` (e.g., `test+clerk_test@example.com`)

### Email verification / 2FA issues
- The `+clerk_test` email format allows using `424242` as the verification code
- Without `+clerk_test`, you cannot bypass email verification in tests
- See: https://clerk.com/docs/guides/development/testing/test-emails-and-phones

### Tests timing out
- Increase timeout in `playwright.config.ts`
- Ensure dev server is accessible at `http://localhost:3000`

### Recording new tests
```bash
npx playwright codegen localhost:3000
```

## Directory Structure

```
e2e/
├── global.setup.ts     # Clerk authentication setup
├── customers.spec.ts   # Customer tests
├── invoices.spec.ts    # Invoice tests
├── pdf-download.spec.ts # PDF, dashboard, settings tests
└── README.md           # This file

playwright/
└── .clerk/
    └── user.json       # Saved auth state (gitignored)
```
