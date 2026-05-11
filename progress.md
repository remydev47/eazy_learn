# EazyTech LMS — Progress Tracker
> Last updated: 2026-05-07  
> Architecture: Next.js custom dashboards + Moodle (headless backend)

---

## Architecture Overview

```
Public Website (Next.js)          →  After login, route by role
                                   ↓
/dashboard/student                 Student Dashboard
/dashboard/instructor              Instructor Dashboard
/dashboard/admin                   Admin Console
                                   ↓
                           Moodle REST API (data source)
                           https://lms.ezaytech.com
```

---

## Overall Status

| Layer | Status |
|---|---|
| Marketing website (public pages) | Done — 9/9 pages |
| Auth system (NextAuth + Moodle) | Not started |
| Student Dashboard | Not started |
| Instructor Dashboard | Not started |
| Admin Console | Done — 7 pages (overview + 6 sub-pages) |
| Moodle backend | Not started |
| Deployment | Not started |

---

## Phase 1 — Marketing Website

### Pages
| Page | Route | Status |
|---|---|---|
| Homepage | `/` | Done |
| Courses catalog | `/courses` | Done |
| Course detail | `/courses/[slug]` | Done |
| Instructors | `/instructors` | Done |
| Resources (free hub) | `/resources` | Done |
| Pricing | `/pricing` | Done |
| About | `/about` | Done |
| Contact + API route | `/contact` | Done |
| 404 | `not-found.tsx` | Done |

### Components Built
| Component | Notes |
|---|---|
| `Navbar` | Sticky, responsive, mobile hamburger menu, Moodle Login/Get Started links |
| `HeroSection` | Split layout, course preview card, floating stats, CTA buttons |
| `TrustedBy` | Brand/logo strip |
| `FeaturedCourses` | Highlighted course cards section |
| `Features` | Why Choose Us grid |
| `CourseCatalog` | Homepage course grid preview |
| `PathToMastery` | Learning path section |
| `Testimonials` | Student quote section |
| `Footer` | 4-column, social icons, links, copyright |
| `CourseCard` | Level badge, rating, price |
| `CourseCatalog` (page) | Search, category/price/level filters, grid/list toggle, pagination |
| `CurriculumAccordion` | Expandable course curriculum on detail page |

### Data / Library (static for now)
| File | Contents |
|---|---|
| `lib/courses.ts` | Full typed course dataset — slug, overview, curriculum, instructor, pricing |
| `lib/instructors.ts` | Instructor profiles — bio, rating, categories |
| `lib/resources.ts` | Free resources — e-books, articles, templates, tools |

### Still Needed — Marketing Site
- [ ] `/about` page
- [ ] `/contact` page + `/api/contact` route (Resend email)
- [ ] `404` page
- [ ] Privacy Policy and Terms pages (footer links exist but pages missing)
- [ ] `components/ui/Button` and `Container` (directory exists, empty)
- [ ] `.env.local` with `NEXT_PUBLIC_MOODLE_URL`
- [ ] Google Analytics

---

## Phase 2 — Authentication

Stack: **NextAuth.js** with Moodle credentials provider

