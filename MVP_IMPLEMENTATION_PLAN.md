# MVP Implementation Plan

> Generated: 2026-06-12
> Goal: Fastest path to a working product with minimum code changes

---

## 1. Strategy: Adapt Backend to Frontend

The frontend has 80+ components, 35+ pages, and a complete UI. The backend has 5 controllers with 27 endpoints. **The backend must adapt to the frontend, not the other way around.**

Minimum changes principle: change the fewest files to get the most pages working.

---

## 2. Phase 1: Infrastructure (Day 1)

### Task 1.1: Add CORS middleware
| | |
|---|---|
| **Files** | `sportsOS-nodejs/index.js` |
| **Change** | Add `const cors = require('cors'); app.use(cors());` before routes |
| **Dependency** | `npm install cors` |
| **Effort** | 5 minutes |
| **Risk** | None |
| **Unblocks** | All frontend→backend communication |

### Task 1.2: Add response envelope wrapper
| | |
|---|---|
| **Files** | `sportsOS-nodejs/index.js` (or new `utils/response.js`) |
| **Change** | Create `ok(data)` and `fail(code, message)` helper functions |
| **Effort** | 15 minutes |
| **Risk** | None |
| **Unblocks** | Frontend `lib/api/client.ts` parsing |

### Task 1.3: Add `_id` → `id` transform to all models
| | |
|---|---|
| **Files** | `sportsOS-nodejs/models/Academy.js`, `Coach.js`, `User.js`, `Shortlist.js` |
| **Change** | Add `toJSON` transform: `schema.set('toJSON', { transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } })` |
| **Effort** | 10 minutes |
| **Risk** | None |
| **Unblocks** | Frontend `id` field usage |

---

## 3. Phase 2: Academy Model Expansion (Day 2-3)

### Task 2.1: Expand Academy model
| | |
|---|---|
| **Files** | `sportsOS-nodejs/models/Academy.js` |
| **Change** | Add fields: `slug` (unique), `description`, `city`, `state`, `address`, `sportsOffered` (rename from `sport`), `facilities` ([String] enum), `trainingLevels` ([String] enum), `certifications` ([{name, issuer, year, documentUrl}]), `contact` ({phone, email, website}), `feeRange` ({min, max, currency}), `verificationStatus` (enum), `status` (enum), `isFeatured`, `avgRating`, `reviewCount`, `coverImage`, `gallery` ([String]). Keep `sport` as backward-compat alias. |
| **Effort** | 30 minutes |
| **Risk** | **MEDIUM** — existing data uses old schema. Must re-seed. |
| **Unblocks** | Academy listing, detail, homepage, compare, shortlist views |

### Task 2.2: Expand Coach model
| | |
|---|---|
| **Files** | `sportsOS-nodejs/models/Coach.js` |
| **Change** | Add fields: `slug` (unique), `avatar`, `bio`, `sportsCoached` ([String], keep `sport` as alias), `specialization` ([String]), `experienceYears`, `city`, `state`, `contact` ({phone, email}), `certifications` ([{name, issuer, year, documentUrl}]), `verificationStatus` (enum), `status` (enum), `isFeatured`, `avgRating`, `reviewCount`. Make `academyId` optional (not required). |
| **Effort** | 20 minutes |
| **Risk** | **MEDIUM** — same as Academy |
| **Unblocks** | Coach listing, detail, homepage, compare, shortlist views |

### Task 2.3: Rewrite academyRepository
| | |
|---|---|
| **Files** | `sportsOS-nodejs/repositories/academyRepository.js` |
| **Change** | Add `findBySlug(slug)`, update queries to use new fields, add pagination support |
| **Effort** | 30 minutes |
| **Risk** | Low — repository layer is isolated |
| **Unblocks** | Academy controller rewrite |

### Task 2.4: Rewrite coachRepository
| | |
|---|---|
| **Files** | `sportsOS-nodejs/repositories/coachRepository.js` |
| **Change** | Add `findBySlug(slug)`, update queries, add pagination |
| **Effort** | 20 minutes |
| **Risk** | Low |
| **Unblocks** | Coach controller rewrite |

### Task 2.5: Rewrite academyController
| | |
|---|---|
| **Files** | `sportsOS-nodejs/controllers/academyController.js` |
| **Change** | Wrap responses in `ok(data)`. Change `GET /:id` to `GET /:slug` using `findBySlug`. Add query param filtering (sport, city, trainingLevel, verificationStatus). Add pagination. |
| **Effort** | 45 minutes |
| **Risk** | Low |
| **Unblocks** | All academy frontend pages |

### Task 2.6: Rewrite coachController
| | |
|---|---|
| **Files** | `sportsOS-nodejs/controllers/coachController.js` |
| **Change** | Wrap responses in `ok(data)`. Change `GET /:id` to `GET /:slug` using `findBySlug`. Add auth middleware to POST/DELETE. Add pagination. |
| **Effort** | 30 minutes |
| **Risk** | Low |
| **Unblocks** | All coach frontend pages |

