# Clinic Front Desk System

A full‑stack web application for managing patient queues and doctor appointments at a clinic.

## Tech Stack
- Backend: NestJS, TypeORM, MySQL, JWT Auth, Passport
- Frontend: Next.js, React, Tailwind CSS v4, react-icons
- Tooling: ESLint, TypeScript

## Monorepo Layout
```
backend/   # NestJS API (auth, users, doctors, patients, queue, appointments)
frontend/  # Next.js UI (pages for login, queue, appointments, doctors)
```

## Quick Start
### Prerequisites
- Node.js 18+
- MySQL running locally with a database named `clinic_system`

### 1) Backend
```bash
cd backend
npm i
npm run start:dev
```
Backend default: http://localhost:3000

The backend auto-syncs schema (dev) and ensures AUTO_INCREMENT starts at 1 and continues sequentially for all tables at startup.

### 2) Frontend
```bash
cd frontend
npm i
npm run dev -- --port 3001
```
Frontend default: http://localhost:3001

### Test Login
- Email: admin@clinic.com
- Password: admin123

## Core Workflow
1) Login using staff credentials (JWT stored in context and attached as Bearer to API requests)
2) Front Desk Dashboard provides navigation:
   - Queue Management
   - Appointment Management
   - Doctors Directory
3) Staff manage walk‑in queues, book/reschedule/cancel appointments, and browse doctors with search/filters.

## Backend Modules (API)
- Auth (`/auth/login`): JWT login for front desk users
- Users: user CRUD helpers in service
- Patients (`/patients`): create/list patients
- Doctors (`/doctors`): create/list/update/delete; powerful search and filters via query params: `q`, `specialization`, `location`, `availability`
- Queue (`/queue`): create/list, update status or priority, delete; ordered by priority DESC then time; auto‑assigns `queueNumber`
  - PATCH `/queue/:id/status` → waiting | with_doctor | completed
  - PATCH `/queue/:id/priority` → 0 | 1 (urgent)
  - DELETE `/queue/:id` → remove from queue
- Appointments (`/appointments`): create/list/update/delete, filter by date prefix (`?date=YYYY-MM-DD`)
  - PATCH body supports `timeslot` reschedule and `status` changes

## Frontend Pages (UI)
- Login (`/login`)
  - Modern card UI; loading state; stores token on success.
- Home (`/`)
  - Hero with large typography; quick links to Queue, Appointments, Doctors; sticky navbar with brand icon.
- Queue (`/queue`)
  - Filter by status, search by patient/number, status dropdown per entry, urgency dropdown (Normal/Urgent), remove entry (red cross), and modal to add a new patient to queue (creates patient, enqueues with auto queue number).
- Appointments (`/appointments`)
  - Header controls: status filter, date popup (native date input), search bar, and “Schedule New Appointment” button.
  - Table with 12‑hour time format, per‑row status dropdown, reschedule modal, and cancel via red cross icon.
  - “Schedule New Appointment” modal: patient quick‑create, themed doctor select, and time input.
- Doctors (`/doctors`)
  - Search and multi‑filter (specialization, location, availability), availability badges, and schedule preview modal.

## Data Model (simplified)
- User: id, name, email, password (hashed), role
- Patient: id, name, phone, notes
- Doctor: id, name, specialization, gender, location, availability
- QueueEntry: id, patient, queueNumber, status, priority, createdAt
- Appointment: id, patient, doctor, timeslot (ISO string), status

## Notes
- Tailwind v4 (via `@import "tailwindcss";`) with custom global keyframes and a sticky, translucent navbar.
- `apiFetch<T>` wraps fetch and attaches JWT when available.
- AUTO_INCREMENT alignment at boot ensures ids start at 1 (empty tables) and continue sequentially.

## Scripts
Backend:
```bash
npm run start:dev     # dev server with watch
npm run build         # production build
```
Frontend:
```bash
npm run dev -- --port 3001
npm run build
```

## Future Enhancements
- Calendar widget for date selection (e.g., react-day-picker)
- Patient search/autocomplete when scheduling
- Role‑based access (admin vs front desk)

---
Happy demoing! If you need deployment instructions, I can provide Docker or cloud setup next.
