# API RESPONSE CONTRACT

**Base URL:** `https://sportsos-nodejs.onrender.com`
**Date:** 2026-06-12

---

## Envelope Format

All responses use a consistent envelope:

```json
// Success
{ "ok": true, "data": <payload> }

// Failure
{ "ok": false, "error": { "code": "<CODE>", "message": "<description>" } }
```

---

## GET /academies

**Query params:** `sport`, `facility`, `level`, `status`, `search`, `page`, `pageSize`

### Response (200)

```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "id": "6847f1a2b3c4d5e6f7a8b9c0",
        "slug": "national-cricket-academy-bengaluru",
        "name": "National Cricket Academy",
        "description": "A premier cricket training institute with indoor nets, outdoor turf wickets, and a dedicated strength-conditioning block.",
        "location": {
          "address": "M. Chinnaswamy Stadium, Cubbon Park",
          "city": "Bengaluru",
          "state": "Karnataka",
          "country": "IN",
          "lat": 12.9789,
          "lng": 77.5996,
          "pincode": "560001",
          "geohash": "td3"
        },
        "contact": {
          "phone": "+91 80 4012 9001",
          "email": "info@nationalcricketacademy.in",
          "website": "https://nationalcricketacademy.in"
        },
        "sportsOffered": ["cricket"],
        "facilities": ["indoor", "outdoor", "ground", "equipment", "gym", "changing_room", "parking", "physio"],
        "trainingLevels": ["beginner", "intermediate", "advanced", "elite"],
        "certifications": [
          {
            "name": "BCCI Level 1 Coach",
            "issuer": "BCCI",
            "year": 2018
          }
        ],
        "verificationStatus": "verified",
        "achievementSignals": {
          "stateAthletesProduced": 24,
          "nationalAthletesProduced": 6,
          "competitionParticipations": ["Ranji Trophy 2023–24"],
          "milestones": ["Hosted 2019 NCA Zonal Trials"]
        },
        "rating": {
          "average": 4.7,
          "count": 412
        },
        "coverImage": "/images/academies/national-cricket-academy-bengaluru.svg",
        "status": "published",
        "lastUpdatedAt": "2026-04-12T09:30:00.000Z",
        "createdAt": "2024-01-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 12,
      "hasMore": false
    }
  }
}
```

### Query Examples

```
GET /academies                          → all published academies (paginated)
GET /academies?sport=cricket            → filter by sport
GET /academies?facility=indoor          → filter by facility
GET /academies?level=elite              → filter by training level
GET /academies?status=verified          → filter by verification status
GET /academies?search=bengaluru         → search name/description/city/sport
GET /academies?sport=cricket&search=bengaluru  → combined filters
GET /academies?page=2&pageSize=10       → pagination
```

---

## GET /academies/by-slug/:slug

### Response (200)

```json
{
  "ok": true,
  "data": {
    "id": "6847f1a2b3c4d5e6f7a8b9c0",
    "slug": "national-cricket-academy-bengaluru",
    "name": "National Cricket Academy",
    "description": "A premier cricket training institute with indoor nets, outdoor turf wickets, and a dedicated strength-conditioning block.",
    "location": {
      "address": "M. Chinnaswamy Stadium, Cubbon Park",
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "IN",
      "district": null,
      "lat": 12.9789,
      "lng": 77.5996,
      "pincode": "560001",
      "geohash": "td3"
    },
    "contact": {
      "phone": "+91 80 4012 9001",
      "email": "info@nationalcricketacademy.in",
      "website": "https://nationalcricketacademy.in"
    },
    "sportsOffered": ["cricket"],
    "facilities": ["indoor", "outdoor", "ground", "equipment", "gym", "changing_room", "parking", "physio"],
    "trainingLevels": ["beginner", "intermediate", "advanced", "elite"],
    "certifications": [
      { "name": "BCCI Level 1 Coach", "issuer": "BCCI", "year": 2018 },
      { "name": "BCCI Level 2 Coach", "issuer": "BCCI", "year": 2021 }
    ],
    "verificationStatus": "verified",
    "achievementSignals": {
      "stateAthletesProduced": 24,
      "nationalAthletesProduced": 6,
      "competitionParticipations": ["Ranji Trophy 2023–24", "Syed Mushtaq Ali Trophy 2024"],
      "milestones": ["Hosted 2019 NCA Zonal Trials", "Alumni include 2 Ranji captains"]
    },
    "rating": { "average": 4.7, "count": 412 },
    "coverImage": "/images/academies/national-cricket-academy-bengaluru.svg",
    "status": "published",
    "lastUpdatedAt": "2026-04-12T09:30:00.000Z",
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
}
```

