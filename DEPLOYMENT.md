# Ezay Tech LMS — Production Deployment Runbook

> **Architecture:** Next.js frontend on **Vercel** (free) + Moodle backend on a **cheap Docker VPS** (~$5–12/mo). The two talk over HTTPS via Moodle's web-service API.
>
> Total fixed cost: **~$6–13/month** + domain (~$1/mo amortized).

This runbook is copy-and-run. All the config files it references already live in
[`infra/moodle/`](infra/moodle/).

---

## Prerequisites (you provide these)

| What | Where to get it | Needed for |
|---|---|---|
| A VPS (Ubuntu 22.04) | Contabo VPS S (~$5), DigitalOcean ($6–12), Hetzner CX22 (~€4), or AWS Lightsail | Moodle backend |
| A domain | Truehost / Safaricom (`.co.ke`), or any registrar | Both |
| A Vercel account | <https://vercel.com> (free, sign in with GitHub) | Frontend |
| GitHub repo access | Already done — `remydev47/eazy_learn` | Frontend |

Pick **one** subdomain scheme up front, e.g.:
- `ezaytech.co.ke` and `www.ezaytech.co.ke` → **Vercel** (frontend)
- `lms.ezaytech.co.ke` → **VPS** (Moodle)

---

## Part 1 — Moodle backend on the VPS

### 1.1 Create + harden the server
```bash
# On the VPS as root (after first SSH login)
apt update && apt upgrade -y
# Create a non-root sudo user (optional but recommended)
adduser deploy && usermod -aG sudo deploy
# Firewall: allow SSH + web only
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable
```

### 1.2 Install Docker
```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER   # then log out and back in so the group applies
docker compose version     # confirm Compose v2 is present
```

### 1.3 Copy the infra files to the server
```bash
# From your LAPTOP, in the repo root:
scp -r infra/moodle <user>@<server-ip>:/opt/moodle
```

### 1.4 Set production secrets
```bash
# On the SERVER:
cd /opt/moodle
cp .env.prod.example .env
nano .env        # replace every <...> with a real value
```
Generate strong values with `openssl rand -base64 24`. Set `MOODLE_HOST=lms.ezaytech.co.ke`.

### 1.5 Point DNS at the server
At your registrar, add an **A record**:
```
lms.ezaytech.co.ke   →   <server-ip>
```
Wait for it to resolve (`dig +short lms.ezaytech.co.ke` should return the IP) **before** the next step — Caddy needs it to issue the TLS cert.

### 1.6 Bring up the stack
```bash
cd /opt/moodle
docker compose -f docker-compose.prod.yml up -d
```
First boot takes **3–4 minutes** (Moodle installs + migrates). Watch:
```bash
docker compose -f docker-compose.prod.yml logs -f moodle
```
Caddy fetches a Let's Encrypt cert automatically once DNS resolves and 80/443 are open.

