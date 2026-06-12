# PRODUCTION READINESS REPORT

**Date:** 2026-06-12
**Backend URL:** https://sportsos-nodejs.onrender.com
**Frontend:** Next.js (Vercel / local)

---

## Feature Readiness Classification

| Feature | Status | Reason |
|---------|--------|--------|
| **Academies** | NEEDS_DEPLOYMENT | Local code works; Render runs old schema |
| **Coaches** | NEEDS_DEPLOYMENT | Local code works; Render has no coaches |
| **Authentication** | NEEDS_DEPLOYMENT | Local code works; Render returns Bad Request |
| **Shortlist** | NEEDS_DEPLOYMENT | Local code works; Render has old schema |
| **Enquiries** | NEEDS_DEPLOYMENT | Local code works; Render has no route |
| **Academy Detail Page** | NEEDS_DEPLOYMENT | Depends on `/academies/by-slug/*` |
| **Coach Detail Page** | NEEDS_DEPLOYMENT | Depends on `/coaches/by-slug/*` |
| **Enquiry Form** | NEEDS_DEPLOYMENT | Depends on `POST /enquiries` |
| **Profile Enquiries** | NEEDS_DEPLOYMENT | Depends on `GET /enquiries/me` |
| **Shortlist Page** | NEEDS_DEPLOYMENT | Depends on `GET /shortlist/me` |
| **Compare** | BROKEN | Not implemented (static data only) |
| **Profile System** | BROKEN | Not implemented (static data only) |
| **WhatsApp Confirmations** | BROKEN | Not implemented |
| **OTP Verification** | BROKEN | Not implemented (routes missing) |
| **Admin Panel** | BROKEN | Placeholder pages only |

---

## Database Readiness

| Check | Status | Detail |
|-------|--------|--------|
| MongoDB connection | READY | Render has `MONGO_URI` env var |
| Academy collection | NEEDS_MIGRATION | Old schema (4 records) → New schema (12 records) |
| Coach collection | NEEDS_MIGRATION | Empty → 8 records |
| Shortlist collection | NEEDS_MIGRATION | Old schema → New schema |
| Enquiry collection | NEEDS_MIGRATION | Does not exist → Create |
| User collection | READY | Backward compatible |

---

## Environment Variables

| Variable | Required | On Render | Notes |
|----------|----------|-----------|-------|
| `MONGO_URI` | Yes | Yes | Connection string |
| `MONGODB_URI` | Yes (seeds) | Unknown | Same value as `MONGO_URI` |
| `JWT_SECRET` | Yes | Yes | Token signing |
| `PORT` | No | Auto | Render assigns |

---

## Build Status

| Component | Local Build | Notes |
|-----------|-------------|-------|
| Frontend | PASSES (78/78) | `npx next build` succeeds |
| Backend | N/A (no build step) | Node.js runtime |

---

## Overall Assessment

**PRODUCTION READINESS: NOT READY**

All features are implemented locally but nothing is deployed. The Render service is running original code that is incompatible with the frontend. A full deployment + database migration is required.

---

## Deployment Checklist

### Pre-Deployment
- [ ] Ensure Render service is connected to `sportsOS-nodejs` git repo
- [ ] Ensure `MONGO_URI` env var is set on Render
- [ ] Ensure `JWT_SECRET` env var is set on Render

### Step 1: Commit & Push Backend Changes
- [ ] `cd sportsOS-nodejs`
- [ ] `git add -A`
- [ ] `git commit -m "Phase 1-6: Full backend rewrite — auth, academies, coaches, shortlist, enquiries"`
- [ ] `git push origin main`

### Step 2: Wait for Render Auto-Deploy
- [ ] Monitor Render dashboard for build progress
- [ ] Verify deploy succeeds (no build errors)
- [ ] Verify `cors` package installs (`npm install`)

### Step 3: Verify Deployment
- [ ] `GET /` → `200 Sports OS API is Running!`
- [ ] `GET /academies` → `200` with new schema
- [ ] `GET /coaches` → `200` (may be empty before seed)

### Step 4: Run Database Migration
- [ ] Connect to MongoDB (MongoDB Compass or Atlas UI)
- [ ] Drop `academies` collection
- [ ] Drop `coaches` collection
- [ ] Drop `shortlists` collection (if exists)
- [ ] Create `enquiries` collection (or let Mongoose auto-create)

### Step 5: Run Seed Scripts
- [ ] Set `MONGODB_URI` locally (same as Render's `MONGO_URI`)
- [ ] `cd sportsOS-nodejs`
- [ ] `node seeds/seedAcademies.js` → Expect 12 academies
- [ ] `node seeds/seedCoaches.js` → Expect 8 coaches

### Step 6: Post-Seed Verification
- [ ] `GET /academies` → 12 records with new schema
- [ ] `GET /coaches` → 8 records with new schema
- [ ] `GET /academies/by-slug/sports-academy-hyderabad` → single academy
- [ ] `GET /coaches/by-slug/rajan-sharma` → single coach

### Step 7: Test Authentication
- [ ] `POST /auth/register` → `{ ok: true, data: { token, user } }`
- [ ] `POST /auth/login` → `{ ok: true, data: { token, user } }`
- [ ] Use token for authenticated requests

### Step 8: Test Shortlist
- [ ] `POST /shortlist` with auth → `201`
- [ ] `GET /shortlist/me` with auth → list of items
- [ ] `DELETE /shortlist/:id` with auth → removed

### Step 9: Test Enquiries
- [ ] `POST /enquiries` → `201` (auth optional)
- [ ] `GET /enquiries/me` with auth → list of enquiries

### Step 10: Frontend Deployment
- [ ] Ensure `.env.local` has `NEXT_PUBLIC_API_URL=https://sportsos-nodejs.onrender.com`
- [ ] Deploy frontend (Vercel / `next build && next start`)
- [ ] Test full flow: browse academies → save to shortlist → submit enquiry

### Rollback Plan
- [ ] Keep old `sportsOS-nodejs` git tag before push
- [ ] If deployment fails, redeploy from old tag on Render
- [ ] If DB migration fails, restore from MongoDB backup
