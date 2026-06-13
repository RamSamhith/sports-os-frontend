# Repository Analysis Report

**Date:** June 12, 2026  
**Scope:** Full codebase analysis (read-only)  
**Purpose:** Understand all existing code before data acquisition

---

## File Inventory

### Backend (sportsOS-nodejs)

| Layer | Files | Lines | Status |
|-------|-------|-------|--------|
| Models | 6 | ~230 | Active |
| Controllers | 6 | ~600 | Active |
| Repositories | 5 | ~500 | Active |
| Services | 15 | ~2,000 | **Dead code** |
| Seeds | 2 | ~720 | Active |
| Middleware | 1 | ~40 | Active |
| Utils | 1 | ~11 | Active |
| **Total** | **36** | **~4,100** | |

### Frontend

| Layer | Files | Lines | Status |
|-------|-------|-------|--------|
| Pages | ~35 | ~3,000 | Active |
| Components | ~40 | ~5,000 | Active |
| API clients | 12 | ~300 | 6 dead |
| Hooks | ~10 | ~800 | Active |
| Types | ~20 | ~1,500 | Many unimplemented |
| Static data | 2 | ~800 | Fixture data |
| **Total** | **~119** | **~11,400** | |

---

## Architecture Summary

```
Frontend (Next.js 14)
    ↓ API calls (lib/api/*.ts)
Backend (Express 5 + Mongoose)
    ↓ Direct imports
Controllers → Repositories → Models → MongoDB
```

**Key finding:** Controllers import repositories directly. The 15 service files are dead code — never imported by any controller.

---

## All Models

| Model | Fields | Required Fields | Indexes |
|-------|--------|-----------------|---------|
| User | 6 | name, email, password | unique(email) |
| Academy | 25+ | slug, name, location.city, location.state | unique(slug) |
| Coach | 20+ | slug, name, location.city, location.state | unique(slug) |
| Athlete | 7 | name, sport, age, academy | none |
| Shortlist | 4 | userId, itemType, itemId | compound(userId, itemType, itemId) |
| Enquiry | 15+ | targetType, targetId, parentInfo.* | none |

---

## All API Endpoints

| Method | Path | Auth | Rate Limit |
|--------|------|------|------------|
| POST | /auth/register | No | 20/15min |
| POST | /auth/login | No | 20/15min |
| GET | /academies/ | No | — |
| GET | /academies/sport/:sport | No | — |
| GET | /academies/verified/all | No | — |
| GET | /academies/by-slug/:slug | No | — |
| GET | /academies/:id | No | — |
| POST | /academies/ | Admin | — |
| PUT | /academies/:id | Admin | — |
| DELETE | /academies/:id | Admin | — |
| GET | /coaches/ | No | — |
| GET | /coaches/academy/:academyId | No | — |
| GET | /coaches/sport/:sport | No | — |
| GET | /coaches/by-slug/:slug | No | — |
| GET | /coaches/:id | No | — |
| POST | /coaches/ | Admin | — |
| PUT | /coaches/:id | Admin | — |
| DELETE | /coaches/:id | Admin | — |
| GET | /shortlist/me | Yes | — |
| GET | /shortlist/me/populated | Yes | — |
| POST | /shortlist/ | Yes | — |
| DELETE | /shortlist/:id | Yes | — |
| POST | /enquiries/ | No (optional) | 10/60min |
| GET | /enquiries/me | Yes | — |
| GET | /enquiries/ | Admin | — |

---

## Enum Values

### Academy
- `verificationStatus`: unverified, pending, verified, rejected
- `status`: draft, published, suspended
- `facilities`: indoor, outdoor, ground, court, equipment, changing_room, parking, physio, gym
- `trainingLevels`: beginner, intermediate, advanced, elite

### Coach
- `verificationStatus`: unverified, pending, verified, rejected
- `status`: draft, published, suspended

### User
- `role`: athlete, parent, coach, academy_owner, admin

### Shortlist
- `itemType`: academy, coach

### Enquiry
- `targetType`: academy, coach
- `intent`: contact, callback, trial, enrollment_interest
- `status`: submitted, delivered, failed, bounced

---

## Dead Code Inventory

| Category | Files | Impact |
|----------|-------|--------|
| Services | 15 files | Never imported |
| API clients | 6 files | Call non-existent endpoints |
| Frontend types | 15+ files | Define unimplemented models |
| Admin pages | 11 pages | All hardcoded mock data |
| Static data | 2 files | Duplicate of seed data |

---

## Gaps Between Frontend and Backend

### Frontend API calls with no backend:
1. POST /auth/send-otp
2. POST /auth/verify-otp
3. POST /auth/logout
4. GET /auth/me
5. GET /users/me, PATCH /users/me
6. GET/POST/PATCH/DELETE /children
7. GET/POST/DELETE /favorites
8. GET /sports, GET /sports/:slug
9. GET /recommendations/academies, /coaches

### Frontend types with no backend model:
Sport, Child, AdminUser, Session, Review, VerificationCase, Lead, LeadActivity, AuditLog, MediaAsset, ConsentRecord, Competition, OnboardingState, AnalyticsEvent
