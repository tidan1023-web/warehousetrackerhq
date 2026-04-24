# Warehouse Inventory HQ

Production-ready full-stack system for managing medical hardware inventory and delivery accountability.

---

## Architecture

```
warehousetrackerhq/
├── backend/          # Node.js + Express API (deploy to Render)
└── frontend/         # Next.js 14 App Router (deploy to Vercel)
```

**Stack:**
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, TanStack Query
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (Mongoose)
- **Storage:** AWS S3 (AES-256 encrypted image uploads)
- **Auth:** JWT (access + refresh tokens)
- **Monitoring:** Sentry
- **Deployment:** Render (backend) + Vercel (frontend)

---

## Features

### Authentication & RBAC
- JWT-based login with access (24h) + refresh (7d) tokens
- Two roles: **Admin** and **Staff**
- Admin: full access — create products, verify, dispatch, manage users, view audit trail
- Staff: upload images, log defects, view inventory

### Mandatory Image Verification
- 5 required image slots per product: **Front, Back, Left, Right, Serial Number**
- Upload via camera (mobile) or drag-and-drop
- Progress bar shows completion status
- Dispatch is **hard-blocked** until all required images are uploaded AND an admin verifies

### Product Lifecycle
```
PENDING → IMAGES_UPLOADED → VERIFIED → DISPATCHED
              ↕
           DEFECTIVE
```

### Defect Logging
- Staff or admin can log defects with severity (low/medium/high/**critical**)
- Attach up to 6 images per defect
- Admin acknowledges and resolves defects
- High/critical defects auto-mark product as `DEFECTIVE`

### Inventory Management
- SKU-based tracking (unique, validated format)
- Dynamic specifications editor (custom key-value pairs)
- Category filtering, search, pagination
- Employee assignment per product

### eBay Integration
- OAuth 2.0 authorization flow
- Push verified/dispatched products directly to eBay via Inventory + Offer API
- Product images, title, description, and specs sync automatically
- Listing status tracked per product

### Audit Trail (Immutable)
- Every action is logged: who, what, when, from where
- Records are **append-only** — schema-level hooks block updates/deletes
- Filterable by action, entity type, date range
- CSV export for compliance

### Dashboard
- Real-time stats: pending/verified/dispatched/defective counts
- "Ready to Ship" and "Needs Attention" lists
- Recent activity feed
- Critical alerts banner

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)
- AWS S3 bucket with IAM credentials
- (Optional) eBay Developer account

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, AWS_*, and optionally EBAY_* and SENTRY_DSN
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

Visit `http://localhost:3000`. The backend bootstrap admin is created from `.env` on first run.

---

## Deployment

### Backend → Render

1. Push this repo to GitHub
2. Create a new **Web Service** on Render, pointing to `/backend`
3. Configure all environment variables from `backend/.env.example`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`

The `render.yaml` in `/backend` automates service configuration.

### Frontend → Vercel

1. Import the repo on Vercel, set **Root Directory** to `frontend`
2. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-api.onrender.com`
3. Deploy

---

## Security Measures

| Measure | Implementation |
|---|---|
| HTTPS | Enforced via Render/Vercel + HSTS header |
| Secure headers | `helmet` (CSP, HSTS, X-Frame-Options, etc.) |
| Input validation | `express-validator` on all endpoints |
| File upload validation | MIME type check + magic-byte verification + 10MB limit |
| Image storage | AWS S3 with AES-256 server-side encryption |
| JWT | Short-lived access tokens (24h) + refresh tokens |
| RBAC | Middleware-enforced role checks on every protected route |
| Rate limiting | Auth: 10 req/15min · API: 120 req/min · Upload: 30 req/min |
| Audit logs | Immutable — schema hooks block any update/delete |
| CORS | Allowlist of known frontend origins only |
| Error monitoring | Sentry integration |
| Secrets | Environment variables only — never committed |

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Any | Current user |
| POST | `/api/auth/users` | Admin | Create user |
| GET | `/api/products` | Any | List products |
| POST | `/api/products` | Admin | Create product |
| GET | `/api/products/:id` | Any | Get product detail |
| PATCH | `/api/products/:id` | Admin | Update product |
| POST | `/api/products/:id/images` | Any | Upload image |
| POST | `/api/products/:id/verify` | Admin | Verify product |
| POST | `/api/products/:id/dispatch` | Admin | Dispatch product |
| GET | `/api/defects` | Any | List defects |
| POST | `/api/defects` | Any | Log defect |
| GET | `/api/audit` | Admin | Audit trail |
| GET | `/api/dashboard/stats` | Any | Dashboard data |
| GET | `/api/ebay/auth-url` | Admin | Get eBay OAuth URL |
| POST | `/api/ebay/products/:id/sync` | Admin | Sync to eBay |

---

## HIPAA-Conscious Design

- No sensitive patient data is stored anywhere in the system
- Products track hardware/equipment only — no PHI
- All data encrypted in transit (TLS) and at rest (S3 AES-256, MongoDB encryption)
- Audit trail maintained for compliance reviews
- Access controls enforced via RBAC
- Environment variable management for all secrets

---

## Database Backup Strategy

For MongoDB Atlas (recommended):
1. Enable **Continuous Cloud Backup** in Atlas cluster settings
2. Configure hourly snapshots with 7-day retention
3. Test restore procedures quarterly
4. Point-in-time recovery available to any second within retention window

For self-hosted MongoDB:
```bash
# Daily backup script
mongodump --uri="$MONGODB_URI" --out="/backups/$(date +%Y-%m-%d)"
# Store in S3 with versioning enabled
aws s3 sync /backups/ s3://your-backup-bucket/mongodb/
```
