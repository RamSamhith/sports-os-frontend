# RENDER DEPLOYMENT CHECKLIST

**Date:** 2026-06-12
**Backend Commit:** `ec24443` (Phase 1-6 complete)
**Repository:** `varshitha-2345/sportsOS-nodejs`
**Branch:** `main`

---

## Deployment Status: ⚠️ DEPLOYED BUT BROKEN

The new code IS deployed on Render. However, **all POST endpoints are broken** due to an Express 5 body-parsing incompatibility.

---

## Verified Configuration

| Setting | Expected | Actual | Status |
|---------|----------|--------|--------|
| Repository | `varshitha-2345/sportsOS-nodejs` | Correct | ✅ |
| Branch | `main` | `main` | ✅ |
| Root directory | `/` (root of repo) | Correct | ✅ |
| Build command | `npm install` | Auto-detected | ✅ |
| Start command | `node index.js` | Auto-detected | ✅ |
| Node version | Default (18+) | Render default | ✅ |

---

## Environment Variables

| Variable | Required | On Render | Status |
|----------|----------|-----------|--------|
| `MONGO_URI` | Yes | Yes (existing) | ✅ |
| `JWT_SECRET` | Yes | Yes (existing) | ✅ |
| `MONGODB_URI` | Yes (seeds) | **NOT SET** | ⚠️ Must set for seeds |
| `PORT` | No | Auto-assigned | ✅ |

---

## CRITICAL: Express 5 Body Parsing Bug

### Problem

Express 5 (`express@^5.2.1`) **removed** the built-in `express.json()` and `express.urlencoded()` body parsers. The current code uses `app.use(express.json())` which silently fails — `req.body` is `undefined` for all POST requests.

### Evidence

```bash
# This returns "Bad Request" (Express 5 default error)
curl -X POST https://sportsos-nodejs.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"x@x.com","password":"test1234"}'

# This returns our error envelope (body is undefined)
curl -X POST https://sportsos-nodejs.onrender.com/auth/register \
  -d "name=Test&email=x@x.com&password=test1234"
# Response: {"ok":false,"error":{"code":"SERVER_ERROR","message":"Cannot destructure property 'name' of 'req.body' as it is undefined."}}
```

### Impact

| Endpoint | Method | Status |
|----------|--------|--------|
| `/auth/register` | POST | BROKEN |
| `/auth/login` | POST | BROKEN |
| `/shortlist` | POST | BROKEN |
| `/enquiries` | POST | BROKEN |
| `/academies` | POST (admin) | BROKEN |
| `/coaches` | POST | BROKEN |
| All GET endpoints | GET | WORKING |

### Fix

**Option A (Recommended):** Install `body-parser` and use it explicitly

```bash
cd sportsOS-nodejs
npm install body-parser
```

Then in `index.js`:
```js
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
```

**Option B:** Use Express 5's built-in alternative (if available)

```js
// Express 5 may provide this differently
app.use(express.json({ type: 'application/json' }));
```

---

## Additional Issues Found

### Auth Middleware Inconsistent Format

`authMiddleware.js` returns `{ message: 'No token...' }` instead of `{ ok: false, error: { code, message } }`. The frontend `client.ts` expects the envelope format.

### Coach Routes Unprotected

`POST /coaches`, `PUT /coaches/:id`, `DELETE /coaches/:id` have no `protect` middleware.

---

## Pre-Deployment Checklist

- [x] Code pushed to `main`
- [x] Render detected the push
- [x] Build succeeded (`npm install`)
- [x] Service started (`node index.js`)
- [x] Root endpoint responds
- [x] GET endpoints work
- [ ] **FIX: Install `body-parser` and update `index.js`**
- [ ] **FIX: Add `protect` to coach routes**
- [ ] **FIX: Update auth middleware response format**
- [ ] Push fix commit
- [ ] Wait for Render auto-deploy
- [ ] Verify POST endpoints work
- [ ] Set `MONGODB_URI` env var on Render
- [ ] Run seed scripts
