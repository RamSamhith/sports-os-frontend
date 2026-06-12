# POST-DEPLOYMENT TEST CHECKLIST

**Date:** 2026-06-12
**Backend URL:** https://sportsos-nodejs.onrender.com
**Prerequisites:** Body parser fix deployed, database migrated, seeds run

---

## 1. Academies Tests

### 1.1 List All
```bash
curl https://sportsos-nodejs.onrender.com/academies
```
- [ ] Status: 200
- [ ] Response: `{ ok: true, data: { items: [...], pagination: {...} } }`
- [ ] Items count: 12

### 1.2 Get by Slug
```bash
curl https://sportsos-nodejs.onrender.com/academies/by-slug/national-cricket-academy-bengaluru
```
- [ ] Status: 200
- [ ] Response has: `id`, `slug`, `name`, `location` (subdoc), `sportsOffered`, `rating`

### 1.3 Invalid Slug
```bash
curl https://sportsos-nodejs.onrender.com/academies/by-slug/nonexistent
```
- [ ] Status: 404
- [ ] Response: `{ ok: false, error: { code: "NOT_FOUND" } }`

### 1.4 Filter by Sport
```bash
curl "https://sportsos-nodejs.onrender.com/academies?sport=cricket"
```
- [ ] Status: 200
- [ ] All items have `sportsOffered` containing "cricket"

---

## 2. Coaches Tests

### 2.1 List All
```bash
curl https://sportsos-nodejs.onrender.com/coaches
```
- [ ] Status: 200
- [ ] Items count: 8

### 2.2 Get by Slug
```bash
curl https://sportsos-nodejs.onrender.com/coaches/by-slug/rahul-dravid-cricket-bengaluru
```
- [ ] Status: 200
- [ ] Response has: `id`, `slug`, `name`, `certifications`, `experienceYears`

### 2.3 Invalid Slug
```bash
curl https://sportsos-nodejs.onrender.com/coaches/by-slug/nonexistent
```
- [ ] Status: 404

---

## 3. Register Tests

### 3.1 Successful Register
```bash
curl -X POST https://sportsos-nodejs.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test-register@example.com","password":"test1234"}'
```
- [ ] Status: 201
- [ ] Response: `{ ok: true, data: { token: "...", user: { id, name, email, role } } }`
- [ ] `role` is `"athlete"` (not whatever was sent)

### 3.2 Duplicate Email
```bash
curl -X POST https://sportsos-nodejs.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test-register@example.com","password":"test1234"}'
```
- [ ] Status: 409
- [ ] Response: `{ ok: false, error: { code: "CONFLICT" } }`

### 3.3 Missing Fields
```bash
curl -X POST https://sportsos-nodejs.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
```
- [ ] Status: 400
- [ ] Response: `{ ok: false, error: { code: "VALIDATION_ERROR" } }`

### 3.4 Role Escalation Blocked
```bash
curl -X POST https://sportsos-nodejs.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Hacker","email":"hacker@example.com","password":"test1234","role":"admin"}'
```
- [ ] Status: 201
- [ ] Response user `role` is `"athlete"` (NOT `"admin"`)

---

## 4. Login Tests

### 4.1 Successful Login
```bash
curl -X POST https://sportsos-nodejs.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-register@example.com","password":"test1234"}'
```
- [ ] Status: 200
- [ ] Response: `{ ok: true, data: { token: "...", user: {...} } }`

### 4.2 Wrong Password
```bash
curl -X POST https://sportsos-nodejs.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-register@example.com","password":"wrongpassword"}'
```
- [ ] Status: 401
- [ ] Response: `{ ok: false, error: { code: "INVALID_CREDENTIALS" } }`

### 4.3 Nonexistent Email
```bash
curl -X POST https://sportsos-nodejs.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nobody@example.com","password":"test1234"}'
```
- [ ] Status: 401

---

## 5. Shortlist Tests

### 5.1 Add to Shortlist (Authenticated)
```bash
# Get token first
TOKEN=$(curl -s -X POST https://sportsos-nodejs.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-register@example.com","password":"test1234"}' | jq -r '.data.token')

# Get academy ID
ACADEMY_ID=$(curl -s https://sportsos-nodejs.onrender.com/academies | jq -r '.data.items[0].id')

# Add
curl -X POST https://sportsos-nodejs.onrender.com/shortlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"itemType\":\"academy\",\"itemId\":\"$ACADEMY_ID\"}"
```
- [ ] Status: 201
- [ ] Response: `{ ok: true, data: { id, userId, itemType, itemId } }`

### 5.2 Duplicate Prevention
```bash
# Try adding same item again
curl -X POST https://sportsos-nodejs.onrender.com/shortlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"itemType\":\"academy\",\"itemId\":\"$ACADEMY_ID\"}"
```
- [ ] Status: 409
- [ ] Response: `{ ok: false, error: { code: "CONFLICT" } }`

### 5.3 Get My Shortlist
```bash
curl https://sportsos-nodejs.onrender.com/shortlist/me \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Status: 200
- [ ] Response: `{ ok: true, data: [...] }`
- [ ] Contains the item we just added

### 5.4 Remove from Shortlist
```bash
SHORTLIST_ID=$(curl -s https://sportsos-nodejs.onrender.com/shortlist/me \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].id')

curl -X DELETE "https://sportsos-nodejs.onrender.com/shortlist/$SHORTLIST_ID" \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Status: 200

### 5.5 Unauthenticated Access
```bash
curl https://sportsos-nodejs.onrender.com/shortlist/me
```
- [ ] Status: 401

---

## 6. Enquiry Tests

### 6.1 Submit as Guest
```bash
ACADEMY_ID=$(curl -s https://sportsos-nodejs.onrender.com/academies | jq -r '.data.items[0].id')

curl -X POST https://sportsos-nodejs.onrender.com/enquiries \
  -H "Content-Type: application/json" \
  -d "{\"targetType\":\"academy\",\"targetId\":\"$ACADEMY_ID\",\"parentInfo\":{\"name\":\"Parent\",\"email\":\"parent@test.com\",\"phone\":\"+919876543210\"},\"sportInterest\":\"Cricket\"}"
```
- [ ] Status: 201
- [ ] Response: `{ ok: true, data: { enquiryId, whatsappConfirmationSent: false } }`

### 6.2 Submit as Authenticated
```bash
curl -X POST https://sportsos-nodejs.onrender.com/enquiries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"targetType\":\"academy\",\"targetId\":\"$ACADEMY_ID\",\"parentInfo\":{\"name\":\"Parent\",\"email\":\"parent@test.com\",\"phone\":\"+919876543210\"},\"sportInterest\":\"Cricket\"}"
```
- [ ] Status: 201

### 6.3 Get My Enquiries
```bash
curl https://sportsos-nodejs.onrender.com/enquiries/me \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Status: 200
- [ ] Response: `{ ok: true, data: [...] }`

### 6.4 Missing Fields
```bash
curl -X POST https://sportsos-nodejs.onrender.com/enquiries \
  -H "Content-Type: application/json" \
  -d '{"targetType":"academy"}'
```
- [ ] Status: 400

### 6.5 Unauthenticated Get
```bash
curl https://sportsos-nodejs.onrender.com/enquiries/me
```
- [ ] Status: 401

---

## Test Execution Summary

| Category | Tests | Pass | Fail | Block |
|----------|-------|------|------|-------|
| Academies | 4 | | | |
| Coaches | 3 | | | |
| Register | 4 | | | |
| Login | 3 | | | |
| Shortlist | 5 | | | |
| Enquiries | 5 | | | |
| **Total** | **24** | | | |
