# Pico Bello Projekte — BOQ System

Full-stack construction BOQ management platform for Quantity Surveying firms.

---

## Overview

The **Pico Bello Projekte BOQ System** is a web-based Bill of Quantities (BOQ) management platform for construction and project management firms. It provides pricing libraries, BOQ generation with automatic calculations, multi-role team access, and real-time notifications.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (JavaScript), Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcrypt + Google OAuth |
| File Storage | Cloudinary |
| Push Notifications | Web Push API + VAPID |
| Deployment | Render (backend + frontend static) |

---

## Features

### 1. Authentication
- User registration and login with JWT tokens (7-day expiry)
- bcrypt password hashing (12 rounds)
- **Google OAuth sign-in** via `@react-oauth/google` + `google-auth-library`
- Four roles: **Admin**, **QS** (Quantity Surveyor), **Project Manager**, **Client**
- Protected routes enforced server-side (middleware) and client-side (React)
- Token stored in `localStorage`; auto-redirect to `/login` on 401

### 2. Landing Page
- Public marketing page at `/`
- Feature showcase, HOW IT WORKS steps, live BOQ calculation demo, user roles overview
- Links to `/login` and `/register`

### 3. Company Settings (Admin only)
- Full company profile: name, address, contact details, website
- Legal identifiers: CAC number, TIN, VAT
- Multiple bank accounts (add / remove)
- Payment instructions (appears on documents)
- Logo, signature, and stamp upload via **Cloudinary**

### 4. Projects
- Create, read, update, delete projects
- Fields: name, client, location, budget (with currency), start/end date, status, description
- Statuses: `planning`, `active`, `on_hold`, `completed`, `cancelled`
- Role-based editing (Admin, PM, QS can edit; Client is read-only)
- Search and status filter

### 5. Dashboard
- Project statistics: total, active, planning, completed, on-hold, cancelled
- Recent projects list

### 6. QS Pricing Library
- Maintain rate items categorised by trade/category
- Fields: category, item description, unit, source reference, price, currency
- Search and category filter

### 7. Artisan Rate Tracking
- Record labour rates by service, location, and rate unit
- Rate units: per day, per hour, per job, per m², per unit
- Location-based filtering

### 8. Material Price Library
- Log supplier prices with delivery fees
- Fields: supplier, material, unit, price, delivery fee, location
- Total cost = price + delivery fee displayed in table

### 9. Pricing Intelligence
- Search across all 3 pricing sources simultaneously
- Filter by source type (QS / Artisan / Material)
- Returns: **min**, **max**, **average**, and **recommended** (avg × 1.1) prices
- Source breakdown table showing all matching records

### 10. BOQ Builder
- Create multiple BOQ versions per project
- Version statuses: `draft`, `final`, `approved`
- Line items with automatic calculations (see formula below)
- Grand total auto-updated on every item change

### 11. Notifications
- **In-app**: bell icon with unread badge in header; dropdown list; poll every 30 seconds
- Mark individual or all as read; delete notifications
- **Push notifications**: Web Push API with VAPID keys; service worker (`/sw.js`)
- Permission prompt on first login

---

## BOQ Calculation Formula

```
finalUnitPrice = baseCost × (1 + overheadPercent / 100) × (1 + profitPercent / 100)
totalCost      = finalUnitPrice × quantity
```

Calculated automatically via a Mongoose `pre('save')` hook on BoqItem. `BoqVersion.totalCost` is recalculated after every item create, update, or delete.

---

## User Roles & Permissions

| Action | Admin | QS | Project Manager | Client |
|---|:---:|:---:|:---:|:---:|
| View dashboard | ✓ | ✓ | ✓ | ✓ |
| View projects | ✓ | ✓ | ✓ | ✓ |
| Create / edit projects | ✓ | ✓ | ✓ | — |
| Delete projects | ✓ | — | — | — |
| View company settings | ✓ | ✓ | ✓ | ✓ |
| Edit company settings | ✓ | — | — | — |
| Upload brand assets | ✓ | — | — | — |
| View pricing libraries | ✓ | ✓ | ✓ | — |
| Create / edit pricing | ✓ | ✓ | — | — |
| Delete pricing entries | ✓ | ✓ | — | — |
| View pricing intelligence | ✓ | ✓ | ✓ | — |
| Create / manage BOQ | ✓ | ✓ | ✓ | — |
| Approve BOQ version | ✓ | — | — | — |

---

## API Routes

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, returns JWT |
| POST | `/google` | Public | Google OAuth sign-in (creates account if new) |
| GET | `/me` | Any | Get current user |

### Company — `/api/company`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Any | Get company settings |
| PUT | `/` | Admin | Save / update company settings |
| POST | `/upload/:type` | Admin | Upload logo/signature/stamp |

### Projects — `/api/projects`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Any | List projects (`?status=` filter) |
| GET | `/:id` | Any | Get single project |
| POST | `/` | Admin/PM/QS | Create project |
| PUT | `/:id` | Admin/PM/QS | Update project |
| DELETE | `/:id` | Admin | Delete project |

