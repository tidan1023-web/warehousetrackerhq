# Pico Bello Projekte — BOQ System

**Phase 1** — Full-stack foundation: authentication, company settings, project management, and dashboard.

---

## Overview

The **Pico Bello Projekte BOQ System** is a web-based Bill of Quantities (BOQ) management platform for construction and project management firms. Phase 1 establishes the core infrastructure: multi-role authentication, company identity management, project tracking, and an analytics dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (JavaScript), Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcrypt |
| File Storage | Cloudinary |
| Deployment | Render (backend + frontend static) |

---

## Features

### 1. Authentication
- User registration and login with JWT tokens (7-day expiry)
- bcrypt password hashing (12 rounds)
- Four roles: **Admin**, **QS** (Quantity Surveyor), **Project Manager**, **Client**
- Protected routes enforced server-side (middleware) and client-side (React)
- Token stored in `localStorage`; auto-redirect to `/login` on 401

### 2. Company Settings (Admin only)
- Full company profile: name, address, contact details, website
- Legal identifiers: CAC number, TIN, VAT
- Multiple bank accounts (add / remove)
- Payment instructions (appears on invoices in Phase 2)
- Logo, signature, and stamp upload via **Cloudinary**

### 3. Projects
- Create, read, update, delete projects
- Fields: name, client, location, budget (with currency), start/end date, status, description
- Statuses: `planning`, `active`, `on_hold`, `completed`, `cancelled`
- Role-based editing (Admin, PM, QS can edit; Client is read-only)
- Search and status filter

### 4. Dashboard
- Project statistics: total, active, planning, completed, on-hold, cancelled
- Invoice summary placeholder (Phase 2)
- Pending approvals placeholder (Phase 2)
- Recent projects list

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

---

## API Routes

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/me` | Any | Get current user |

### Company — `/api/company`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Any | Get company settings |
| PUT | `/` | Admin | Save / update company settings |
| POST | `/upload/:type` | Admin | Upload logo/signature/stamp (`type` = `logo`, `signature`, `stamp`) |

### Projects — `/api/projects`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Any | List all projects (optional `?status=` filter) |
| GET | `/:id` | Any | Get single project |
| POST | `/` | Admin/PM/QS | Create project |
| PUT | `/:id` | Admin/PM/QS | Update project |
| DELETE | `/:id` | Admin | Delete project |

### Dashboard — `/api/dashboard`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/summary` | Any | Stats + 5 recent projects |

---

## MongoDB Schema

### `users`
```
_id          ObjectId
name         String (required)
email        String (required, unique, lowercase)
password     String (hashed, bcrypt 12 rounds)
role         Enum: admin | qs | project_manager | client
isActive     Boolean (default: true)
createdAt    Date
```

### `companysettings`
```
_id                 ObjectId
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
bankDetails         Array of { bankName, accountName, accountNumber, sortCode }
paymentInstructions String
signature           String (Cloudinary URL)
stamp               String (Cloudinary URL)
updatedBy           ObjectId → users
updatedAt           Date
```

### `projects`
```
_id         ObjectId
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
createdAt   Date
updatedAt   Date
```

---

## Folder Structure

```
warehousetrackerhq/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js        MongoDB connection
│   │   │   └── cloudinary.js      Cloudinary + multer setup
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── companyController.js
│   │   │   ├── projectController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/
│   │   │   ├── auth.js            JWT verify middleware
│   │   │   └── rbac.js            Role-based access middleware
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Company.js
│   │   │   └── Project.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── company.js
│   │   │   ├── projects.js
│   │   │   └── dashboard.js
│   │   └── index.js               Express server entry
│   ├── .env.example
│   ├── package.json
│   └── render.yaml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Header.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    Auth state + login/logout/register
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── CompanySettings.jsx
│   │   ├── services/
│   │   │   └── api.js             Axios instance with interceptors
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
Register / Login
      │
      ▼
POST /api/auth/register or /login
      │
      ▼  JWT token returned
Store token in localStorage
      │
      ▼
All API requests include: Authorization: Bearer <token>
      │
      ▼  authenticate middleware runs
Find user by decoded ID, attach to req.user
      │
      ▼  authorize(...roles) middleware (where applicable)
Check req.user.role is in allowed list
      │
      ▼
Controller handles request
```

On 401 → Axios interceptor clears localStorage and redirects to `/login`.

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas cluster (free tier is fine)
- Cloudinary account (free tier)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pico-bello-boq
JWT_SECRET=<random 64-char string>
CLOUDINARY_CLOUD_NAME=<from cloudinary.com/console>
CLOUDINARY_API_KEY=<from cloudinary.com/console>
CLOUDINARY_API_SECRET=<from cloudinary.com/console>
CLIENT_URL=http://localhost:5173
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
4. Add env var: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Add a redirect rule: `/* → /index.html` (for SPA routing)

The `render.yaml` files in each subdirectory automate this configuration.

---

## Data Flow

```
Browser (React)
   │  axios request with JWT header
   ▼
Express API (Node.js)
   │  authenticate middleware → verify JWT
   │  authorize middleware  → check role
   ▼
Controller → Mongoose query
   ▼
MongoDB Atlas
   │  (file uploads bypass Express via multer-storage-cloudinary)
   ▼
Cloudinary CDN  ←──  logo / signature / stamp
```

---

## Limitations (Phase 1)

| Area | Status |
|---|---|
| BOQ line items | Phase 2 |
| Invoice generation (PDF) | Phase 2 |
| Approval workflow | Phase 2 |
| Email notifications | Phase 2 |
| Client portal (separate view) | Phase 2 |
| Audit/activity log | Phase 2 |
| Password reset | Phase 2 |
| Multi-company / tenant | Not planned |
| Refresh tokens | Single token (7d expiry) |
| Rate limiting | Not implemented in Phase 1 |

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
| `CLIENT_URL` | No | Frontend origin for CORS (default: `http://localhost:5173`) |

### Frontend
| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | No | API base URL (uses Vite proxy `/api` in dev) |
