# Moodle Backend — Docker Setup

Runs Moodle 4.3 LTS + PostgreSQL 16 as the headless backend for the Next.js frontend.

The same `docker-compose.yml` works on your laptop and on a production server (Contabo, DigitalOcean, etc.) — only the env vars change.

---

## Local development (laptop)

### 1. Start Docker Desktop
The Docker daemon must be running. On macOS: open the Docker Desktop app.

### 2. Bring the stack up
```bash
cd infra/moodle
docker compose up -d
```

First boot takes **2–4 minutes** while Bitnami installs Moodle, runs migrations, and creates the admin user. Watch progress with:
```bash
docker compose logs -f moodle
```
Wait until you see `** Starting cron **` or similar — that means it's ready.

### 3. Configure web services (one-shot, idempotent)
```bash
./setup-webservices.sh
```
This enables web services, creates the "Dashboard API" external service, attaches all required functions, and generates an API token. The token is printed and saved to `.token` (gitignored).

### 4. Wire the token into the frontend
Copy the values printed by the setup script into `frontend/.env.local`:
```
MOODLE_URL=http://localhost:8080
NEXT_PUBLIC_MOODLE_URL=http://localhost:8080
MOODLE_TOKEN=<the long hex string the script printed>
MOODLE_AUTH_SERVICE=dashboard_api
```

### 5. Verify
```bash
cd ../../frontend
npm run dev
# in another terminal:
curl http://localhost:3000/api/moodle/ping
```
Expected response:
```json
{
  "ok": true,
  "sitename": "Ezay Tech LMS",
  "release": "4.3...",
  "username": "admin",
  ...
}
```

If you see `ok: false`, check `docker compose logs moodle` and the message field.

### 6. Log in to the Moodle admin UI
- URL: <http://localhost:8080/login/>
- User: `admin` (or whatever you set in `.env`)
- Password: from `infra/moodle/.env`

---

## Common commands

| Task | Command |
|---|---|
| Stop the stack | `docker compose down` |
| Stop + delete all data | `docker compose down -v` |
| Tail logs | `docker compose logs -f moodle` |
| Restart Moodle only | `docker compose restart moodle` |
| Shell into the container | `docker exec -it ezay-moodle-app bash` |
| Run Moodle CLI | `docker exec -u daemon ezay-moodle-app php /opt/bitnami/moodle/admin/cli/<script>.php` |
| Re-run web service setup | `./setup-webservices.sh` (safe, idempotent) |

---

## Production deployment (Contabo / DigitalOcean / any VPS)

The same compose file works on a server. Steps:

### 1. Provision a VPS
- **Contabo VPS S** — ~$7/mo, 4 CPU, 8 GB RAM, 200 GB SSD (recommended for budget)
- **DigitalOcean** — $12/mo, 1 CPU, 2 GB RAM
- Ubuntu 22.04 LTS

### 2. Install Docker on the server
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER  # log out + back in
```

### 3. Copy this directory to the server
```bash
# from your laptop
scp -r infra/moodle root@<server-ip>:/opt/
```

### 4. Set production env vars
On the server, edit `/opt/moodle/.env`:
```
POSTGRES_PASSWORD=<generate strong password>
MOODLE_ADMIN_PASSWORD=<generate strong password>
MOODLE_ADMIN_EMAIL=admin@<your-domain>
MOODLE_HOST=lms.ezaytech.com   # or whatever domain you point at this server
MOODLE_HTTP_PORT=80
MOODLE_HTTPS_PORT=443
```

### 5. Point DNS
Add an A record: `lms.ezaytech.com` → `<server-ip>`

### 6. Bring it up
```bash
cd /opt/moodle
docker compose up -d
# wait ~3 minutes
./setup-webservices.sh
```

### 7. Add SSL (Let's Encrypt)
For production, put **Caddy** or **Nginx + certbot** in front of Moodle on ports 80/443.
Easiest option — add this Caddy service to `docker-compose.yml`:
```yaml
caddy:
  image: caddy:2-alpine
  restart: unless-stopped
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./Caddyfile:/etc/caddy/Caddyfile
    - caddy_data:/data
  networks:
    - moodlenet
```
And a minimal `Caddyfile`:
```
lms.ezaytech.com {
    reverse_proxy moodle:8080
}
```
Then change Moodle's port mapping so it's no longer exposed directly, and Caddy auto-fetches a Let's Encrypt cert.

### 8. Point the frontend at production Moodle
In Vercel's project settings → Environment Variables:
```
MOODLE_URL=https://lms.ezaytech.com
NEXT_PUBLIC_MOODLE_URL=https://lms.ezaytech.com
MOODLE_TOKEN=<production token from setup-webservices.sh>
```

---

## What the setup script does

`setup-webservices.sh` performs the manual steps documented in [CLAUDE.md §5](../../CLAUDE.md) automatically:

1. Enables web services (`enablewebservices=1`)
2. Enables the REST protocol (`webserviceprotocols=rest`)
3. Creates an external service named "Dashboard API" with shortname `dashboard_api`
4. Attaches 14 functions covering student / instructor / admin needs (matches `frontend/lib/moodle/client.ts`)
5. Generates a permanent token for the admin user against that service
6. Writes the token to `.token` and prints it

It's safe to re-run — existing records are skipped, only missing ones are added.

---

## Troubleshooting

### `/api/moodle/ping` returns `ok: false` with `invalidtoken`
- Check `MOODLE_TOKEN` in `frontend/.env.local` matches the contents of `infra/moodle/.token`
- Restart the Next.js dev server after changing env vars

### `ok: false` with `accessexception` or `nopermissions`
- The admin user might not have the required capability. Re-run `./setup-webservices.sh`.

### Container won't start, logs show DB connection errors
- Postgres takes a moment to be ready on first boot. `docker compose down && docker compose up -d` and wait.

### "Web service is not available" in Moodle UI
- Run `./setup-webservices.sh` — it sets `enablewebservices=1` which the Bitnami image leaves off by default.

### Want to wipe and start over
```bash
docker compose down -v   # -v deletes volumes (all Moodle data!)
docker compose up -d
./setup-webservices.sh
```
