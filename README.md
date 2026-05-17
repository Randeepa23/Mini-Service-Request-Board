# ServiceBoard — Mini Service Request Board

A full-stack web application where homeowners can post service requests (e.g. plumbing, electrical, painting, joinery) and tradespeople can browse, manage, and update them.

Built for the **GlobalTNA Full-Stack Developer Intern** technical assessment.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB (local or Atlas) |
| **ODM** | Mongoose 9 |
| **Auth** | JWT (jsonwebtoken + bcryptjs) |
| **Testing** | Jest + Supertest |

---

## Project Structure

```
globaltna-assessment/
├── backend/                  # Express REST API
│   ├── models/
│   │   ├── JobRequest.js     # JobRequest Mongoose model
│   │   └── User.js           # User model (for JWT auth)
│   ├── routes/
│   │   ├── jobs.js           # CRUD routes for /api/jobs
│   │   └── auth.js           # Register + Login routes
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── __tests__/
│   │   └── jobs.test.js      # API endpoint unit tests
│   ├── app.js                # Express app factory (for testing)
│   ├── server.js             # Entry point — connects DB + starts server
│   ├── seed.js               # Seeds 10 sample jobs
│   └── .env                  # Environment variables
├── frontend/                 # Next.js frontend
│   ├── app/
│   │   ├── page.tsx          # Home — job list with filters
│   │   ├── layout.tsx        # Root layout with metadata
│   │   ├── globals.css       # Global styles + design tokens
│   │   ├── jobs/
│   │   │   ├── new/page.tsx  # New job creation form
│   │   │   └── [id]/page.tsx # Job detail + status update + delete
│   │   └── auth/page.tsx     # Login / Register page
│   └── .env.local            # API URL config
├── .gitignore
├── package.json              # Root convenience scripts
└── README.md                 # ← You are here
```

---

## Prerequisites

- **Node.js** ≥ 18
- **MongoDB** — either a [local install](https://www.mongodb.com/docs/manual/installation/) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

---

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd globaltna-assessment

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
MONGO_URI=mongodb://localhost:27017/globaltna
PORT=5000
JWT_SECRET=supersecretkey123
```

> Replace `MONGO_URI` with your Atlas connection string if using Atlas.

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Seed the Database (Optional)

```bash
cd backend
npm run seed
```

This inserts 10 sample jobs across all categories and statuses.

### 4. Start the App

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/jobs` | List all jobs (supports `?category`, `?status`, `?search`) | No |
| `GET` | `/api/jobs/:id` | Get a single job by ID | No |
| `POST` | `/api/jobs` | Create a new job | ✅ JWT |
| `PATCH` | `/api/jobs/:id` | Update job status only | No |
| `DELETE` | `/api/jobs/:id` | Delete a job | ✅ JWT |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and receive JWT | No |

### Filter Examples

```
GET /api/jobs?category=Plumbing
GET /api/jobs?status=Open
GET /api/jobs?search=kitchen
GET /api/jobs?category=Electrical&status=Open
```

---

## Data Model — JobRequest

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | String | ✅ | |
| `description` | String | ✅ | |
| `category` | String | | Enum: Plumbing, Electrical, Painting, Joinery |
| `location` | String | | e.g. Glasgow |
| `contactName` | String | | |
| `contactEmail` | String | | Validated email format |
| `status` | String | | Enum: Open, In Progress, Closed (default: Open) |
| `createdAt` | Date | | Auto-set on creation |

---

## Running Tests

```bash
cd backend
npm test
```

Tests use **Jest** + **Supertest** and cover:
- `GET /api/jobs` — list, filter by category/status/search
- `GET /api/jobs/:id` — fetch single job + 404 handling
- `PATCH /api/jobs/:id` — update status
- `DELETE /api/jobs/:id` — auth requirement
- Unknown routes → 404

---

## Frontend Pages

1. **Home** (`/`) — Lists all service requests as cards. Filter by category, status, or keyword search. Click a card to view details.
2. **New Request** (`/jobs/new`) — Form to create a new service request with client-side validation. Requires login.
3. **Job Detail** (`/jobs/:id`) — Full details, status dropdown to update, and delete button. Delete requires login.
4. **Auth** (`/auth`) — Login and register. JWT token stored in localStorage.

---

## Bonus Features Implemented

- ✅ **Keyword search** across title and description
- ✅ **JWT-based auth** for POST and DELETE operations
- ✅ **Unit tests** on API endpoints (Jest + Supertest)
- ✅ **Seed script** with 10 sample jobs
- ✅ **Status filter** (in addition to category filter)
- ✅ **Premium dark UI** with animations and micro-interactions

---

## Design Decisions

- **App Router (Next.js)** — Using the latest Next.js App Router with `use()` for unwrapping params.
- **Express separate from Next.js** — Backend is a standalone Express server, frontend calls it via `NEXT_PUBLIC_API_URL`.
- **app.js factory pattern** — Separates Express app creation from `server.js` so tests can import the app without starting the server or connecting to MongoDB.
- **Input validation** — Both client-side (form validation in React) and server-side (Mongoose schema validators + express error handling).
- **Error handling** — Global Express error handler + 404 catch-all + Mongoose validation error handling.

---

## Author

Built for the GlobalTNA Full-Stack Developer Intern Assessment.