### Response (404)

```json
{
  "ok": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Academy not found"
  }
}
```

---

## GET /coaches

**Query params:** `sport`, `search`, `page`, `pageSize`

### Response (200)

```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "id": "6847f1a2b3c4d5e6f7a8b9c1",
        "slug": "rahul-dravid-cricket-bengaluru",
        "name": "Rahul Dravid",
        "avatar": "/images/coaches/rahul-dravid-cricket-bengaluru.svg",
        "certifications": [
          { "name": "BCCI Level 3 Coach", "issuer": "BCCI", "year": 2014 },
          { "name": "ICC Level 2 Coach", "issuer": "International Cricket Council", "year": 2017 }
        ],
        "experienceYears": 18,
        "sportsCoached": ["cricket"],
        "specialization": ["batting", "red-ball technique", "youth development"],
        "academyId": "6847f1a2b3c4d5e6f7a8b9c0",
        "location": {
          "city": "Bengaluru",
          "state": "Karnataka",
          "country": "IN",
          "lat": 12.9789,
          "lng": 77.5996
        },
        "contact": {
          "phone": "+91 98 6012 9001",
          "email": "coach.dravid@nationalcricketacademy.in"
        },
        "verificationStatus": "verified",
        "rating": { "average": 4.9, "count": 184 },
        "status": "published",
        "lastUpdatedAt": "2026-05-01T09:30:00.000Z",
        "createdAt": "2024-01-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 8,
      "hasMore": false
    }
  }
}
```

### Query Examples

```
GET /coaches                        → all published coaches (paginated)
GET /coaches?sport=cricket          → filter by sport
GET /coaches?search=bengaluru       → search name/city/sport/specialization
GET /coaches?page=2&pageSize=5      → pagination
```

---

## GET /coaches/by-slug/:slug

### Response (200)

```json
{
  "ok": true,
  "data": {
    "id": "6847f1a2b3c4d5e6f7a8b9c1",
    "slug": "rahul-dravid-cricket-bengaluru",
    "name": "Rahul Dravid",
    "avatar": "/images/coaches/rahul-dravid-cricket-bengaluru.svg",
    "certifications": [
      { "name": "BCCI Level 3 Coach", "issuer": "BCCI", "year": 2014 },
      { "name": "ICC Level 2 Coach", "issuer": "International Cricket Council", "year": 2017 }
    ],
    "experienceYears": 18,
    "sportsCoached": ["cricket"],
    "specialization": ["batting", "red-ball technique", "youth development"],
    "academyId": "6847f1a2b3c4d5e6f7a8b9c0",
    "location": {
      "address": null,
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "IN",
      "district": null,
      "lat": 12.9789,
      "lng": 77.5996,
      "pincode": null,
      "geohash": null
    },
    "contact": {
      "phone": "+91 98 6012 9001",
      "email": "coach.dravid@nationalcricketacademy.in"
    },
    "verificationStatus": "verified",
    "rating": { "average": 4.9, "count": 184 },
    "status": "published",
    "lastUpdatedAt": "2026-05-01T09:30:00.000Z",
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
}
```

### Response (404)

```json
{
  "ok": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Coach not found"
  }
}
```

---

## Consistency Check

| Endpoint | Envelope | Payload Type | `items` key | `pagination` key |
|----------|----------|-------------|-------------|------------------|
| `GET /academies` | `{ ok, data }` | `{ items[], pagination }` | ✅ | ✅ |
| `GET /academies/by-slug/:slug` | `{ ok, data }` | `Academy` | N/A | N/A |
| `GET /academies/:id` | `{ ok, data }` | `Academy` | N/A | N/A |
| `GET /coaches` | `{ ok, data }` | `{ items[], pagination }` | ✅ | ✅ |
| `GET /coaches/by-slug/:slug` | `{ ok, data }` | `Coach` | N/A | N/A |
| `GET /coaches/:id` | `{ ok, data }` | `Coach` | N/A | N/A |