### Task 2.7: Seed database with full data
| | |
|---|---|
| **Files** | New `sportsOS-nodejs/scripts/seed.js` |
| **Change** | Seed 5 academies + 3 coaches with all fields populated (matching `data/academies.ts` and `data/coaches.ts` structure) |
| **Effort** | 30 minutes |
| **Risk** | None |
| **Unblocks** | Visual verification of all pages |

---

## 4. Phase 3: Auth Fix (Day 3)

### Task 3.1: Fix register response
| | |
|---|---|
| **Files** | `sportsOS-nodejs/controllers/authController.js` |
| **Change** | Generate JWT token on register. Return `ok({ user, token })` |
| **Effort** | 10 minutes |
| **Risk** | None |
| **Unblocks** | Frontend register page |

### Task 3.2: Fix login response
| | |
|---|---|
| **Files** | `sportsOS-nodejs/controllers/authController.js` |
| **Change** | Return `ok({ user, token })` instead of raw `{ message, token, user }` |
| **Effort** | 5 minutes |
| **Risk** | None |
| **Unblocks** | Frontend login page |

### Task 3.3: Expand User role enum
| | |
|---|---|
| **Files** | `sportsOS-nodejs/models/User.js` |
| **Change** | Change `enum: ['user', 'admin']` to `enum: ['athlete', 'parent', 'coach', 'academy_owner', 'admin']` |
| **Effort** | 2 minutes |
| **Risk** | None (no existing data with old roles) |
| **Unblocks** | Frontend role-based UI |

---

## 5. Phase 4: Shortlist Rewrite (Day 4)

### Task 5.1: Replace Shortlist model
| | |
|---|---|
| **Files** | `sportsOS-nodejs/models/Shortlist.js` |
| **Change** | Replace entirely: `userId` (ref User), `contextChildId` (ref Child, optional), `itemId` (ObjectId), `itemType` (enum: academy/coach/sport). Add compound unique index on `(userId, itemId, itemType)`. |
| **Effort** | 10 minutes |
| **Risk** | **MEDIUM** — breaking change, requires DB drop of old collection |
| **Unblocks** | All shortlist functionality |

### Task 5.2: Rewrite shortlistRepository
| | |
|---|---|
| **Files** | `sportsOS-nodejs/repositories/shortlistRepository.js` |
| **Change** | New methods: `findByUser(userId)`, `findByUserAndType(userId, itemType)`, `findDuplicate(userId, itemId, itemType)`, `create(data)`, `remove(userId, itemId, itemType)` |
| **Effort** | 15 minutes |
| **Risk** | Low |
| **Unblocks** | Shortlist controller |

