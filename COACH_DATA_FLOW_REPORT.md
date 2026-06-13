# Coach Data Flow Report

**Date:** June 12, 2026

---

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  app/(public)/coaches/page.tsx                              │
│       ↓                                                     │
│  components/coaches/coaches-listing.tsx                     │
│       ↓ getCoaches({ pageSize: 100 })                      │
│  lib/api/coaches.ts                                         │
│       ↓ GET /coaches?sport=&search=                         │
│                                                             │
│  app/(public)/coaches/[slug]/page.tsx                       │
│       ↓ getCoach(slug)                                      │
│  lib/api/coaches.ts                                         │
│       ↓ GET /coaches/by-slug/:slug                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  index.js                                                   │
│       ↓ app.use('/coaches', coachController)                │
│                                                             │
│  controllers/coachController.js                             │
│       ↓ imports coachRepository                             │
│                                                             │
│  repositories/coachRepository.js                            │
│       ↓ imports Coach model                                 │
│                                                             │
│  models/Coach.js                                            │
│       ↓ mongoose.model('Coach', coachSchema)                │
│                                                             │
│  MongoDB: coaches collection                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Coach Schema Fields

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
| avatar | String | — |
| certifications | [Object] | — |
| experienceYears | Number | 0 |
| sportsCoached | [String] | — |
| specialization | [String] | — |
| academyId | ObjectId | — |
| location.address | String | — |
| location.country | String | 'IN' |
| location.district | String | — |
| location.lat | Number | 0 |
| location.lng | Number | 0 |
| location.pincode | String | — |
| location.geohash | String | — |
| contact.phone | String | — |
| contact.email | String | — |
| verificationStatus | String | 'unverified' |
| rating.average | Number | 0 |
| rating.count | Number | 0 |
| status | String | 'published' |

---

## Coach CRUD Operations

### CREATE (POST /coaches/)
**Auth:** Admin only  
**Validation:**
- name must be truthy
- sportsCoached must be truthy
- location must be truthy
- Duplicate check: name + academyId (case-insensitive)

**Auto-generated:**
- slug: from name if not provided
- verificationStatus: defaults to 'unverified'
- status: defaults to 'published'

**Response:** 201 `{ ok: true, data: coach }`

---

### READ (GET /coaches/)
**Auth:** Public  
**Query params:** sport, search, page, pageSize  
**Base filter:** `{ status: 'published' }`  
**Default pagination:** page=1, pageSize=20  
**Sort:** `{ createdAt: -1 }` (newest first)

**Response:** `{ ok: true, data: { items: Coach[], pagination: { page, pageSize, total, hasMore } } }`

---

### READ by slug (GET /coaches/by-slug/:slug)
**Auth:** Public  
**Filter:** `{ slug: slug }` (any status)  
**Response:** `{ ok: true, data: coach }` or 404

---

### READ by academy (GET /coaches/academy/:academyId)
**Auth:** Public  
**Filter:** `{ academyId: academyId, status: 'published' }`  
**Response:** `{ ok: true, data: Coach[] }`

---

### UPDATE (PUT /coaches/:id)
**Auth:** Admin only  
**Body:** Any coach fields  
**No validation on update** — raw body passed to repository  
**Response:** `{ ok: true, data: coach }` or 404

---

### DELETE (DELETE /coaches/:id)
**Auth:** Admin only  
**Response:** `{ ok: true, data: { message: 'Deleted coach with id ...' } }` or 404

---

## Coach Seed Data (8 records)

| # | Slug | Name | Sport | City | Academy |
|---|------|------|-------|------|---------|
| 1 | rahul-dravid-cricket-bengaluru | Rahul Dravid | cricket | Bengaluru | national-cricket-academy-bengaluru |
| 2 | anil-kumble-spin-bengaluru | Anil Kumble | cricket | Bengaluru | national-cricket-academy-bengaluru |
| 3 | saina-nehwal-badminton-hyderabad | Saina Nehwal | badminton | Hyderabad | pullela-gopichand-badminton-academy-hyderabad |
| 4 | pankaj-advani-billiards-bengaluru | Pankaj Advani | chess | Bengaluru | chess-gurukul-kolkata |
| 5 | viren-raquib-athletics-bengaluru | Viren Raquib | athletics | Bengaluru | None |
| 6 | sushil-kumar-wrestling-delhi | Sushil Kumar | wrestling | New Delhi | None |
| 7 | mary-komar-boxing-rohtak | Mary Kom | boxing | Rohtak | None |
| 8 | arjun-jadhav-table-tennis-pune | Arjun Jadhav | table-tennis | Pune | None |

**Known data issue:** Pankaj Advani's `sportsCoached` is `['chess']` but he's a billiards player.

---

## Coach ↔ Academy Relationship

**Field:** `coach.academyId` (ObjectId, ref: 'Academy')  
**Required:** No (optional)  
**Resolution at seed time:** Seed script maps coach slugs to academy slugs, then looks up academy `_id` by slug

**Coaches with academies:**
- Rahul Dravid → National Cricket Academy (Bengaluru)
- Anil Kumble → National Cricket Academy (Bengaluru)
- Saina Nehwal → Pullela Gopichand Badminton Academy (Hyderabad)
- Pankaj Advani → Chess Gurukul (Kolkata)

**Independent coaches (no academy):**
- Viren Raquib, Sushil Kumar, Mary Kom, Arjun Jadhav

---

## Coach Data Acquisition Constraints

1. **Slug uniqueness** — each coach must have a unique slug
2. **Duplicate detection** — name + academyId combination must be unique
3. **Status must be valid** — draft, published, or suspended
4. **verificationStatus must be valid** — unverified, pending, verified, rejected
5. **location.city and location.state are required**
6. **sportsCoached is array of strings** — sport slugs
7. **academyId must reference existing Academy** if provided
8. **timestamps auto-generated** — createdAt, updatedAt
9. **toJSON transform applied** — _id becomes id, updatedAt becomes lastUpdatedAt
10. **Certifications are embedded** — not a separate collection
