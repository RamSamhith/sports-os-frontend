# PHASE 5 COMPLETION REPORT — Shortlist Integration

**Date:** 2026-06-12
**Status:** COMPLETE
**Build:** PASSES (78/78 pages generated)

---

## Summary

Replaced the legacy shortlist system (academy-only, `athleteId` + `academyId`) with a generic user-scoped shortlist supporting both academies and coaches. Backend stores `{ userId, itemType, itemId }` with a unique compound index. Frontend uses API when authenticated, localStorage fallback when guest.

---

## New Shortlist Schema

```json
{
  "userId": "ObjectId (ref: User)",
  "itemType": "academy | coach",
  "itemId": "ObjectId",
  "createdAt": "Date"
}
```

**Index:** `{ userId: 1, itemType: 1, itemId: 1 }` — unique, prevents duplicates.

---

## Endpoints Added

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/shortlist/me` | Required | Returns current user's shortlist records |
| `GET` | `/shortlist/me/populated` | Required | Returns shortlist with full academy/coach data |
| `POST` | `/shortlist` | Required | Add item to shortlist (`{ itemType, itemId }`) |
| `DELETE` | `/shortlist/:id` | Required | Remove item by record ID |

All endpoints require `Authorization: Bearer <token>` header.

---

## Files Changed

### Backend (3 files)
| File | Change |
|------|--------|
| `sportsOS-nodejs/models/Shortlist.js` | Rewritten — new schema `{ userId, itemType, itemId }`, unique compound index |
| `sportsOS-nodejs/repositories/shortlistRepository.js` | Rewritten — `findByUser`, `findDuplicate`, `create`, `remove`, `removeAllByUser` |
| `sportsOS-nodejs/controllers/shortlistController.js` | Rewritten — 4 endpoints with `protect` middleware, populated endpoint joins Academy/Coach |

### Frontend (6 files)
| File | Change |
|------|--------|
| `lib/api/shortlist.ts` | NEW — API client: `getMyShortlist`, `getMyShortlistPopulated`, `addToShortlist`, `removeFromShortlist` |
| `lib/hooks/use-shortlist.ts` | Added `populatedData` to `ShortlistContextValue` |
| `components/providers/shortlist-provider.tsx` | Rewritten — fetches from API when authenticated, localStorage fallback when guest, syncs add/remove to API |
| `components/shortlist/shortlist-view.tsx` | Rewritten — uses `populatedData` from context for API items, falls back to static data for guest items |
| `app/(public)/shortlist/page.tsx` | Updated — removed sports tab (academy + coach only) |
| `app/(private)/profile/saved/page.tsx` | Updated — removed sports tab (academy + coach only) |

---

## Auth Requirements

- All shortlist endpoints require a valid JWT token
- `protect` middleware extracts `userId` from token
- Users can only read/modify their own shortlist
- Unauthenticated users: shortlist stored in localStorage only (no API sync)

---

## Duplicate Prevention

- Backend compound unique index on `(userId, itemType, itemId)`
- `POST /shortlist` checks `findDuplicate()` before creating
- Returns `409 CONFLICT` if already saved
- Frontend `addWithMeta()` also checks locally before adding

---

## Verified

- Requires authentication (401 without token)
- User sees only own shortlist (filtered by `userId`)
- Duplicate saves prevented (unique index + pre-check)
- `npx next build` passes (78/78 pages)

---

## Remaining Blockers

1. **Backend deployment** — Changes need deployment to Render + DB migration (drop old shortlist collection, create new with compound index)
2. **Sport shortlist removed** — Sports tab removed from shortlist pages per requirements (not in MVP scope)
3. **Guest → Authenticated migration** — localStorage shortlist items are not synced to API on first login (user sees empty shortlist until they re-save items)