### Task 5.3: Rewrite shortlistController
| | |
|---|---|
| **Files** | `sportsOS-nodejs/controllers/shortlistController.js` |
| **Change** | Rename mount to `/favorites`. New routes: `GET /favorites` (user's bookmarks), `POST /favorites` (add), `DELETE /favorites/:type/:id` (remove). Add `protect` middleware. Wrap in `ok()`. |
| **Effort** | 20 minutes |
| **Risk** | Low |
| **Unblocks** | Frontend shortlist toggle + page |

### Task 5.4: Update index.js mount
| | |
|---|---|
| **Files** | `sportsOS-nodejs/index.js` |
| **Change** | Change `app.use('/shortlist', ...)` to `app.use('/favorites', ...)` |
| **Effort** | 2 minutes |
| **Risk** | None |
| **Unblocks** | Frontend `/favorites` path |

---

## 6. Phase 5: Enquiry Endpoint (Day 4)

### Task 6.1: Create Enquiry model
| | |
|---|---|
| **Files** | New `sportsOS-nodejs/models/Enquiry.js` |
| **Change** | Fields: `userId`, `targetType` (enum), `targetId`, `intent` (enum), `parentInfo` ({name, email, phone}), `childInfo` ({name, age}), `sportInterest`, `message`, `status` (default: submitted), `createdAt` |
| **Effort** | 10 minutes |
| **Risk** | None |
| **Unblocks** | Enquiry form submission |

### Task 6.2: Create enquiryController
| | |
|---|---|
| **Files** | New `sportsOS-nodejs/controllers/enquiryController.js` |
| **Change** | `POST /enquiries` (create), `GET /enquiries` (list by user). Add `protect` middleware. |
| **Effort** | 20 minutes |
| **Risk** | None |
| **Unblocks** | Frontend enquiry form |

### Task 6.3: Mount in index.js
| | |
|---|---|
| **Files** | `sportsOS-nodejs/index.js` |
| **Change** | Add `app.use('/enquiries', require('./controllers/enquiryController'))` |
| **Effort** | 2 minutes |
| **Risk** | None |

---

## 7. Phase 6: Frontend Wiring (Day 5-7)

### Task 7.1: Connect login page
| | |
|---|---|
| **Files** | `app/(auth)/login/page.tsx` |
| **Change** | Replace setTimeout with `login()` from `@/lib/api/auth`. Store token in localStorage. |
| **Effort** | 15 minutes |
| **Risk** | Low |
| **Depends on** | Phase 3 |

### Task 7.2: Connect register page
| | |
|---|---|
| **Files** | `app/(auth)/register/page.tsx` |
| **Change** | Replace setTimeout with `register()` from `@/lib/api/auth`. Store token in localStorage. |
| **Effort** | 15 minutes |
| **Risk** | Low |
| **Depends on** | Phase 3 |

### Task 7.3: Connect academy listing
| | |
|---|---|
| **Files** | `components/academies/academy-listing.tsx` |
| **Change** | Replace `import { academies } from '@/data/academies'` with `getAcademies()` from `@/lib/api/academies`. Handle loading/error states. |
| **Effort** | 20 minutes |
| **Risk** | Low |
| **Depends on** | Phase 2 |

### Task 7.4: Connect academy detail
| | |
|---|---|
| **Files** | `app/(public)/academies/[slug]/page.tsx` |
| **Change** | Replace `import { academyBySlug } from '@/data/academies'` with `getAcademy(slug)` from `@/lib/api/academies`. Convert to client component or use server fetch. |
| **Effort** | 20 minutes |
| **Risk** | Low |
| **Depends on** | Phase 2 |

### Task 7.5: Connect coach listing
| | |
|---|---|
| **Files** | `components/coaches/coaches-listing.tsx` |
| **Change** | Replace `import { coaches } from '@/data/coaches'` with `getCoaches()` from `@/lib/api/coaches`. |
| **Effort** | 15 minutes |
| **Risk** | Low |
| **Depends on** | Phase 2 |

### Task 7.6: Connect coach detail
| | |
|---|---|
| **Files** | `app/(public)/coaches/[slug]/page.tsx` |
| **Change** | Replace `import { coachBySlug } from '@/data/coaches'` with `getCoach(slug)`. Also replace `academyById` import with API call. |
| **Effort** | 20 minutes |
| **Risk** | Low |
| **Depends on** | Phase 2 |

### Task 7.7: Connect homepage featured sections
| | |
|---|---|
| **Files** | `components/home/featured-academies.tsx`, `components/home/featured-coaches.tsx` |
| **Change** | Replace static imports with API calls. |
| **Effort** | 15 minutes |
| **Risk** | Low |
| **Depends on** | Phase 2 |

### Task 7.8: Connect shortlist toggle
| | |
|---|---|
| **Files** | `components/shortlist/shortlist-toggle.tsx`, `components/providers/shortlist-provider.tsx` |
| **Change** | Replace localStorage operations with API calls to `/favorites`. |
| **Effort** | 30 minutes |
| **Risk** | Medium |
| **Depends on** | Phase 4 |

### Task 7.9: Connect shortlist page
| | |
|---|---|
| **Files** | `components/shortlist/shortlist-view.tsx` |
| **Change** | Replace localStorage reads with `getFavorites()` API call. |
| **Effort** | 15 minutes |
| **Risk** | Low |
| **Depends on** | Phase 4 |

### Task 7.10: Connect enquiry form
| | |
|---|---|
| **Files** | `components/enquiry/enquiry-form.tsx` |
| **Change** | Replace `toast.success()` with `createEnquiry()` API call. |
| **Effort** | 10 minutes |
| **Risk** | Low |
| **Depends on** | Phase 5 |

---

## 8. Effort Summary

| Phase | Days | Tasks | Risk |
|-------|------|-------|------|
| 1: Infrastructure | 1 | 3 tasks | None |
| 2: Academy + Coach | 2-3 | 7 tasks | Medium (schema change) |
| 3: Auth Fix | 0.5 | 3 tasks | None |
| 4: Shortlist | 1 | 4 tasks | Medium (breaking change) |
| 5: Enquiry | 0.5 | 3 tasks | None |
| 6: Frontend Wiring | 2-3 | 10 tasks | Low |
| **Total** | **7-9** | **30 tasks** | |

---

## 9. What NOT to Change

| Item | Reason |
|------|--------|
| Frontend UI components | UI is complete |
| Frontend layout/styling | Works as-is |
| Frontend type definitions | Reference — keep unchanged |
| `lib/api/client.ts` | Production-ready — just needs `NEXT_PUBLIC_API_URL` |
| `lib/api/auth.ts` | Already defines correct API calls |
| `lib/api/academies.ts` | Already defines correct API calls |
| `lib/api/coaches.ts` | Already defines correct API calls |
| `lib/api/favorites.ts` | Already defines correct API calls |
| `lib/api/enquiries.ts` | Already defines correct API calls |
| `middleware/authMiddleware.js` | Working correctly |
| `config/db.js` | Working correctly |
| Sports pages | Use static data — defer to post-MVP |
| Search page | Use client-side filtering — defer to post-MVP |
| Compare page | Client-side only — works as-is |
| Admin pages | Defer to post-MVP |
| Private profile pages | Defer to post-MVP |
| Children pages | Defer to post-MVP |
| Settings pages | Defer to post-MVP |
| Analytics | Defer to post-MVP |
