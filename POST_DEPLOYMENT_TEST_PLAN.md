# POST-DEPLOYMENT TEST PLAN

**Date:** 2026-06-12
**Backend URL:** https://sportsos-nodejs.onrender.com

---

## 1. Auth Tests

### 1.1 Register
```bash
curl -X POST https://sportsos-nodejs.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"testuser@example.com","password":"test1234","phone":"+919876543210"}'
```
**Expected:** `201` with `{ ok: true, data: { token: "...", user: { id, name, email, role } } }`

### 1.2 Login
```bash
curl -X POST https://sportsos-nodejs.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"test1234"}'
```
**Expected:** `200` with `{ ok: true, data: { token: "...", user: { ... } } }`

### 1.3 Duplicate Register
```bash
curl -X POST https://sportsos-nodejs.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"testuser@example.com","password":"test1234"}'
```
**Expected:** `409` with `{ ok: false, error: { code: "CONFLICT", message: "Email already registered" } }`

### 1.4 Invalid Login
```bash
curl -X POST https://sportsos-nodejs.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"wrongpassword"}'
```
**Expected:** `401` with `{ ok: false, error: { code: "INVALID_CREDENTIALS" } }`

### 1.5 Missing Fields
```bash
curl -X POST https://sportsos-nodejs.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
```
**Expected:** `400` with `{ ok: false, error: { code: "VALIDATION_ERROR" } }`

---

## 2. Academy Tests

### 2.1 List All
```bash
curl https://sportsos-nodejs.onrender.com/academies
```
**Expected:** `200` with `{ ok: true, data: { items: [...12 academies...], pagination: {...} } }`

### 2.2 Get by Slug
```bash
curl https://sportsos-nodejs.onrender.com/academies/by-slug/national-cricket-academy-bengaluru
```
**Expected:** `200` with full academy object including `id`, `slug`, `name`, `location` (subdoc), `sportsOffered`, etc.

### 2.3 Invalid Slug
```bash
curl https://sportsos-nodejs.onrender.com/academies/by-slug/nonexistent
```
**Expected:** `404` with `{ ok: false, error: { code: "NOT_FOUND" } }`

### 2.4 Search/Filter
```bash
curl "https://sportsos-nodejs.onrender.com/academies?sport=cricket"
```
**Expected:** `200` with filtered results

### 2.5 New Schema Fields
```bash
curl https://sportsos-nodejs.onrender.com/academies | jq '.data.items[0]'
```
**Expected:** Object has `slug`, `location.city`, `location.state`, `sportsOffered[]`, `facilities[]`, `rating`, `verificationStatus`, `certifications[]`

---

## 3. Coach Tests

### 3.1 List All
```bash
curl https://sportsos-nodejs.onrender.com/coaches
```
**Expected:** `200` with `{ ok: true, data: { items: [...8 coaches...], pagination: {...} } }`

### 3.2 Get by Slug
```bash
curl https://sportsos-nodejs.onrender.com/coaches/by-slug/rahul-dravid-cricket-bengaluru
```
**Expected:** `200` with full coach object

### 3.3 Invalid Slug
```bash
curl https://sportsos-nodejs.onrender.com/coaches/by-slug/nonexistent
```
**Expected:** `404`

### 3.4 New Schema Fields
```bash
curl https://sportsos-nodejs.onrender.com/coaches | jq '.data.items[0]'
```
**Expected:** Object has `slug`, `name`, `certifications[]`, `experienceYears`, `sportsCoached[]`, `location.city`, `rating`, `verificationStatus`

---

## 4. Shortlist Tests

### 4.1 Add to Shortlist (Authenticated)
```bash
# First get a token
TOKEN=$(curl -s -X POST https://sportsos-nodejs.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"test1234"}' | jq -r '.data.token')

# Get an academy ID
ACADEMY_ID=$(curl -s https://sportsos-nodejs.onrender.com/academies | jq -r '.data.items[0].id')

# Add to shortlist
curl -X POST https://sportsos-nodejs.onrender.com/shortlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"itemType\":\"academy\",\"itemId\":\"$ACADEMY_ID\"}"
```
**Expected:** `201` with `{ ok: true, data: { id, userId, itemType, itemId, createdAt } }`

### 4.2 Duplicate Prevention
```bash
# Try adding the same item again
curl -X POST https://sportsos-nodejs.onrender.com/shortlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"itemType\":\"academy\",\"itemId\":\"$ACADEMY_ID\"}"
```
**Expected:** `409` with `{ ok: false, error: { code: "CONFLICT", message: "Already in shortlist" } }`

