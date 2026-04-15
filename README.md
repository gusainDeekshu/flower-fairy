
# 🌸 Flower Fairy Frontend

AE Naturals is a production-grade, high-performance e-commerce platform built with a **Next.js 15 (App Router)** frontend and a **NestJS** backend. Designed for scalability, it supports multi-tenant architecture, complex product enrichment (A+ Content), secure passwordless authentication, and a dynamic 3rd-party provider registry.

🔗 **Live Demo:** [https://flower-fairy-murex.vercel.app](https://flower-fairy-murex.vercel.app)

---

## 📖 System Overview

The platform is split into distinct, specialized applications communicating via a REST API:
1. **The Storefront (Frontend):** A highly optimized, SEO-friendly Next.js application tailored for premium shopping experiences.
2. **The Core API (Backend):** A robust NestJS monolith handling complex business logic, inventory safety, and background processing.
*(Note: The Admin Dashboard documentation is pending step 3).*

---

## ✨ Features

### 🛒 The Storefront (Frontend)
* **Blazing Fast UI:** Next.js Server Components mixed with Client Components for optimal performance and SEO.
* **Intelligent Cart Syncing:** Zustand-powered guest carts that seamlessly merge with the database upon user login, preventing data loss.
* **Dynamic A+ Content:** An Amazon-style product detail page that dynamically renders rich JSON content blocks (Banners, Grids, Split Text).
* **Resilient Authentication:** Passwordless OTP flow. If an access token expires, Axios interceptors seamlessly use a secure `HttpOnly` refresh cookie to restore the session without user interruption.
* **Mobile-First Design:** Fully responsive UI built with Tailwind CSS and Shadcn UI.

### ⚙️ The Core Engine (Backend)
* **Multi-Tenant Architecture:** Host multiple brands/stores on a single database with isolated data.
* **Dynamic Provider Factory:** Hot-swap payment gateways (Stripe, Razorpay, PhonePe) and SMS/Email providers via database configurations—no redeploys needed.
* **Real-Time Inventory Safety:** BullMQ and Redis work together to reserve stock during checkout and automatically release it if the payment fails or times out.
* **Logistics Integration:** Shiprocket integration for AWB generation and order tracking.

---

## 🛠 Technology Stack

### Frontend (Storefront)
| Technology | Purpose |
| :--- | :--- |
| **Next.js 15 (App Router)** | Framework & Server Rendering |
| **TypeScript** | Type Safety |
| **Tailwind CSS & Shadcn UI** | Styling & UI Components |
| **Zustand** | Synchronous State (Cart/Auth) & Local Storage |
| **TanStack Query** | Asynchronous Server State & Caching |
| **Axios** | HTTP Client with automated token refresh |

### Backend (Core API)
| Technology | Purpose |
| :--- | :--- |
| **NestJS** | Framework Architecture |
| **PostgreSQL & Prisma** | Relational Database & ORM |
| **Redis** | High-performance caching (`cache-manager`) |
| **BullMQ** | Background job queues |
| **Cloudinary** | Media optimization and delivery |

---

## 📂 Architecture & Folder Structure

### Frontend (`ae-naturals/src/`)
```text
├── app/            # Next.js App Router (Pages: Home, Product, Cart, Checkout, Profile)
├── components/     # Reusable UI elements
│   ├── home/       # Modular landing page sections
│   ├── product/    # Product details, Gallery, and A+ Content Renderer
│   ├── ui/         # Shadcn atomic components
├── hooks/          # Complex logic abstraction (useCartActions, useAuthInit)
├── lib/            # Utilities and Axios API client with interceptors
├── services/       # API abstraction layer (Cart, Product, Auth)
├── store/          # Zustand global state (Cart, Auth)
└── types/          # TypeScript interfaces matching backend DTOs
```

### Backend (`ae-naturals-backend/src/`)
```text
├── auth/           # OTP flows and JWT strategies
├── cart/           # Cart persistence and real-time price snapshots
├── inventory/      # BullMQ/CRON workers for stock management
├── orders/         # Order lifecycles and webhook processors
├── providers/      # Factory pattern for dynamic Email/SMS/Payment integrations
└── products/       # Catalog APIs and A+ Content logic
```

---

## 🚀 Installation & Getting Started

### 1. Prerequisites
* Node.js (v18+)
* PostgreSQL instance & Redis server (for Backend)

### 2. Backend Setup
```bash
git clone [https://github.com/aenaturalsit-dotcom/ae-naturals-backend.git](https://github.com/aenaturalsit-dotcom/ae-naturals-backend.git)
cd ae-naturals-backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
# Runs on http://localhost:4000
```

### 3. Frontend Setup
```bash
git clone [https://github.com/gusainDeekshu/ae-naturals.git](https://github.com/gusainDeekshu/ae-naturals.git)
cd ae-naturals
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1" > .env.local

npm run dev
# Runs on http://localhost:3000
```

---

## 🔐 Security & Data Flow
1. **Authentication:** Users request an OTP. The backend validates it and issues a short-lived JWT Access Token (memory) and a long-lived Refresh Token (`HttpOnly` cookie).
2. **API Requests:** The frontend attaches the Access Token. If it receives a `401`, the Axios interceptor halts the queue, calls the `/auth/refresh` endpoint using the cookie, updates the token, and replays the original request invisibly to the user.
3. **Data Protection:** All sensitive backend provider keys (Stripe, Twilio) are AES-256 encrypted at rest.

---

## 👨‍💻 Author
**Deekshant Gusain**
* GitHub: [@gusainDeekshu](https://github.com/gusainDeekshu)
* Portfolio: [Deekshant Gusain](https://deekshantportfoliosite.netlify.app)

## 📄 License
This project is licensed under the **MIT License**.
**********************************************