# Billstack

> Managed subscription billing infrastructure for Nigerian SaaS businesses, built natively on Nomba's payment primitives.

---

## What Is Billstack

Every Nigerian SaaS company that wants recurring subscription billing has to build the entire billing layer from scratch. Billstack is the managed layer that sits between Nomba's payment APIs and downstream product teams. One API integration gives you plan management, automated recurring billing, card and DVA subscriptions, and revenue intelligence without writing any billing infrastructure yourself.

---

## What Is Built

### Merchant Onboarding
- Registration with email verification
- Business profile management
- Settlement account setup with bank verification
- Webhook URL configuration and test ping
- Portal branding with logo, colors, and return URL
- Split payment configuration for marketplace revenue routing
- Live and test API key pairs with SHA-256 hashing

### Plan Management
- Flat rate plans with fixed monthly, quarterly, annual, or custom billing intervals
- Tiered pricing plans with dynamic volume tiers and per-unit pricing
- Trial period support
- Plan archiving without breaking existing subscribers
- Public plan listing endpoint for merchant storefronts

### Subscription Engine
- Dual payment architecture — card and DVA as equal first-class payment methods
- Card path: Nomba hosted checkout with card tokenization for future silent renewals
- DVA path: dedicated Nigerian bank account provisioned per customer for bank transfer billing
- Trial handling: zero-amount card capture for tokenization, immediate DVA activation
- Invoice generation on every subscription creation
- Subscription event timeline written on every state change
- Multi-tenant isolation enforced at repository layer — structurally impossible to query another merchant's data

### Database
24 production-grade tables including subscriptions, invoices, invoice line items, transactions, dedicated virtual accounts, pending credits, processed webhook events for idempotency, dunning attempts, outbound webhook deliveries, subscription health scores, portal sessions, and merchant balances.

### Infrastructure
- Self-refreshing Nomba OAuth token cache with 30-minute background refresh
- FOR UPDATE SKIP LOCKED on all worker queries for safe horizontal scaling
- Unique constraint idempotency on processed webhook events
- Calendar-aware billing period calculation handling month-end edge cases
- pgx transactions wrapping all multi-write operations

---

## What Is Left to Build

- **Renewal worker** — charges card subscriptions at period end, checks DVA transfers
- **Dunning intelligence** — decline code categorization, salary window retry scheduling, DVA fallback on hard declines
- **Trial expiry worker** — converts trialing subscriptions to active
- **Outbound webhook delivery worker** — delivers merchant webhooks with exponential backoff retry
- **Analytics layer** — MRR, churn, 30-day revenue forecast, recovery rate
- **Customer self-service portal** — subscription management for end customers
- **Node.js SDK** — published to npm as @billstack/node
- **Test mode** — mock Nomba client with event simulator endpoint
- **OpenAPI specification** — Swagger UI at /docs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Go, Gin |
| Database | PostgreSQL (Neon) |
| Query generation | sqlc |
| Migrations | goose |
| Payment rails | Nomba API |
| Authentication | JWT + hashed API keys |
| Deployment | Railway |
| Frontend | Next.js 14, TypeScript, Tailwind |

---

## API Overview

### Authentication
All API requests require a Bearer token in the Authorization header.

Dashboard routes use JWT: `Authorization: Bearer <jwt>`

Programmatic routes use API keys: `Authorization: Bearer bsk_live_xxx`

### Base URL
```
https://billstack-92i8.onrender.com
```

### Core Endpoints

**Merchants**
```
POST   /v1/auth/register
POST   /v1/auth/login
GET    /v1/merchants/me
POST   /v1/merchants/onboarding
POST   /v1/merchants/settlement-account
POST   /v1/merchants/webhook-url
POST   /v1/merchants/portal-config
POST   /v1/merchants/split-config
```

**Plans**
```
POST   /v1/plans/
GET    /v1/plans/
GET    /v1/plans/:id
PATCH  /v1/plans/:id
POST   /v1/plans/:id/archive
GET    /v1/plans/public/:merchant_id
```

**Subscriptions**
```
POST   /v1/subscriptions/
```

**Webhooks**
```
POST   /v1/webhooks
```

---

## Quick Start