### 4.3 Get My Shortlist
```bash
curl https://sportsos-nodejs.onrender.com/shortlist/me \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** `200` with `{ ok: true, data: [...shortlist items...] }`

### 4.4 Get Populated Shortlist
```bash
curl https://sportsos-nodejs.onrender.com/shortlist/me/populated \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** `200` with `{ ok: true, data: [...{ ...item, data: { academy object } }...] }`

### 4.5 Remove from Shortlist
```bash
# Get the shortlist record ID
SHORTLIST_ID=$(curl -s https://sportsos-nodejs.onrender.com/shortlist/me \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].id')

curl -X DELETE "https://sportsos-nodejs.onrender.com/shortlist/$SHORTLIST_ID" \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** `200` with `{ ok: true, data: { id: "..." } }`

### 4.6 Unauthenticated Access
```bash
curl https://sportsos-nodejs.onrender.com/shortlist/me
```
**Expected:** `401` with `{ ok: false, error: { code: "UNAUTHORIZED" } }`

---

## 5. Enquiry Tests

### 5.1 Submit Enquiry (Guest)
```bash
ACADEMY_ID=$(curl -s https://sportsos-nodejs.onrender.com/academies | jq -r '.data.items[0].id')

curl -X POST https://sportsos-nodejs.onrender.com/enquiries \
  -H "Content-Type: application/json" \
  -d "{\"targetType\":\"academy\",\"targetId\":\"$ACADEMY_ID\",\"parentInfo\":{\"name\":\"Parent Test\",\"email\":\"parent@test.com\",\"phone\":\"+919876543210\"},\"sportInterest\":\"Cricket\",\"message\":\"Interested in trial\"}"
```
**Expected:** `201` with `{ ok: true, data: { enquiryId, leadId: null, whatsappConfirmationSent: false } }`

### 5.2 Submit Enquiry (Authenticated)
```bash
curl -X POST https://sportsos-nodejs.onrender.com/enquiries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"targetType\":\"academy\",\"targetId\":\"$ACADEMY_ID\",\"parentInfo\":{\"name\":\"Parent Test\",\"email\":\"parent@test.com\",\"phone\":\"+919876543210\"},\"sportInterest\":\"Cricket\"}"
```
**Expected:** `201` with enquiry linked to user

### 5.3 Get My Enquiries
```bash
curl https://sportsos-nodejs.onrender.com/enquiries/me \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** `200` with `{ ok: true, data: [...enquiries...] }`

### 5.4 Missing Fields
```bash
curl -X POST https://sportsos-nodejs.onrender.com/enquiries \
  -H "Content-Type: application/json" \
  -d '{"targetType":"academy"}'
```
**Expected:** `400` with validation error

### 5.5 Invalid targetType
```bash
curl -X POST https://sportsos-nodejs.onrender.com/enquiries \
  -H "Content-Type: application/json" \
  -d '{"targetType":"sport","targetId":"test","parentInfo":{"name":"T","email":"t@t.com","phone":"123"},"sportInterest":"Cricket"}'
```
**Expected:** `400` with validation error

### 5.6 Unauthenticated Get My Enquiries
```bash
curl https://sportsos-nodejs.onrender.com/enquiries/me
```
**Expected:** `401`

---

## 6. CORS Test

```bash
curl -X OPTIONS https://sportsos-nodejs.onrender.com/academies \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"
```
**Expected:** `204` or `200` with `Access-Control-Allow-Origin` header

---

## Test Execution Checklist

- [ ] Auth: Register succeeds
- [ ] Auth: Login succeeds
- [ ] Auth: Duplicate register returns 409
- [ ] Auth: Wrong password returns 401
- [ ] Auth: Missing fields returns 400
- [ ] Academy: List returns 12 records
- [ ] Academy: Get by slug returns full object
- [ ] Academy: Invalid slug returns 404
- [ ] Academy: Filter by sport works
- [ ] Academy: New schema fields present
- [ ] Coach: List returns 8 records
- [ ] Coach: Get by slug returns full object
- [ ] Coach: Invalid slug returns 404
- [ ] Coach: New schema fields present
- [ ] Shortlist: Add works (authenticated)
- [ ] Shortlist: Duplicate returns 409
- [ ] Shortlist: Get my shortlist works
- [ ] Shortlist: Populated shortlist returns full data
- [ ] Shortlist: Remove works
- [ ] Shortlist: Unauthenticated returns 401
- [ ] Enquiry: Submit as guest works
- [ ] Enquiry: Submit as user works
- [ ] Enquiry: Get my enquiries works
- [ ] Enquiry: Missing fields returns 400
- [ ] Enquiry: Invalid type returns 400
- [ ] Enquiry: Unauthenticated get returns 401
- [ ] CORS: Preflight request works
