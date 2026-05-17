#Pass management system

A simple app I built for my assignment.  
It helps manage visitors, appointments, QR passes, and check-ins.

## What it does

- Login (admin, security, employee, visitor)
- Add visitors with photo
- Employees make appointments and approve them
- Generate QR pass and PDF badge
- Scan QR to check in/out
- Dashboard shows counts
- Search visitors, export CSV
- Email/SMS demo (prints to terminal if not setup)

## Tech I used

- React + Vite (frontend)
- Node.js + Express (backend)
- MongoDB (database)
- JWT for login
- Multer, QRCode, PDFKit

## How to run

1. Install MongoDB and start it.
2. Go to `server` folder, copy `.env.example` to `.env`
3. Back to root folder, run `npm run install-all`
4. Run `npm run seed` (adds dummy data)
5. Run `npm run dev`

Open http://localhost:5173

## Demo login

Password for all: **123456**

Emails:
- admin@demo.com
- security@demo.com
- employee@demo.com
- visitor@demo.com

```

## Setup

1. Install MongoDB and keep it running.
2. Copy the backend environment file:

```bash
cd server
copy .env.example .env
```

3. Install dependencies from the root folder:

```bash
npm run install-all
```

4. Add demo data:

```bash
npm run seed
```

5. Start frontend and backend together:

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## Demo Login

All demo users use this password:

```txt
123456
```

Accounts:

```txt
admin@demo.com
security@demo.com
employee@demo.com
visitor@demo.com
```

## Main API Routes

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/visitors`
- `POST /api/visitors`
- `GET /api/appointments`
- `POST /api/appointments`
- `PATCH /api/appointments/:id/status`
- `GET /api/passes`
- `POST /api/passes`
- `POST /api/checklogs/scan`
- `GET /api/dashboard`
- `GET /api/dashboard/export/logs.csv`

## Screenshots / Demo Video

Run the project and add screenshots in the `screenshots` folder. Suggested screenshots:

- Login page
- Dashboard
- Visitor registration
- Appointment approval
- QR pass page
- QR scanner page

## Notes

Email and SMS are demo integrations. If mail credentials are not added in `.env`, the backend prints notification messages in the terminal. This keeps the project easy to run for assignment checking.

## Bonus Items Covered

- Multi-organization field in models
- Audit style check logs
- CSV export reports
- Docker/Nginx files included for deployment practice
