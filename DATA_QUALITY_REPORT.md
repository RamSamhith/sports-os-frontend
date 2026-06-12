# DATA QUALITY REPORT

**Date:** 2026-06-12
**Scope:** Seed data (12 academies, 8 coaches)

---

## Academy Seed Data (12 records)

### Slug Uniqueness
| Status | Detail |
|--------|--------|
| VALID | All 12 slugs are unique |

### Name Uniqueness
| Status | Detail |
|--------|--------|
| VALID | All 12 names are unique |

### Missing Fields
| Status | Academy | Field | Detail |
|--------|---------|-------|--------|
| WARNING | Imphal Karate Dojo | `contact.website` | Only phone + email, no website |

### Invalid Locations
| Status | Detail |
|--------|--------|
| VALID | All 12 have city, state, country, lat/lng |

### Broken Image URLs
| Status | Detail |
|--------|--------|
| VALID | All 12 use relative SVG paths (`/images/academies/*.svg`) |

### Inconsistent Sports
| Status | Detail |
|--------|--------|
| VALID | All `sportsOffered` values match expected sports |

### Description Quality
| Status | Detail |
|--------|--------|
| VALID | All 12 have non-empty descriptions (50-200 chars) |

### Contact Data
| Status | Detail |
|--------|--------|
| VALID | All 12 have phone + email (except Imphal: phone + email only, no website) |

---

## Coach Seed Data (8 records)

### Slug Uniqueness
| Status | Detail |
|--------|--------|
| VALID | All 8 slugs are unique |

### Name Uniqueness
| Status | Detail |
|--------|--------|
| VALID | All 8 names are unique |

### Invalid Data

| Status | Coach | Field | Detail |
|--------|-------|-------|--------|
| INVALID | Pankaj Advani | `sportsCoached` | Set to `['chess']` but name/slug say "billiards" — data mismatch |
| WARNING | Mary Kom | `slug` | `mary-komar-boxing-rohtak` — typo "komar" should be "kom" |

### Missing Fields

| Status | Coach | Field | Detail |
|--------|-------|-------|--------|
| WARNING | Anil Kumble | `contact.phone` | Email only, no phone number |
| WARNING | Pankaj Advani | `contact.phone` | Email only, no phone number |
| WARNING | Mary Kom | `contact.phone` | Email only, no phone number |

### Invalid Academy References

| Status | Detail |
|--------|--------|
| VALID | All `academyId` references resolve to valid academies (4 linked, 4 null) |

### Certification Data

| Status | Detail |
|--------|--------|
| VALID | All 8 have at least 1 certification with name, issuer, year |

### Avatar URLs

| Status | Detail |
|--------|--------|
| VALID | All 8 use relative SVG paths (`/images/coaches/*.svg`) |

---

## Summary

| Category | VALID | WARNING | INVALID |
|----------|-------|---------|---------|
| Academy slugs | 12 | 0 | 0 |
| Academy names | 12 | 0 | 0 |
| Academy descriptions | 12 | 0 | 0 |
| Academy contacts | 11 | 1 | 0 |
| Academy locations | 12 | 0 | 0 |
| Academy images | 12 | 0 | 0 |
| Coach slugs | 8 | 0 | 0 |
| Coach names | 8 | 0 | 0 |
| Coach sports | 7 | 0 | 1 |
| Coach contacts | 5 | 3 | 0 |
| Coach academy refs | 8 | 0 | 0 |
| Coach certifications | 8 | 0 | 0 |
| Coach avatars | 8 | 0 | 0 |
| **Total** | **123** | **4** | **1** |

### Issues to Fix Before Deployment

1. **FIX:** Pankaj Advani `sportsCoached` should be `['billiards']` not `['chess']`
2. **FIX:** Mary Kom slug should be `mary-kom-boxing-rohtak` (fix typo)
3. **OPTIONAL:** Add phone numbers to Anil Kumble, Pankaj Advani, Mary Kom
4. **OPTIONAL:** Add website to Imphal Karate Dojo
