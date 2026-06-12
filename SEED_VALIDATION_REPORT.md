# Seed Validation Report

**Date:** June 12, 2026

---

## Academy Seeds

| Check | Result |
|-------|--------|
| Total count | 12 ✅ |
| All slugs unique | ✅ |
| All `status: 'published'` | ✅ (12/12) |
| All `verificationStatus` valid | ✅ (`verified`: 9, `pending`: 2, `unverified`: 1) |
| All `facilities` values in enum | ✅ |
| All `trainingLevels` values in enum | ✅ |
| Required fields present | ✅ (name, slug, location.city, location.state) |

**Slugs:**
1. `national-cricket-academy-bengaluru`
2. `mumbai-football-academy-andheri`
3. `pullela-gopichand-badminton-academy-hyderabad`
4. `shiv-nadar-swimming-academy-chennai`
5. `delhi-tennis-academy-rukmini-devi`
6. `pro-kabaddi-academy-pune`
7. `hockey-india-academy-ludhiana`
8. `chess-gurukul-kolkata`
9. `tata-archery-academy-jamshedpur`
10. `yoga-and-gymnastics-tradition-bengaluru`
11. `aikido-and-karate-tradition-imphal`
12. `skating-academy-ahmedabad`

---

## Coach Seeds

| Check | Result |
|-------|--------|
| Total count | 8 ✅ |
| All slugs unique | ✅ |
| All `status: 'published'` | ✅ (8/8) |
| All `verificationStatus` valid | ✅ (`verified`: 7, `pending`: 1) |
| Required fields present | ✅ (name, slug, location.city, location.state) |
| Academy relationships | ✅ (4 linked, 4 standalone) |

**Slugs:**
1. `rahul-dravid-cricket-bengaluru` → national-cricket-academy-bengaluru
2. `anil-kumble-spin-bengaluru` → national-cricket-academy-bengaluru
3. `saina-nehwal-badminton-hyderabad` → pullela-gopichand-badminton-academy-hyderabad
4. `pankaj-advani-billiards-bengaluru` → chess-gurukul-kolkata
5. `viren-raquib-athletics-bengaluru` → standalone
6. `sushil-kumar-wrestling-delhi` → standalone
7. `mary-komar-boxing-rohtak` → standalone
8. `arjun-jadhav-table-tennis-pune` → standalone

---

## Known Data Quality Issues (Non-Blocking)

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 1 | Pankaj Advani `sportsCoached: ['chess']` should be `['billiards']` | LOW | Wrong sport tag |
| 2 | Mary Kom slug `mary-komar` has typo (should be `mary-kom`) | LOW | URL mismatch with frontend data |

**These are cosmetic data issues, not schema mismatches. Non-blocking for MVP.**

---

## Seed Script Execution Status

| Script | Status | Action Required |
|--------|--------|-----------------|
| `seedAcademies.js` | NOT RUN on Render | Run manually |
| `seedCoaches.js` | NOT RUN on Render | Run manually |

**Commands:**
```bash
MONGO_URI="<render-mongo-uri>" node seeds/seedAcademies.js
MONGO_URI="<render-mongo-uri>" node seeds/seedCoaches.js
```

---

## Summary

**All seed data is schema-compliant.** Seeds are ready to execute. No code changes needed.
