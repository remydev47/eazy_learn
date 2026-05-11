# EazyTech LMS — Client Information Requirements
> For the developer to complete Moodle API wiring and backend setup.  
> Please fill in every item marked **[REQUIRED]** before the integration sprint begins.  
> Items marked **[OPTIONAL]** are needed only for specific features.

---

## 1. Moodle Server Access

These credentials allow the Next.js frontend to talk to your Moodle instance.

| Item | Value | Notes |
|---|---|---|
| Moodle site URL | **[REQUIRED]** e.g. `https://lms.ezaytech.com` | Must be HTTPS in production |
| Moodle Web Service token | **[REQUIRED]** Generate in Site Admin → Web Services → Manage Tokens | 32-character alphanumeric string |
| Admin username | **[REQUIRED]** | For generating the token and configuring services |
| Admin password | **[REQUIRED]** | Shared once — can be rotated after integration |
| Server IP / SSH access | **[REQUIRED]** | For deploying and configuring the DigitalOcean droplet |

**How to generate the token**:
1. Login as Admin → Site Administration → Server → Web Services → Manage Tokens
2. Click "Add" → select the admin user → select the "Dashboard API" external service
3. Copy the token and share it securely (use a password manager or one-time-secret link)

---

## 2. Moodle Web Service Functions to Enable

Tell your Moodle admin to enable all of the following functions under:  
**Site Admin → Server → Web Services → External Services → Dashboard API → Add functions**

### Student Dashboard
| Function | Purpose |
|---|---|
| `core_enrol_get_users_courses` | Get courses a student is enrolled in |
| `core_completion_get_activities_completion_status` | Per-activity progress for each course |
| `mod_assign_get_assignments` | Upcoming assignment deadlines |
| `gradereport_user_get_grade_items` | Student grades per course |
| `core_calendar_get_calendar_events` | Upcoming events and deadlines |
| `core_course_get_courses_by_field` | Fetch course metadata (title, image, instructor) |

### Instructor Dashboard
| Function | Purpose |
|---|---|
| `core_enrol_get_enrolled_users` | List all students in each course |
| `core_rating_get_item_ratings` | Course ratings from students |
| `report_log_get_entries` | Activity logs for engagement charts |
| `mod_quiz_get_quizzes_by_courses` | Quiz activity data |
| `core_course_get_courses_by_field` | Instructor's own courses |

### Admin Console
| Function | Purpose |
|---|---|
| `core_user_get_users` | Full user directory (all roles) |
| `core_role_assign_roles` | Change a user's role |
| `core_user_update_users` | Suspend / unsuspend / edit users |
| `core_course_get_courses` | All platform courses |
| `core_cohort_get_cohorts` | User groups / cohorts |

---

## 3. Course Content & Structure

So the developer can map static mock data to real courses.

### For each course, provide:

| Field | Value | Notes |
|---|---|---|
| Course full name | **[REQUIRED]** | Displayed on cards and detail pages |
| Course short name | **[REQUIRED]** | Used as slug / URL identifier |
| Course summary / description | **[REQUIRED]** | 2–4 sentences |
| Category | **[REQUIRED]** e.g. Technology, Design, Business | Used for filters |
| Price | **[REQUIRED]** e.g. $79 USD | Must match PayPal/Stripe enrolment plugin price |
| Thumbnail image | **[REQUIRED]** | Minimum 800×500 px, WEBP or JPG preferred |
| Instructor name | **[REQUIRED]** | Matches a Moodle user account |
| Skill level | **[REQUIRED]** Beginner / Intermediate / Advanced | Shown as badge on course cards |
| Duration (hours) | **[REQUIRED]** | Approximate total watch/study time |
| Course curriculum | **[REQUIRED]** | List of sections → lessons (see template below) |
| Certificate on completion? | **[REQUIRED]** Yes / No | Requires Moodle certificate plugin |
| Free preview lessons | **[OPTIONAL]** | Which specific lessons are publicly visible |
| Promo video URL | **[OPTIONAL]** | YouTube/Vimeo URL shown on course detail page |

