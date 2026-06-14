# Admin Panel API Integration Report

**Date**: 2026-06-14
**Status**: ✅ Implemented
**Build**: Passed (lint ✅, typecheck ✅, build ✅)

---

## Summary

Six admin pages have been connected to real backend APIs. Loading states, error states, and empty states are now present on all connected pages.

---

## Backend API Audit

### Available Endpoints

| Endpoint | Method | Auth | Controller | Status |
|----------|--------|------|------------|--------|
| `/admin/dashboard/stats` | GET | admin | `adminController.js:9` | ✅ Used |
| `/admin/users` | GET | admin | `adminController.js:40` | ✅ Used |
| `/admin/users/:id/role` | PUT | admin | `adminController.js:61` | Available |
| `/academies` | GET | public | `academyController.js:12` | ✅ Used |
| `/coaches` | GET | public | `coachController.js:10` | ✅ Used |
| `/enquiries` | GET | admin | `enquiryController.js:82` | ✅ Used |

### Missing Endpoints

| Endpoint | Purpose | Impact |
|----------|---------|--------|
| `/admin/verification` | List pending verifications | Used academies with `status=pending` as proxy |
| `/admin/leads` | List leads for kanban board | Leads page shows empty state |
| `/admin/analytics` | Dashboard analytics data | Analytics page remains placeholder |

---

## Files Changed

### New Files

| File | Purpose |
|------|---------|
| `lib/api/admin.ts` | Admin API client functions |

### Modified Files

| File | Changes |
|------|---------|
| `app/(admin)/admin/page.tsx` | Dashboard: fetches `/admin/dashboard/stats`, shows real KPIs |
| `app/(admin)/admin/academies/page.tsx` | Academies: fetches from `/academies`, shows real data |
| `app/(admin)/admin/coaches/page.tsx` | Coaches: fetches from `/coaches`, shows real data |
| `app/(admin)/admin/users/page.tsx` | Users: fetches from `/admin/users`, shows real data |
| `app/(admin)/admin/enquiries/page.tsx` | Enquiries: fetches from `/enquiries`, shows real data |
| `app/(admin)/admin/verification/page.tsx` | Verification: fetches pending academies, shows real data |
| `app/(admin)/admin/leads/page.tsx` | Leads: shows proper empty state instead of placeholder |
| `components/admin/status-pill.tsx` | Added `'unverified'` to status union type |

---

## Pages Connected

| Page | Data Source | Loading | Error | Empty |
|------|-------------|---------|-------|-------|
| Dashboard | `GET /admin/dashboard/stats` | ✅ Skeleton | ✅ ErrorState | N/A |
| Academies | `GET /academies` | ✅ Skeleton | ✅ ErrorState | ✅ EmptyState |
| Coaches | `GET /coaches` | ✅ Skeleton | ✅ ErrorState | ✅ EmptyState |
| Users | `GET /admin/users` | ✅ Skeleton | ✅ ErrorState | ✅ EmptyState |
| Enquiries | `GET /enquiries` | ✅ Skeleton | ✅ ErrorState | ✅ EmptyState |
| Verification | `GET /academies?status=pending` | ✅ Skeleton | ✅ ErrorState | ✅ EmptyState |
| Leads | Static (no API) | N/A | N/A | ✅ EmptyState |

---

## Remaining Mocked Pages

| Page | Status | Reason |
|------|--------|--------|
| Analytics | Placeholder | No backend analytics endpoint exists |
| Settings | Placeholder | No backend settings endpoint exists |
| Sports | Placeholder | No admin sports endpoint exists |
| Lead Detail | Placeholder | No backend lead detail endpoint exists |

---

## Admin API Client Functions

**File**: `lib/api/admin.ts`

```typescript
getDashboardStats()          → GET /admin/dashboard/stats
getUsers(params?)            → GET /admin/users
getAdminAcademies(params?)   → GET /academies
getAdminCoaches(params?)     → GET /coaches
getAdminEnquiries()          → GET /enquiries
```

All functions use the centralized `get()` client with automatic token refresh and error handling.

---

## Loading/Error Pattern

Every connected page follows this pattern:

```typescript
const [data, setData] = useState<Type[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let cancelled = false;
  setLoading(true);
  apiFunction().then((res) => {
    if (cancelled) return;
    if (res.ok) { setData(res.data); setError(null); }
    else { setError(res.error.message); }
    setLoading(false);
  });
  return () => { cancelled = true; };
}, []);
```

- **Loading**: `<Skeleton>` components matching table row layout
- **Error**: `<ErrorState>` with retry button that re-fetches
- **Empty**: `<EmptyState>` with descriptive message

---

## Remaining Admin Limitations

1. **No CRUD operations** — Pages are read-only; no create/edit/delete from UI
2. **No lead management** — Backend lead endpoints not implemented
3. **No analytics** — No data collection or visualization
4. **No settings persistence** — Feature flags have no backend
5. **No sports management** — Sports admin not implemented
6. **No verification actions** — Can view pending items but cannot approve/reject

---

## Build Results

```
✓ Lint:     1 warning (pre-existing)
✓ Typecheck: No errors
✓ Build:    79 pages generated successfully
```
