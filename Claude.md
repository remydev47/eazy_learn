# CLAUDE.md — Ezay Tech LMS MVP (Custom Dashboards)
> Next.js Custom Dashboards + Moodle Backend

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Dashboard Breakdown](#4-dashboard-breakdown)
5. [Moodle API Integration](#5-moodle-api-integration)
6. [Project Structure](#6-project-structure)
7. [Implementation Guide](#7-implementation-guide)
8. [Database Strategy](#8-database-strategy)
9. [Authentication Flow](#9-authentication-flow)
10. [Deployment](#10-deployment)
11. [Development Timeline](#11-development-timeline)
12. [Cost Breakdown](#12-cost-breakdown)

---

## 1. Project Overview

### What We're Building

**3 Custom Dashboard Types** (in Next.js):
1. **Student Dashboard** — Course progress, deadlines, achievements
2. **Instructor Dashboard** — Teaching analytics, earnings, course management
3. **Admin Console** — Platform metrics, user management, approvals

**Plus**:
- Marketing landing page
- Course catalog
- Authentication system

**Backend**: Moodle (headless) provides ALL data via API

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  PUBLIC WEBSITE (Next.js)                    │
│                 https://ezaytech.com                         │
│                                                              │
│  • Homepage                                                  │
│  • About                                                     │
│  • Courses Catalog                                          │
│  • Contact                                                   │
│  • Login/Signup (redirects to Next.js auth)                 │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ After Login → Route by Role
                       ↓
┌─────────────────────────────────────────────────────────────┐
│           CUSTOM DASHBOARDS (Next.js Protected Routes)       │
│                                                              │
│  /dashboard/student    → Student Dashboard                  │
│  /dashboard/instructor → Instructor Dashboard               │
│  /dashboard/admin      → Admin Console                      │
│                                                              │
│  Data Source: Moodle API                                    │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ API Calls
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              MOODLE LMS (Backend/Headless)                   │
│              https://lms.ezaytech.com                        │
│                                                              │
│  Students/Instructors visit ONLY for:                       │
│  • Watching course videos (iframe or redirect)              │
│  • Taking quizzes                                           │
│  • Submitting assignments                                   │
│  • Forum discussions                                        │
│                                                              │
│  REST API provides all dashboard data                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

### Frontend (All Dashboards)

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling (matches your designs) |
| **shadcn/ui** | Pre-built components |
| **Recharts** | Charts (revenue, engagement graphs) |
| **NextAuth.js** | Authentication |
| **React Hook Form** | Forms |
| **Zod** | Validation |

### Backend

| Technology | Purpose |
|------------|---------|
| **Moodle 4.3 LTS** | LMS backend (headless) |
| **PostgreSQL** | Database (comes with Moodle) |
| **Moodle Web Services** | REST API for dashboards |

### Hosting

| Component | Service | Cost |
|-----------|---------|------|
| Next.js dashboards | **Vercel Free Tier** | $0/month |
| Moodle backend | **DigitalOcean Droplet 2GB** | $12/month |
| Domain | Namecheap | $12/year |

**Total: $13/month**

---

## 4. Dashboard Breakdown

### Student Dashboard (`/dashboard/student`)

Based on your design, here's what we need to fetch from Moodle:

#### Top Stats Cards
```typescript
interface StudentStats {
  coursesEnrolled: number        // Count of enrolled courses
  coursesCompleted: number       // Courses with 100% progress
  hoursLearned: number          // Sum of video watch time
  averageGrade: number          // Avg across all courses
  upcomingDeadlines: number     // Assignments due in 7 days
}
```

**Moodle APIs Used**:
- `core_enrol_get_users_courses` — Get enrolled courses
- `core_completion_get_activities_completion_status` — Progress per course
- `mod_assign_get_assignments` — Upcoming assignments
- `gradereport_user_get_grade_items` — Grades

#### Course Cards with Progress
```typescript
interface CourseCard {
  id: number
  title: string
  thumbnail: string
  progress: number              // 0-100
  instructor: string
  nextLesson: string
  timeRemaining: string         // "2h 30m remaining"
  category: string
}
```

**Moodle APIs**:
- `core_course_get_courses_by_field`
- `core_completion_get_activities_completion_status`

#### Recent Activity Feed
```typescript
interface ActivityItem {
  type: 'grade_received' | 'course_completed' | 'new_assignment' | 'forum_post'
  courseName: string
  description: string
  timestamp: Date
  icon: string
}
```

**Moodle APIs**:
- `core_calendar_get_calendar_events`
- `gradereport_user_get_grade_items`

#### Upcoming Deadlines Widget
```typescript
interface Deadline {
  assignmentName: string
  courseName: string
  dueDate: Date
  status: 'not_started' | 'in_progress' | 'submitted'
  priority: 'high' | 'medium' | 'low'  // Based on days remaining
}
```

---

### Instructor Dashboard (`/dashboard/instructor`)

#### Top Stats Cards
```typescript
interface InstructorStats {
  totalStudents: number          // Across all courses
  averageRating: number          // Avg course rating
  monthlyEarnings: number        // Revenue this month
  totalRevenue: number           // All-time
  activeCourses: number          // Published courses
}
```

**Moodle APIs**:
- `core_enrol_get_enrolled_users` — Count students per course
- `core_rating_get_item_ratings` — Course ratings
- Custom table for revenue tracking (see Database section)

#### Student Engagement Chart
```typescript
interface EngagementData {
  date: string
  videoWatchTime: number        // Minutes watched
  quizAttempts: number
  forumPosts: number
}
```

**Moodle APIs**:
- `report_log_get_entries` — Activity logs
- `mod_quiz_get_quiz_access_information`

#### Your Courses Table
```typescript
interface InstructorCourse {
  id: number
  title: string
  thumbnail: string
  enrolled: number              // Student count
  completionRate: number        // % who completed
  averageGrade: number
  revenue: number
  status: 'draft' | 'published' | 'archived'
}
```

#### Recent Activity Feed
- New student enrollments
- New 5-star reviews
- New questions in course forums
- Assignment submissions to grade

---

### Admin Console (`/dashboard/admin`)

#### Platform Revenue Card
```typescript
interface PlatformRevenue {
  total: number
  weeklyRevenue: number[]       // Last 7 days for chart
  monthlyRevenue: number[]      // Last 12 months for chart
  growthPercentage: number      // vs last period
}
```

**Data Source**: Custom PostgreSQL table (tracked via payment webhooks)

#### Active Users Card
```typescript
interface ActiveUsers {
  total: number
  newToday: number
  activeThisWeek: number
  growthRate: number
}
```

**Moodle APIs**:
- `core_user_get_users`
- Filter by `lastaccess` timestamp

#### New Signups Widget
```typescript
interface NewSignups {
  count: number                 // Last 24 hours
  trend: 'up' | 'down' | 'stable'
  recentUsers: User[]
}
```

#### Pending Approvals
```typescript
interface PendingApproval {
  id: number
  type: 'course' | 'instructor_application'
  title: string
  submittedBy: string
  submittedAt: Date
  thumbnail?: string
}
```

**Data Source**: Custom workflow (Moodle courses with `visible=0` awaiting approval)

#### User Management Table
```typescript
interface UserRow {
  id: number
  name: string
  email: string
  role: 'student' | 'instructor' | 'admin'
  joinedDate: Date
  status: 'active' | 'banned' | 'pending'
  totalSpent?: number           // For students
  totalEarned?: number          // For instructors
}
```

**Moodle APIs**:
- `core_user_get_users`
- `core_role_assign_roles`
- `core_user_update_users`

---

## 5. Moodle API Integration

### Setup Moodle Web Services

1. **Enable Web Services**
   - Site Admin → Advanced Features → ✓ Enable web services

2. **Create External Service**
   - Site Admin → Server → Web Services → External Services → Add
   - Name: "Dashboard API"
   - Enabled: Yes

3. **Add Required Functions**
   ```
   core_enrol_get_users_courses
   core_completion_get_activities_completion_status
   core_course_get_courses_by_field
   mod_assign_get_assignments
   gradereport_user_get_grade_items
   core_enrol_get_enrolled_users
   core_user_get_users
   core_role_assign_roles
   report_log_get_entries
   core_calendar_get_calendar_events
   ```

4. **Generate Token**
   - Site Admin → Server → Web Services → Manage Tokens → Add
   - User: Admin (or service account)
   - Service: Dashboard API
   - Copy token → `.env.local` in Next.js

### API Client Library

```typescript
// lib/moodle/client.ts

const MOODLE_URL = process.env.MOODLE_URL!
const MOODLE_TOKEN = process.env.MOODLE_TOKEN!

async function callMoodleAPI(
  wsfunction: string,
  params: Record<string, any> = {}
) {
  const url = new URL(`${MOODLE_URL}/webservice/rest/server.php`)
  
  url.searchParams.append('wstoken', MOODLE_TOKEN)
  url.searchParams.append('wsfunction', wsfunction)
  url.searchParams.append('moodlewsrestformat', 'json')
  
  // Add other params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value))
  })
  
  const response = await fetch(url.toString())
  
  if (!response.ok) {
    throw new Error(`Moodle API error: ${response.statusText}`)
  }
  
  const data = await response.json()
  
  // Moodle returns errors as objects with "exception" key
  if (data.exception) {
    throw new Error(data.message || 'Moodle API error')
  }
  
  return data
}

export const moodleAPI = {
  // Student APIs
  async getEnrolledCourses(userId: number) {
    return callMoodleAPI('core_enrol_get_users_courses', { userid: userId })
  },
  
  async getCourseProgress(userId: number, courseId: number) {
    return callMoodleAPI('core_completion_get_activities_completion_status', {
      userid: userId,
      courseid: courseId,
    })
  },
  
  async getUpcomingAssignments(userId: number) {
    return callMoodleAPI('mod_assign_get_assignments')
    // Filter client-side for user's courses and upcoming deadlines
  },
  
  async getUserGrades(userId: number, courseId?: number) {
    return callMoodleAPI('gradereport_user_get_grade_items', {
      userid: userId,
      ...(courseId && { courseid: courseId })
    })
  },
  
  // Instructor APIs
  async getEnrolledStudents(courseId: number) {
    return callMoodleAPI('core_enrol_get_enrolled_users', {
      courseid: courseId,
    })
  },
  
  async getActivityLogs(courseId: number) {
    return callMoodleAPI('report_log_get_entries', {
      courseid: courseId,
    })
  },
  
  // Admin APIs
  async getAllUsers(limit = 1000) {
    return callMoodleAPI('core_user_get_users', {
      criteria: [{ key: 'deleted', value: '0' }]
    })
  },
  
  async updateUserRole(userId: number, roleId: number, contextId: number) {
    return callMoodleAPI('core_role_assign_roles', {
      assignments: [{
        roleid: roleId,
        userid: userId,
        contextid: contextId,
      }]
    })
  },
}
```

### Example: Student Dashboard Data Fetching

```typescript
// app/dashboard/student/page.tsx

import { moodleAPI } from '@/lib/moodle/client'
import { getServerSession } from 'next-auth'
import { StudentDashboard } from '@/components/dashboards/StudentDashboard'

export default async function StudentDashboardPage() {
  const session = await getServerSession()
  const userId = session.user.moodleId
  
  // Fetch all required data
  const [courses, assignments, grades] = await Promise.all([
    moodleAPI.getEnrolledCourses(userId),
    moodleAPI.getUpcomingAssignments(userId),
    moodleAPI.getUserGrades(userId),
  ])
  
  // Fetch progress for each course
  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      const progress = await moodleAPI.getCourseProgress(userId, course.id)
      
      // Calculate completion percentage
      const total = progress.statuses.length
      const completed = progress.statuses.filter(s => s.state === 1).length
      const percentage = Math.round((completed / total) * 100)
      
      return {
        ...course,
        progress: percentage,
      }
    })
  )
  
  // Calculate stats
  const stats = {
    coursesEnrolled: courses.length,
    coursesCompleted: coursesWithProgress.filter(c => c.progress === 100).length,
    hoursLearned: calculateTotalHours(courses), // Custom function
    averageGrade: calculateAvgGrade(grades),
    upcomingDeadlines: assignments.filter(isUpcoming).length,
  }
  
  return (
    <StudentDashboard 
      stats={stats}
      courses={coursesWithProgress}
      assignments={assignments}
      grades={grades}
    />
  )
}
```

---

## 6. Project Structure

```
ezay-tech-lms/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Landing page
│   │   ├── about/page.tsx
│   │   ├── courses/page.tsx
│   │   └── contact/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   ├── student/
│   │   │   └── page.tsx                # Student Dashboard
│   │   ├── instructor/
│   │   │   ├── page.tsx                # Instructor Dashboard
│   │   │   ├── courses/page.tsx        # Manage courses
│   │   │   └── analytics/page.tsx      # Detailed analytics
│   │   └── admin/
│   │       ├── page.tsx                # Admin Console
│   │       ├── users/page.tsx          # User management
│   │       └── approvals/page.tsx      # Course approvals
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts # NextAuth config
│   │   ├── contact/route.ts
│   │   └── moodle/
│   │       └── [...proxy]/route.ts     # Proxy to Moodle API
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── dashboards/
│   │   ├── StudentDashboard.tsx
│   │   ├── InstructorDashboard.tsx
│   │   └── AdminConsole.tsx
│   ├── cards/
│   │   ├── StatCard.tsx
│   │   ├── CourseCard.tsx
│   │   └── RevenueCard.tsx
│   ├── charts/
│   │   ├── RevenueChart.tsx            # Using Recharts
│   │   ├── EngagementChart.tsx
│   │   └── ProgressChart.tsx
│   ├── tables/
│   │   ├── UserTable.tsx
│   │   └── CourseTable.tsx
│   └── layout/
│       ├── DashboardNav.tsx
│       └── DashboardSidebar.tsx
├── lib/
│   ├── moodle/
│   │   ├── client.ts                   # Moodle API client
│   │   ├── types.ts                    # TypeScript types
│   │   └── utils.ts                    # Helper functions
│   ├── auth.ts                         # NextAuth config
│   └── db.ts                           # Custom DB (if needed)
├── hooks/
│   ├── useCourses.ts
│   ├── useAnalytics.ts
│   └── useRevenue.ts
└── .env.local
```

---

## 7. Implementation Guide

### Phase 1: Setup (Week 1)

#### Day 1-2: Infrastructure
```bash
# 1. Create Next.js project
npx create-next-app@latest ezay-tech-lms --typescript --tailwind --app

cd ezay-tech-lms

# 2. Install dependencies
npm install next-auth @auth/prisma-adapter
npm install recharts lucide-react date-fns
npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog
npm install zod react-hook-form @hookform/resolvers
```

#### Day 3: Setup Moodle
```bash
# On DigitalOcean
# 1. Create droplet with Bitnami Moodle Stack
# 2. SSH in and configure domain
# 3. Enable web services
# 4. Generate API token
# 5. Add to Next.js .env.local
```

#### Day 4-5: Authentication
```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { moodleAPI } from './moodle/client'

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Validate against Moodle
        const user = await authenticateWithMoodle(
          credentials.email,
          credentials.password
        )
        
        if (user) {
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.fullname,
            role: getUserRole(user), // 'student' | 'instructor' | 'admin'
            moodleId: user.id,
          }
        }
        
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.moodleId = user.moodleId
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      session.user.moodleId = token.moodleId
      return session
    }
  },
  pages: {
    signIn: '/login',
  }
}

async function authenticateWithMoodle(email: string, password: string) {
  // Use Moodle token login endpoint
  const params = new URLSearchParams({
    username: email,
    password: password,
    service: 'moodle_mobile_app'
  })
  
  const response = await fetch(
    `${process.env.MOODLE_URL}/login/token.php?${params}`
  )
  
  const data = await response.json()
  
  if (data.token) {
    // Fetch user details
    return await moodleAPI.getUserByEmail(email)
  }
  
  return null
}
```

### Phase 2: Student Dashboard (Week 2)

#### Component Structure

```typescript
// components/dashboards/StudentDashboard.tsx

interface StudentDashboardProps {
  stats: StudentStats
  courses: CourseWithProgress[]
  assignments: Assignment[]
  grades: Grade[]
}

export function StudentDashboard({ stats, courses, assignments, grades }: StudentDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Courses Enrolled"
          value={stats.coursesEnrolled}
          icon="BookOpen"
          trend="+2 this month"
        />
        <StatCard
          label="Completed"
          value={stats.coursesCompleted}
          icon="CheckCircle"
          color="green"
        />
        <StatCard
          label="Hours Learned"
          value={`${stats.hoursLearned}h`}
          icon="Clock"
        />
        <StatCard
          label="Avg Grade"
          value={`${stats.averageGrade}%`}
          icon="TrendingUp"
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {courses
                .filter(c => c.progress > 0 && c.progress < 100)
                .slice(0, 4)
                .map(course => (
                  <CourseCardWithProgress 
                    key={course.id}
                    course={course}
                  />
                ))
              }
            </div>
          </section>

          {/* All Courses */}
          <section>
            <h2 className="text-2xl font-bold mb-4">My Courses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map(course => (
                <CourseCardWithProgress 
                  key={course.id}
                  course={course}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <DeadlinesWidget assignments={assignments} />
          
          {/* Recent Activity */}
          <ActivityFeed grades={grades} />
          
          {/* Achievements */}
          <AchievementsWidget stats={stats} />
        </div>
      </div>
    </div>
  )
}
```

#### Course Card Component (Matching Your Design)

```typescript
// components/cards/CourseCard.tsx

interface CourseCardProps {
  course: {
    id: number
    title: string
    thumbnail: string
    progress: number
    instructor: string
    category: string
  }
}

export function CourseCardWithProgress({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-orange-400 to-red-600">
        {course.thumbnail ? (
          <Image 
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white/50" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
            {course.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          by {course.instructor}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-orange-600">
              {course.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_MOODLE_URL}/course/view.php?id=${course.id}`
          }}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-medium transition"
        >
          {course.progress === 0 ? 'Start Course' : 'Continue Learning'}
        </button>
      </div>
    </div>
  )
}
```

### Phase 3: Instructor Dashboard (Week 3)

```typescript
// components/dashboards/InstructorDashboard.tsx

export function InstructorDashboard({ stats, courses, engagement, activity }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Students"
          value={stats.totalStudents.toLocaleString()}
          icon="Users"
          change="+8.2%"
        />
        <StatCard
          label="Average Rating"
          value={stats.averageRating.toFixed(1)}
          icon="Star"
          maxValue={5}
        />
        <StatCard
          label="Monthly Earnings"
          value={`$${stats.monthlyEarnings.toLocaleString()}`}
          icon="DollarSign"
          color="green"
        />
        <StatCard
          label="Active Courses"
          value={stats.activeCourses}
          icon="BookOpen"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Engagement Chart */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Student Engagement</h2>
              <select className="border rounded-lg px-3 py-1.5 text-sm">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Last Year</option>
              </select>
            </div>
            
            <EngagementChart data={engagement} />
          </section>

          {/* Your Courses Table */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Courses</h2>
              <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                Manage all courses →
              </button>
            </div>
            
            <InstructorCourseTable courses={courses} />
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RecentActivityFeed activity={activity} />
          <EarningsBreakdown stats={stats} />
        </div>
      </div>
    </div>
  )
}
```

### Phase 4: Admin Console (Week 4)

```typescript
// components/dashboards/AdminConsole.tsx

export function AdminConsole({ revenue, users, approvals, signups }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert Banner */}
      {revenue.payoutLatency && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
            <div className="flex-1">
              <p className="font-medium text-red-800">High Payout Latency</p>
              <p className="text-sm text-red-700">
                Withdrawal requests for Stripe Connect are taking longer than average.
              </p>
            </div>
            <button className="bg-red-800 text-white px-4 py-2 rounded-lg text-sm">
              View Logs
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">TOTAL PLATFORM REVENUE</p>
              <h2 className="text-4xl font-bold">
                ${revenue.total.toLocaleString()}
              </h2>
              <p className="text-sm text-green-600 mt-1">
                ↑ +{revenue.growthPercentage}% from last month
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border rounded-lg">
                Weekly
              </button>
              <button className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded-lg">
                Monthly
              </button>
            </div>
          </div>
          
          <RevenueChart data={revenue.monthlyRevenue} />
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-orange-600" />
            <span className="text-sm text-green-600 font-medium">+4k</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">ACTIVE USERS</p>
          <h3 className="text-3xl font-bold">{users.total.toLocaleString()}</h3>
        </div>
      </div>

      {/* New Signups Card */}
      <div className="bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between text-white mb-4">
          <div className="flex items-center gap-3">
            <UserPlus className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-75">NEW SIGNUPS</p>
              <h3 className="text-3xl font-bold">{signups.count.toLocaleString()}</h3>
              <p className="text-xs opacity-75 mt-1">Past 24 hours activity</p>
            </div>
          </div>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            +{signups.trend}
          </span>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Approvals */}
        <PendingApprovalsCard approvals={approvals} />
        
        {/* User Management Table */}
        <UserManagementCard users={users.recent} />
      </div>
    </div>
  )
}
```

---

## 8. Database Strategy

### Moodle's Built-in Tables (Use These)

Moodle already tracks:
- Users (`mdl_user`)
- Courses (`mdl_course`)
- Enrollments (`mdl_user_enrolments`)
- Grades (`mdl_grade_grades`)
- Progress (`mdl_course_modules_completion`)
- Activity logs (`mdl_logstore_standard_log`)

**Don't duplicate this data** — fetch via API.

### Custom Tables (Add to Moodle's PostgreSQL)

For data Moodle doesn't track:

```sql
-- Payment tracking (for revenue dashboards)
CREATE TABLE mdl_custom_payments (
  id SERIAL PRIMARY KEY,
  userid BIGINT REFERENCES mdl_user(id),
  courseid BIGINT REFERENCES mdl_course(id),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(20), -- 'stripe', 'paypal'
  transaction_id VARCHAR(100) UNIQUE,
  status VARCHAR(20), -- 'pending', 'completed', 'refunded'
  instructor_share DECIMAL(10,2), -- For instructor earnings
  platform_fee DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Instructor earnings summary (for quick dashboard access)
CREATE TABLE mdl_instructor_earnings (
  id SERIAL PRIMARY KEY,
  userid BIGINT REFERENCES mdl_user(id),
  month DATE, -- First day of month
  total_revenue DECIMAL(10,2),
  total_students INT,
  courses_sold INT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Platform metrics cache (updated daily)
CREATE TABLE mdl_platform_metrics (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE,
  total_revenue DECIMAL(10,2),
  new_signups INT,
  active_users INT,
  courses_created INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### When Payment Occurs (Webhook)

```typescript
// app/api/webhooks/stripe/route.ts

import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!
  
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    
    // Store payment in custom table
    await storePayment({
      userId: session.metadata.userId,
      courseId: session.metadata.courseId,
      amount: session.amount_total / 100,
      transactionId: session.payment_intent,
      instructorShare: calculateInstructorShare(session.amount_total),
      platformFee: calculatePlatformFee(session.amount_total),
    })
    
    // Enroll user in Moodle via API
    await moodleAPI.enrollUser(
      parseInt(session.metadata.userId),
      parseInt(session.metadata.courseId)
    )
  }
  
  return new Response('OK', { status: 200 })
}
```

---

## 9. Authentication Flow

```
User visits ezaytech.com
    ↓
Clicks "Login"
    ↓
Redirected to /login (Next.js page)
    ↓
Enters credentials
    ↓
NextAuth validates against Moodle API
    ↓
If valid:
├─ Create session
├─ Store user role (student/instructor/admin)
└─ Redirect based on role:
    ├─ Student → /dashboard/student
    ├─ Instructor → /dashboard/instructor
    └─ Admin → /dashboard/admin
```

### Protecting Routes

```typescript
// middleware.ts

import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const path = req.nextUrl.pathname
      
      // Admin routes
      if (path.startsWith('/dashboard/admin')) {
        return token?.role === 'admin'
      }
      
      // Instructor routes
      if (path.startsWith('/dashboard/instructor')) {
        return token?.role === 'instructor' || token?.role === 'admin'
      }
      
      // Student routes
      if (path.startsWith('/dashboard/student')) {
        return token?.role === 'student'
      }
      
      return !!token
    }
  }
})

export const config = {
  matcher: ['/dashboard/:path*']
}
```

---

## 10. Deployment

### Vercel (Next.js Dashboard)

```bash
# 1. Connect GitHub repo to Vercel
# 2. Set environment variables:
MOODLE_URL=https://lms.ezaytech.com
MOODLE_TOKEN=your_moodle_token
NEXTAUTH_SECRET=generate_random_string
NEXTAUTH_URL=https://ezaytech.com
DATABASE_URL=postgresql://... (if using custom DB)

# 3. Deploy
vercel --prod
```

### DigitalOcean (Moodle)

Already covered in previous docs — use Bitnami Moodle Stack.

---

## 11. Development Timeline

### 6-Week Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| **Week 1** | Setup + Auth | Next.js project, Moodle installed, NextAuth working |
| **Week 2** | Student Dashboard | Complete student dashboard with all widgets |
| **Week 3** | Instructor Dashboard | Instructor dashboard + course management |
| **Week 4** | Admin Console | Admin dashboard + user management |
| **Week 5** | Polish + Integrate | Connect all pieces, mobile responsive, testing |
| **Week 6** | Content + Launch | Create 3 sample courses, deploy, go live |

**Total: 6 weeks solo development**

---

## 12. Cost Breakdown

### Monthly Costs

| Item | Cost |
|------|------|
| Vercel (Next.js dashboards) | $0 |
| DigitalOcean (Moodle) | $12 |
| Domain (amortized) | $1 |
| **Total** | **$13/month** |

### One-Time Costs

| Item | Cost |
|------|------|
| Domain (1 year) | $12 |
| **Total** | **$12** |

**First Year Total: $168**

---

## Quick Start

```bash
# 1. Clone starter repo (I can create this for you)
git clone https://github.com/ezaytech/lms-dashboard.git
cd lms-dashboard

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Fill in Moodle URL and token

# 4. Run dev server
npm run dev

# 5. Start building dashboards!
```

---

This is your complete blueprint. You now have:

1. ✅ Beautiful custom dashboards (matching your designs)
2. ✅ Moodle backend (all LMS features built-in)
3. ✅ Clear API integration strategy
4. ✅ 6-week timeline
5. ✅ $13/month budget

Ready to start building?