# Elites Tech Solutions LLC: Full-Stack Web Platform

Production full-stack web application built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Prisma ORM**, and **Tailwind / Custom Agency Design System**.

---

## 🚀 Quick Start

### 1. Install & Setup
```bash
# Install dependencies
npm install

# Push Prisma schema to local database
npm run prisma:push

# Generate Prisma Client
npm run prisma:generate
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Start
```bash
npm run build
npm start
```

---

## 🏛️ Application Architecture

```
├── prisma/
│   └── schema.prisma              # Database schema (Registrations, Enquiries, Admin users)
├── public/
│   ├── favicon.svg                # Brand favicon
│   ├── robots.txt                 # SEO crawler directives
│   └── fonts/                     # Self-hosted Anton & Inter woff2 typography
├── src/
│   ├── app/
│   │   ├── page.tsx               # Home: Hero, Network Viz, Regions, Services, Methodology
│   │   ├── services/page.tsx      # 7 Core IT Service areas with Consultation triggers
│   │   ├── training/page.tsx      # Corporate Training, Individual tracks, Featured Cohort
│   │   ├── data-analysis/page.tsx # Data Analysis Programme & Interactive Registration
│   │   ├── tuition/page.tsx       # Tuition & Fees schedule, payment arrangements
│   │   ├── about/page.tsx         # Mission, Operating Model, Regional coverage
│   │   ├── contact/page.tsx       # Regional contacts & Interactive Consultation Enquiry
│   │   ├── privacy/page.tsx       # Privacy Policy (UK GDPR, Ghana DPA 2012, US compliance)
│   │   ├── terms/page.tsx         # Terms of Enrolment
│   │   ├── cookies/page.tsx       # Cookie Policy & Audit
│   │   ├── not-found.tsx          # Custom 404 page
│   │   ├── admin/
│   │   │   ├── page.tsx           # Authenticated Staff Operations Dashboard
│   │   │   ├── login/page.tsx     # Admin Portal Login
│   │   │   └── AdminDashboardClient.tsx # Client dashboard: search, filter, update, CSV export
│   │   ├── api/
│   │   │   ├── register/route.ts  # Programme Registration API (db insert + email dispatch)
│   │   │   ├── enquiry/route.ts   # Consultation Enquiry API (db insert + email dispatch)
│   │   │   └── admin/             # Secured Admin APIs (login, logout, status updates, CSV export)
│   │   ├── globals.css            # Agency tokens & responsive styling
│   │   └── layout.tsx             # Root layout with Header, Footer, Sprite, Cookie Consent
│   ├── components/
│   │   ├── Header.tsx             # Responsive sticky navigation with mobile drawer
│   │   ├── Footer.tsx             # Multi-region contacts, quick links, cookie settings
│   │   ├── Sprite.tsx             # Full SVG icon sprite symbols
│   │   ├── Countdown.tsx          # Cohort countdown timer
│   │   ├── CookieConsent.tsx      # Consent banner & preferences modal dialog
│   │   ├── ScrollEffects.tsx      # Scroll progress bar, back-to-top, reveal observer
│   │   ├── RegistrationForm.tsx   # Interactive Data Analysis registration form
│   │   └── EnquiryForm.tsx        # Interactive Consultation / Contact enquiry form
│   └── lib/
│       ├── config.ts              # Site constants, company info, regional phone/email
│       ├── db.ts                  # Global Prisma Client instance
│       ├── mail.ts                # Server-side transactional email sender (4 templates)
│       └── auth.ts                # JWT session management for staff portal
└── website/                       # Original static front-end assets (preserved for reference)
```

---

## 🔒 Operations & Staff Portal (`/admin`)

The platform includes an internal staff portal to view, manage, and export incoming student registrations and business inquiries.

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Email**: `elitestechsolutionllc@gmail.com`
- **Default Password**: `admin123` *(change in `.env` for production)*

### Features:
1. **Real-time Pipeline**: Filter registrations by status (`pending`, `confirmed`, `enrolled`, `cancelled`).
2. **Instant Search**: Search records by student name, email, country, or reference ID.
3. **One-Click CSV Export**: Download a full, formatted spreadsheet of all registrations for admissions reporting.
4. **Enquiry Management**: Track corporate leads and service inquiries across US, Ghana, and UK.

---

## 📧 Email Notifications

Email sending is handled entirely server-side (no public keys exposed on the client).

The system includes the 4 responsive HTML email templates:
1. **Confirmation to Registrant**: Sent immediately to the applicant with reference ID and onboarding steps.
2. **Notice to Company**: Detailed applicant profile delivered to `elitestechsolutionllc@gmail.com`.
3. **Enquiry Message to Company**: Business inquiry details routed to the admissions inbox.
4. **Enquiry Acknowledgement to Sender**: Professional confirmation sent to the prospective client.

### Configuration (`.env`):
- **Development Mode**: If SMTP credentials are empty, emails are safely logged to the console with simulated delivery.
- **Production Mode**: Fill in standard SMTP settings:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="elitestechsolutionllc@gmail.com"
SMTP_PASS="your-gmail-app-password"
SMTP_FROM="Elites Tech Solutions LLC <elitestechsolutionllc@gmail.com>"
```

---

## 🗄️ Database Options

By default, the platform uses **SQLite** (`file:./dev.db`) for immediate local development with zero external dependencies.

To connect **PostgreSQL** (e.g. Supabase, Neon, AWS RDS):
1. In `prisma/schema.prisma`, update provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. In `.env`, set:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
   ```
3. Run `npm run prisma:push`.

---

## 🌐 Deployment

### Deploying to Vercel
1. Push repository to GitHub/GitLab.
2. Import project in [Vercel](https://vercel.com).
3. Add environment variables from `.env.example` in project settings.
4. Click **Deploy**.
