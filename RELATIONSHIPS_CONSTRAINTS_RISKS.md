# Existing Relationships, Constraints, Validation, Risks & Integration Points

**Date:** June 12, 2026

---

## 1. Existing Relationships

### Coach → Academy (One-Way)
- **Field:** `coach.academyId` (ObjectId, ref: 'Academy')
- **Required:** No (4/8 seeded coaches have no academy)
- **Query:** `GET /coaches/academy/:academyId`
- **Seed resolution:** Coaches linked to academies by slug mapping

### Shortlist → Academy/Coach (Polymorphic)
- **Field:** `shortlist.itemId` (ObjectId)
- **Discriminator:** `shortlist.itemType` = 'academy' | 'coach'
- **Constraint:** Compound unique index (userId, itemType, itemId)

### Enquiry → Academy/Coach (Polymorphic)
- **Field:** `enquiry.targetId` (ObjectId)
- **Discriminator:** `enquiry.targetType` = 'academy' | 'coach'

### Athlete → Academy (String Reference)
- **Field:** `athlete.academy` (String, plain text)
- **No ObjectId ref** — data integrity risk

---

## 2. Existing Constraints

### Database Level
| Constraint | Type | Collection |
|------------|------|------------|
| slug uniqueness | unique index | academies, coaches |
| email uniqueness | unique index | users |
| compound shortlist | unique index | shortlists (userId, itemType, itemId) |
| required fields | schema validation | all collections |

### Application Level
| Constraint | Location | Logic |
|------------|----------|-------|
| Academy duplicate check | academyController POST | name + city (case-insensitive) |
| Coach duplicate check | coachController POST | name + academyId (case-insensitive) |
| Auth required | protect middleware | JWT verification |
| Admin required | adminOnly middleware | role === 'admin' |
| Rate limiting | authLimiter | 20 requests per 15 minutes |
| Rate limiting | enquiryLimiter | 10 requests per 60 minutes |
| Password minimum | authController | 8 characters |
| Email normalization | authController | toLowerCase() |

---

## 3. Existing Validation Logic

### Academy Validation (POST create)
```javascript
// academyController.js lines 72-78
if (!name || !sportsOffered || !location) {
  return fail('VALIDATION_ERROR', 'Name, sports offered, and location are required');
}
const existing = await academyRepo.findDuplicate(name, location.city || location);
if (existing) {
  return fail('CONFLICT', 'An academy with this name already exists in this city');
}
```

### Coach Validation (POST create)
```javascript
// coachController.js lines 67-73
if (!name || !sportsCoached || !location) {
  return fail('VALIDATION_ERROR', 'Name, sports coached, and location are required');
}
const existing = await coachRepo.findDuplicate(name, academyId);
if (existing) {
  return fail('CONFLICT', 'A coach with this name already exists at this academy');
}
```

### Auth Validation (POST register)
```javascript
// authController.js
if (!name || !email || !password) {
  return fail('VALIDATION_ERROR', 'Name, email, and password are required');
}
if (password.length < 8) {
  return fail('VALIDATION_ERROR', 'Password must be at least 8 characters');
}
// Email normalized: email.toLowerCase()
// Role always defaults to 'athlete' regardless of request body
```

---

## 4. Risks and Concerns

### Data Acquisition Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Slug collisions | HIGH | Check existing slugs before insert |
| Duplicate name+city | HIGH | Use findDuplicate() before create |
| Invalid enum values | MEDIUM | Validate against allowed values |
| Missing required fields | MEDIUM | Validate name, location.city, location.state |
| academyId references non-existent Academy | HIGH | Verify academy exists before linking coach |
| Large batch insert performance | LOW | Use insertMany() for bulk operations |
| Rate limiting on seed scripts | LOW | Seeds run directly, not via API |

### Schema Risks

| Risk | Severity | Detail |
|------|----------|--------|
| Athlete academy is string not ref | MEDIUM | No referential integrity |
| No cascade delete | LOW | Deleting academy doesn't remove coach references |
| Embedded certifications | LOW | Can't query certifications independently |
| No geospatial indexes | LOW | Location-based queries won't use indexes |

### Frontend-Backend Risks

| Risk | Severity | Detail |
|------|----------|--------|
| Frontend types have extra fields | LOW | ageRange, gallery, batchInformation not in backend |
| Admin pages are mocked | LOW | Not connected to API |
| 6 dead API clients | LOW | Call non-existent endpoints |
| UserRole enum mismatch | LOW | Frontend: academy_rep, Backend: academy_owner |

---

## 5. Recommended Integration Points

### For Data Acquisition

| Integration Point | Method | Notes |
|-------------------|--------|-------|
| Seed scripts | `seeds/seedAcademies.js`, `seeds/seedCoaches.js` | Existing pattern — deleteMany + insertMany |
| Repository functions | `academyRepository.createAcademy()`, `coachRepository.createCoach()` | For individual inserts |
| Direct MongoDB | `Academy.insertMany()`, `Coach.insertMany()` | For bulk inserts |
| Duplicate check | `findDuplicate(name, city)` | Before insert |

### For Verification

| Check | Method |
|-------|--------|
| Academy exists | `GET /academies/by-slug/:slug` |
| Coach exists | `GET /coaches/by-slug/:slug` |
| Count academies | `GET /academies` → pagination.total |
| Count coaches | `GET /coaches` → pagination.total |

### For Testing

| Test | Endpoint |
|------|----------|
| List all academies | `GET /academies?pageSize=100` |
| List all coaches | `GET /coaches?pageSize=100` |
| Filter by sport | `GET /academies?sport=cricket` |
| Search by name | `GET /academies?search=Mumbai` |
| Get by slug | `GET /academies/by-slug/national-cricket-academy-bengaluru` |