**Curriculum template** (provide as spreadsheet or plain text):
```
Section 1: Introduction
  - Lesson 1.1: Welcome & Overview (video, 5 min)
  - Lesson 1.2: Setting up your environment (video, 12 min)
  - Lesson 1.3: Quiz: Check your understanding (quiz, 5 questions)

Section 2: Core Concepts
  - Lesson 2.1: ...
```

### Minimum to launch:
- **3 complete courses** fully uploaded to Moodle with videos, curriculum, and enrolment pricing set
- At least 1 course in each of 2 different categories

---

## 4. User Roles

Moodle uses role IDs internally. Confirm which role names map to which dashboard:

| Dashboard | Moodle Role Name | Role ID (check in Site Admin → Users → Roles) |
|---|---|---|
| Student Dashboard | `student` | **[REQUIRED]** |
| Instructor Dashboard | `editingteacher` | **[REQUIRED]** (may differ if custom roles were created) |
| Admin Console | `manager` or `admin` | **[REQUIRED]** |

**Important**: The Next.js auth system reads the user's role from Moodle after login and redirects accordingly. If you used custom role names in Moodle, share the exact role shortnames.

---

## 5. Authentication

The login flow is: **user enters credentials → NextAuth sends them to Moodle → Moodle returns a token → role is read → dashboard redirect**.

| Item | Value |
|---|---|
| Moodle login endpoint | `{MOODLE_URL}/login/token.php` (automatic, just need the URL) |
| Service name for token | **[REQUIRED]** e.g. `moodle_mobile_app` (the service the token endpoint uses) |
| Allow email login (not just username)? | **[REQUIRED]** Yes / No — requires Moodle setting change |
| Self-registration enabled? | **[REQUIRED]** Yes / No — affects signup page flow |
| Email verification required on signup? | **[REQUIRED]** Yes / No |

---

## 6. Payment Gateway

### PayPal (built-in Moodle plugin — recommended for MVP)

| Item | Value |
|---|---|
| PayPal Business account email | **[REQUIRED]** |
| PayPal Sandbox email (for testing) | **[REQUIRED]** |
| PayPal Sandbox password | **[REQUIRED]** |
| Currency code | **[REQUIRED]** e.g. `USD`, `GBP`, `EUR` |
| Platform revenue share % | **[REQUIRED]** e.g. 30% platform / 70% instructor |

### Stripe (for revenue dashboard — optional for MVP)

| Item | Value |
|---|---|
| Stripe publishable key | **[OPTIONAL]** `pk_live_...` |
| Stripe secret key | **[OPTIONAL]** `sk_live_...` |
| Stripe webhook secret | **[OPTIONAL]** `whsec_...` — needed for real-time revenue tracking |

> If using PayPal only for MVP, Stripe can be wired in Phase 2. Revenue dashboard will show mock data until one of these is connected.

---

## 7. Email (Contact Form & Transactional Emails)

| Item | Value |
|---|---|
| Email provider | **[REQUIRED]** Resend (recommended free tier), SendGrid, or SMTP |
| Resend API key | **[REQUIRED if using Resend]** `re_...` from resend.com/api-keys |
| From address | **[REQUIRED]** e.g. `no-reply@eazytech.com` — domain must be verified in Resend |
| Support / contact destination email | **[REQUIRED]** Where contact form submissions are sent |
| Domain verified in email provider? | **[REQUIRED]** Yes / No — developer can help with DNS records |

---

## 8. Domain & DNS

| Item | Value |
|---|---|
| Primary domain | **[REQUIRED]** e.g. `ezaytech.com` |
| LMS subdomain | **[REQUIRED]** e.g. `lms.ezaytech.com` → points to DigitalOcean droplet |
| Registrar | **[REQUIRED]** e.g. Namecheap, Cloudflare, GoDaddy |
| Access to DNS panel? | **[REQUIRED]** Developer needs to add A records and CNAME records |
| Cloudflare proxy? | **[OPTIONAL]** Yes / No — affects SSL setup on Moodle |

