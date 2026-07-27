<!-- @format -->

# SmileDesk

A modern full-stack dental clinic management platform built for clinics that want to manage appointments, patients, subscriptions, and clinic profiles from a fast web dashboard.

> **What it does**
>
> - Lets dentists register a clinic, manage bookings, and run a clinic dashboard.
> - Provides a clinic discovery flow with clinic listings and slug-based clinic pages.
> - Supports appointment booking, confirmation, decline, and patient lookup.
> - Includes an AI chat assistant that patients can talk to directly to check availability and book an appointment, powered by Gemini function/tool calling.
> - Protects premium features behind a subscription flow and SMS-ready middleware.

---

## 🧩 Project Overview

This repository is split into two main apps:

- `back-end/` — Express + MongoDB API server
- `front-end/` — React + TypeScript + Vite web client

The frontend is tailored for clinic users and visitors, while the backend manages authentication, clinic data, appointment workflows, AI assistant logic, and subscription validation.

---

## 🚀 Key Features

- Clinic registration + manager login
- JWT-based authentication with secure cookie support
- Clinic dashboard with appointments, patients, settings, and subscription plan management
- Appointment lifecycle: book, confirm, decline, and check available hours
- **AI clinic assistant** — a chat-based assistant (built with the Gemini SDK's function/tool calling) that lets patients book appointments and (soon) look up appointment details in plain language — see [AI Clinic Assistant](#-ai-clinic-assistant) below.
- Subscription validation middleware to gate premium clinic operations
- SMS integration scaffolded through middleware and reusable SMS service layer
- Paginated clinic listing, featured clinics, and clinic detail lookup by slug
- Form validation with Zod and request rate limiting for sensitive routes

---

## 🤖 AI Clinic Assistant

SmileDesk includes a chat-based AI assistant built with the Gemini SDK's function/tool calling. Instead of the usual forms and dropdowns, patients (and staff) can just type what they want, and the model calls the right backend function to handle it.

**Capabilities:**

- ✅ **Book an appointment** — patient describes when they want to come in, the assistant checks availability and creates the booking.
- 🔜 **Get appointment details** — patient (or staff) will be able to ask about an existing appointment (date, time, status) and have the assistant look it up and reply — in progress.

More tools will be added to the assistant over time as new booking-related actions come up.

---

## 🧱 Tech Stack

### Back-end

- Node.js + Express 5
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Google Gemini API (function/tool calling for the AI clinic assistant)
- Zod validation
- dotenv configuration
- express-rate-limit
- cookie-parser

### Front-end

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router Dom
- Zustand for state management
- Axios for API calls
- Framer Motion animations
- React Toastify for UI notifications

---

## 📁 Architecture

### Back-end structure

- `index.js` — app entry point, CORS setup, route registration
- `controllers/` — request handlers for users, clinics, appointments, AI chat, SMS, and stats
- `routes/` — route definitions for API endpoints
- `models/` — Mongoose schemas for `User`, `Clinic`, `Appointment`, and `OTP`
- `middleware/` — auth, subscription guard, SMS subscription check, validation, and rate limiting
- `validations/` — Zod schemas for auth and appointment payloads
- `services/` — SMS sending helpers, message scaffolding, and the Gemini-powered AI assistant service (tool/function definitions for availability checks, booking, and lookups)
- `data/` — constants, plans, roles, status text, and clinic defaults

### Front-end structure

- `src/Router.tsx` — page routes and nested dashboard routes
- `src/routes/` — top-level pages like `Home`, `Login`, `Register`, `Clinic`, `Dashboard`, `Pricing`, and `Features`
- `src/components/` — reusable UI pieces, dashboard views, appointment cards, the chat assistant widget, and mobile-friendly sections
- `src/services/` — API clients for auth, clinic, appointment, AI chat, SMS, and statics
- `src/store/` — state stores for auth, clinic, appointment, and UI data
- `src/config/api.ts` — Axios base client with cookie support
- `src/types/` — typed request/response models for strong TypeScript safety

---

## ⚙️ Setup

### Back-end

```bash
cd back-end
npm install
node index.js
```

> If you want, add a `start` script in `back-end/package.json`:
>
> ```json
> "scripts": {
>   "start": "node index.js"
> }
> ```

### Front-end

```bash
cd front-end
npm install
npm run dev
```

---

## 🌿 Environment Variables

### Back-end

Create a `.env` file inside `back-end/` with at least:

```env
DB_URL=<your-mongo-connection-string>
WEBSITE_URL=http://localhost:5173
NODE_ENV=development
GEMINI_API_KEY=<your-gemini-api-key>
```

### Front-end

Create `.env.development` or `.env.production` inside `front-end/` with:

```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## 🧪 API Endpoints

### Auth

- `POST /user/login`
- `POST /user/register`
- `POST /user/logout`
- `GET /user/me`
- `PATCH /user/`

### Clinics

- `GET /clinic/`
- `GET /clinic/slug/:slug`
- `POST /clinic/subscribe`
- `GET /clinic/dashboard`
- `PATCH /clinic/update`

### Appointments

- `POST /appointment/`
- `GET /appointment/`
- `GET /appointment/today`
- `GET /appointment/upcoming`
- `GET /appointment/expired`
- `PATCH /appointment/confirm/:id`
- `PATCH /appointment/decline/:id`

### SMS

- `POST /sms/pick-sms`
- `POST /sms/confirm-sms`

### Statics

- `GET /statics/:clinicId`

---

## 💡 Notes

- The backend uses cookie-based auth and `withCredentials: true` in Axios, so the frontend and backend must share a trusted origin.
- The AI clinic assistant uses the Gemini SDK's function/tool calling: the model is given a set of callable functions (check availability, create booking, look up patient/appointment) and decides when to call each one based on the conversation. All validation and business rules still live in the backend functions themselves.
- SMS support is implemented as a service layer and middleware gate, ready to connect to a real provider.
- The front-end UI is designed for Arabic users, with right-to-left content and clinic branding.

---

## ⭐ Creative Summary

SmileDesk is a polished dental care management experience for clinics that want to run their business digitally. It combines a modern React dashboard with an Express/Mongo backend and an AI-powered chat assistant, focused on clinic growth, effortless appointment booking, and subscription-aware operations.

Use this project as a base to launch a clinic management SaaS, polish the patient booking flow, or turn it into a multilingual health tech product.

---

## 📌 License

This repository does not currently include a license file. Add one if you plan to publish or share the project publicly.
