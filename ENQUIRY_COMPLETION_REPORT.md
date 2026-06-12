# ENQUIRY INTEGRATION — COMPLETION REPORT

**Date:** 2026-06-12
**Status:** COMPLETE
**Build:** PASSES (78/78 pages generated)

---

## Summary

Created full enquiry system: model, repository, controller, API client, and wired both frontend forms (submission + profile history). Auth attachment is optional — guests can submit enquiries, authenticated users get their enquiries linked to their account.

---

## Enquiry Schema

```json
{
  "userId": "ObjectId (ref: User, nullable)",
  "targetType": "academy | coach",
  "targetId": "ObjectId",
  "intent": "contact | callback | trial | enrollment_interest",
  "parentInfo": { "name": String, "email": String, "phone": String },
  "childInfo": { "name": String, "age": Number },
  "sportInterest": String,
  "message": String,
  "status": "submitted | delivered | failed | bounced",
  "deliveryAttempts": Number,
  "whatsappConfirmationSent": Boolean,
  "leadId": String,
  "createdAt": Date
}
```

---

## Endpoints Added

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/enquiries` | Optional | Submit enquiry (attaches userId if token present) |
| `GET` | `/enquiries/me` | Required | Get current user's enquiries |
| `GET` | `/enquiries` | Admin only | Get all enquiries |

---

## Files Changed

### Backend (4 files)
| File | Change |
|------|--------|
| `sportsOS-nodejs/models/Enquiry.js` | NEW — Enquiry schema matching frontend `types/domain/enquiry.ts` |
| `sportsOS-nodejs/repositories/enquiryRepository.js` | NEW — `create`, `findByUser`, `findAll`, `findById` |
| `sportsOS-nodejs/controllers/enquiryController.js` | NEW — 3 endpoints with optional auth on POST, required on GET |
| `sportsOS-nodejs/index.js` | Mounted `/enquiries` route |

### Frontend (4 files)
| File | Change |
|------|--------|
| `lib/api/enquiries.ts` | NEW — `createEnquiry()`, `getMyEnquiries()` |
| `components/enquiry/enquiry-form.tsx` | Rewritten — calls `createEnquiry()` API, loading/error states, redirects to success page |
| `app/(public)/enquiry/[type]/[id]/page.tsx` | Rewritten — client component, fetches target by slug from API |
| `app/(private)/profile/enquiries/page.tsx` | Rewritten — fetches user's enquiries from API, displays with status badges |

---

## Auth Behavior

- **POST /enquiries**: Auth is optional. If a valid JWT is present, `userId` is attached to the enquiry. If not, enquiry is saved as guest (userId: null).
- **GET /enquiries/me**: Requires authentication. Returns only the current user's enquiries.
- **GET /enquiries**: Requires admin role. Returns all enquiries.

---

## Verified

- Enquiry form submits to API and redirects to success page
- Profile enquiries page displays user's enquiry history with status
- Guest submissions work (no auth required)
- `npx next build` passes (78/78 pages)

---

## Remaining Blockers

1. **Backend deployment** — Changes need deployment to Render
2. **WhatsApp integration** — `whatsappConfirmationSent` defaults to false; actual WhatsApp sending not implemented (requires third-party integration)
3. **Lead ID generation** — `leadId` is null; lead creation system not implemented
4. **Admin enquiries page** — `GET /enquiries` endpoint exists but no admin UI page was created (admin routes exist as placeholders)
