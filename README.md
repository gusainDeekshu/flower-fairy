
# 🌸 Flower Fairy Frontend

A professional, high-performance e-commerce storefront built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. This application is designed to provide a seamless shopping experience for premium gift items like flowers, cakes, and personalized gifts.

🔗 **[Live Demo](https://flower-fairy-murex.vercel.app)** | 🖥️ **[GitHub Repository](https://github.com/gusainDeekshu/flower-fairy)**

---

## ✨ Features

* **⚡ Next.js 15 App Router:** Optimized performance with server components and client-side interactivity.
* **🔑 OTP Authentication:** Secure, password-less login using Email/SMS OTP via a custom `OtpModal`.
* **🛒 Persistent Shopping Cart:** Fully functional cart using **Zustand** with `localStorage` persistence and automatic guest-to-user cart merging.
* **🛡️ Robust Error Handling:** Centralized Axios interceptors for user-friendly error messages and 500-level crash protection.
* **🎨 Dynamic Branding:** Theme configuration system to support multiple store identities (Multi-tenant ready).
* **🔄 Asynchronous State:** background synchronization, caching, and optimistic updates using **TanStack Query**.
* **📱 Mobile-First Design:** Fully responsive layouts using **Tailwind CSS** and **Lucide Icons**.

---

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Shadcn UI |
| **State Management** | Zustand (Global) + TanStack Query (Server) |
| **Auth & Validation** | Zod + JWT |
| **Notifications** | Sonner |
| **HTTP Client** | Axios |

---

## 📂 Folder Structure Overview

```text
src/
├── app/            # App Router: Pages, Layouts, and dynamic routes
├── components/     # Feature-based components (home, auth, cart, product)
│   ├── auth/       # OTP Modal and login logic
│   ├── ui/         # Atomic UI components and Shadcn primitives
├── store/          # Zustand stores for Cart and User Auth state
├── hooks/          # Custom hooks for API mutations and queries
├── lib/            # Axios API client and shared utility functions
├── schemas/        # Zod schemas for type-safe forms and API responses
└── config/         # Brand configuration (Flower Fairy settings)

```

---

## 🚀 Getting Started

### 1. Prerequisites

* **Node.js** (v20+ recommended)
* **npm**, **pnpm**, or **bun**
* A running instance of the [Flower Fairy Backend](https://github.com/gusainDeekshu/flower-fairy-backend)

### 2. Installation

```bash
git clone https://github.com/gusainDeekshu/flower-fairy.git
cd flower-fairy
npm install

```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"

```

### 4. Running Locally

```bash
# Start development server
npm run dev

```

---

## 👤 Author

**Deekshant Gusain**

* **GitHub**: [@gusainDeekshu](https://www.google.com/search?q=https://github.com/gusainDeekshu)
* **Portfolio**: [deekshantportfoliosite.netlify.app](https://deekshantportfoliosite.netlify.app/)

---

## 📄 License

This project is licensed under the **MIT License**.

