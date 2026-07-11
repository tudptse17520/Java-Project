# Frontend Structure

```text
pbms-frontend/
├── public/              # Public static files (logos, global images, icons)
├── src/
│   ├── app/             # App Router (pages, layouts, route groups, middleware)
│   ├── components/      # Reusable UI components (ui/, common/, layouts/)
│   ├── config/          # Environment, permissions, navigation menus
│   ├── constants/       # Roles, statuses, and domain enums
│   ├── features/        # Business logic modules (UI local state & components)
│   ├── hooks/           # Global custom hooks
│   ├── lib/             # Third-party clients (Axios client, Query client)
│   ├── mocks/           # Mock data for frontend independent development
│   ├── providers/       # Global state providers (Query, Theme, Toast, Auth)
│   ├── services/        # Centralized API layer (Axios endpoints)
│   ├── stores/          # Global client state (Zustand stores)
│   ├── types/           # TypeScript types/interfaces matching Backend Entities
│   └── utils/           # Global helper functions (formatters)
└── middleware.ts        # Global Route Guard (placed at /src root)
```

## Routing Structure 

```text
app/
├── (auth)
│   └── login
│
├── (dashboard)
│   ├── forbidden (403 Error Page)
│   │
│   ├── admin
│   │   ├── dashboard
│   │   ├── users
│   │   └── settings
│   │
│   ├── manager
│   │   ├── dashboard
│   │   ├── buildings
│   │   ├── floors
│   │   ├── slots
│   │   ├── pricing
│   │   ├── feedbacks
│   │   └── reports
│   │
│   └── staff
│       ├── dashboard
│       ├── check-in
│       ├── check-out
│       ├── sessions
│       └── payments
│
└── (driver)
    ├── browse
    ├── reservations
    ├── vehicles
    └── profile
```

## Prerequisites
- Node.js (v18 or newer recommended)
- npm, yarn, or pnpm

## Setup & Run
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or yarn install / pnpm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env.local` and update the values.
4. Start the development server:
   ```bash
   npm run dev
   # or yarn dev / pnpm dev
   ```
The frontend application will start on `http://localhost:3000`.
