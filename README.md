# Visitor Pass System – My Assignment Project

**GitHub:** https://github.com/DAKSH-AHUJA/Assignment-9.git

A simple visitor management app. Lets you register visitors, create appointments, generate QR passes, and scan check‑in/out.

## What it does

- Login (admin, security, employee, visitor)
- Add visitors with photo
- Employees create & approve appointments
- Generate QR pass + PDF badge
- Scan QR to check in/out
- Dashboard with counts
- Search visitors, export CSV
- Email/SMS demo (prints to terminal if not setup)

## Tech used

- React + Vite (frontend)
- Node.js + Express (backend)
- MongoDB, JWT, Multer, QRCode, PDFKit

## Run locally

1. Install MongoDB and start it.
2. `cd server` → copy `.env.example` to `.env`
3. Back to root → `npm run install-all`
4. `npm run seed` (adds demo data)
5. `npm run dev`

Open http://localhost:5173

## Demo login (password for all: `123456`)

- admin@demo.com
- security@demo.com
- employee@demo.com
- visitor@demo.com

## Main API routes

- `/api/auth/login`, `/api/auth/register`
- `/api/visitors`, `/api/appointments`, `/api/passes`
- `/api/checklogs/scan`, `/api/dashboard`, `/api/dashboard/export/logs.csv`

## Screenshots

Add your own in `screenshots` folder: login, dashboard, visitor form, appointment approval, QR passes, scanner.

## Notes

- Email/SMS are demo – prints to terminal if no email config.
- Bonus: multi‑org field, audit logs, CSV export, Docker/Nginx files.

That's it – simple and works.