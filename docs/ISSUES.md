# InvoiceFlow - Issue Tracker & Roadmap

## Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature or request |
| `documentation` | Documentation improvements |
| `good first issue` | Good for newcomers |
| `priority: high` | Critical for MVP |
| `priority: medium` | Should have |
| `priority: low` | Nice to have |
| `ui/ux` | User interface improvements |
| `backend` | Server-side changes |
| `testing` | Test-related issues |

---

## Open Issues

### Bugs

#### [BUG-001] AG Grid - Empty description validation not shown inline
- **Priority:** Medium
- **Labels:** `bug`, `ui/ux`
- **Description:** When submitting an invoice with empty description fields, the validation error is shown as a toast but not inline in the grid.
- **Expected:** Red border or inline error message on the cell
- **Steps to reproduce:**
  1. Create new invoice
  2. Leave description empty
  3. Submit form
- **Acceptance criteria:**
  - [ ] Empty cells show visual indication
  - [ ] Error message displayed near the grid

---

### Enhancements

#### [ENH-001] Invoice editing functionality
- **Priority:** High
- **Labels:** `enhancement`, `priority: high`
- **Description:** Allow editing of draft invoices before they are marked as open.
- **Requirements:**
  - Edit button on invoice detail page (only for drafts)
  - Pre-populate form with existing data
  - Update invoice items (add/remove/modify)
- **Acceptance criteria:**
  - [ ] Edit button visible for draft invoices only
  - [ ] Form pre-filled with existing data
  - [ ] Items grid shows existing items
  - [ ] Changes saved correctly

---

#### [ENH-002] Invoice duplication / copy feature
- **Priority:** Medium
- **Labels:** `enhancement`, `priority: medium`
- **Description:** Allow users to duplicate an existing invoice as a starting point for a new one.
- **Use case:** Monthly recurring invoices to same customer
- **Requirements:**
  - "Kopieren" button on invoice detail
  - Creates new draft with:
    - Same customer
    - Same items
    - Today's date
    - New invoice number
- **Acceptance criteria:**
  - [ ] Copy button available on all invoices
  - [ ] New draft created with copied data
  - [ ] Invoice number is new (next in sequence)
  - [ ] Date reset to today

---

#### [ENH-003] Customer quick-add from invoice form
- **Priority:** Medium
- **Labels:** `enhancement`, `ui/ux`
- **Description:** Allow adding a new customer directly from the invoice creation form without navigating away.
- **Requirements:**
  - "+" button next to customer dropdown
  - Opens modal with customer form
  - After save, selects new customer in dropdown
- **Acceptance criteria:**
  - [ ] Add customer button in invoice form
  - [ ] Modal opens with customer form
  - [ ] Dropdown updates with new customer
  - [ ] New customer is auto-selected

---

#### [ENH-004] Dashboard charts and analytics
- **Priority:** Low
- **Labels:** `enhancement`, `priority: low`, `ui/ux`
- **Description:** Add visual charts to dashboard for better insights.
- **Suggested charts:**
  - Monthly revenue bar chart (last 6 months)
  - Invoice status pie chart
  - Top customers by revenue
- **Acceptance criteria:**
  - [ ] Chart library integrated (recharts or similar)
  - [ ] Revenue trend chart
  - [ ] Responsive on mobile

---

#### [ENH-005] Email sending integration
- **Priority:** Medium
- **Labels:** `enhancement`, `backend`
- **Description:** Send invoices directly via email instead of manual download and attachment.
- **Requirements:**
  - Email provider integration (Resend, SendGrid, or Postmark)
  - "Per E-Mail senden" button on invoice detail
  - Email template with PDF attachment
  - Delivery status tracking
- **Acceptance criteria:**
  - [ ] Email button on invoice detail
  - [ ] PDF attached automatically
  - [ ] Professional email template
  - [ ] Sent status shown in UI

---

#### [ENH-006] Recurring invoices
- **Priority:** Low
- **Labels:** `enhancement`, `priority: low`
- **Description:** Automatically generate invoices on a schedule for recurring services.
- **Requirements:**
  - New "Recurring Invoice" entity
  - Schedule options: weekly, monthly, quarterly
  - Auto-generation via cron job or Supabase Edge Function
- **Acceptance criteria:**
  - [ ] Create recurring invoice template
  - [ ] Define schedule
  - [ ] Invoices created automatically
  - [ ] Email notification when created

---

#### [ENH-007] Multi-currency support
- **Priority:** Low
- **Labels:** `enhancement`, `priority: low`
- **Description:** Support invoicing in currencies other than EUR.
- **Requirements:**
  - Currency selection per invoice
  - Exchange rate handling
  - PDF shows selected currency
- **Acceptance criteria:**
  - [ ] Currency dropdown in settings (defaults)
  - [ ] Currency selection per invoice
  - [ ] Correct symbol in PDF

---