### Dashboard — `/api/dashboard`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/summary` | Any | Stats + 5 recent projects |

### QS Prices — `/api/qs-prices`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Any | List (`?category=` filter) |
| POST | `/` | Admin/QS | Create entry |
| PUT | `/:id` | Admin/QS | Update entry |
| DELETE | `/:id` | Admin/QS | Delete entry |

### Artisan Prices — `/api/artisan-prices`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Any | List (`?location=` filter) |
| POST | `/` | Admin/QS | Create entry |
| PUT | `/:id` | Admin/QS | Update entry |
| DELETE | `/:id` | Admin/QS | Delete entry |

### Material Prices — `/api/material-prices`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Any | List (`?material=` / `?supplier=` filter) |
| POST | `/` | Admin/QS | Create entry |
| PUT | `/:id` | Admin/QS | Update entry |
| DELETE | `/:id` | Admin/QS | Delete entry |

### Pricing Intelligence — `/api/pricing`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/intelligence?q=&source=` | Any | Search all sources, return stats |

### BOQ — `/api/boq`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Any | List BOQ versions |
| GET | `/:id` | Any | Get version with all items |
| POST | `/` | Admin/QS/PM | Create version |
| PUT | `/:id` | Admin/QS/PM | Update version |
| DELETE | `/:id` | Admin | Delete version + all items |
| POST | `/:id/items` | Admin/QS/PM | Add item to version |
| PUT | `/:id/items/:itemId` | Admin/QS/PM | Update item |
| DELETE | `/:id/items/:itemId` | Admin/QS/PM | Delete item |

### Notifications — `/api/notifications`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Any | Get user's notifications |
| PUT | `/read-all` | Any | Mark all as read |
| PUT | `/:id/read` | Any | Mark one as read |
| DELETE | `/:id` | Any | Delete notification |
| POST | `/push-subscription` | Any | Save Web Push subscription |

### Push VAPID — `/api/push`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/vapid-public-key` | Public | Get server's VAPID public key |

---

## MongoDB Schema

### `users`
```
_id          ObjectId
name         String (required)
email        String (required, unique, lowercase)
password     String (hashed, optional — null for Google-only users)
role         Enum: admin | qs | project_manager | client
isActive     Boolean (default: true)
createdAt    Date
```

### `companysettings`
```
companyName         String (required)
logo                String (Cloudinary URL)
address             String
phone               String
whatsapp            String
email               String
website             String
cacNumber           String
tin                 String
vat                 String
bankDetails         [{ bankName, accountName, accountNumber, sortCode }]
paymentInstructions String
signature           String (Cloudinary URL)
stamp               String (Cloudinary URL)
updatedBy           ObjectId → users
updatedAt           Date
```

### `projects`
```
name        String (required)
client      String (required)
location    String
budget      Number
currency    String (default: NGN)
startDate   Date
endDate     Date
status      Enum: planning | active | on_hold | completed | cancelled
description String
createdBy   ObjectId → users
createdAt / updatedAt  Date
```

### `qsprices`
```
category    String (required)
item        String (required)
unit        String
source      String
price       Number (required)
currency    String (default: NGN)
createdBy   ObjectId → users
createdAt / updatedAt  Date
```

### `artisanprices`
```
service     String (required)
rate        Number (required)
currency    String (default: NGN)
rateUnit    Enum: per day | per hour | per job | per m² | per unit
location    String
createdBy   ObjectId → users
createdAt / updatedAt  Date
```

### `materialprices`
```
supplier    String (required)
material    String (required)
price       Number (required)
currency    String (default: NGN)
unit        String
deliveryFee Number (default: 0)
location    String
createdBy   ObjectId → users
createdAt / updatedAt  Date
```

### `boqversions`
```
projectId   ObjectId → projects (required)
name        String (required)
description String
status      Enum: draft | final | approved (default: draft)
currency    String (default: NGN)
totalCost   Number (auto-updated)
createdBy   ObjectId → users
createdAt / updatedAt  Date
```

### `boqitems`
```
versionId       ObjectId → boqversions (required)
item            String (required)
description     String
unit            String
quantity        Number (default: 1)
baseCost        Number (required)
overheadPercent Number (default: 0)
profitPercent   Number (default: 0)
finalUnitPrice  Number (auto-calculated on save)
totalCost       Number (auto-calculated on save)
createdAt / updatedAt  Date
```

### `notifications`
```
userId    ObjectId → users (required)
title     String (required)
message   String (required)
type      Enum: info | success | warning | error (default: info)
link      String
read      Boolean (default: false)
createdAt Date
```

### `pushsubscriptions`
```
userId    ObjectId → users (required)
endpoint  String (unique)
keys      { p256dh: String, auth: String }
createdAt Date
```

---

## Folder Structure

