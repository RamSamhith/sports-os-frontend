# DATABASE MIGRATION CHECKLIST

**Date:** 2026-06-12
**Database:** MongoDB Atlas (via Render `MONGO_URI`)

---

## Current State

The Render service is connected to a MongoDB database that has **old schema** collections from the original code.

---

## Pre-Migration Verification

Before migrating, verify you have access to:

- [ ] MongoDB Atlas dashboard (or MongoDB Compass with connection string)
- [ ] `MONGODB_URI` environment variable (same as `MONGO_URI` on Render)
- [ ] Seed scripts committed: `seeds/seedAcademies.js`, `seeds/seedCoaches.js`

---

## Migration Steps

### Step 1: Backup (Optional but Recommended)

If Atlas backup is available:
1. Go to Atlas → Backup
2. Create a manual snapshot before migration

### Step 2: Drop Old Collections

In MongoDB Atlas UI or Compass:

| Collection | Action | Reason |
|------------|--------|--------|
| `academies` | DROP | Old schema (4 records, incompatible fields) |
| `coaches` | DROP | Empty or old schema |
| `shortlists` | DROP | Old schema (`athleteId` + `academyId`) |
| `enquiries` | N/A | Will be auto-created by Mongoose on first insert |
| `users` | KEEP | Backward compatible (new fields optional) |

**Commands (MongoDB shell):**
```js
db.academies.drop()
db.coaches.drop()
db.shortlists.drop()  // if exists
```

### Step 3: Verify Drop

```js
show collections
// Should show: users (only)
```

### Step 4: Set Environment Variable

On Render Dashboard → Environment → Add:

```
MONGODB_URI = <same value as MONGO_URI>
```

**Note:** Seed scripts use `MONGODB_URI`, the app uses `MONGO_URI`. They should point to the same database.

### Step 5: Run seedAcademies.js

**Option A: Run locally**
```bash
export MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>"
cd sportsOS-nodejs
node seeds/seedAcademies.js
```

**Option B: Run via Render Shell**
```bash
# In Render Dashboard → Shell
export MONGODB_URI="$MONGO_URI"
node seeds/seedAcademies.js
```

**Expected output:**
```
Connected to MongoDB
Cleared existing academies
Seeded 12 academies
Done
```

### Step 6: Run seedCoaches.js

```bash
node seeds/seedCoaches.js
```

**Expected output:**
```
Connected to MongoDB
Cleared existing coaches
Seeded 8 coaches
Done
```

**Note:** `seedCoaches.js` reads academies to link `academyId`. Must run AFTER `seedAcademies.js`.

### Step 7: Verify Seeded Data

```js
// In MongoDB shell
db.academies.countDocuments()  // Should be 12
db.coaches.countDocuments()    // Should be 8

// Or via API
curl https://sportsos-nodejs.onrender.com/academies | jq '.data.items | length'
// Should be 12

curl https://sportsos-nodejs.onrender.com/coaches | jq '.data.items | length'
// Should be 8
```

---

## Rollback

If migration fails:

1. Re-run seed scripts (they are idempotent — `deleteMany` + `insertMany`)
2. Or restore from Atlas backup (if available)

---

## Post-Migration Checklist

- [ ] `users` collection preserved
- [ ] `academies` collection has 12 records
- [ ] `coaches` collection has 8 records
- [ ] `shortlists` collection recreated (empty)
- [ ] `enquiries` collection will be auto-created on first insert
- [ ] Academy slugs match frontend expectations
- [ ] Coach slugs match frontend expectations
- [ ] Coach `academyId` references resolve correctly
