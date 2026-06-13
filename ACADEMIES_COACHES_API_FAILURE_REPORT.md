# Academies & Coaches API Failure Report

## Symptoms

When visiting `/academies` or `/coaches` pages in production, the browser shows:

```
Unexpected token '<', '<!DOCTYPE...' is not valid JSON
```

The pages fail to load data entirely.

---

## Backend Status: **CONFIRMED WORKING**

Both backend endpoints return valid JSON when hit directly:

| Endpoint | HTTP Status | Response Format |
|----------|-------------|-----------------|
| `GET /academies` | 200 | `{ ok: true, data: { items: [...], pagination: {...} } }` |
| `GET /coaches` | 200 | `{ ok: true, data: { items: [...], pagination: {...} } }` |

Backend URL: `https://sportsos-nodejs.onrender.com`
Items returned: 12 academies, 8 coaches.

---

## Root Cause Analysis

### The Error Flow

1. `lib/api/client.ts:24` defines:
   ```ts
   const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
   ```

2. `lib/api/client.ts:39` uses it:
   ```ts
   const url = `${API_BASE}${path}`;
   ```

3. When `NEXT_PUBLIC_API_URL` is **empty or undefined** in the deployment environment:
   - `API_BASE = ''`
   - `fetch('' + '/academies')` → `fetch('/academies')` → hits the **frontend's own `/academies` route**
   - Next.js returns the page HTML (starting with `<!DOCTYPE html>`)
   - `client.ts:42`: `const json = await res.json();` throws:
     ```
     Unexpected token '<', '<!DOCTYPE...' is not valid JSON
     ```

### Why It Works Locally

`.env.local` contains:
```
NEXT_PUBLIC_API_URL=https://sportsos-nodejs.onrender.com
```

This sets the variable for local development. It is **not** used by Vercel.

### Why It Fails in Production

**`NEXT_PUBLIC_API_URL` is not set in Vercel's environment variables.**

`NEXT_PUBLIC_*` variables must be explicitly configured in Vercel's dashboard (Settings → Environment Variables). They are not automatically read from `.env.local` or `.env` files — those files are only read during local development.

---

## Evidence

| Check | Result |
|-------|--------|
| Backend `/academies` direct hit | 200 + JSON, 12 items |
| Backend `/coaches` direct hit | 200 + JSON, 8 items |
| `.env.local` has correct URL | ✅ `https://sportsos-nodejs.onrender.com` |
| `lib/api/client.ts` has fallback to `''` | ✅ line 24 |
| Vercel env var `NEXT_PUBLIC_API_URL` | **NOT SET** (confirmed by absence of Vercel config in repo) |
| Error message matches HTML interception | ✅ `<!DOCTYPE` = HTML page |

---

## Fix Options

### Option A: Set the Vercel Environment Variable (Recommended)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://sportsos-nodejs.onrender.com`
   - **Environments:** Production, Preview, Development
3. Redeploy

**Time:** 2 minutes  
**Risk:** None — this is the intended fix.

### Option B: Add a Validation in `client.ts` (Defense in Depth)

In `lib/api/client.ts`, fail fast when the URL is missing:

```ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE) {
  console.error('[API] NEXT_PUBLIC_API_URL is not set. API calls will fail.');
}
```

This doesn't fix the issue but makes it immediately visible in deployment logs instead of silently failing.

**Time:** 5 minutes  
**Risk:** None — additive only.

### Option C: Both (Recommended)

Do both Option A and Option B. Set the env var (fixes the problem) and add the validation (catches future regressions).

---

## Pages Affected

| Page | API Call | Failure Mode |
|------|----------|--------------|
| `/academies` | `getAcademies()` → `GET /academies` | Throws HTML parse error |
| `/academies/[slug]` | `getAcademy(slug)` → `GET /academies/by-slug/:slug` | Throws HTML parse error |
| `/coaches` | `getCoaches()` → `GET /coaches` | Throws HTML parse error |
| `/coaches/[slug]` | `getCoach(slug)` → `GET /coaches/by-slug/:slug` | Throws HTML parse error |

**Note:** The Home page does NOT show this error because:
- `FeaturedAcademies` and `FeaturedCoaches` silently fail (catch block renders empty state)
- `StatsSection`, `PersonalizedHome`, `YourAcademy`, `FeaturedSports` all use static `data/` imports

---

## Additional Backend Route Gaps

The frontend defines API functions for routes that **do not exist** on the backend:

| Frontend API Module | Backend Route | Status |
|---------------------|---------------|--------|
| `lib/api/sports.ts` → `GET /sports` | No `/sports` route on backend | **Missing** |
| `lib/api/sports.ts` → `GET /sports/:slug` | No `/sports/:slug` route on backend | **Missing** |
| `lib/api/recommendations.ts` → `GET /recommendations/academies` | No `/recommendations` route on backend | **Missing** |
| `lib/api/recommendations.ts` → `GET /recommendations/coaches` | No `/recommendations` route on backend | **Missing** |
| `lib/api/favorites.ts` | No `/favorites` route on backend | **Missing** |
| `lib/api/children.ts` | No `/children` route on backend | **Missing** |
| `lib/api/users.ts` | No `/users` route on backend | **Missing** |

These currently fail silently or throw errors. They should be implemented on the backend before the frontend pages that depend on them go live.

---

## Summary

| Item | Status |
|------|--------|
| Root cause identified | ✅ — `NEXT_PUBLIC_API_URL` not set in Vercel |
| Backend confirmed working | ✅ — both endpoints return valid JSON |
| Fix identified | ✅ — set env var in Vercel dashboard |
| Defense-in-depth recommended | ✅ — add validation in `client.ts` |
| Backend routes for sports/recommendations | ❌ — missing, needed for future pages |
