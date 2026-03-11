# 🌸 Flower Fairy Frontend

A professional, high-performance e-commerce storefront built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. This application is designed to provide a seamless shopping experience for premium gift items like flowers, cakes, and personalized gifts. It features a robust state management system using **TanStack Query** and a type-safe architecture powered by **Zod**.

🔗 **[Live Demo](https://flower-fairy-murex.vercel.app)** | 🖥️ **[GitHub Repository](https://github.com/gusainDeekshu/flower-fairy)**

---

## ✨ Features

* **⚡ Modern Frontend Stack:** Built on **Next.js 15** with the App Router for optimal performance and SEO.
* **🛍️ Product Management:** Dynamic product listing and details pages with support for variants and attributes.
* **🛒 Shopping Cart:** Fully functional cart system with local storage persistence and server-side synchronization.
* **🎨 Dynamic Branding:** Customizable theme configuration to support multiple store identities.
* **🔄 Asynchronous State:** Optimized data fetching, caching, and background synchronization using **React Query**.
* **✅ Type-Safe Validation:** Frontend data validation and schema enforcement using **Zod**.
* **📱 Fully Responsive:** Mobile-first design using **Tailwind CSS** and **Shadcn UI** components.

---

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Shadcn UI |
| **State Management** | TanStack Query (React Query) |
| **Form/Schema Validation** | Zod |
| **HTTP Client** | Axios |

---

## 📂 Folder Structure Overview

```text
src/
├── app/            # Next.js App Router: pages, layouts, and API routes
├── components/     # UI components organized by feature (home, product, layout)
│   ├── ui/         # Shadcn-based atomic UI components
├── hooks/          # Custom React hooks for products and cart logic
├── lib/            # Shared utilities and API client configuration
├── schemas/        # Zod validation schemas for products and orders
├── services/       # API integration layer for products and cart
└── config/         # Brand-specific configurations and constants

```

---

## 🚀 Getting Started

### 1. Prerequisites

* **Node.js** (v20+ recommended)
* **npm** or **pnpm**
* A running instance of the [Flower Fairy Backend](https://www.google.com/search?q=https://github.com/gusainDeekshu/flower-fairy-backend)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/gusainDeekshu/flower-fairy.git
cd flower-fairy

# Install dependencies
npm install

```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"

```

### 4. Running Locally

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start

```

---

## 👤 Author

**Deekshant Gusain**

* **GitHub**: [@gusainDeekshu](https://www.google.com/search?q=https://github.com/gusainDeekshu)
* **Portfolio**: [beastdrive.in](https://beastdrive.in)

---

## 📄 License

This project is licensed under the **MIT License**.