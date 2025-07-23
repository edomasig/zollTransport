# Nurse Logger App – Vercel Deployment Guide (PostgreSQL Version)

## 🎯 Purpose

Build a full-stack app using **Next.js** (for Vercel deployment) that allows **nurses to log machine checks** (e.g., defibrillator status) via QR code scanning.

---

## 👩‍⚕️ Nurse Workflow

1. Nurse scans a **QR code** on a machine (each QR encodes the `deviceId`).
2. The QR links to a page like `/log/[deviceId]`.
3. On that page, a form displays the following fields:

```json
[
  "Day",
  "Week Day",
  "Time",
  "Defibrillator or Device ID",
  "DAILY CODE READINESS TEST",
  "DAILY BATTERY CHECK",
  "WEEKLY MANUAL DEFIB TEST",
  "WEEKLY PACER TEST",
  "WEEKLY RECORDER",
  "PADS: NOT EXPIRED",
  "Freq / Earliest Expiration Date",
  "Follow up / Corrective Action",
  "Print Name & Title"
]
```

Each form submission logs an entry to a PostgreSQL table tied to the machine ID.

A success message is shown after logging.

---

## 🧩 Tech Stack

- **Frontend:** Next.js (React) + TailwindCSS
- **Backend:** Vercel Serverless API Routes
- **Database:** PostgreSQL (hosted via Supabase, Neon, Railway, or PlanetScale)
- **ORM:** Prisma (recommended for PostgreSQL integration)
- **Auth:** NextAuth.js or Clerk.dev (for nurse login)
- **QR Code:** Dynamic QR generation using qrcode npm package

---

## 🛠 API Endpoints (CRUD)

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| POST   | /api/loggers/create     | Create a new log entry  |
| GET    | /api/loggers/[deviceId] | Fetch logs for a device |
| PUT    | /api/loggers/[logId]    | Update log (admin only) |
| DELETE | /api/loggers/[logId]    | Delete log (admin only) |

---

## 🧾 Admin Dashboard

- Secure admin panel at `/admin`
- View logs with filters:
  - By Device
  - By Date
  - By Nurse
- Export logs to CSV
- Manage device list and regenerate QR codes

---

## 🗄 Recommended Database Schema (PostgreSQL + Prisma)

```prisma
model Device {
  id          String   @id @default(uuid())
  name        String
  location    String
  qrCodeUrl   String
  logs        Log[]
}

model Log {
  id                          String   @id @default(uuid())
  day                         DateTime
  weekDay                     String
  time                        String
  deviceId                    String   @unique
  dailyCodeReadinessTest      Boolean
  dailyBatteryCheck           Boolean
  weeklyManualDefibTest       Boolean
  weeklyPacerTest             Boolean
  weeklyRecorder              Boolean
  padsNotExpired              Boolean
  expirationDate              DateTime
  correctiveAction            String
  nurseName                   String
  createdAt                   DateTime @default(now())
  updatedAt                   DateTime @updatedAt

  device Device @relation(fields: [deviceId], references: [id])
}
```

---

## ✨ Optional Features

- Notification if log not updated daily
- Highlight battery/pad status if critical or overdue
- Offline support for temporary local saving

---

## 🔧 Deployment Notes

### Environment Variables (`.env.local`)

```
DATABASE_URL=postgresql://user:password@host:port/dbname
NEXTAUTH_SECRET=your_secret
```

### Steps

1. Clone the repo
2. Install dependencies: `npm install`
3. Generate Prisma client: `npx prisma generate`
4. Push DB schema: `npx prisma db push`
5. Run locally: `npm run dev`
6. Deploy to Vercel: Push to GitHub and connect via vercel.com

---

## 🧪 Future Add-ons

- Push notifications for missing entries
- Machine analytics dashboard
- Role-based access control (e.g., Nurse, Supervisor, Admin)

---

## 📦 Libraries Used

- next
- prisma
- @prisma/client
- next-auth
- qrcode
- tailwindcss
- pg (PostgreSQL driver)

---

## 📌 Author's Note

Designed to assist clinical teams with easy, consistent, and mobile-friendly equipment logging using PostgreSQL for robust and scalable data management.
