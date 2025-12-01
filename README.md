# Hi Teacher - Learning Management System

> A comprehensive Learning Management System built for coaching institutes and freelance teachers

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

## 🎯 Overview

**Hi Teacher** is a modern, production-ready Learning Management System designed specifically for small to medium-sized coaching institutes (20-100 students) and freelance teachers. Built with trust, professionalism, and ease of use at its core.

### Key Features

- 🔐 **Complete Authentication System** - Login, registration, password recovery
- 👥 **Multi-Role Support** - Admin, Teacher, Student with role-based access
- 📊 **Beautiful Dashboards** - Personalized for each user role
- 🎨 **Professional Design** - Trust-inspiring blue/teal color scheme
- 📱 **Fully Responsive** - Works seamlessly on all devices
- ♿ **Accessible** - WCAG AA compliant
- 🌙 **Dark Mode** - Full dark mode support

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd hiteacher-web

# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev
```

Visit **http://localhost:3000** to see the app!

### Demo Credentials

```
Admin:
  Email: admin@hiteacher.com
  Password: (any 6+ characters)

Teacher:
  Email: teacher@example.com
  Password: (any 6+ characters)

Student:
  Email: student@example.com
  Password: (any 6+ characters)
```

---

## 🏗️ Tech Stack

### Core
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui + Radix UI

### State & Forms
- **State Management:** Zustand with persistence
- **Form Handling:** React Hook Form
- **Validation:** Zod

### Icons & Charts
- **Icons:** Lucide React
- **Charts:** Recharts (ready to use)

### Code Quality
- **Utilities:** clsx, tailwind-merge, class-variance-authority
- **Date Handling:** date-fns

---

## 📁 Project Structure

```
hiteacher-web/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (grouped)
│   │   ├── login/
│   │   ├── register/
│   │   │   ├── student/
│   │   │   └── teacher/
│   │   ├── forgot-password/
│   │   └── verify/
│   ├── admin/dashboard/          # Admin dashboard
│   ├── teacher/dashboard/        # Teacher dashboard
│   ├── student/dashboard/        # Student dashboard
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   └── ... (9 components total)
│   ├── layouts/                  # Layout components
│   │   ├── dashboard-layout.tsx
│   │   ├── dashboard-sidebar.tsx
│   │   └── dashboard-header.tsx
│   └── dashboard/                # Dashboard widgets
│       └── stat-card.tsx
│
├── lib/
│   ├── validations/              # Zod schemas
│   │   ├── auth.ts
│   │   └── batch.ts
│   ├── mock-data/                # Mock API data
│   │   ├── users.ts
│   │   └── batches.ts
│   └── utils.ts                  # Utility functions
│
├── types/                        # TypeScript types
│   ├── user.ts
│   ├── batch.ts
│   ├── content.ts
│   ├── class.ts
│   ├── assessment.ts
│   └── analytics.ts
│
├── store/                        # Zustand stores
│   ├── auth-store.ts             # Authentication state
│   └── ui-store.ts               # UI state
│
├── hooks/                        # Custom hooks
│   ├── use-auth.ts
│   └── use-debounce.ts
│
└── middleware.ts                 # Route protection
```

---

## 🎨 Design System

### Color Palette

**Light Mode:**
- **Primary:** `hsl(217, 91%, 35%)` - Deep Professional Blue
- **Secondary:** `hsl(174, 72%, 35%)` - Warm Teal
- **Accent:** `hsl(174, 60%, 51%)` - Light Teal

**Dark Mode:**
- **Primary:** `hsl(217, 91%, 60%)` - Lighter Blue
- **Secondary:** `hsl(174, 72%, 50%)` - Lighter Teal

### Typography
- **Sans:** Geist Sans
- **Mono:** Geist Mono

### Principles
- Clean and modern aesthetic
- Generous whitespace
- Consistent component sizing
- Smooth transitions (200ms)
- Professional trust-inspiring colors

---

## 🔐 Authentication

### Features
- ✅ Email/password login
- ✅ Student registration (with parent info)
- ✅ Teacher registration (2-step with verification)
- ✅ Password recovery flow
- ✅ Email verification
- ✅ Remember me functionality
- ✅ Role-based redirects

### Routes
- `/login` - Login page
- `/register/student` - Student registration
- `/register/teacher` - Teacher registration (multi-step)
- `/forgot-password` - Password recovery
- `/verify` - Email verification

### Session Management
- Zustand store with localStorage persistence
- Auto-logout on invalid sessions
- Role-based route protection via middleware

---

## 📊 Dashboards

### Admin Dashboard
**Features:**
- User statistics and growth metrics
- Pending approval queue (teachers & students)
- Recent platform activity feed
- System performance metrics

**Navigation:**
- Dashboard, Users, Approvals, Analytics, Settings

### Teacher Dashboard
**Features:**
- Student and batch overview
- Upcoming classes schedule
- Recent assignment submissions
- Batch performance metrics
- Quick action buttons

**Navigation:**
- Dashboard, Batches, Students, Content, Classes, Assignments, Analytics, Settings

### Student Dashboard
**Features:**
- Today's class schedule
- Upcoming assignments with deadlines
- Course progress visualization
- Recently added content
- Grade overview

**Navigation:**
- Dashboard, My Classes, Notes, Assignments, Messages, Progress, Settings

---

## 🧩 Components

### UI Components (9)
All built with shadcn/ui and Radix UI:
- `Button` - Multiple variants and sizes
- `Input` - Form inputs with validation
- `Label` - Accessible form labels
- `Card` - Content containers
- `Avatar` - User avatars with fallback
- `Badge` - Status indicators
- `Dialog` - Modal dialogs
- `Tabs` - Tabbed navigation
- `Table` - Data tables

### Layout Components (3)
- `DashboardLayout` - Main wrapper
- `DashboardSidebar` - Collapsible navigation
- `DashboardHeader` - Top bar with search & notifications

### Dashboard Components (1)
- `StatCard` - Metric cards with trends

---

## 🗂️ State Management

### Auth Store (`auth-store.ts`)
```typescript
{
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email, password) => Promise<void>
  logout: () => void
}
```

### UI Store (`ui-store.ts`)
```typescript
{
  isSidebarOpen: boolean
  theme: 'light' | 'dark'
  toggleSidebar: () => void
  setTheme: (theme) => void
}
```

---

## ✅ Form Validation

All forms use **React Hook Form** + **Zod** validation:

**Login:**
- Email (required, valid email)
- Password (min 6 chars)
- Remember me (optional)

**Student Registration:**
- Name, Email, Phone, Password (required)
- Parent name & contact (optional)

**Teacher Registration:**
- Step 1: Personal info (name, email, phone, password)
- Step 2: Professional details (subjects, qualification, experience, bio)

---

## 🔒 Security

- Client-side form validation
- Route protection middleware
- Role-based access control
- Session persistence in localStorage
- Password visibility toggles
- Remember me functionality

> **Note:** This is a demo app with mock authentication. In production, implement proper backend authentication with JWT/sessions, password hashing, and HTTPS.

---

## 🎯 Development Phases

### ✅ Phase 1: Foundation & Setup
- Dependencies installation
- Folder structure
- shadcn/ui configuration
- Type definitions
- State management setup
- Mock data infrastructure

### ✅ Phase 2: Design System & UI Foundation
- Custom color palette
- 9 core UI components
- Dark mode support
- Demo landing page

### ✅ Phase 3: Authentication & Authorization
- Login page
- Student & teacher registration
- Password recovery
- Email verification
- Role-based routing

### ✅ Phase 4: Core Dashboards
- Dashboard layouts (sidebar, header)
- Admin dashboard (approvals, activity)
- Teacher dashboard (classes, submissions)
- Student dashboard (schedule, assignments)

### 🚧 Phase 5: Batch & Student Management (Next)
- Batch CRUD
- Student enrollment
- Batch settings

### 📅 Future Phases
- Content Management
- Video Management
- Class Scheduling
- Live Classes
- Communication Features
- Assessments & Grading
- Analytics & Reporting
- Payment Integration

---

## 🚀 Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

## 📦 Key Dependencies

```json
{
  "next": "16.0.6",
  "react": "19.2.0",
  "typescript": "5",
  "tailwindcss": "4",
  "zustand": "^5.0.2",
  "react-hook-form": "^7.54.2",
  "zod": "^3.24.1",
  "@radix-ui/react-*": "Various Radix UI primitives",
  "lucide-react": "^0.469.0",
  "date-fns": "^4.1.0",
  "recharts": "^2.15.0"
}
```

---

## 🎨 Customization

### Colors
Edit `app/globals.css` to customize the color scheme:
```css
:root {
  --primary: 217 91% 35%;      /* Deep blue */
  --secondary: 174 72% 35%;    /* Teal */
  --accent: 174 60% 51%;       /* Light teal */
  /* ... */
}
```

### Sidebar Navigation
Edit navigation items in `components/layouts/dashboard-sidebar.tsx`:
```typescript
const teacherNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
  // Add more items...
]
```

---

## 🐛 Known Issues

- Uses `--legacy-peer-deps` for React 19 compatibility
- Some CSS lint warnings for Tailwind v4 at-rules (safe to ignore)
- Mock authentication only (no real backend)

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 👨‍💻 Development

Built with ❤️ using modern web technologies.

**Version:** 1.0.0 (Phase 4 Complete)  
**Last Updated:** December 2, 2025

---

## 📸 Screenshots

### Landing Page
Modern, gradient design with stats cards and feature showcase.

### Login Page
Clean authentication with demo credentials display.

### Admin Dashboard
- Approval queue with action buttons
- Activity feed
- System statistics

### Teacher Dashboard
- Upcoming classes schedule
- Submission queue
- Batch performance metrics

### Student Dashboard
- Today's schedule
- Assignment tracker
- Course progress bars

---

Made with Next.js 16 and shadcn/ui 🚀
