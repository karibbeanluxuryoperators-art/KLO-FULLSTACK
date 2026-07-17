<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/8eea5213-a379-4d79-848a-6a13e802cf38

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Partner Flow

The Partner Flow is the end-to-end journey a supplier goes through after
signing in with Google. It covers upload, bundling, and approval
notifications.

### 1. Who is a partner?

A user becomes a KLO Partner in one of two ways:

- **Hard-coded in `src/firebase.ts`** — add their email to the `ROLE_MAP`
  with value `"PARTNER"`. After Google sign-in, the KLO client will surface
  the partner UI (dashboard + bundles).
- **Promoted by an admin** — any signed-in user (including new applicants)
  can be granted the role manually by editing `ROLE_MAP` (no UI yet).

`ADMIN` users always see both the admin console and the partner dashboard.

### 2. How upload works

1. Partner signs in with Google. The KLO client looks up their supplier
   record via `GET /api/suppliers/lookup?uid=...&email=...`.
2. If no record exists, the **List with KLO** button takes them to the
   `SupplierPortal` multi-step application (`/partner`). The portal posts
   to `POST /api/suppliers/register` with the Firebase `uid` so the
   supplier row is bound to their account.
3. After registration, partners land on the `SupplierDashboard` at
   `/supplier/dashboard`. They can add assets for **any of the 5
   pillars** (VILLA, YACHT, AVIATION, GROUND, STAFF) — the "Add Asset"
   modal now pre-selects the type based on the supplier's pillar
   instead of being hard-coded to LODGING.
4. All assets start in `PENDING` until an admin approves the supplier
   (`PATCH /api/suppliers/:id/status` → `APPROVED`), which flips the
   supplier's assets to `ACTIVE` in one shot.

### 3. How bundling works

The **Bundles** tab in the partner dashboard lets an APPROVED partner
combine services from any number of approved suppliers into one
bookable package.

- `GET /api/bundles/available-assets` — returns `ACTIVE` assets from
  suppliers with status `APPROVED`, each annotated with the parent
  supplier's `business_name`.
- `POST /api/bundles` — creates a bundle. The server validates every
  `asset_id` exists **and** its parent supplier is `APPROVED`; rejects
  with `400` otherwise. `total_price` is computed server-side from
  `assets.price_per_unit * qty`; status is forced to `PENDING` (clients
  cannot set `APPROVED`).
- `GET /api/bundles?supplier_id=X` — lists the partner's bundles,
  joined with their `bundle_items` and asset names.
- `PATCH /api/bundles/:id/status` — admin approves or rejects. On
  `APPROVED`, the server stamps `approved_at` / `approved_by` and fires
  the approval notification.

### 4. Approval notifications

Whenever an admin approves a supplier or a bundle, the server calls a
module-level helper `notifyApproval(supplierId, kind, payload)` that:

1. Looks up the supplier's `telegram_chat_id`, `email`, and
   `business_name`.
2. If a `TELEGRAM_BOT_TOKEN` is set and the supplier has a chat id,
   sends an HTML message:
   `✅ <b>KLO Approval</b>\nYour <kind> was approved.\n<b><name></b>`
3. If a `SENDGRID_API_KEY` is set and the supplier has an email,
   sends via the SendGrid v3 API (`POST /v3/mail/send` with Bearer
   auth). Subject: `KLO — Approved`. Plain-text body includes the
   supplier name and the kind.
4. If neither provider is configured, logs
   `[email-stub] would send to <email>: <subject> <body>` and still
   inserts an audit row with `sent_email = false`.
5. Inserts an `approval_notifications` row capturing both flags for
   audit / debugging.

The helper is wrapped in `try/catch` so a Telegram or SendGrid outage
**never breaks** the approval mutation.

### 5. Required environment variables

- `TELEGRAM_BOT_TOKEN` — already documented; enables Telegram
  notifications (existing booking flow uses it too).
- `SENDGRID_API_KEY` — **new**; enables email notifications. When
  absent, email is stubbed to console.

### 6. Database migration

A new file, `supabase_migration_partner_flow.sql`, adds the
`firebase_uid` / `telegram_chat_id` columns to `suppliers` and creates
the new `bundles`, `bundle_items`, and `approval_notifications` tables
plus their indexes. All statements are idempotent (`IF NOT EXISTS`).

Run it once via the Supabase SQL editor or
`supabase db execute -f supabase_migration_partner_flow.sql`. The
original `supabase_schema.sql` is left untouched.

### 7. Routing summary

| Path                       | Renders                                                |
|----------------------------|--------------------------------------------------------|
| `/supplier/dashboard`      | `SupplierDashboard` (Overview tab)                     |
| `/supplier/dashboard/bundles` | `SupplierDashboard` (Bundles tab)                  |
| `/partner/bundles`         | alias for the same bundles view                        |
| `/partner`                 | `SupplierPortal` (multi-step application)              |
| `/admin`                   | admin console (ADMIN only)                             |
