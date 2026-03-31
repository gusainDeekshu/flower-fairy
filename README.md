
# 🌸 Flower Fairy Frontend

A professional, high-performance e-commerce storefront built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. This application provides a seamless shopping experience for premium gift items like flowers, cakes, and personalized gifts.

🔗 **[Live Demo](https://flower-fairy-murex.vercel.app)** | 🖥️ **[GitHub Repository](https://github.com/gusainDeekshu/flower-fairy)**



## ✨ Features

* **⚡ Next.js 15 App Router:** Optimized performance using Server Components for SEO and Client Components for interactivity.
* **🔑 Persistent OTP Authentication:** Secure, password-less login with a global `AuthProvider` that restores user sessions from `HttpOnly` cookies even after a page refresh (F5).
* **🛒 Intelligent Shopping Cart:** Fully functional cart using **Zustand** with `localStorage` persistence. Features automatic **Guest-to-User merging**, ensuring items added before login are synchronized with the database account.
* **🛡️ Robust Error Handling:** Centralized Axios interceptors in `api-client.ts` to handle 401 token refreshes silently and provide 500-level crash protection.
* **🎨 Dynamic Branding:** Multi-tenant ready theme configuration system to support various store identities.
* **🔄 Server State Management:** High-speed data fetching, caching, and background synchronization using **TanStack Query**.
* **📱 Mobile-First Design:** Fully responsive, modern layouts built with **Tailwind CSS**, **Shadcn UI**, and **Lucide Icons**.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Shadcn UI |
| **State Management** | Zustand (Global) + TanStack Query (Server) |
| **Networking** | Axios + Centralized Interceptors |
| **Auth & Validation** | Zod + JWT |
| **Notifications** | Sonner |

---

## 📂 Folder Structure

```text
src/
├── app/            # Pages, Layouts, and dynamic API routes
├── components/     # Feature-based components
│   ├── auth/       # OTP Modal with auto-sync logic
│   ├── home/       # Hero sections and Product Showcase
│   ├── product/    # Product details and AddToCart logic
│   ├── providers/  # Global Auth and Query providers
│   └── ui/         # Atomic Shadcn primitives
├── hooks/          # Custom hooks for catalog and auth initialization
├── lib/            # Axios instance and session recovery logic
├── services/       # API abstraction layer (Cart, Product, Orders)
├── store/          # Zustand stores for Cart and Auth state
└── config/         # Multi-tenant brand settings
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js** (v20+ recommended)
* **pnpm** (preferred) or **npm**
* A running instance of the [Flower Fairy Backend](https://github.com/gusainDeekshu/flower-fairy-backend)

### 2. Installation
```bash
git clone https://github.com/gusainDeekshu/flower-fairy.git
cd flower-fairy
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
# Backend API Base URL
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
```

### 4. Running Locally
```bash
# Start development server with Turbopack
npm run dev
```

---

## 🔄 Core Workflow: Session & Cart Sync

The application uses a sophisticated synchronization flow to ensure data integrity:
1.  **Session Recovery**: On every page refresh, the `AuthProvider` calls `/auth/me`. If the access token is missing, the `api-client` uses the `refresh_token` cookie to restore the session silently.
2.  **Cart Merging**: If a guest adds items to their cart and then logs in, the `syncCart` function pushes local items to the database, ensuring no data is lost during the transition.
3.  **Error Resilience**: Axios interceptors detect 401 errors and automatically attempt a single retry after refreshing the token, providing a smooth user experience without manual re-logins.

---

## 👤 Author

**Deekshant Gusain**
* **GitHub**: [@gusainDeekshu](https://github.com/gusainDeekshu)
* **Portfolio**: [deekshantportfoliosite.netlify.app](https://deekshantportfoliosite.netlify.app/)

---

## 📄 License

This project is licensed under the **MIT License**.