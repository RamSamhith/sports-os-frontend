# Seed Execution Plan

**Date:** June 12, 2026  
**Purpose:** Populate database with development data for MVP testing

---

## Expected Outcome

| Collection | Before | After | Records |
|------------|--------|-------|---------|
| `academies` | 0 | 12 | 12 academies |
| `coaches` | 1 (test) | 8 | 8 real coaches (test coach removed) |

---

## Seed Data Summary

### Academies (12)

| # | Slug | Sport | City | Status |
|---|------|-------|------|--------|
| 1 | `national-cricket-academy-bengaluru` | cricket | Bengaluru | verified |
| 2 | `mumbai-football-academy-andheri` | football | Mumbai | verified |
| 3 | `pullela-gopichand-badminton-academy-hyderabad` | badminton | Hyderabad | verified |
| 4 | `shiv-nadar-swimming-academy-chennai` | swimming | Chennai | verified |
| 5 | `delhi-tennis-academy-rukmini-devi` | tennis | New Delhi | verified |
| 6 | `pro-kabaddi-academy-pune` | kabaddi | Pune | pending |
| 7 | `hockey-india-academy-ludhiana` | hockey | Ludhiana | verified |
| 8 | `chess-gurukul-kolkata` | chess | Kolkata | verified |
| 9 | `tata-archery-academy-jamshedpur` | archery | Jamshedpur | verified |
| 10 | `yoga-and-gymnastics-tradition-bengaluru` | yoga, gymnastics | Bengaluru | verified |
| 11 | `aikido-and-karate-tradition-imphal` | karate | Imphal | unverified |
| 12 | `skating-academy-ahmedabad` | skating | Ahmedabad | pending |

### Coaches (8)

| # | Slug | Sport | City | Academy Link |
|---|------|-------|------|--------------|
| 1 | `rahul-dravid-cricket-bengaluru` | cricket | Bengaluru | national-cricket-academy-bengaluru |
| 2 | `anil-kumble-spin-bengaluru` | cricket | Bengaluru | national-cricket-academy-bengaluru |
| 3 | `saina-nehwal-badminton-hyderabad` | badminton | Hyderabad | pullela-gopichand-badminton-academy-hyderabad |
| 4 | `pankaj-advani-billiards-bengaluru` | chess | Bengaluru | chess-gurukul-kolkata |
| 5 | `viren-raquib-athletics-bengaluru` | athletics | Bengaluru | — |
| 6 | `sushil-kumar-wrestling-delhi` | wrestling | New Delhi | — |
| 7 | `mary-komar-boxing-rohtak` | boxing | Rohtak | — |
| 8 | `arjun-jadhav-table-tennis-pune` | table-tennis | Pune | — |

---

## Execution: Local Database

### Prerequisites
- MongoDB running locally on `mongodb://localhost:27017`
- Node.js installed
- `npm install` completed in `sportsOS-nodejs/`

### Commands

```bash
cd sportsOS-nodejs

# Set local MongoDB URI
set MONGO_URI=mongodb://localhost:27017/sportsos

# Step 1: Seed academies (must run first — coaches reference academies)
node seeds/seedAcademies.js

# Step 2: Seed coaches (links to academies by slug)
node seeds/seedCoaches.js
```

### PowerShell

```powershell
cd sportsOS-nodejs

$env:MONGO_URI = "mongodb://localhost:27017/sportsos"

node seeds/seedAcademies.js
node seeds/seedCoaches.js
```

### Expected Output

```
Connected to MongoDB
Cleared existing academies
Seeded 12 academies
Done

Connected to MongoDB
Cleared existing coaches
Seeded 8 coaches
Done
```

---

## Execution: Render Database

### Prerequisites
- Access to Render dashboard or `MONGO_URI` value
- Node.js installed locally
- `npm install` completed

### Commands

```bash
cd sportsOS-nodejs

# Replace with your actual Render MongoDB connection string
export MONGO_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"

# Step 1: Seed academies
node seeds/seedAcademies.js

# Step 2: Seed coaches
node seeds/seedCoaches.js
```

### PowerShell

```powershell
cd sportsOS-nodejs

$env:MONGO_URI = "mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"

node seeds/seedAcademies.js
node seeds/seedCoaches.js
```

### Finding MONGO_URI on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your `sportsOS-nodejs` service
3. Go to **Environment** tab
4. Copy the `MONGO_URI` value

---

## Execution: Alternative (Render Shell)

If you have Render Shell access:

1. Go to Render Dashboard → your service → **Shell** tab
2. Run:

```bash
node seeds/seedAcademies.js
node seeds/seedCoaches.js
```

**Note:** `MONGO_URI` is already set in Render's environment.

---

## Verification Checklist

After running seeds, verify:

### Step 1: Check API responses

```bash
# Should return 12 academies
curl https://sportsos-nodejs.onrender.com/academies

# Should return 8 coaches
curl https://sportsos-nodejs.onrender.com/coaches
```

### Step 2: Check specific slugs

```bash
# Should return National Cricket Academy
curl https://sportsos-nodejs.onrender.com/academies/by-slug/national-cricket-academy-bengaluru

# Should return Rahul Dravid
curl https://sportsos-nodejs.onrender.com/coaches/by-slug/rahul-dravid-cricket-bengaluru
```

### Step 3: Verify counts

| Endpoint | Expected |
|----------|----------|
| `GET /academies` | `total: 12` |
| `GET /coaches` | `total: 8` |
| `GET /academies/verified/all` | 9 verified academies |
| `GET /academies/sport/cricket` | 1 academy |

### Step 4: Verify frontend

- [ ] Homepage shows academy cards
- [ ] Homepage shows coach cards
- [ ] `/academies` lists 12 items
- [ ] `/coaches` lists 8 items
- [ ] Academy detail pages load
- [ ] Coach detail pages load

---

## Idempotency

Both seed scripts are **idempotent**:

```javascript
await Academy.deleteMany({});  // Clears all existing data
await Academy.insertMany(academies);  // Inserts fresh data
```

Running seeds multiple times is safe. Each run:
1. Clears the entire collection
2. Inserts the full dataset

**Warning:** This removes any manually created academies/coaches.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `MONGO_URI is undefined` | Env var not set | Set `MONGO_URI` before running |
| `connect ECONNREFUSED` | MongoDB not running | Start local MongoDB or check connection string |
| `Seeded 0 academies` | Insert failed silently | Check MongoDB logs, verify connection |
| Coaches have no `academyId` | Academies not seeded first | Run `seedAcademies.js` before `seedCoaches.js` |

---

## Summary

| Item | Value |
|------|-------|
| Academy count | 12 |
| Coach count | 8 |
| Execution order | Academies first, then Coaches |
| Idempotency | Yes (safe to re-run) |
| Local command | `set MONGO_URI=mongodb://localhost:27017/sportsos && node seeds/seedAcademies.js && node seeds/seedCoaches.js` |
| Render command | Copy `MONGO_URI` from dashboard, then run both scripts |
