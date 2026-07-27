# Anuverse Web — Agent Handoff Notes

> Last updated by Replit Agent, July 24 2026.
> Read this before touching anything.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Vite (port 5000) |
| Backend | FastAPI + Uvicorn (port 8000, auto-reload) |
| Database | MongoDB 7.0 on external VPS (148.113.27.147) |
| Auth | JWT via `python-jose`, stored as HttpOnly cookie named `access_token` |
| Password hashing | `passlib[bcrypt]` |
| Async HTTP | `httpx` (used for Google OAuth session exchange) |
| File uploads | `python-multipart` (multipart form for payment screenshots) |

---

## Secrets (already set in Replit Secrets)

| Key | Purpose |
|---|---|
| `MONGODB_URL` | `mongodb://veltrion:<pw>@148.113.27.147:27017/veltrion?authSource=admin` |
| `JWT_SECRET` | Signs/verifies JWT tokens |
| `UPI_ID` | **NOT SET YET** — UPI ID for payment QR codes (e.g. `veltrion@upi`). Falls back to `"veltrion@upi"` placeholder. |
| `SESSION_SECRET` | Pre-existing Replit secret |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | For pushing to GitHub |

---

## Running the project

Two workflows, both auto-start:

```bash
# Frontend (webview, port 5000)
npm run dev

# Backend (console, port 8000)
python -m backend.run
```

Vite proxies `/api/*` → `http://localhost:8000` — so frontend calls `/api/...` with no CORS issues.

---

## Backend structure

```
backend/
  main.py          # FastAPI app, lifespan, CORS, router registration
  run.py           # uvicorn entrypoint
  auth.py          # JWT helpers: create_access_token, get_current_user, require_admin
  database.py      # Motor async MongoDB client, connect_db / close_db / get_db
  models/
    user.py        # UserCreate, UserLogin, UserOut, UserInDB
    order.py       # OrderCreate, OrderOut, OrderInDB, short_ref() → "ANU-XXXXXX"
  routes/
    auth.py        # /api/auth/* endpoints
    users.py       # /api/users/* endpoints
    orders.py      # /api/orders/* endpoints
    plans.py       # /api/plans, /api/vps-plans (hardcoded catalogues + find_plan helper)
```

---

## API surface

### Auth
```
POST /api/auth/register         — name, email, password (min 8) → sets cookie
POST /api/auth/login            — email, password → sets cookie
POST /api/auth/logout           — clears cookie
POST /api/auth/google-session   — { session_id } → calls auth.emergentagent.com → sets cookie
GET  /api/auth/me               — returns current user from cookie
```

### Plans (no auth)
```
GET  /api/plans                 — Minecraft plans (basic + premium, pet-themed names)
GET  /api/plans/{category_id}
GET  /api/vps-plans             — VPS plans (intel_xeon + amd_epyc + amd_ryzen)
GET  /api/vps-plans/{category_id}
```

### Orders (auth required)
```
POST   /api/orders                    — create order, returns { order_ref, upi_uri, amount, plan_name }
POST   /api/orders/{ref}/paid         — multipart: utr (str) + screenshot (image) → saves base64
GET    /api/orders/user/{user_id}     — list user's orders (admin can fetch any)
GET    /api/orders/{order_id}
PATCH  /api/orders/{order_id}/status  — admin only: update status + provision_status
PATCH  /api/orders/{order_id}/provision — admin only: set server, panel_url, server_password, etc.
```

---

## MongoDB collections

### `users`
```
_id, name, email, password_hash, role ("user"|"admin"), created_at, google_id?
```

### `orders`
```
_id, order_ref ("ANU-XXXXXX"), user_id, user_email, customer_name, discord,
plan_id, plan_name, plan_category ("vps"|"minecraft"),
billing_cycle ("monthly"|"quarterly"|"annually"),
price, ram, vcores, disk,
status ("pending"|"paid"|"rejected"),
provision_status ("unpaid"|"provisioning"|"provisioned"|"failed"),
utr, payment_screenshot (base64 data URI),
server (Pterodactyl server ID/username), panel_url, server_password, provision_error,
created_at
```

---

## Auth flow

- Cookie name: `access_token` (HttpOnly, Secure, SameSite=Lax, 7-day expiry)
- JWT payload: `{ sub: user_id, email, role, exp }`
- `get_current_user` = FastAPI Depends → extracts cookie → decodes JWT → fetches user from DB
- `require_admin` = same but also checks `role == "admin"`, raises 403 otherwise

---

## What's NOT done yet (known gaps)

- `UPI_ID` secret not set — add it to Replit Secrets
- No admin panel / dashboard UI
- No frontend integration with the backend (all frontend pages still use hardcoded data)
- No email verification or password reset flow
- No Pterodactyl provisioning automation
- Payment screenshot stored as base64 in MongoDB — fine for now but will bloat the DB at scale; consider moving to S3/R2 later
- No rate limiting on auth endpoints

---

## VPS details

- Host: `148.113.27.147`
- MongoDB user: `veltrion`, auth DB: `admin`, app DB: `veltrion`
- Auth enabled in `/etc/mongod.conf` (`security.authorization: enabled`)
- UFW rule open on port 27017
- The hostname `anuverse` doesn't resolve (cosmetic sudo warning) — fix: `echo "127.0.0.1 anuverse" >> /etc/hosts`

---

## GitHub

Repo: `https://github.com/victusxxgaming-design/Anuverse-Web`
Branch: `main`
Push with: `git -c "url.https://$GITHUB_PERSONAL_ACCESS_TOKEN@github.com/.insteadOf=https://github.com/" push origin main`
(Replit's built-in GitHub integration is not linked — use the token directly)
