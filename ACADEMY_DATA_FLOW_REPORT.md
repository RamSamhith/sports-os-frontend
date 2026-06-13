# Academy Data Flow Report

**Date:** June 12, 2026

---

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  app/(public)/academies/page.tsx                            │
│       ↓                                                     │
│  components/academies/academy-listing.tsx                   │
│       ↓ getAcademies({ pageSize: 100 })                    │
│  lib/api/academies.ts                                       │
│       ↓ GET /academies?sport=&facility=&level=&search=      │
│                                                             │
│  app/(public)/academies/[slug]/page.tsx                     │
│       ↓ getAcademy(slug)                                    │
│  lib/api/academies.ts                                       │
│       ↓ GET /academies/by-slug/:slug                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  index.js                                                   │
│       ↓ app.use('/academies', academyController)            │
│                                                             │
│  controllers/academyController.js                           │
│       ↓ imports academyRepository                           │
│                                                             │
│  repositories/academyRepository.js                          │
│       ↓ imports Academy model                               │
│                                                             │
│  models/Academy.js                                          │
│       ↓ mongoose.model('Academy', academySchema)            │
│                                                             │
│  MongoDB: academies collection                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Academy Schema Fields

### Required Fields (must have data)
| Field | Type | Notes |
|-------|------|-------|
| slug | String | unique, lowercase |
| name | String | |
| location.city | String | |
| location.state | String | |

### Optional Fields (can be empty)
| Field | Type | Default |
|-------|------|---------|
| description | String | '' |
| location.address | String | — |
| location.country | String | 'IN' |
| location.district | String | — |
| location.lat | Number | 0 |
| location.lng | Number | 0 |
| location.pincode | String | — |
| location.geohash | String | — |
| contact.phone | String | — |
| contact.email | String | — |
| contact.website | String | — |
| sportsOffered | [String] | [] |
| facilities | [String] | [] |
| trainingLevels | [String] | [] |
| certifications | [Object] | [] |
| verificationStatus | String | 'unverified' |
| achievementSignals | Object | {} |
| rating.average | Number | 0 |
| rating.count | Number | 0 |
| coverImage | String | — |
| status | String | 'published' |

---

## Academy CRUD Operations

### CREATE (POST /academies/)
**Auth:** Admin only  
**Validation:**
- name must be truthy
- sportsOffered must be truthy
- location must be truthy
- Duplicate check: name + city (case-insensitive)

**Auto-generated:**
- slug: from name if not provided
- verificationStatus: defaults to 'unverified'
- status: defaults to 'published'

**Response:** 201 `{ ok: true, data: academy }`

---

### READ (GET /academies/)
**Auth:** Public  
**Query params:** sport, facility, level, status, search, page, pageSize  
**Base filter:** `{ status: 'published' }`  
**Default pagination:** page=1, pageSize=20  
**Sort:** `{ createdAt: -1 }` (newest first)

**Response:** `{ ok: true, data: { items: Academy[], pagination: { page, pageSize, total, hasMore } } }`

---

### READ by slug (GET /academies/by-slug/:slug)
**Auth:** Public  
**Filter:** `{ slug: slug }` (any status)  
**Response:** `{ ok: true, data: academy }` or 404

---

### READ by ID (GET /academies/:id)
**Auth:** Public  
**Filter:** `{ _id: id }` (any status)  
**Response:** `{ ok: true, data: academy }` or 404

---

### UPDATE (PUT /academies/:id)
**Auth:** Admin only  
**Body:** Any academy fields  
**No validation on update** — raw body passed to repository  
**Response:** `{ ok: true, data: academy }` or 404

---

### DELETE (DELETE /academies/:id)
**Auth:** Admin only  
**Response:** `{ ok: true, data: { message: 'Deleted academy with id ...' } }` or 404

---

## Academy Seed Data (12 records)

| # | Slug | City | Sport | Verification |
|---|------|------|-------|-------------|
| 1 | national-cricket-academy-bengaluru | Bengaluru | cricket | verified |
| 2 | mumbai-football-academy-andheri | Mumbai | football | verified |
| 3 | pullela-gopichand-badminton-academy-hyderabad | Hyderabad | badminton | verified |
| 4 | shiv-nadar-swimming-academy-chennai | Chennai | swimming | verified |
| 5 | delhi-tennis-academy-rukmini-devi | New Delhi | tennis | verified |
| 6 | pro-kabaddi-academy-pune | Pune | kabaddi | pending |
| 7 | hockey-india-academy-ludhiana | Ludhiana | hockey | verified |
| 8 | chess-gurukul-kolkata | Kolkata | chess | verified |
| 9 | tata-archery-academy-jamshedpur | Jamshedpur | archery | verified |
| 10 | yoga-and-gymnastics-tradition-bengaluru | Bengaluru | yoga, gymnastics | verified |
| 11 | aikido-and-karate-tradition-imphal | Imphal | karate | unverified |
| 12 | skating-academy-ahmedabad | Ahmedabad | skating | pending |

**States covered:** Karnataka, Maharashtra, Telangana, Tamil Nadu, Delhi, Punjab, West Bengal, Jharkhand, Manipur, Gujarat

---

## Academy Data Acquisition Constraints

1. **Slug uniqueness** — each academy must have a unique slug
2. **Duplicate detection** — name + city combination must be unique
3. **Status must be valid** — draft, published, or suspended
4. **verificationStatus must be valid** — unverified, pending, verified, rejected
5. **facilities must be valid enum values** — 9 allowed values
6. **trainingLevels must be valid enum values** — 4 allowed values
7. **location.city and location.state are required**
8. **sportsOffered is array of strings** — sport slugs
9. **timestamps auto-generated** — createdAt, updatedAt
10. **toJSON transform applied** — _id becomes id, updatedAt becomes lastUpdatedAt

---

## Academy ↔ Coach Relationship

- **Direction:** Coach → Academy (one-way)
- **Field:** `coach.academyId` (ObjectId, ref: 'Academy')
- **Optional:** 4/8 seeded coaches have no academy
- **Query:** `GET /coaches/academy/:academyId` returns coaches for an academy
- **No reverse query exists** — no endpoint to get coaches from academy side
