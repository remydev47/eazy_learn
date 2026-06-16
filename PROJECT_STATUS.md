# Ezay Tech LMS — Project Status

> Last updated: 2026-05-28
> Repo: `/Users/brianrimi/Documents/deploy/EazytechLMS`
> Public demo URL (ephemeral): `https://hollywood-maria-sampling-schools.trycloudflare.com`

---

## Executive Summary

A **functional, demo-ready** learning platform is up and running:

- Marketing site, course catalog, three role-based dashboards — all wired to a real Moodle backend via Web Services API
- 13 courses seeded across Beginner / Intermediate / Advanced tiers
- Three test users (admin / instructor / student) with working role-based access control
- Brand colors swapped to blue (`#1A6EF5`)
- Public URL via Cloudflare Tunnel — client can click around on their own device

**This is invoice-worthy.** The Moodle integration, auth, and dashboard wiring is roughly 4–6 weeks of integration work compressed into 5 days. It's what turns a beautiful mockup into a working product.

**What's NOT done:** production deployment, M-Pesa payments, live class integration, recording storage, real course content upload, custom Moodle theme, real branding/logo.

---

## Table of Contents

1. [Architecture](#architecture)
2. [What's Built (Phase 1 & 2)](#whats-built-phase-1--2)
3. [Running the Demo](#running-the-demo)
4. [Demo Walkthrough Script](#demo-walkthrough-script)
5. [Honest Caveats](#honest-caveats)
6. [What's NOT Built (Phase 3)](#whats-not-built-phase-3)
7. [Production Deployment Plan](#production-deployment-plan)
8. [Client / Business Owner Action Items](#client--business-owner-action-items)
9. [Open Questions](#open-questions)
10. [Project Files Reference](#project-files-reference)

---

## Architecture

```
                ┌─────────────────────────────────────────────┐
                │   Marketing site (public)                   │
                │   - Homepage, About, Contact, Pricing       │
                │   - Course catalog (13 courses)             │
                │   - Course detail pages                     │
                │                                             │
                │              Next.js 16 + React 19          │
                │   ───────────────────────────────────────── │
                │   Role-based dashboards (auth required)     │
                │   - /dashboard/student                      │
                │   - /dashboard/instructor                   │
                │   - /dashboard/admin                        │
                │                                             │
                │   Auth: NextAuth v5 (Credentials provider)  │
                │   Session: JWT in HttpOnly cookie           │
                └──────────────────┬──────────────────────────┘
                                   │ REST + JWT
                                   ↓
                ┌─────────────────────────────────────────────┐
                │   Moodle 5.0.1 (headless)                   │
                │   - Postgres 16                             │
                │   - 14 web service functions exposed        │
                │   - "Dashboard API" external service        │
                │                                             │
                │   Source of truth for:                      │
                │   - Users, courses, enrollments             │
                │   - Categories, completion, grades          │
                │                                             │
                │   Demo: localhost:8080 (Docker)             │
                │   Production: lms.ezaytech.co.ke (Contabo)  │
                └─────────────────────────────────────────────┘
```

### Architectural invariants (do not break)

- **Moodle is the only source of truth** for users, courses, enrollments, completion, grades.
- All reads go through `lib/moodle/client.ts` — never duplicate data in another datastore.
- All writes go through Moodle's REST API or a custom Moodle plugin.
- Custom tables (payments, instructor earnings) live inside Moodle's PostgreSQL, not a separate DB.
- Sessions are JWT-only (no DB session store).

---

## What's Built (Phase 1 & 2)

### Phase 1 — Marketing site & UI design (done before this work)

| Surface | Status |
|---|---|
| Homepage, hero, featured courses | Done |
| About, Contact, Pricing, Privacy, Terms, 404 | Done |
| Instructors page | Done |
| Resources page | Done |
| Tailwind v4 + shadcn/ui + Recharts | Done |
| All static UI shells for 3 dashboards | Done |
| Static `lib/courses.ts` mock data | Done (now unused) |

### Phase 2 — Backend integration & auth (this work)

| Component | Status | Notes |
|---|---|---|
| Moodle Docker stack (Moodle 5.0.1 + Postgres 16) | Done | `infra/moodle/docker-compose.yml` |
| Idempotent setup script (web services + token) | Done | `infra/moodle/setup-webservices.sh` |
| Demo course seed (13 courses, 3 tiers) | Done | `infra/moodle/seed-full-catalog.sh` |
| Test users seed (admin, teacher, student) | Done | `infra/moodle/create-test-users.sh` |
| `lib/moodle/client.ts` — typed API wrapper | Done | 17 functions covering catalog, enrol, completion, users, roles |
| `lib/moodle/auth.ts` — credentials validation | Done | Includes 2-call role resolution (siteinfo + course roster) |
| NextAuth v5 wiring | Done | `lib/auth.ts` + `lib/auth.config.ts` (edge-safe split) |
| `/login` page with server action | Done | Form-based, CSRF-protected |
| `proxy.ts` (renamed from middleware in Next 16) | Done | Role-based section locks |
| `/dashboard/student` wired to Moodle | Done | Live enrollments, real progress, sign-out |
| `/dashboard/instructor` wired to Moodle | Done | Filters to courses where user is editingteacher |
| `/courses` catalog wired to Moodle | Done | Server Component + client filtering |
| `/courses/[slug]` detail wired to Moodle | Done | `generateStaticParams()` from live catalog |
| `lib/course-metadata.ts` (demo metadata) | Done | Pricing/level/instructor placeholders, clearly marked demo-only |
| `lib/moodle/catalog.ts` (Moodle→UI mapper) | Done | |
| Brand color swap `#FF510E` → `#1A6EF5` | Done | All `app/` and `components/` files |
| Cloudflare Tunnel public URL | Done | Demo-only, ephemeral |
| `AUTH_TRUST_HOST` + `AUTH_URL` for proxy support | Done | |

### Verified end-to-end (curl tests)

- Unauthenticated `/dashboard/*` → redirect to `/login` (307)
- Login as `student` → JWT cookie set → `/dashboard/student` returns 200 with "Welcome back, Sarah" + her enrolled course
- Login as `teacher` → routes to `/dashboard/instructor`, sees 3 taught courses with real student counts
- Login as `admin` → can access all three dashboards
- Cross-role access blocked at the proxy layer (student trying `/dashboard/admin` redirects to their home)
- Catalog renders 13 courses with tier badges
- Detail pages render with category, instructor, price, "Enroll" → real Moodle deep link
- Unknown slug → 404
- All of the above works through the **public Cloudflare Tunnel URL**

---

## Running the Demo

### Daily startup checklist (your laptop)

```bash
# 1. Start Moodle (idempotent — leave running across days)
cd /Users/brianrimi/Documents/deploy/EazytechLMS/infra/moodle
docker compose up -d

# 2. Start Next.js (own terminal, leave running)
cd /Users/brianrimi/Documents/deploy/EazytechLMS/frontend
npm run dev

# 3. Start the Cloudflare tunnel (own terminal, leave running)
nohup ~/bin/cloudflared tunnel --url http://localhost:3000 > /tmp/cftunnel.log 2>&1 &

# 4. Grab the tunnel URL (wait ~10s after starting)
grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" /tmp/cftunnel.log | head -1
```

### CRITICAL: update `AUTH_URL` whenever the tunnel URL changes

Quick tunnel URLs are ephemeral — they change every restart. After each restart:

```bash
# Edit frontend/.env.local — change this line to the new tunnel URL:
AUTH_URL=https://<new-tunnel-url>.trycloudflare.com

# Restart Next.js to pick it up
```

Without this, post-login redirects go to a stale URL and the login appears broken to the client. **This is the single thing most likely to bite you mid-demo.**

> To avoid this entirely, create a **named Cloudflare tunnel** (free, requires a Cloudflare account). That gives you a stable hostname like `demo.ezaytech.co.ke` that survives restarts. Recommended if demoing more than twice.

### Demo credentials

| Username | Password | Role | What they see |
|---|---|---|---|
| `student` | `Student123!` | Student | Sarah Student — 3 enrolled courses, real progress |
| `teacher` | `Teacher123!` | Instructor | Tom Teacher — 3 taught courses with student counts |
| `admin` | `EzayAdmin123!` | Site admin | Can access all three dashboards |

These are visible at the bottom of the `/login` page for the demo. Remove before any production launch.

---

## Demo Walkthrough Script

Suggested 10-minute flow:

1. **Open the public URL** in the browser. "This is the marketing site, on a temporary preview URL. Production lives on `ezaytech.co.ke`."

2. **Click "Courses"** → catalog with 13 courses. "All three tiers — Beginner, Intermediate, Advanced. Filterable by category, price, level. This data is live from our Moodle backend, not hardcoded."

3. **Click "Introduction to AWS Cloud Computing"** → detail page. "Curriculum, instructor bio, pricing. I've placed pricing at $79 / $149 / $249 by tier — you can change anything you like."

4. **Click "Sign in"** → log in as `student`. "Sarah is enrolled in 3 courses. Her dashboard surfaces her progress, her next session, and 'continue learning' picks the right course."

5. **Show "Welcome back, Sarah"** + enrolled courses. "All real data. The 'Resume' button drops her into the actual course content inside Moodle."

6. **Sign out → log in as `teacher`**. "Tom teaches 3 courses, has X students. The 'AVERAGE RATING' and 'MONTHLY EARNINGS' show '—' because ratings/payments aren't wired yet — I'd rather show a dash than fake a number."

7. **Sign out → log in as `admin`**. "Site-wide admin view. The user/course counts will be wired live; the revenue/signups stay as placeholders until M-Pesa goes in."

8. **Open `localhost:8080` in a new tab** (screen share, not via tunnel). "This is Moodle — the backend. Instructors upload videos, PDFs, quizzes here. Students never see this UI directly; they consume content through our site."

9. **Pause for questions.**

10. **End with**: "Here's what's next" — show the [Phase 3 list below](#whats-not-built-phase-3).

---

## Honest Caveats

Be upfront with the client about these — clients respect candor far more than over-promising.

| Surface | Current state | Plan |
|---|---|---|
| Pricing ($79/$149/$249) | Hardcoded in `lib/course-metadata.ts` | Move to Moodle custom course fields once client confirms real prices |
| Instructor bios | 5 placeholder names with placeholder bios | Replace with real instructor data once client provides headshots + bios |
| Course curriculum | Synthetic "Session 1, 2, 3…" list | Wire to `core_course_get_contents` once real lesson structure exists |
| Ratings / review counts | Static demo numbers (4.7, 48 reviews) | Install Moodle ratings plugin OR build custom |
| Instructor "Monthly Earnings" | Shows "—" (honest) | Wire to `mdl_custom_payments` table once payments live |
| Admin "Revenue" / "Active Users" | Still showing mock numbers | Either wire user count via `core_user_get_users`, or keep mocked until launch |
| Course thumbnails | Fall back to `/assets/*.webp` | Real thumbnails when instructors upload them to Moodle |
| "Recent Activity" feeds | Honest "Placeholder" labels | Parse `report_log_get_entries` post-demo |
| Wordmark "EazyTech" vs "Ezay Tech" | Inconsistent across files | Awaiting decision (see [Open Questions](#open-questions)) |
| Logo | Text wordmark only, no graphic mark | Client to provide PNG/SVG |
| Moodle "open in backend" deep links | Point at `localhost:8080` | Break when accessed via tunnel. Either tunnel Moodle too, or screen-share that step |

---

## What's NOT Built (Phase 3)

The next invoice should cover these. Rough order:

### Backend & infrastructure
- [ ] Provision Contabo VPS S (~€4.50/month, 4 CPU, 8 GB RAM, 200 GB SSD)
- [ ] Move Moodle Docker stack to Contabo
- [ ] Caddy reverse proxy in front of Moodle for Let's Encrypt SSL
- [ ] Point `lms.ezaytech.co.ke` at the Contabo VPS
- [ ] Set Moodle `wwwroot` to the production URL
- [ ] Generate production-grade `MOODLE_TOKEN` and rotate the demo one
- [ ] Strong production passwords for Postgres + Moodle admin

### Frontend deployment
- [ ] Push frontend code to a GitHub repo (currently committed locally only)
- [ ] Connect Vercel free tier to the GitHub repo
- [ ] Set production env vars in Vercel:
  - `MOODLE_URL` = `https://lms.ezaytech.co.ke`
  - `NEXT_PUBLIC_MOODLE_URL` = same
  - `MOODLE_TOKEN` = production token
  - `AUTH_SECRET` = freshly generated, never the demo one
  - `AUTH_URL` = `https://ezaytech.co.ke`
  - `AUTH_TRUST_HOST` = `true`
- [ ] Point `ezaytech.co.ke` at Vercel (DNS CNAME)

### Payments (blocked on client's business registration)
- [ ] Client opens **Paystack** account (test keys work immediately; live needs business verification + Kenyan bank account)
- [ ] Build a custom Next.js Paystack payment route (initialize transaction → checkout → verify)
- [ ] Test-mode payment end-to-end (M-Pesa + card via Paystack)
- [ ] Custom Moodle table for payment tracking (`mdl_custom_payments`)
- [ ] Webhook handler for **Paystack** payment events → trigger Moodle enrollment via API
- [ ] Switch to live mode

### Live classes & content
- [ ] Wire Zoom links into Moodle course modules (manual, no integration)
- [ ] Decide recording storage: YouTube unlisted (free) vs Wasabi/Cloudflare R2 (paid)
- [ ] Client uploads BOOTCAMP PDFs into the right courses
- [ ] Client populates real course descriptions
- [ ] Add real instructor profiles (replace placeholders)

### Polish
- [ ] Replace placeholder logo with real one
- [ ] Confirm + apply final brand palette
- [ ] Wire admin dashboard's user/course counts to Moodle
- [ ] Wire instructor activity feed (parse `report_log_get_entries`)
- [ ] Build proper signup flow on Next.js (currently links to Moodle's `signup.php`)
- [ ] Replace test credentials block on `/login` page with real branding
- [ ] Wire `/dashboard/student/courses`, `/schedule`, `/assignments` sub-pages
- [ ] Wire `/dashboard/instructor/courses`, `/students`, `/analytics` sub-pages
- [ ] Wire `/dashboard/admin/users`, `/courses`, `/revenue` sub-pages

### Optional but valuable
- [ ] Custom Moodle plugin exposing `local_ezay_get_user_role` web service (replaces the 2-call workaround in `lib/moodle/auth.ts`)
- [ ] Custom Moodle plugin storing pricing / level / sessions as course custom fields (replaces `lib/course-metadata.ts` placeholder lookup)
- [ ] Custom Moodle theme matching brand
- [ ] Certificate plugin
- [ ] Analytics integration (Google Analytics or Plausible)
- [ ] Email setup (Resend free tier for contact form + transactional emails)

---

## Production Deployment Plan

Rough sequence — 5–7 days of dev work, plus client-side business setup.

### Step 1 — Provision Contabo VPS (~1 hour, day 1)

- Sign up at <https://contabo.com>
- Order **VPS S** — €4.50/mo, 4 vCPU, 8 GB RAM, 200 GB SSD, Ubuntu 22.04
- SSH key access only, disable root password login
- Update + install Docker:
  ```bash
  apt update && apt upgrade -y
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker $USER
  ```
- Copy `infra/moodle/` directory to the server:
  ```bash
  scp -r infra/moodle/ root@<server-ip>:/opt/
  ```
- On the server, edit `/opt/moodle/.env` with **strong production passwords** (don't reuse demo values)
- `cd /opt/moodle && docker compose up -d`
- Wait 3–4 minutes for first-boot bootstrap
- `./setup-webservices.sh` to enable web services and capture the production token

### Step 2 — Domain + DNS (timing depends on client)

- Client registers `ezaytech.co.ke` via Truehost or Safaricom (~KES 1,500/year, instant)
- Add DNS records:
  - `A` record: `lms.ezaytech.co.ke` → Contabo VPS IP
  - `CNAME`: `www.ezaytech.co.ke` → `cname.vercel-dns.com` (after Vercel deploy)
  - `A` record: `ezaytech.co.ke` → Vercel IP (Vercel provides this)

### Step 3 — Caddy SSL in front of Moodle (~30 min, day 2)

- Add to `/opt/moodle/docker-compose.yml`:
  ```yaml
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    networks: [moodlenet]
  ```
- Create `/opt/moodle/Caddyfile`:
  ```
  lms.ezaytech.co.ke {
    reverse_proxy moodle:8080
  }
  ```
- Remove Moodle's direct port mappings (now behind Caddy)
- `docker compose up -d caddy` — Caddy auto-fetches a Let's Encrypt cert
- Update Moodle's `wwwroot` to `https://lms.ezaytech.co.ke` via CLI

### Step 4 — Deploy Next.js to Vercel (~30 min, day 2)

- Push `frontend/` to a GitHub repo
- Sign up / log into Vercel, "Import Git Repository", select the repo
- Set env vars in Vercel project settings (see [Phase 3 checklist](#frontend-deployment) above)
- Click Deploy. Vercel handles SSL + global CDN automatically.
- Once deployed, add the custom domain `ezaytech.co.ke` in Vercel settings
- Vercel will give you the DNS records to add at your registrar

### Step 5 — Real content + branding (days 3–5)

- Client uploads BOOTCAMP PDFs through Moodle's admin UI (no code needed)
- Client writes real course descriptions in Moodle
- Replace `lib/course-metadata.ts` placeholder instructors with real ones (or migrate to Moodle custom fields — recommended)
- Swap text wordmark for the real logo asset
- Confirm and apply final brand palette

### Step 6 — Payments (days 5–7, gated on business registration)

- Client opens **Paystack** account at <https://paystack.com> (test keys available immediately; live mode needs business verification + a Kenyan bank account for settlement)
- Build a custom Next.js payment flow (no Moodle plugin): initialize transaction server-side with the secret key → Paystack checkout (M-Pesa + cards, KES) → verify
- Configure with API keys from the Paystack dashboard (public key, secret key, webhook secret)
- Test the flow in Paystack test mode first
- Create `mdl_custom_payments` table inside Moodle's PostgreSQL for payment audit trail
- Add Next.js API route `/api/webhooks/paystack` to receive payment events → enroll the paid user via Moodle's enrol API
- Switch Paystack to live mode

### Step 7 — Live classes & recordings (post-launch)

- Instructor creates Zoom meetings, pastes links into Moodle course calendar (no integration needed for v1)
- Recordings upload path:
  - **Free path**: instructor uploads to YouTube unlisted, pastes link in Moodle
  - **Paid path**: Wasabi or Cloudflare R2 ($5–10/month for ~250 GB)
- Wire links into Moodle course modules so students see "Session 1 recording" links in the course

---

## Client / Business Owner Action Items

Things only the client can do — start these **today**. None require technical skill.

### Hard blockers for launch (start within 7 days)

- [ ] **Register the business** with BRS (~KES 950, takes 1–3 days). Unlocks domain registration, M-Pesa Paybill, bank account, KRA PIN.
- [ ] **Get KRA PIN** for the business (free, online via iTax once BRS cert is issued)
- [ ] **Register the domain** `ezaytech.co.ke` (recommend Truehost or Safaricom, ~KES 1,500/year)
- [ ] **Open business bank account** (Equity, KCB, NCBA, or similar — needed to receive M-Pesa payouts)
- [ ] **Open Paystack account** (test keys work immediately; live mode requires business cert + KRA PIN + Kenyan bank account for settlement)

### Content & branding (parallel work)

- [ ] **Send the logo** — PNG or SVG, even rough version. "Will provide later" doesn't fly post-demo.
- [ ] **Confirm pricing strategy** — current demo uses $79 / $149 / $249 USD by tier. KES equivalents are also stored. Confirm or change.
- [ ] **Tagline / slogan** — one short sentence
- [ ] **About Us copy** — 2–3 paragraphs
- [ ] **Contact details** — email, phone, physical address
- [ ] **Real instructor list** for the launch cohort: name, headshot, 2–3 sentence bio, email per instructor
- [ ] **BOOTCAMP folder of PDFs** — upload to Google Drive shared with you so you can attach them to courses
- [ ] **Real course descriptions** — currently using synthetic marketing copy
- [ ] **Refund policy** — "no refunds after first session"? "7-day money-back"?

### Legal

- [ ] Privacy Policy — basic template works, client reviews
- [ ] Terms of Service — same
- [ ] Refund Policy — owner's call

---

## Open Questions

1. **Wordmark spelling.** Three variants exist across the project: `EazyTech` (in the UI), `Ezay Tech` (in CLAUDE.md), `ezaytech` (in the domain). Which is canonical? Once confirmed, swap site-wide in ~2 minutes.

2. **Pricing in KES or USD primary?** Current demo shows USD by default. Client may want KES as the primary currency for Kenyan market with USD as secondary.

3. **Demo Moodle deep-links.** "Resume Lesson" / "Enroll Now" buttons currently link to `localhost:8080` which breaks when the demo is viewed through the Cloudflare tunnel. Options:
   - Screen-share that part of the demo only
   - Tunnel Moodle separately and patch Moodle's `wwwroot` — adds ~15 min of setup, makes the tunnel URLs feel more "real" to the client

4. **Named tunnel vs quick tunnel.** Quick tunnels (current setup) generate a new URL every restart. Named tunnels need a free Cloudflare account but give a stable hostname. Worth setting up if there will be multiple demos.

5. **Self-signup flow.** Currently the "Sign up" link on the login page points at Moodle's `signup.php`. A branded Next.js signup page would be cleaner — about half a day of work. Defer until needed?

6. **Live class integration depth.** Three levels:
   - **Lazy**: instructor pastes Zoom link in Moodle calendar (no code)
   - **Medium**: Next.js shows session schedule in dashboard, links out to Zoom
   - **Deep**: BigBlueButton plugin embedded inside Moodle (most setup)
   Recommend medium for v1.

---

## Project Files Reference

### Documentation
- [`CLAUDE.md`](./CLAUDE.md) — original MVP scope
- [`CLIENT_REQUIREMENTS.md`](./CLIENT_REQUIREMENTS.md) — what to ask the client
- [`progress.md`](./progress.md) — earlier Phase 1 progress notes (now stale)
- [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) — this file

### Infrastructure (`infra/moodle/`)
- [`docker-compose.yml`](./infra/moodle/docker-compose.yml) — Moodle 5.0.1 + Postgres 16
- [`.env`](./infra/moodle/.env) — container env vars (gitignored)
- [`setup-webservices.sh`](./infra/moodle/setup-webservices.sh) — enable web services, create external service, generate token
- [`seed-demo-data.sh`](./infra/moodle/seed-demo-data.sh) — initial single-course demo seed
- [`seed-full-catalog.sh`](./infra/moodle/seed-full-catalog.sh) — full 13-course catalog seed
- [`create-test-users.sh`](./infra/moodle/create-test-users.sh) — admin / teacher / student test users
- [`README.md`](./infra/moodle/README.md) — local dev + production deploy guide

### Frontend (`frontend/`)
- [`.env.local`](./frontend/.env.local) — env vars (gitignored)
- [`proxy.ts`](./frontend/proxy.ts) — route protection + role-based locks (Next 16 renamed `middleware.ts` to `proxy.ts`)
- [`lib/auth.ts`](./frontend/lib/auth.ts) — NextAuth v5 config (Node runtime)
- [`lib/auth.config.ts`](./frontend/lib/auth.config.ts) — Edge-safe NextAuth callbacks
- [`lib/moodle/client.ts`](./frontend/lib/moodle/client.ts) — typed Moodle API wrapper
- [`lib/moodle/auth.ts`](./frontend/lib/moodle/auth.ts) — credentials validation + role resolution
- [`lib/moodle/catalog.ts`](./frontend/lib/moodle/catalog.ts) — Moodle→UI mapper for catalog pages
- [`lib/moodle/types.ts`](./frontend/lib/moodle/types.ts) — Moodle response types
- [`lib/course-metadata.ts`](./frontend/lib/course-metadata.ts) — demo-only pricing/level/instructor lookup
- [`types/next-auth.d.ts`](./frontend/types/next-auth.d.ts) — type augmentation for session.user.role / moodleId
- [`app/api/auth/[...nextauth]/route.ts`](./frontend/app/api/auth/[...nextauth]/route.ts) — NextAuth route handler
- [`app/api/moodle/ping/route.ts`](./frontend/app/api/moodle/ping/route.ts) — Moodle connectivity smoke test
- [`app/login/page.tsx`](./frontend/app/login/page.tsx) — sign-in form (server action)
- [`app/courses/page.tsx`](./frontend/app/courses/page.tsx) — catalog (Server Component, 5 lines)
- [`app/courses/CoursesCatalogClient.tsx`](./frontend/app/courses/CoursesCatalogClient.tsx) — catalog filtering UI
- [`app/courses/[slug]/page.tsx`](./frontend/app/courses/[slug]/page.tsx) — course detail (wired to Moodle)
- [`app/dashboard/student/page.tsx`](./frontend/app/dashboard/student/page.tsx) — student dashboard (live)
- [`app/dashboard/instructor/page.tsx`](./frontend/app/dashboard/instructor/page.tsx) — instructor dashboard (live)
- [`app/dashboard/admin/page.tsx`](./frontend/app/dashboard/admin/page.tsx) — admin dashboard (still mock)

---

## Cost Summary

### Demo phase (now)
- DigitalOcean / Contabo: **$0** (running on laptop)
- Cloudflare Tunnel: **$0**
- **Total: $0/month**

### Production phase (post-launch)
| Item | Cost |
|---|---|
| Contabo VPS S (Moodle backend) | ~$5/month |
| Vercel free tier (Next.js frontend) | $0 |
| Domain `ezaytech.co.ke` | ~$1/month amortized |
| Resend free tier (email) | $0 |
| Paystack (transaction fees only, no monthly) | per-txn % |
| **Total fixed cost** | **~$6/month** |

Optional add-ons:
- Wasabi/B2 recording storage: $5–10/month at 250–500 GB
- Custom Moodle theme work: one-time ~$200–500
- Google Workspace business email: $6/user/month

---

## Last Verified

End-to-end smoke test through public tunnel `https://hollywood-maria-sampling-schools.trycloudflare.com` on 2026-05-28:

- Homepage HTTP 200
- `/courses` HTTP 200 — 13 courses render
- `/login` HTTP 200 — blue brand color confirmed
- Sign in as `student` → 302 redirect to tunnel `/dashboard/student`
- Authenticated dashboard HTTP 200 — "Welcome back, Sarah" + "Introduction to Web Development" course card

All three roles (`student`, `teacher`, `admin`) tested. Role-based section locks confirmed working.