| Task | Status |
|---|---|
| Install NextAuth.js | Not started |
| `lib/auth.ts` — Moodle credentials provider | Not started |
| `/api/auth/[...nextauth]/route.ts` | Not started |
| `middleware.ts` — role-based route protection | Not started |
| `/login` page (Next.js, not Moodle's) | Not started |
| `/signup` page | Not started |
| Session stores `role` + `moodleId` | Not started |
| Redirect by role after login | Not started |

**Auth flow**: Login form → NextAuth → `login/token.php` on Moodle → get user role → redirect to correct dashboard

---

## Phase 3 — Student Dashboard (`/dashboard/student`)

### Overview page (`/dashboard/student`)
| Widget / Section | Status |
|---|---|
| Sidebar with nav items + Upcoming Deadlines | Done |
| Welcome header with stats chips (Courses, Hours) | Done |
| "Continue Learning" full-width banner with progress bar | Done |
| "My Enrolled Courses" 2-column grid with progress | Done |
| "Recommended for You" card with badges | Done |
| Footer | Done |

### My Courses page (`/dashboard/student/courses`)
| Widget / Section | Status |
|---|---|
| Sidebar (Dashboard, My Courses active, Schedule, Messages, Settings, Help) | Done |
| "Upgrade Plan" promo card at bottom of sidebar | Done |
| Secondary horizontal tab nav (Overview, My Courses, Resources) + search + icons | Done |
| Page header with active course count + Grid/List toggle | Done |
| 4-column filter bar (Search, Category, Status, Instructor) | Done |
| 3-column course card grid (image, category badge, instructor, progress bar, Go to Course btn) | Done |
| "Explore Catalog" dashed CTA card | Done |
| List view layout (alternate view) | Done |
| Empty state with "Clear all filters" action | Done |

### Pages still to design/build
| Page | Route | Status |
|---|---|---|
| Schedule | `/dashboard/student/schedule` | Not started |
| Messages | `/dashboard/student/messages` | Not started |

**Moodle APIs needed**:
- `core_enrol_get_users_courses`
- `core_completion_get_activities_completion_status`
- `mod_assign_get_assignments`
- `gradereport_user_get_grade_items`
- `core_calendar_get_calendar_events`

---

## Phase 4 — Instructor Dashboard (`/dashboard/instructor`)

| Widget / Section | Status |
|---|---|
| Sidebar with nav + user profile | Done |
| Header with bell + Create Course button | Done |
| 3 stat cards (students, rating, earnings) with badges | Done |
| Student Engagement AreaChart (Recharts) + period selector | Done |
| Recent Activity feed (enrollments, reviews, questions) | Done |
| Your Courses table (thumbnail, tags, enrolled, completion bar) | Done |
| Footer | Done |
| `/dashboard/instructor/courses` — My Courses page with tab filter, sort, course cards, growth chart, rating card | Done |
| `/dashboard/instructor/analytics` — detailed analytics page | Not started |

**Moodle APIs needed**:
- `core_enrol_get_enrolled_users`
- `core_rating_get_item_ratings`
- `report_log_get_entries`
- Custom `mdl_instructor_earnings` table for revenue

---

## Phase 5 — Admin Console (`/dashboard/admin`)

| Widget / Section | Status |
|---|---|
| Sidebar with brand, "Academic Admin" label, System Health, user profile | Done |
| Sticky top bar with global search + bell | Done |
| Alert banner (High Payout Latency) | Done |
| Platform Revenue card + BarChart (Recharts) + Weekly/Monthly toggle | Done |
| Active Users card | Done |
| New Signups dark card | Done |
| Pending Approvals with Approve/Review actions | Done |
| Quarterly Report download card (orange gradient) | Done |
| User Management table with role badges + status + pagination | Done |
| Footer | Done |
| `/dashboard/admin/courses` — Global Oversight: stat cards, category+status filter, course table, pagination, FAB | Done |
| `/dashboard/admin/users` — User Directory: 5 stat cards, checkbox table, bulk export/delete, Insights + Security Log + Export cards | Done |
| `/dashboard/admin/revenue` — Financial Oversight: stat cards, Revenue chart, Top Categories bars, Pending Payouts table, Transaction Log with filter | Done |
| `/dashboard/admin/analytics` — Platform Performance: User Growth chart, Revenue donut chart, Most Popular Courses table, Top Instructors carousel | Done |
| `/dashboard/admin/settings` — System Settings: 5-tab panel (General/Payments/Email/Security/Integrations), API keys, toggles, Save feedback | Done |
| `/dashboard/admin/logs` — Activity Monitoring: severity filter pills, search, log table, Resource Monitoring bars, Global Access Map | Done |

**Moodle APIs needed**:
- `core_user_get_users`
- `core_role_assign_roles`
- `core_user_update_users`
- Custom `mdl_custom_payments` and `mdl_platform_metrics` tables

---

## Phase 6 — Shared Dashboard Infrastructure

| Task | Status |
|---|---|
| `components/dashboard/RevenueChart.tsx` | Done |
| `components/dashboard/EngagementChart.tsx` | Done |
| shadcn/ui initialized (Tailwind v4 compatible) | Done |
| shadcn components: Button, Badge, Input, Progress, Avatar, Table | Done |
| `lib/moodle/client.ts` — API client | Not started |
| `lib/moodle/types.ts` — TypeScript types | Not started |
| `lib/moodle/utils.ts` — helpers | Not started |
| `hooks/useCourses.ts` | Not started |
| `hooks/useAnalytics.ts` | Not started |
| `hooks/useRevenue.ts` | Not started |

**Dependencies installed**:
- `recharts` ✅
- `lucide-react` ✅
- `date-fns` ✅
- shadcn/ui (base-ui based, Tailwind v4) ✅
- `next-auth` — not yet
- `zod` + `react-hook-form` — not yet

---

## Phase 7 — Moodle Backend

| Task | Status |
|---|---|
| Create DigitalOcean droplet (Bitnami Moodle) | Not started |
| Point domain DNS → lms.ezaytech.com | Not started |
| Enable SSL (Let's Encrypt via bncert) | Not started |
| Enable Moodle Web Services | Not started |
| Create "Dashboard API" external service | Not started |
| Add all required API functions | Not started |
| Generate API token for Next.js | Not started |
| Configure PayPal enrolment plugin | Not started |
| Upload brand logo + set primary color (#1A6EF5) | Not started |
| Add "Website" back-link to Moodle nav | Not started |
| Create first 3 courses | Not started |
| Install certificate plugin | Not started |
| Create custom DB tables (payments, earnings, metrics) | Not started |

---

## Phase 8 — Deployment

| Task | Status |
|---|---|
| Push frontend to GitHub | Not started |
| Connect GitHub repo to Vercel | Not started |
| Set Vercel env vars (MOODLE_URL, MOODLE_TOKEN, NEXTAUTH_SECRET, etc.) | Not started |
| Configure custom domain (ezaytech.com → Vercel) | Not started |
| Stripe webhook endpoint for payment tracking | Not started |

---

## Next Up (Current Priority)

1. Finish remaining marketing pages (About, Contact, 404, Privacy, Terms)
2. Build auth pages (`/login`, `/signup`) + NextAuth.js + Moodle credentials provider
3. Wire up `lib/moodle/client.ts` to replace all static mock data with live Moodle REST API
4. Provision Moodle backend on DigitalOcean + configure web services
5. Deploy frontend to Vercel + connect domain

---

## Cost Tracker

| Item | Cost |
|---|---|
| Frontend (Vercel free tier) | $0/month |
| Backend (DigitalOcean — not provisioned yet) | $12/month (pending) |
| Domain (not purchased yet) | ~$1/month amortized |
| Email (Resend free tier) | $0/month |
| **Year 1 total estimate** | **~$168** |