**DNS records the developer will add**:
```
A     @          → Vercel IP (for Next.js frontend)
A     lms        → DigitalOcean droplet IP (for Moodle)
CNAME www        → cname.vercel-dns.com
TXT   @          → Resend email verification record
```

---

## 9. Branding & Design Assets

| Asset | Specification | Status |
|---|---|---|
| Logo (SVG) | **[REQUIRED]** — for Moodle header | Already provided for Next.js site |
| Logo (PNG, transparent bg) | **[REQUIRED]** for email templates | Min 400px wide |
| Primary brand colour | `#FF510E` (confirmed) | ✅ |
| Secondary colour (if any) | **[OPTIONAL]** | |
| Favicon `.ico` / `.png` | **[REQUIRED]** 32×32 and 180×180 | |
| Social share image | **[OPTIONAL]** 1200×630 px OG image | |

---

## 10. Legal Pages Content

The footer already links to these pages. The developer will create the page structure — client must provide the text content.

| Page | Route | Content needed from client |
|---|---|---|
| Privacy Policy | `/privacy` | **[REQUIRED]** — data collected, cookies, GDPR compliance if EU users |
| Terms of Service | `/terms` | **[REQUIRED]** — platform rules, refund policy, instructor agreement |
| Refund Policy | `/refund` (or inside Terms) | **[REQUIRED]** — e.g. "14-day money-back guarantee" |

> **Tip**: Use a service like Termly.io or Iubenda (both free tiers) to auto-generate GDPR-compliant Privacy Policy and Terms of Service, then paste the text to the developer.

---

## 11. Analytics & Tracking

| Item | Value |
|---|---|
| Google Analytics 4 Measurement ID | **[OPTIONAL]** `G-XXXXXXXXXX` — add to Vercel env vars |
| Facebook Pixel ID | **[OPTIONAL]** for ad tracking |
| Hotjar / Microsoft Clarity ID | **[OPTIONAL]** for session recording |

---

## 12. Infrastructure Credentials

To provision the DigitalOcean server on your behalf:

| Item | Value |
|---|---|
| DigitalOcean account email | **[REQUIRED]** — or invite developer as team member |
| Preferred server region | **[REQUIRED]** e.g. `NYC3`, `LON1`, `FRA1` — choose closest to most users |
| Server size | `s-2vcpu-2gb` ($18/month) recommended for MVP | Developer will confirm |
| SSH public key | Developer will provide their public key to add to the droplet |

---

## 13. Summary Checklist

Before handing off to the developer, ensure you have:

### Moodle
- [ ] Moodle installed and reachable at your subdomain
- [ ] Admin credentials shared securely
- [ ] Web service token generated and shared
- [ ] All API functions enabled on the Dashboard API external service
- [ ] At least 3 courses fully uploaded (videos, curriculum, pricing)
- [ ] PayPal enrolment plugin configured with your business email
- [ ] SSL certificate installed (via bncert on DigitalOcean/Bitnami)

### Domain & Email
- [ ] Domain purchased and DNS panel accessible
- [ ] LMS subdomain A record pointing to server IP
- [ ] Resend account created, domain verified, API key provided
- [ ] Contact destination email confirmed

### Legal
- [ ] Privacy Policy text provided
- [ ] Terms of Service text provided
- [ ] Refund policy decided

### Payments
- [ ] PayPal Business account ready with confirmed business email
- [ ] PayPal Sandbox credentials for testing
- [ ] Platform revenue share % decided

### Branding
- [ ] Logo PNG (transparent background) provided
- [ ] Favicon provided
- [ ] Any additional brand assets shared

---

## How to Share Information Securely

**Do not send credentials over email or WhatsApp.**

Recommended methods:
1. **1Password / Bitwarden share link** — send a one-time link that expires after viewing
2. **[One-Time Secret](https://onetimesecret.com)** — free, no account needed, link expires after one read
3. **Shared Google Doc** (private, link-restricted) — for longer text like policy content
4. **Loom video walkthrough** — to show where settings are in your Moodle admin panel

---

*Document version: 1.0 — Created for EazyTech LMS MVP handoff*  
*Prepared by: Developer (Brian Rimi) · May 2026*