#### [ENH-008] Dark mode
- **Priority:** Low
- **Labels:** `enhancement`, `ui/ux`, `good first issue`
- **Description:** Implement dark mode theme option.
- **Requirements:**
  - Toggle in settings or header
  - Respect system preference
  - Persist choice in localStorage
- **Acceptance criteria:**
  - [ ] Dark theme CSS variables
  - [ ] Toggle component
  - [ ] Persisted preference
  - [ ] AG Grid dark theme

---

#### [ENH-009] Export functionality
- **Priority:** Medium
- **Labels:** `enhancement`, `priority: medium`
- **Description:** Export invoices to CSV/Excel for accounting software.
- **Requirements:**
  - Export button on invoices list
  - Date range filter
  - CSV format with German number formatting
- **Acceptance criteria:**
  - [ ] Export button visible
  - [ ] Date range selection
  - [ ] Valid CSV output
  - [ ] Correct column headers

---

#### [ENH-010] Search and advanced filtering
- **Priority:** Medium
- **Labels:** `enhancement`, `ui/ux`
- **Description:** Add search functionality and advanced filters to invoice list.
- **Requirements:**
  - Text search (invoice number, customer name)
  - Date range filter
  - Amount range filter
- **Acceptance criteria:**
  - [ ] Search input field
  - [ ] Real-time filtering
  - [ ] Clear filters button

---

### Documentation

#### [DOC-001] API documentation
- **Priority:** Low
- **Labels:** `documentation`
- **Description:** Document the internal API structure for future development.
- **Requirements:**
  - Server Actions documentation
  - Type definitions
  - Database schema ERD

---

#### [DOC-002] Setup video tutorial
- **Priority:** Low
- **Labels:** `documentation`
- **Description:** Create a video tutorial showing initial setup process.

---

### Testing

#### [TEST-001] Unit tests for utility functions
- **Priority:** Medium
- **Labels:** `testing`, `good first issue`
- **Description:** Add unit tests for calculation and formatting utilities.
- **Files to test:**
  - `src/lib/utils.ts`
  - `src/lib/validations/*.ts`
- **Acceptance criteria:**
  - [ ] Jest or Vitest setup
  - [ ] Tests for `calculateItemAmounts`
  - [ ] Tests for `calculateInvoiceTotals`
  - [ ] Tests for `formatCurrency`

---

#### [TEST-002] E2E tests with Playwright
- **Priority:** Medium
- **Labels:** `testing`
- **Description:** End-to-end tests for critical user flows.
- **Flows to test:**
  - User registration and setup
  - Create customer
  - Create invoice
  - Download PDF
- **Acceptance criteria:**
  - [ ] Playwright configured
  - [ ] CI integration
  - [ ] Tests pass reliably

---

## Completed Issues

_Move issues here when resolved_

---

## Backlog (Future Considerations)

These are ideas for future development beyond the MVP:

1. **Mobile app** - React Native version for on-the-go invoicing
2. **Client portal** - Allow clients to view and pay invoices online
3. **Payment integration** - Stripe/PayPal for direct payments
4. **Expense tracking** - Track business expenses
5. **Time tracking** - Built-in time tracker for hourly billing
6. **Multi-user/team** - Support for multiple users per organization
7. **Tax report generation** - UStVA (Umsatzsteuer-Voranmeldung) export
8. **Reminder automation** - Automatic payment reminders
9. **Logo upload** - Custom logo on invoices
10. **Custom invoice templates** - Multiple PDF designs

---

## Sprint Planning

### Sprint 1 (Current - MVP Polish)
- [x] Core invoice creation
- [x] PDF generation
- [x] Customer management
- [x] Status workflow
- [ ] ENH-001: Invoice editing
- [ ] BUG-001: Grid validation

### Sprint 2 (Planned)
- [ ] ENH-002: Invoice duplication
- [ ] ENH-003: Quick-add customer
- [ ] TEST-001: Unit tests
- [ ] ENH-009: Export to CSV

### Sprint 3 (Planned)
- [ ] ENH-005: Email sending
- [ ] ENH-010: Search & filters
- [ ] TEST-002: E2E tests

---

## How to Contribute

1. Pick an issue from the list above
2. Comment on the issue to claim it
3. Create a feature branch: `git checkout -b feature/ENH-001-invoice-editing`
4. Implement the changes
5. Write tests if applicable
6. Create a Pull Request
7. Request review

### Commit Message Format

```
[ENH-001] Add invoice editing functionality

- Add edit button to invoice detail page
- Create EditInvoiceForm component
- Update Server Action for invoice updates
```

---

## Issue Template

When creating new issues, use this template:

```markdown
### Description
[Clear description of the issue or feature]

### Steps to Reproduce (for bugs)
1. Step one
2. Step two
3. ...

### Expected Behavior
[What should happen]

### Actual Behavior (for bugs)
[What actually happens]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

### Additional Context
[Screenshots, logs, or other relevant information]
```