### Consistent Patterns

- ✅ All responses wrapped in `{ ok: true/false, data/error }`
- ✅ List endpoints return `{ items: [...], pagination: {...} }`
- ✅ Detail endpoints return single object
- ✅ `id` field (not `_id`) via `toJSON` transform
- ✅ `lastUpdatedAt` field (mapped from `updatedAt`)
- ✅ `__v` stripped from all responses
- ✅ `password` stripped from User responses
- ✅ Error codes: `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`, `SERVER_ERROR`

### Known Inconsistencies

| Endpoint | Issue | Severity |
|----------|-------|----------|
| `GET /academies/sport/:sport` | Returns flat array, not `{ items }` | Low (not used by frontend) |
| `GET /academies/verified/all` | Returns flat array, not `{ items }` | Low (not used by frontend) |
| `GET /coaches/academy/:academyId` | Returns flat array, not `{ items }` | Low (not used by frontend) |
| `GET /coaches/sport/:sport` | Returns flat array, not `{ items }` | Low (not used by frontend) |

**Note:** The 4 inconsistent endpoints return flat arrays inside the envelope (`{ ok: true, data: [...] }`). They are not used by the frontend integration and can be normalized later if needed.

---

## Field Reference

### Academy Fields

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `id` | `string` | auto | — |
| `slug` | `string` | ✅ | auto-generated from name |
| `name` | `string` | ✅ | — |
| `description` | `string` | — | `""` |
| `location.address` | `string` | — | `null` |
| `location.city` | `string` | ✅ | — |
| `location.state` | `string` | ✅ | — |
| `location.country` | `string` | — | `"IN"` |
| `location.lat` | `number` | — | `0` |
| `location.lng` | `number` | — | `0` |
| `contact.phone` | `string` | — | `null` |
| `contact.email` | `string` | — | `null` |
| `contact.website` | `string` | — | `null` |
| `sportsOffered` | `string[]` | ✅ | `[]` |
| `facilities` | `string[]` | — | `[]` |
| `trainingLevels` | `string[]` | — | `[]` |
| `certifications` | `object[]` | — | `[]` |
| `verificationStatus` | `enum` | — | `"unverified"` |
| `achievementSignals` | `object` | — | `{}` |
| `rating.average` | `number` | — | `0` |
| `rating.count` | `number` | — | `0` |
| `coverImage` | `string` | — | `null` |
| `status` | `enum` | — | `"published"` |
| `lastUpdatedAt` | `string` | auto | — |
| `createdAt` | `string` | auto | — |

### Coach Fields

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `id` | `string` | auto | — |
| `slug` | `string` | ✅ | auto-generated from name |
| `name` | `string` | ✅ | — |
| `avatar` | `string` | — | `null` |
| `certifications` | `object[]` | — | `[]` |
| `experienceYears` | `number` | — | `0` |
| `sportsCoached` | `string[]` | ✅ | `[]` |
| `specialization` | `string[]` | — | `[]` |
| `academyId` | `ObjectId` | — | `null` |
| `location.city` | `string` | ✅ | — |
| `location.state` | `string` | ✅ | — |
| `location.country` | `string` | — | `"IN"` |
| `location.lat` | `number` | — | `0` |
| `location.lng` | `number` | — | `0` |
| `contact.phone` | `string` | — | `null` |
| `contact.email` | `string` | — | `null` |
| `verificationStatus` | `enum` | — | `"unverified"` |
| `rating.average` | `number` | — | `0` |
| `rating.count` | `number` | — | `0` |
| `status` | `enum` | — | `"published"` |
| `lastUpdatedAt` | `string` | auto | — |
| `createdAt` | `string` | auto | — |

### Enum Values

| Field | Values |
|-------|--------|
| `verificationStatus` | `unverified`, `pending`, `verified`, `rejected` |
| `status` | `draft`, `published`, `suspended` |
| `facilities` | `indoor`, `outdoor`, `ground`, `court`, `equipment`, `changing_room`, `parking`, `physio`, `gym` |
| `trainingLevels` | `beginner`, `intermediate`, `advanced`, `elite` |