```
boq-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── cloudinary.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── companyController.js
│   │   │   ├── projectController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── qsPriceController.js
│   │   │   ├── artisanPriceController.js
│   │   │   ├── materialPriceController.js
│   │   │   ├── pricingController.js
│   │   │   ├── boqController.js
│   │   │   └── notificationController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── rbac.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Company.js
│   │   │   ├── Project.js
│   │   │   ├── QsPrice.js
│   │   │   ├── ArtisanPrice.js
│   │   │   ├── MaterialPrice.js
│   │   │   ├── BoqVersion.js
│   │   │   ├── BoqItem.js
│   │   │   ├── Notification.js
│   │   │   └── PushSubscription.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── company.js
│   │   │   ├── projects.js
│   │   │   ├── dashboard.js
│   │   │   ├── qsPrices.js
│   │   │   ├── artisanPrices.js
│   │   │   ├── materialPrices.js
│   │   │   ├── pricing.js
│   │   │   ├── boq.js
│   │   │   └── notifications.js
│   │   └── index.js
│   ├── .env.example
│   ├── package.json
│   └── render.yaml
│
├── frontend/
│   ├── public/
│   │   └── sw.js              Service worker (push notifications)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Header.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── CompanySettings.jsx
│   │   │   ├── QsPricing.jsx
│   │   │   ├── ArtisanPricing.jsx
│   │   │   ├── MaterialPricing.jsx
│   │   │   ├── PricingIntelligence.jsx
│   │   │   └── BoqBuilder.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── notifications.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env.example
│   └── render.yaml
│
├── .gitignore
└── README.md
```

---

## Auth Flow

```
Register / Login / Google OAuth
      │
      ▼
POST /api/auth/register  or  /login  or  /google
      │
      ▼  JWT token returned
Store token in localStorage
      │
      ▼
All API requests: Authorization: Bearer <token>
      │
      ▼  authenticate middleware: verify JWT
Attach user to req.user
      │
      ▼  authorize(...roles) middleware (where applicable)
Check req.user.role is in allowed list
      │
      ▼
Controller handles request
```

On 401 → Axios interceptor clears localStorage and redirects to `/login`.

---

## Notification Flow

### In-App
```
Backend creates Notification document
      │
Frontend polls GET /api/notifications every 30s
      │
NotificationBell updates badge + dropdown
      │
User clicks → mark read / delete
```

### Push
```
Frontend: request Notification permission
      │
Register service worker (/sw.js)
      │
Subscribe to PushManager with VAPID public key
      │
POST /api/notifications/push-subscription (save to DB)
      │
Backend sends push via web-push library
      │
sw.js receives 'push' event → showNotification()
```

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas cluster (free tier is fine)
- Cloudinary account (free tier)
- Google Cloud project with OAuth 2.0 Client ID
- VAPID keys (generate with `npx web-push generate-vapid-keys`)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/pico-bello-boq
JWT_SECRET=<random 64-char string>
CLOUDINARY_CLOUD_NAME=<your cloud name>
CLOUDINARY_API_KEY=<your api key>
CLOUDINARY_API_SECRET=<your api secret>
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=<your google oauth client id>
VAPID_PUBLIC_KEY=<generated public key>
VAPID_PRIVATE_KEY=<generated private key>
VAPID_EMAIL=mailto:you@example.com
```

```bash
npm run dev   # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
# In development, Vite proxies /api → localhost:5000 automatically
npm run dev   # starts on http://localhost:5173
```

For production, copy `.env.example` to `.env` and set:
```
VITE_API_URL=https://your-api.onrender.com/api
VITE_GOOGLE_CLIENT_ID=<your google oauth client id>
```

---

## Deployment (Render)

### Backend (Web Service)
1. Create a **Web Service** on [render.com](https://render.com), root directory `backend`
2. Build command: `npm install`
3. Start command: `npm start`
4. Add all environment variables from `backend/.env.example`

### Frontend (Static Site)
1. Create a **Static Site** on Render, root directory `frontend`
2. Build command: `npm install && npm run build`
3. Publish directory: `dist`
4. Add env vars: `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID`
5. Add a redirect rule: `/* → /index.html` (for SPA routing)

The `render.yaml` files in each subdirectory automate this configuration.

---

## Data Flow

```
Browser (React)
   │  axios request with JWT header
   ▼
Express API (Node.js)
   │  authenticate → verify JWT
   │  authorize   → check role
   ▼
Controller → Mongoose query
   ▼
MongoDB Atlas

File uploads (logo/sig/stamp):
   multer-storage-cloudinary → Cloudinary CDN (bypasses Express response)

Push notifications:
   notificationController → web-push → browser SW → showNotification()
```

---

## Environment Variables Reference

### Backend
| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGODB_URI` | **Yes** | MongoDB Atlas connection string |
| `JWT_SECRET` | **Yes** | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API secret |
| `CLIENT_URL` | No | Frontend origin for CORS |
| `GOOGLE_CLIENT_ID` | **Yes** | Google OAuth client ID |
| `VAPID_PUBLIC_KEY` | **Yes** | VAPID public key for Web Push |
| `VAPID_PRIVATE_KEY` | **Yes** | VAPID private key for Web Push |
| `VAPID_EMAIL` | **Yes** | Contact email for VAPID |

### Frontend
| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | No | API base URL (uses Vite proxy `/api` in dev) |
| `VITE_GOOGLE_CLIENT_ID` | **Yes** | Google OAuth client ID |
