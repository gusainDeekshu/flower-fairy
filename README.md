
# 🌸 Flower Fairy Frontend

A **production-ready, high-performance e-commerce storefront** built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.
The application is designed to deliver a **fast, scalable, and SEO-optimized shopping experience** for premium gifting products such as flowers, cakes, and personalized items.

It leverages modern frontend architecture patterns including:

* Server Components for performance
* Client Components for interactivity
* State persistence
* Secure OTP authentication
* Advanced cart synchronization logic

🔗 **Live Demo:** [https://flower-fairy-murex.vercel.app](https://flower-fairy-murex.vercel.app)
🖥️ **Frontend Repository:** [https://github.com/gusainDeekshu/flower-fairy](https://github.com/gusainDeekshu/flower-fairy)

---

# 🎯 Project Goals

This project was built to achieve the following:

• Deliver **blazing fast page loads** with optimized rendering
• Maintain **secure and persistent authentication** without passwords
• Provide **smooth cart experience across guest and logged-in sessions**
• Enable **scalable multi-brand storefront support**
• Ensure **robust error handling and session stability**

---

# ✨ Core Features

## ⚡ Next.js 15 App Router Architecture

The application uses the **Next.js App Router** which introduces a more powerful routing and rendering system.

Key benefits:

• Server Components improve SEO and reduce client bundle size
• Streaming UI for faster perceived performance
• Layout-based architecture for scalable UI composition
• Built-in support for API routes and middleware

This ensures:

• Faster page rendering
• Better search engine indexing
• Reduced client-side JavaScript

---

## 🔑 Persistent OTP Authentication System

Instead of traditional password login, the system uses a **secure OTP-based authentication flow**.

### How It Works

1. User enters phone/email.
2. Backend sends OTP.
3. OTP verification generates:

   * Access Token
   * Refresh Token (stored in HttpOnly cookie)
4. On page refresh:

   * Frontend automatically restores the session.

### Authentication Architecture

AuthProvider handles:

• Session restoration
• Login state
• User data hydration
• Silent token refresh

This prevents:

• Unexpected logouts
• Broken sessions
• Authentication delays

---

## 🛒 Intelligent Shopping Cart System

The cart is powered by **Zustand state management** with local persistence.

### Key Capabilities

Guest Cart Support
Users can add products before login.

Cart Persistence
Cart is saved in localStorage to prevent loss on refresh.

Guest-to-User Cart Merge
When a user logs in:

1. Local cart items are detected
2. API sync pushes them to database
3. Server cart is merged automatically

This ensures:

• No lost items
• Seamless user experience
• Cross-device consistency

---

## 🔄 Server State Management with TanStack Query

The application uses **TanStack Query** to manage API-driven state.

Benefits:

• Smart caching
• Background refetching
• Optimistic updates
• Reduced API calls
• Better performance

This is especially useful for:

• Product listings
• Cart updates
• Order history
• User profile data

---

## 🛡️ Advanced Error Handling System

The app uses **centralized Axios interceptors** located in:

```
lib/api-client.ts
```

This system automatically handles:

### 401 Unauthorized

Token expired → refresh token used → retry request

### 500 Server Errors

Graceful failure UI + logging

### Network Failures

Retry-safe architecture

This results in:

• Fewer user disruptions
• Stable authentication flows
• Consistent API behavior

---

## 🎨 Dynamic Branding (Multi-Tenant Ready)

The system includes a **brand configuration layer** that allows multiple store identities.

Located in:

```
config/
```

This enables:

• Multiple storefronts using same codebase
• Custom themes
• Brand color overrides
• Logo and UI variation

Useful for:

• Marketplace platforms
• Franchise stores
• White-label deployments

---

## 📱 Mobile-First UI System

The UI is designed with **mobile-first responsiveness** using:

• Tailwind CSS
• Shadcn UI
• Lucide Icons

Design principles used:

• Component-based layout
• Accessible UI
• Adaptive grids
• Performance optimized animations

Result:

• Works perfectly across devices
• Fast UI rendering
• Clean and modern UX

---

# 🛠️ Technology Stack

| Layer            | Technology     |
| ---------------- | -------------- |
| Framework        | Next.js 15     |
| Language         | TypeScript     |
| Styling          | Tailwind CSS   |
| UI System        | Shadcn UI      |
| Icons            | Lucide         |
| State Management | Zustand        |
| Server State     | TanStack Query |
| HTTP Client      | Axios          |
| Authentication   | JWT + OTP      |
| Validation       | Zod            |
| Notifications    | Sonner         |

---

# 📂 Detailed Folder Structure

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

---

## 2. Clone the Repository

```bash
git clone https://github.com/gusainDeekshu/flower-fairy.git
cd flower-fairy
```

---

## 3. Install Dependencies

```bash
npm install
```

or

```bash
pnpm install
```

---

## 4. Environment Configuration

Create:

```
.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

This connects the frontend to the backend API.

---

## 5. Run the Development Server

```bash
npm run dev
```

The app will run at:

```
http://localhost:3000
```

---

# 🔄 Core Workflow: Session & Cart Synchronization

This is one of the most important features of the application.

### Step 1 — Session Recovery

On page load:

```
AuthProvider → /auth/me
```

If access token expired:

```
refresh_token cookie → generate new token
```

User stays logged in without interruption.

---

### Step 2 — Cart Synchronization

Scenario:

Guest adds items → then logs in.

Flow:

1 Local cart detected
2 syncCart triggered
3 Backend cart merged
4 Local cart cleared

Outcome:

No cart data loss.

---

### Step 3 — Error Recovery

Axios interceptors automatically:

• detect expired tokens
• retry requests
• maintain stable API communication

---

# 🔐 Security Design

The system follows modern web security practices.

Access tokens stored in memory
Refresh tokens stored in HttpOnly cookies
OTP authentication reduces credential leaks
Zod schema validation protects API inputs

---

# 📈 Performance Optimizations

Several techniques were used:

Server Components reduce bundle size
TanStack Query caching reduces network calls
Lazy loading of UI sections
Optimized image loading
Turbopack dev performance boost

---

# 👨‍💻 Author

Deekshant Gusain

GitHub
[https://github.com/gusainDeekshu](https://github.com/gusainDeekshu)

Portfolio
[https://deekshantportfoliosite.netlify.app](https://deekshantportfoliosite.netlify.app)

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to:

• Use
• Modify
• Distribute
• Build commercial projects

*****************************************************************************************************************************************************************


*********************************************************************************************
