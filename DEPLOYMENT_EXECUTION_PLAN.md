# DEPLOYMENT EXECUTION PLAN

**Date:** 2026-06-12
**Prepared by:** opencode

---

## Repository Map

| Repository | URL | Branch | Role |
|------------|-----|--------|------|
| Frontend | `https://github.com/RamSamhith/sports-os-frontend.git` | `backend-integration` | Next.js app |
| Backend | `https://github.com/varshitha-2345/sportsOS-nodejs.git` | `main` | Express API |

**Render is connected to:** `varshitha-2345/sportsOS-nodejs` (backend repo)

---

## Uncommitted Changes

### Backend (`sportsOS-nodejs/`)

**Modified (13 files):**
```
controllers/academyController.js
controllers/athleteController.js
controllers/authController.js
controllers/coachController.js
controllers/shortlistController.js
index.js
models/Academy.js
models/Athlete.js
models/Coach.js
models/Shortlist.js
models/User.js
package.json
package-lock.json
repositories/academyRepository.js
repositories/coachRepository.js
repositories/shortlistRepository.js
```

**New (7 files):**
```
controllers/enquiryController.js
models/Enquiry.js
repositories/enquiryRepository.js
seeds/seedAcademies.js
seeds/seedCoaches.js
utils/response.js
```

### Frontend (root repo)

**Modified (4 files):**
```
app/(private)/profile/enquiries/page.tsx
app/(public)/enquiry/[type]/[id]/page.tsx
components/enquiry/enquiry-form.tsx
lib/api/enquiries.ts
```

---

## Environment Variables

### Render Service (Backend)
| Variable | Value | Notes |
|----------|-------|-------|
| `MONGO_URI` | (already set) | MongoDB connection string |
| `JWT_SECRET` | (already set) | Token signing secret |
| `MONGODB_URI` | **MUST SET** | Same value as `MONGO_URI` — needed by seed scripts |

### Frontend (.env.local)
| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://sportsos-nodejs.onrender.com` | Already set |

---

## Seed Script Details

### seedAcademies.js
- Connects to `process.env.MONGODB_URI`
- Clears all existing academies (`deleteMany({})`)
- Inserts 12 academies with new schema
- Run FIRST (coaches depend on academies)

### seedCoaches.js
- Connects to `process.env.MONGODB_URI`
- Reads existing academies to link `academyId`
- Clears all existing coaches (`deleteMany({})`)
- Inserts 8 coaches with new schema
- Run SECOND (depends on academies existing)

---

## Deployment Steps

### Phase A: Backend Commit & Push

```bash
# 1. Navigate to backend repo
cd sportsOS-nodejs

# 2. Stage all changes
git add -A

# 3. Verify what's staged
git status

# 4. Commit
git commit -m "Phase 1-6: Backend rewrite — auth, academies, coaches, shortlist, enquiries"

# 5. Push to main
git push origin main
```

### Phase B: Render Auto-Deploy

1. Render detects push to `main`
2. Runs `npm install` (installs `cors` package)
3. Starts `node index.js`
4. Wait for deploy to complete (~2-5 minutes)

### Phase C: Verify Deployment

```bash
# Root
curl https://sportsos-nodejs.onrender.com/

# Academies (should return new schema)
curl https://sportsos-nodejs.onrender.com/academies

# Auth register
curl -X POST https://sportsos-nodejs.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test1234"}'
```

### Phase D: Database Migration

**Via MongoDB Atlas UI or MongoDB Compass:**

1. Open MongoDB Atlas → Browse Collections
2. Select your database
3. Drop these collections:
   - `academies`
   - `coaches`
   - `shortlists` (if exists)
4. Keep `users` collection (backward compatible)

### Phase E: Run Seed Scripts

**Option 1: Run locally against production DB**

```bash
# Set MONGODB_URI to your Render MongoDB connection string
export MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>"

cd sportsOS-nodejs
node seeds/seedAcademies.js
node seeds/seedCoaches.js
```

**Option 2: Run via Render Shell (if available)**

```bash
# In Render Dashboard → Shell
export MONGODB_URI="$MONGO_URI"
node seeds/seedAcademies.js
node seeds/seedCoaches.js
```

### Phase F: Post-Seed Verification

```bash
# Should return 12 academies
curl https://sportsos-nodejs.onrender.com/academies | jq '.length'

# Should return 8 coaches
curl https://sportsos-nodejs.onrender.com/coaches | jq '.length'

# Should return single academy by slug
curl https://sportsos-nodejs.onrender.com/academies/by-slug/national-cricket-academy-bengaluru
```

### Phase G: Frontend Deploy

```bash
# From root repo
git add -A
git commit -m "Phase 6: Enquiry integration"
git push origin backend-integration
```

---

## Execution Order

| Step | Action | Risk | Time |
|------|--------|------|------|
| 1 | Commit backend | None | 1 min |
| 2 | Push backend | None | 1 min |
| 3 | Wait for Render deploy | None | 2-5 min |
| 4 | Verify deployment | None | 2 min |
| 5 | Drop old collections | **HIGH** — irreversible | 1 min |
| 6 | Run seedAcademies.js | Low — replaces data | 1 min |
| 7 | Run seedCoaches.js | Low — replaces data | 1 min |
| 8 | Verify seeds | None | 2 min |
| 9 | Test auth flow | None | 3 min |
| 10 | Test shortlist flow | None | 2 min |
| 11 | Test enquiry flow | None | 2 min |
| 12 | Commit frontend | None | 1 min |
| 13 | Push frontend | None | 1 min |
| 14 | End-to-end test | None | 5 min |

**Total estimated time:** ~30 minutes