### 1.7 Enable web services + generate the production token
```bash
cd /opt/moodle
./setup-webservices.sh
```
Copy the token it prints — that's your **production `MOODLE_TOKEN`** for Vercel.
(It's also saved to `/opt/moodle/.token`.)

### 1.8 Verify the backend
```bash
curl -s "https://lms.ezaytech.co.ke/webservice/rest/server.php?wstoken=<TOKEN>&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json"
```
You should get JSON with `"sitename":"Ezay Tech LMS"`. Also open
`https://lms.ezaytech.co.ke/login/` in a browser — valid padlock, Moodle login page.

---

## Part 2 — Frontend on Vercel

### 2.1 Import the repo
1. <https://vercel.com> → **Add New… → Project** → import `remydev47/eazy_learn`.
2. **Root Directory:** set to `frontend` (the Next.js app is not at repo root).
3. Framework preset: **Next.js** (auto-detected). Leave build/output defaults.

### 2.2 Set environment variables
In the Vercel project → **Settings → Environment Variables**, add (Production scope):

| Key | Value |
|---|---|
| `MOODLE_URL` | `https://lms.ezaytech.co.ke` |
| `NEXT_PUBLIC_MOODLE_URL` | `https://lms.ezaytech.co.ke` |
| `MOODLE_TOKEN` | *(production token from step 1.7)* |
| `MOODLE_AUTH_SERVICE` | `moodle_mobile_app` |
| `AUTH_SECRET` | *(generate fresh: `openssl rand -base64 32`)* |
| `AUTH_URL` | `https://ezaytech.co.ke` |
| `AUTH_TRUST_HOST` | `true` |
| `RESEND_API_KEY` | *(once the domain is verified in Resend; optional at first)* |
| `RESEND_FROM` | `contact@ezaytech.co.ke` |
| `CONTACT_EMAIL` | `admin@ezaytech.co.ke` |

> **Do NOT reuse the local-dev `AUTH_SECRET` or `MOODLE_TOKEN`.** Generate fresh for production.

### 2.3 Deploy + attach the domain
1. Click **Deploy**. The build is decoupled from Moodle (ISR + graceful fallback), so it succeeds even if Moodle is briefly unreachable.
2. Project → **Settings → Domains** → add `ezaytech.co.ke` and `www.ezaytech.co.ke`.
3. Vercel shows the exact DNS records to add at your registrar (an A record for the apex and/or a CNAME for `www`). Add them. SSL is automatic.

---

## Part 3 — Post-deploy smoke test

```bash
# Frontend up
curl -s -o /dev/null -w "%{http_code}\n" https://ezaytech.co.ke            # 200
curl -s -o /dev/null -w "%{http_code}\n" https://ezaytech.co.ke/courses    # 200
# Login flow (in a browser): sign in as admin → lands on /dashboard/admin
```
- Catalog shows the live courses.
- Course detail "Enroll"/"Resume" links now point at `https://lms.ezaytech.co.ke` (real, not localhost).
- Contact form sends mail (once Resend is wired).

---

## Part 4 — Before you call it "launched"

These are tracked in [`PROJECT_STATUS.md`](PROJECT_STATUS.md); the deploy-blocking ones:

- [ ] **Remove the demo-credentials block** from `frontend/app/login/page.tsx`.
- [ ] **Rotate** the local-dev Moodle token (the production one from 1.7 is separate — good).
- [ ] Confirm the real **logo / brand palette / wordmark** (`EazyTech` vs `Ezay Tech`).
- [ ] **Payments (Paystack)** — M-Pesa + cards via Paystack; separate build. Test mode works now; live mode gated on business registration + Kenyan bank account.
- [ ] Set up **backups** for `/opt/moodle` volumes (see below).

---

## Ongoing operations

| Task | Command (on the VPS, in `/opt/moodle`) |
|---|---|
| Tail logs | `docker compose -f docker-compose.prod.yml logs -f moodle` |
| Restart Moodle | `docker compose -f docker-compose.prod.yml restart moodle` |
| Update images | `docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d` |
| Re-run WS setup | `./setup-webservices.sh` (idempotent) |
| **Backup DB** | `docker exec ezay-moodle-db pg_dump -U moodle moodle > backup-$(date +%F).sql` |
| **Backup uploads** | `docker run --rm -v moodle_moodle_files:/d -v $PWD:/b alpine tar czf /b/moodledata-$(date +%F).tgz -C /d .` |

Automate the two backups with a daily cron and copy them off-box (e.g. to object storage).

---

## Cost summary

| Item | Monthly |
|---|---|
| VPS (Contabo S / Hetzner CX22) | ~$5 |
| Vercel (frontend) | $0 |
| Domain (amortized) | ~$1 |
| Resend email (free tier) | $0 |
| **Total** | **~$6** |

Optional later: object storage for recordings (~$5–10), managed Postgres, custom Moodle theme.