### 1. Register a merchant account
```bash
curl -X POST https://billstack-92i8.onrender.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tunde@studystack.ng",
    "password": "securepassword",
    "business_name": "StudyStack",
    "personal_name": "Tunde Adeyemi"
  }'
```

### 2. Create a plan
```bash
curl -X POST https://billstack-92i8.onrender.com/v1/plans/ \
  -H "Authorization: Bearer bsk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monthly Pro",
    "plan_type": "flat",
    "amount": 250000,
    "currency": "NGN",
    "interval_unit": "monthly",
    "interval_count": 1,
    "trial_days": 0
  }'
```

Note: amounts are in kobo. ₦2,500 = 250000.

### 3. Create a subscription via card
```bash
curl -X POST https://billstack-92i8.onrender.com/v1/subscriptions/ \
  -H "Authorization: Bearer bsk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cus_ade_001",
    "customer_email": "ade@gmail.com",
    "customer_name": "Ade Balogun",
    "plan_id": "plan-uuid-here",
    "payment_method_type": "card"
  }'
```

Response includes a `checkout_url`. Redirect your customer to this URL. Nomba handles card entry and tokenization. Your configured webhook receives `payment_success` when the customer pays.

### 4. Create a subscription via DVA
```bash
curl -X POST https://billstack-92i8.onrender.com/v1/subscriptions/ \
  -H "Authorization: Bearer bsk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cus_ade_002",
    "customer_email": "ade@gmail.com",
    "customer_name": "Ade Balogun",
    "plan_id": "plan-uuid-here",
    "payment_method_type": "dva"
  }'
```

Response includes DVA bank account details. Show these to your customer. When they transfer, your configured webhook receives `payment_success` and the subscription activates automatically.

---

## Webhook Events

Configure your webhook URL in the merchant dashboard. Billstack delivers signed events for every subscription lifecycle change.

| Event | Trigger |
|---|---|
| `subscription.created` | New subscription created |
| `subscription.activated` | First payment confirmed |
| `subscription.renewed` | Renewal payment successful |
| `subscription.payment_failed` | Payment attempt failed |
| `subscription.cancelled` | Subscription cancelled |
| `dva.underpayment` | DVA transfer less than expected |
| `dva.payment_after_cancellation` | Transfer received after cancellation |

All webhook payloads are signed with HMAC-SHA256. Verify using your webhook secret from the dashboard.

---

## Amounts

All amounts in the Billstack API are in **kobo**.

| Naira | Kobo |
|---|---|
| ₦1 | 100 |
| ₦100 | 10000 |
| ₦2,500 | 250000 |
| ₦10,000 | 1000000 |

---

## Local Development

```bash
# clone the repo
git clone https://github.com/luponetn/billstack.git
cd billstack-server

# copy environment variables
cp .env.example .env
# fill in your values

# run database migrations
goose -dir migrations postgres $DATABASE_URL up

# start the server
go run ./cmd/api
```

---

## Environment Variables

```bash
PORT=6060
DATABASE_URL=postgres://...
JWT_SECRET=
JWT_REFRESH_SECRET=
NOMBA_BASE_URL=https://sandbox.api.nomba.com/v1
NOMBA_ACCOUNT_ID=
NOMBA_TEST_CLIENT_ID=
NOMBA_TEST_PRIVATE_KEY=
NOMBA_WEBHOOK_SECRET=
CHECKOUT_CALLBACK_URL=https://yourdomain.com/payment/return
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

## Project Structure

```
billstack-server/
├── cmd/api/              # server entry point
├── internal/
│   ├── auth/             # JWT authentication
│   ├── merchants/        # merchant onboarding and management
│   ├── plans/            # plan management
│   ├── subscriptions/    # subscription lifecycle
│   ├── payments/         # Nomba payment integration
│   ├── nomba/            # Nomba API client with token cache
│   ├── webhooks/         # inbound Nomba webhook handler
│   ├── db/sqlc/          # generated database queries
│   └── response/         # standard response envelope
├── migrations/           # goose SQL migrations
└── utils/                # shared utilities
```

---

Built for the Nomba x DevCareer Hackathon 2026 — Infrastructure Track.