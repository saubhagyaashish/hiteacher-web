# Developer Guide - Hi Teacher LMS

> Comprehensive guide for developers contributing to the Hi Teacher Learning Management System

**Version:** 1.0.0 (Phase 5 Complete)  
**Last Updated:** December 2, 2025  
**Repository:** https://github.com/saubhagyaashish/hiteacher-web

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Development Phases](#development-phases)
6. [Mocked APIs](#mocked-apis)
7. [Design System](#design-system)
8. [Common Issues & Solutions](#common-issues--solutions)
9. [Enhancement Opportunities](#enhancement-opportunities)
10. [Contributing Guidelines](#contributing-guidelines)

---

## 🎯 Project Overview

**Hi Teacher** is a modern Learning Management System (LMS) built for coaching institutes and freelance teachers. It emphasizes **trust**, **professionalism**, and **ease of use**.

### Target Audience
- **Small to medium-sized coaching institutes** (20-100 students)
- **Freelance teachers** managing multiple batches
- **Students** accessing course materials and tracking progress
- **Admins** managing platform and approvals

### Core Features (Completed)
✅ Multi-role authentication (Admin, Teacher, Student)  
✅ Role-based dashboards with analytics  
✅ Batch management and student enrollment  
✅ Professional, accessible UI with dark mode  
✅ Form validation with real-time feedback  
✅ Responsive design (mobile-first)  

### Key Design Principles
- **Trust & Professionalism**: Deep blue/teal color palette
- **Clean & Modern**: Generous whitespace, consistent typography
- **Accessible**: WCAG AA compliant
- **Mobile-First**: Responsive across all devices

---

## 🏗️ Tech Stack

### Core Framework
- **Next.js 16** (App Router) - React framework with SSR
- **React 19** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Tailwind CSS 4** - Utility-first CSS (CSS-first configuration)
- **shadcn/ui** - Radix UI-based component library
- **class-variance-authority** - Component variants
- **clsx + tailwind-merge** - Conditional classes

### State Management & Forms
- **Zustand 5** - Lightweight state management with persistence
- **React Hook Form 7** - Form handling
- **Zod 4** - Schema validation

### UI Components
- **Radix UI** - Headless, accessible components
- **Lucide React** - Icon library (500+ icons)
- **Recharts** - Chart library (ready for analytics)

### Utilities
- **date-fns 4** - Date manipulation
- **React Quill** - Rich text editor (for future content)

---

## 📁 Project Structure

```
hiteacher-web/
│
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (route group)
│   │   ├── login/
│   │   ├── register/
│   │   │   ├── student/
│   │   │   └── teacher/         # Multi-step registration
│   │   ├── forgot-password/
│   │   └── verify/
│   ├── admin/dashboard/          # Admin portal
│   ├── teacher/
│   │   ├── dashboard/
│   │   ├── batches/              # Batch management
│   │   │   ├── [id]/            # Dynamic route for batch details
│   │   │   └── new/             # Create batch
│   │   └── students/            # Student list
│   ├── student/dashboard/        # Student portal
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles + Tailwind config
│
├── components/
│   ├── ui/                      # shadcn/ui components (9 total)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── label.tsx
│   │   ├── tabs.tsx
│   │   └── table.tsx
│   ├── layouts/                 # Layout components
│   │   ├── dashboard-layout.tsx  # Main wrapper
│   │   ├── dashboard-sidebar.tsx # Collapsible sidebar
│   │   └── dashboard-header.tsx  # Header with search/notifications
│   └── dashboard/               # Dashboard widgets
│       └── stat-card.tsx        # Metric cards with trends
│
├── lib/
│   ├── validations/             # Zod schemas
│   │   ├── auth.ts              # Auth forms validation
│   │   └── batch.ts             # Batch forms validation
│   ├── mock-data/               # Mock API responses
│   │   ├── users.ts             # User data
│   │   └── batches.ts           # Batch data
│   └── utils.ts                 # Utility functions (cn helper)
│
├── types/                       # TypeScript definitions
│   ├── user.ts                  # User, Teacher, Student, Admin
│   ├── batch.ts                 # Batch, BatchSettings
│   ├── content.ts               # Content hierarchy
│   ├── class.ts                 # Class, Attendance
│   ├── assessment.ts            # Quiz, Assignment, Grade
│   └── analytics.ts             # Metrics, ChartData
│
├── store/                       # Zustand stores
│   ├── auth-store.ts            # Authentication state (persisted)
│   └── ui-store.ts              # UI state (sidebar, theme)
│
├── hooks/                       # Custom React hooks
│   ├── use-auth.ts              # Auth state access
│   └── use-debounce.ts          # Debounced values
│
├── middleware.ts                # Route protection & role-based access
├── postcss.config.mjs           # PostCSS config (Tailwind v4)
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

### Key Conventions

**Route Groups**: `(auth)` - Groups routes without affecting URL  
**Dynamic Routes**: `[id]` - Captures route parameter  
**Path Aliases**:
- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/types` → `./types`
- `@/hooks` → `./hooks`
- `@/store` → `./store`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and npm
- Git
- Code editor (VS Code recommended)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/saubhagyaashish/hiteacher-web.git
cd hiteacher-web

# 2. Install dependencies (use legacy-peer-deps for React 19 compatibility)
npm install --legacy-peer-deps

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

### Available Scripts

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### First Time Setup

1. **VS Code Settings**: A `.vscode/settings.json` is included to suppress Tailwind v4 CSS lint warnings
2. **No environment variables needed**: All APIs are mocked
3. **No database required**: Using in-memory mock data

---

## 📅 Development Phases

### ✅ Completed Phases

#### **Phase 1: Foundation & Setup** (Complete)
- ✅ Next.js 16 + React 19 + TypeScript setup
- ✅ Tailwind CSS 4 configuration
- ✅ shadcn/ui initialization
- ✅ Folder structure
- ✅ TypeScript types (6 type files)
- ✅ Zustand stores (auth + UI)
- ✅ Mock data infrastructure
- ✅ Path aliases configuration

#### **Phase 2: Design System & UI Foundation** (Complete)
- ✅ Custom blue/teal color palette
- ✅ 9 core shadcn/ui components
- ✅ Dark mode support
- ✅ Responsive design tokens
- ✅ Demo landing page

**Color Palette:**
- Primary: `hsl(217, 91%, 35%)` - Deep Professional Blue
- Secondary: `hsl(174, 72%, 35%)` - Warm Teal
- Accent: `hsl(174, 60%, 51%)` - Light Teal

#### **Phase 3: Authentication & Authorization** (Complete)
- ✅ Login page with role-based redirects
- ✅ Student registration (with parent info)
- ✅ Teacher registration (2-step process)
- ✅ Password recovery flow
- ✅ Email verification
- ✅ Route protection middleware
- ✅ Session persistence

**Mock Users:**
```typescript
Admin:  admin@hiteacher.com
Teacher: teacher@example.com
Student: student@example.com
Password: any 6+ characters
```

#### **Phase 4: Core Dashboards** (Complete)
- ✅ Collapsible sidebar navigation
- ✅ Header with search + notifications
- ✅ Admin dashboard (approvals, activity, stats)
- ✅ Teacher dashboard (classes, submissions, performance)
- ✅ Student dashboard (schedule, assignments, progress)
- ✅ Stat cards with trends
- ✅ Activity feeds

#### **Phase 5: Batch & Student Management** (Complete)
- ✅ Batch list with grid view [4 stat cards]
- ✅ Create batch form (subject, schedule, capacity, access control)
- ✅ Batch details page (tabbed: students, classes, details)
- ✅ Student list with search
- ✅ Performance tracking with trend indicators
- ✅ Batch capacity visualization

### 🚧 Pending Phases

#### **Phase 6: Content Management System** (Next Priority)
- [ ] Hierarchical structure (Subject → Topic → Chapter)
- [ ] File upload (PDF, videos, notes)
- [ ] Content metadata management
- [ ] Content library for students
- [ ] Search and filter

#### **Phase 7: Video & Media Management**
- [ ] Custom video player
- [ ] Playback controls (speed, quality)
- [ ] Watch time tracking
- [ ] Resume playback

#### **Phase 8: Class Scheduling & Management**
- [ ] Calendar view
- [ ] Recurring class support
- [ ] Attendance marking
- [ ] Class reminders
- [ ] Meeting link integration

#### **Phase 9: Communication Features**
- [ ] Announcement system
- [ ] Discussion forum
- [ ] Q&A system
- [ ] Private messaging

#### **Phase 10: Assessment & Evaluation**
- [ ] Quiz creation
- [ ] Question bank
- [ ] Auto-grading
- [ ] Assignment submission
- [ ] Gradebook

#### **Phase 11: Analytics & Reporting**
- [ ] Performance metrics
- [ ] Content engagement
- [ ] Attendance reports
- [ ] Export functionality

#### **Phase 12-14**: Advanced features, payments, optimization

---

## 🔌 Mocked APIs

All API calls are currently mocked with simulated delays. No backend required.

### Authentication APIs

**Location**: `lib/mock-data/users.ts`

```typescript
// Mock users with different roles
export const mockUsers = {
  admin: User,    // Admin account
  teacher: Teacher, // Teacher with subjects
  student: Student  // Student with batches
}

// Mock login function (1s delay)
export async function mockLogin(email: string, password: string)

// Mock token generation
export function generateMockToken(userId: string)
```

**Features:**
- Returns user object with role-specific data
- Simulates 1000ms API delay
- Generates JWT-like token
- Role-based response (admin/teacher/student)

### Batch APIs

**Location**: `lib/mock-data/batches.ts`

```typescript
// Mock batch data
export const mockBatches = Batch[] // 4 sample batches

// Functions to add:
- getBatchById(id: string)
- createBatch(data: BatchFormData)
- updateBatch(id: string, data: BatchFormData)
- deleteBatch(id: string)
- addStudentToBatch(batchId: string, studentId: string)
```

**Mock Batches:**
1. Advanced Mathematics - Batch A (25/30 students, 87%)
2. Physics - Mechanics (30/30, 82%)
3. Chemistry - Organic (20/25, 91%)
4. Biology - NEET Prep (18/20, 85%)

### Future Mock APIs (To Implement)

```typescript
// Content APIs
- uploadContent(file: File, metadata: ContentMetadata)
- getContentBySubject(subjectId: string)
- deleteContent(contentId: string)

// Class APIs
- scheduleClass(classData: ClassFormData)
- markAttendance(classId: string, attendance: Attendance[])
- cancelClass(classId: string)

// Assessment APIs
- createQuiz(quizData: QuizFormData)
- submitAssignment(assignmentId: string, file: File)
- gradeSubmission(submissionId: string, grade: Grade)
```

### Mock API Delay Utility

```typescript
// Used throughout app for consistent delays
export async function mockApiDelay(ms: number = 1500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

---

## 🎨 Design System

### Tailwind v4 Configuration

**Important**: This project uses **Tailwind CSS v4** which has a different configuration approach than v3.

**Configuration Location**: `app/globals.css`

```css
/* Tailwind v4 uses CSS-first configuration */
@import "tailwindcss";

@theme inline {
  /* Direct HSL values (NOT var() references) */
  --color-primary: 217 91% 35%;
  --color-secondary: 174 72% 35%;
  /* ... */
}
```

**Key Difference from v3:**
- ❌ No `tailwind.config.js` file
- ✅ All config in CSS via `@theme` directive
- ✅ Use direct color values, not CSS variable references
- ✅ PostCSS plugin: `@tailwindcss/postcss`

### Component Variants

**Button Variants:**
- `default` - Primary blue with shadow
- `secondary` - Teal with shadow
- `outline` - Border only
- `ghost` - Transparent
- `destructive` - Red
- `link` - Text link

**Badge Variants:**
- `default` - Blue background
- `secondary` - Teal background
- `destructive` - Red background
- `outline` - Border only

### Custom Components

**Stat Card**: `components/dashboard/stat-card.tsx`
```typescript
<StatCard
  title="Total Users"
  value="2,543"
  description="1,245 students, 45 teachers"
  icon={Users}
  trend={{ value: 12, isPositive: true }}
  iconColor="text-primary"
/>
```

**Features:**
- Colored left border
- Icon with circular background
- Colored value text
- Optional trend indicator
- Hover shadow effect

---

## ⚠️ Common Issues & Solutions

### 1. **npm install Fails** (Peer Dependency Conflicts)

**Issue**: React 19 has peer dependency conflicts with some packages

**Solution:**
```bash
npm install --legacy-peer-deps
```

Always use `--legacy-peer-deps` flag when installing packages.

---

### 2. **CSS Lint Warnings** (Tailwind v4)

**Issue**: VS Code shows warnings for `@import`, `@theme`, `@custom-variant`

**Solution**: Already configured in `.vscode/settings.json`
```json
{
  "css.lint.unknownAtRules": "ignore"
}
```

These are valid Tailwind v4 syntax.

---

### 3. **Colors Not Showing** (Tailwind Build Issue)

**Issue**: Components appear gray/white instead of blue/teal

**Root Cause**: `@theme` block using `var()` references instead of direct values

**Solution**: Colors in `@theme inline` must be **direct HSL values**:
```css
/* ❌ Wrong */
--color-primary: var(--primary);

/* ✅ Correct */
--color-primary: 217 91% 35%;
```

---

### 4. **Hydration Mismatch** (Browser Extensions)

**Issue**: Console error about `cz-shortcut-listen="true"`

**Solution**: Already fixed in `app/layout.tsx`
```tsx
<body suppressHydrationWarning>
```

Safe to ignore - caused by browser extensions.

---

### 5. **Route 404 Errors**

**Issue**: `/auth/login` returns 404

**Cause**: Route groups `(auth)` don't appear in URL

**Solution**: Use correct URLs:
- ❌ `/auth/login`
- ✅ `/login`
- ❌ `/auth/register/student`
- ✅ `/register/student`

---

### 6. **Module Not Found** (Path Aliases)

**Issue**: Import from `@/components` fails

**Solution**: Check `tsconfig.json` has path mappings:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### 7. **Development Server Not Hot Reloading**

**Solution:**
```bash
# Stop server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

---

## 💡 Enhancement Opportunities

### High Priority

1. **Backend Integration**
   - Replace mock APIs with real backend
   - Implement JWT authentication
   - Setup database (PostgreSQL/MongoDB)
   - API rate limiting

2. **Content Management**
   - File upload to cloud storage (S3/Cloudinary)
   - PDF viewer integration
   - Video streaming
   - Content versioning

3. **Real-time Features**
   - WebSocket for live classes
   - Real-time notifications
   - Chat functionality
   - Live attendance

### Medium Priority

4. **Enhanced Analytics**
   - Charts using Recharts
   - Student progress tracking
   - Teacher performance metrics
   - Export to PDF/Excel

5. **Communication**
   - Rich text editor for announcements
   - Email notifications
   - SMS integration
   - Push notifications

6. **Mobile App**
   - React Native app
   - Shared codebase with Next.js
   - Offline mode

### Low Priority

7. **Payment Integration**
   - Stripe/Razorpay
   - Invoice generation
   - Subscription management

8. **Advanced Features**
   - AI-powered recommendations
   - Automated grading
   - Plagiarism detection
   - Certificate generation

---

## 🤝 Contributing Guidelines

### Code Style

**TypeScript:**
- Use `interface` for object shapes
- Use `type` for unions/intersections
- Always type function parameters and returns

**React:**
- Functional components only
- Use hooks (`useState`, `useEffect`, etc.)
- Client components: Add `'use client'` directive
- Server components: Default (no directive needed)

**Naming Conventions:**
- Components: PascalCase (`UserCard.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_STUDENTS`)
- CSS classes: kebab-case via Tailwind utilities

### Component Structure

```tsx
'use client' // If needed

import statements
// External packages first
// Internal imports after

// Type definitions
interface ComponentProps {
  // ...
}

// Component
export default function Component({ props }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState()
  
  // 2. Effects
  useEffect(() => {
    // ...
  }, [])
  
  // 3. Handlers
  const handleClick = () => {
    // ...
  }
  
  // 4. Render
  return (
    // JSX
  )
}
```

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: description of changes"

# 3. Push to GitHub
git push origin feature/your-feature-name

# 4. Create Pull Request
```

**Commit Convention:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting, missing semicolons
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Testing (To Be Added)

```bash
# Unit tests (coming soon)
npm run test

# E2E tests (coming soon)
npm run test:e2e
```

---

## 📚 Additional Resources

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### Project Links
- **Repository**: https://github.com/saubhagyaashish/hiteacher-web
- **Issues**: Report bugs/features on GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

---

## � Quick Reference Cheat Sheet

### Essential Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Installation
npm install --legacy-peer-deps    # Always use this flag

# Git
git checkout -b feature/name      # New feature branch
git add . && git commit -m "feat: message"
git push origin feature/name
```

### Demo Credentials

```
Admin:    admin@hiteacher.com     (password: any 6+ chars)
Teacher:  teacher@example.com     (password: any 6+ chars)
Student:  student@example.com     (password: any 6+ chars)
```

### Important Paths

```
Components:    @/components/ui/
Layouts:       @/components/layouts/
Dashboards:    app/{role}/dashboard/
Auth Pages:    app/(auth)/
Mock Data:     lib/mock-data/
Types:         types/
Stores:        store/
Validations:   lib/validations/
```

### color Reference

```css
Primary:    hsl(217, 91%, 35%)  /* Deep blue */
Secondary:  hsl(174, 72%, 35%)  /* Teal */
Accent:     hsl(174, 60%, 51%)  /* Light teal */
```

### Route Structure

```
/login                    → Login page
/register/student         → Student registration
/register/teacher         → Teacher registration (2-step)
/admin/dashboard          → Admin portal
/teacher/dashboard        → Teacher portal
/teacher/batches          → Batch list
/teacher/batches/new      → Create batch
/teacher/batches/[id]     → Batch details (dynamic)
/teacher/students         → Student list
/student/dashboard        → Student portal
```

---

## 💻 Code Examples & Recipes

### How to Create a New Page

**1. Create the file:**
```bash
# Example: Creating a teacher analytics page
touch app/teacher/analytics/page.tsx
```

**2. Add the component:**
```tsx
'use client'

import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default function AnalyticsPage() {
  return (
    <DashboardLayout 
      role="teacher" 
      title="Analytics" 
      subtitle="Performance insights"
    >
      <div>
        {/* Your content here */}
      </div>
    </DashboardLayout>
  )
}
```

**3. Add to sidebar navigation:**
Edit `components/layouts/dashboard-sidebar.tsx`:
```tsx
const teacherNavItems: NavItem[] = [
  // ... existing items
  { 
    title: 'Analytics', 
    href: '/teacher/analytics', 
    icon: TrendingUp 
  },
]
```

---

### How to Add a Form with Validation

**1. Create Zod schema:**
```tsx
// lib/validations/course.ts
import { z } from 'zod'

export const courseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
})

export type CourseFormData = z.infer<typeof courseSchema>
```

**2. Use in component:**
```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, type CourseFormData } from '@/lib/validations/course'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function CreateCourse() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema)
  })

  const onSubmit = async (data: CourseFormData) => {
    console.log(data)
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Course Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      
      <Button type="submit">Create Course</Button>
    </form>
  )
}
```

---

### How to Create a Dashboard Widget

**1. Create widget component:**
```tsx
// components/dashboard/recent-activity.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Activity {
  title: string
  user: string
  time: string
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.user} • {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

**2. Use in dashboard:**
```tsx
import { RecentActivity } from '@/components/dashboard/recent-activity'

const activities = [
  { title: 'New enrollment', user: 'John Doe', time: '5 mins ago' },
  // ...
]

<RecentActivity activities={activities} />
```

---

### How to Add a Mock API Endpoint

**1. Define types:**
```tsx
// types/course.ts
export interface Course {
  id: number
  name: string
  subject: string
  teacherId: string
  students: number
}
```

**2. Create mock data:**
```tsx
// lib/mock-data/courses.ts
import { Course } from '@/types/course'

export const mockCourses: Course[] = [
  {
    id: 1,
    name: 'Advanced Calculus',
    subject: 'Mathematics',
    teacherId: '1',
    students: 30
  },
  // ...
]

export async function getCourses(): Promise<Course[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return mockCourses
}

export async function createCourse(data: Omit<Course, 'id'>): Promise<Course> {
  await new Promise(resolve => setTimeout(resolve, 1500))
  const newCourse = { ...data, id: Date.now() }
  mockCourses.push(newCourse)
  return newCourse
}
```

**3. Use in component:**
```tsx
'use client'

import { useState, useEffect } from 'react'
import { getCourses } from '@/lib/mock-data/courses'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  
  return <div>{/* Render courses */}</div>
}
```

---

## 🔧 VS Code Recommended Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "yoavbls.pretty-ts-errors",
    "steoates.autoimport",
    "eamodio.gitlens",
    "usernamehw.errorlens",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Extension Benefits

- **ESLint**: Code quality and error detection
- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes
- **Pretty TypeScript Errors**: Readable TS errors
- **Auto Import**: Automatic import statements
- **GitLens**: Git blame and history
- **Error Lens**: Inline error messages
- **Path Intellisense**: File path autocomplete
- **Auto Rename Tag**: Sync HTML/JSX tag renaming

---

## 🐛 Debugging Guide

### React DevTools Setup

**1. Install Extension:**
- [React DevTools (Chrome)](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [React DevTools (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

**2. Usage:**
- Open DevTools → "Components" tab
- Inspect component tree
- View props, state, hooks
- Edit values in real-time

### Next.js Debugging

**VS Code Launch Configuration:**

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Common Console Errors

**1. "Hydration failed"**
```
Solution: Add suppressHydrationWarning to <body> tag
Already fixed in app/layout.tsx
```

**2. "Module not found: Can't resolve '@/...'"**
```tsx
Solution: Check tsconfig.json has path mappings
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
```

**3. "className did not match"**
```
Cause: Client/server mismatch (usually browser extensions)
Solution: Check for dynamic class generation, use suppressHydrationWarning
```

### Network Debugging

**Check Mock API Calls:**

Add console logs to mock functions:
```tsx
export async function mockLogin(email: string, password: string) {
  console.log('🔐 Mock Login called:', { email })
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('✅ Mock Login success')
  return user
}
```

---

## 🚀 Deployment Guide

### Deploy to Vercel (Recommended)

**Method 1: GitHub Integration (Easiest)**

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Done! Auto-deploys on every push

**Method 2: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables (For Future Backend)

In Vercel dashboard or via CLI:

```bash
# .env.local (local development)
NEXT_PUBLIC_API_URL=https://api.hiteacher.com
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key

# Never commit .env.local to Git!
```

Add to `.gitignore`:
```
.env*.local
```

---

### Deploy to Netlify

**1. Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

**2. Build for static export:**

Update `next.config.ts`:
```ts
const config = {
  output: 'export', // Static export
  images: {
    unoptimized: true // Required for static export
  }
}
```

**3. Build and deploy:**
```bash
npm run build
netlify deploy --prod
```

---

### Deploy to Custom Server

**1. Build the app:**
```bash
npm run build
```

**2. Start production server:**
```bash
npm run start
# Server runs on port 3000
```

**3. Use PM2 for process management:**
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "hiteacher" -- start

# Auto-restart on file changes
pm2 restart hiteacher

# View logs
pm2 logs hiteacher

# Stop
pm2 stop hiteacher
```

**4. Nginx reverse proxy:**
```nginx
server {
  listen 80;
  server_name yourdomain.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

---

## 🏛️ Architecture Decision Records (ADR)

### Why Next.js App Router?

**Decision**: Use Next.js 16 with App Router instead of Pages Router

**Rationale:**
- ✅ **Server Components**: Better performance, smaller JS bundles
- ✅ **Nested Layouts**: Shared UI without re-rendering
- ✅ **Streaming**: Progressive page rendering
- ✅ **Better SEO**: Improved meta tags, Open Graph support
- ✅ **Future-proof**: App Router is the future of Next.js

**Trade-offs:**
- ❌ Steeper learning curve
- ❌ Some packages not yet compatible
- ✅ Worth it for long-term benefits

---

### Why Zustand over Redux/Context?

**Decision**: Use Zustand for state management

**Rationale:**
- ✅ **Minimal boilerplate**: 10x less code than Redux
- ✅ **Simple API**: Easy to learn and use
- ✅ **No providers**: Use hooks directly
- ✅ **Great TypeScript support**: Fully typed
- ✅ **Persistence**: Built-in localStorage sync
- ✅ **Small bundle**: 1KB vs Redux's 9KB

**Example comparison:**

```tsx
// Redux (complex)
const mapStateToProps = (state) => ({ user: state.user })
connect(mapStateToProps)(Component)

// Zustand (simple)
const user = useAuthStore((state) => state.user)
```

---

### Why Tailwind v4 CSS-First?

**Decision**: Use Tailwind CSS v4 with CSS-first configuration

**Rationale:**
- ✅ **Faster builds**: Native CSS parsing
- ✅ **Better IDE support**: Full CSS autocomplete
- ✅ **More flexible**: Direct CSS integration
- ✅ **Simplified config**: No JS config file needed
- ✅ **Better dark mode**: Native CSS color schemes

**Migration note**: Requires `@theme` in CSS instead of `tailwind.config.js`

---

### Why shadcn/ui over Material-UI?

**Decision**: Use shadcn/ui component library

**Rationale:**
- ✅ **Copy-paste, not npm**: Full control over components
- ✅ **Customizable**: Modify source directly
- ✅ **Tailwind-based**: Consistent styling
- ✅ **Accessible**: Built on Radix UI primitives
- ✅ **Modern design**: Clean, professional look
- ✅ **No bundle bloat**: Only include what you use

**vs Material-UI:**
- MUI: 300KB+ bundle size
- shadcn/ui: ~20KB (only what you copy)

---

### Why React Hook Form over Formik?

**Decision**: Use React Hook Form for forms

**Rationale:**
- ✅ **Better performance**: Fewer re-renders
- ✅ **Smaller bundle**: 9KB vs Formik's 15KB
- ✅ **Better DX**: Cleaner API
- ✅ **TypeScript-first**: Excellent TS support
- ✅ **Zod integration**: Perfect with validation

---

## ⚡ Performance Best Practices

### Image Optimization

**Use Next.js Image component:**

```tsx
import Image from 'next/image'

// ❌ Don't use regular <img>
<img src="/avatar.jpg" />

// ✅ Use Next.js Image
<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={100}
  height={100}
  priority={false} // Set true for above-fold images
/>
```

**Benefits:**
- Automatic lazy loading
- Responsive images
- WebP/AVIF format support
- Blur placeholder

---

### Code Splitting & Lazy Loading

**Dynamic imports for heavy components:**

```tsx
import dynamic from 'next/dynamic'

// ❌ Don't import heavy components directly
import RichTextEditor from '@/components/rich-text-editor'

// ✅ Use dynamic import
const RichTextEditor = dynamic(
  () => import('@/components/rich-text-editor'),
  { 
    loading: () => <p>Loading editor...</p>,
    ssr: false // Disable server-side rendering if needed
  }
)
```

**Route-based splitting:**
Next.js automatically splits code by route. No action needed!

---

### Minimize Client-Side JavaScript

**Use Server Components by default:**

```tsx
// ❌ Unnecessary 'use client'
'use client'
export default function StaticContent() {
  return <div>Static content</div>
}

// ✅ Server Component (default)
export default function StaticContent() {
  return <div>Static content</div>
}

// ✅ Only use 'use client' when needed
'use client'
export default function InteractiveForm() {
  const [value, setValue] = useState('')
  return <input value={value} onChange={e => setValue(e.target.value)} />
}
```

---

### Optimize Fonts

**Already configured in `app/layout.tsx`:**

```tsx
import { GeistSans } from 'geist/font/sans'

// ✅ Font optimization built-in
<html className={GeistSans.variable}>
```

**Benefits:**
- Self-hosted fonts (no external requests)
- Font subsetting (smaller file size)
- Font display swap (no layout shift)

---

### Database Query Optimization (Future)

**When adding real backend:**

```tsx
// ❌ N+1 queries
const batches = await getBatches()
for (const batch of batches) {
  batch.students = await getStudents(batch.id) // N queries!
}

// ✅ Use joins or eager loading
const batches = await getBatchesWithStudents() // 1 query
```

---

### Caching Strategies

**Server-side caching (when adding backend):**

```tsx
// Static data (revalidate every hour)
export const revalidate = 3600

async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }
  })
  return res.json()
}
```

**Client-side caching with SWR (future):**

```tsx
import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetcher)
  
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  return <div>Hello {data.name}!</div>
}
```

---

### Bundle Analysis

**Analyze bundle size:**

```bash
# Install analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({})

# Run analysis
ANALYZE=true npm run build
```

**Opens interactive treemap showing bundle sizes**

---

### Performance Monitoring

**Add to `app/layout.tsx` (future):**

```tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
```

---

## �📞 Support

For questions or issues:
1. Check this documentation first
2. Search existing GitHub Issues
3. Create new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

---

## 📚 Related Documentation

- **README.md** - Project overview and quick start
- **DEVELOPER.md** (this file) - Comprehensive developer guide
- **task.md** - Development task checklist
- **walkthrough.md** - Phase completion reports

---

**Last Updated**: December 2, 2025  
**Contributors**: 1  
**License**: MIT (TBD)  
**Total Phases**: 5 Complete, 9 Pending  
**Total Files Created**: 40+

---

*Built with ❤️ using Next.js, TypeScript, and Tailwind CSS*

*Happy Coding! 🚀*
