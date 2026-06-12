# MVP Test Plan

**Date:** June 12, 2026  
**Prerequisite:** Seed scripts must be executed on Render before testing.

```bash
MONGO_URI="<render-mongo-uri>" node seeds/seedAcademies.js
MONGO_URI="<render-mongo-uri>" node seeds/seedCoaches.js
```

---

## 1. Public User Testing Checklist

Test without logging in.

| # | Test | Steps | Expected | Pass/Fail |
|---|------|-------|----------|-----------|
| 1.1 | Homepage loads | Navigate to `/` | Page renders, no console errors | |
| 1.2 | Homepage shows academies | Scroll to featured academies section | Academy cards visible with names, images, ratings | |
| 1.3 | Homepage shows coaches | Scroll to featured coaches section | Coach cards visible with names, sports, ratings | |
| 1.4 | Academy listing loads | Navigate to `/academies` | 12 academy cards displayed | |
| 1.5 | Academy listing pagination | If >20 items, scroll/paginate | Pagination works correctly | |
| 1.6 | Academy search/filter | Enter search term or select sport filter | Results update, matching academies shown | |
| 1.7 | Academy detail loads | Click any academy card | Detail page loads with name, description, location, sports, facilities, certifications, rating | |
| 1.8 | Academy detail back button | Click back/breadcrumb | Returns to academy listing | |
| 1.9 | Coach listing loads | Navigate to `/coaches` | 8 coach cards displayed | |
| 1.10 | Coach detail loads | Click any coach card | Detail page loads with name, sport, experience, certifications, rating | |
| 1.11 | Coach detail back button | Click back/breadcrumb | Returns to coach listing | |
| 1.12 | Enquiry form loads (academy) | Navigate to `/enquiry/academy/<id>` | Form renders with target info pre-filled | |
| 1.13 | Enquiry form loads (coach) | Navigate to `/enquiry/coach/<id>` | Form renders with target info pre-filled | |
| 1.14 | Navigation links work | Click all nav links | Correct pages load, no dead links | |
| 1.15 | 404 page | Navigate to `/nonexistent-page` | Custom 404 or redirect, no crash | |

---

## 2. Authentication Testing Checklist

| # | Test | Steps | Expected | Pass/Fail |
|---|------|-------|----------|-----------|
| 2.1 | Register page loads | Navigate to `/register` | Form renders with name, email, phone, password, confirm password fields | |
| 2.2 | Register validation | Submit empty form | Field errors shown: name required, email required, phone required, password required | |
| 2.3 | Register email validation | Enter invalid email | Error: "Enter a valid email address" | |
| 2.4 | Register phone validation | Enter phone with != 10 digits | Error: "Phone number must be exactly 10 digits" | |
| 2.5 | Register password validation | Enter password < 8 chars | Error: "Password must be at least 8 characters" | |
| 2.6 | Register password mismatch | Enter different passwords | Error: "Passwords do not match" | |
| 2.7 | Register success | Submit valid form | Account created, token stored, redirect to `/verify/method` | |
| 2.8 | Register duplicate email | Register with existing email | Error: "Email already registered" | |
| 2.9 | Register role escalation | Register with `"role":"admin"` in request | User created as `athlete`, not `admin` | |
| 2.10 | Login page loads | Navigate to `/login` | Form renders with email, password fields | |
| 2.11 | Login validation | Submit empty form | Field errors shown | |
| 2.12 | Login success | Enter valid credentials | Token stored, redirect to `/` | |
| 2.13 | Login wrong password | Enter wrong password | Error: "Invalid email or password" | |
| 2.14 | Login wrong email | Enter non-existent email | Error: "Invalid email or password" | |
| 2.15 | Login error display | Trigger login error | Red error banner shows actual message (not "UNKNOWN_ERROR") | |
| 2.16 | Token persistence | Login, close browser, reopen | User remains logged in (token in localStorage) | |
| 2.17 | Auth state on refresh | Login, refresh page | Auth state restored from localStorage | |
| 2.18 | Logout | Click logout/sign out | Token cleared, auth state reset, redirect to `/` | |
| 2.19 | Protected route redirect | Access `/profile/enquiries` without login | Redirect to `/login` | |
| 2.20 | Rate limiting | Attempt login 20+ times rapidly | After 20 attempts, receive rate limit error | |

---

## 3. Shortlist Testing Checklist

| # | Test | Steps | Expected | Pass/Fail |
|---|------|-------|----------|-----------|
| 3.1 | Shortlist page (guest) | Navigate to `/shortlist` without login | Empty state shown, prompt to browse | |
| 3.2 | Shortlist page (authenticated) | Navigate to `/shortlist` with login | Shows saved items or empty state | |
| 3.3 | Add academy to shortlist | Click bookmark on academy card | Item added, bookmark icon changes, toast confirmation | |
| 3.4 | Add coach to shortlist | Click bookmark on coach card | Item added, bookmark icon changes | |
| 3.5 | Shortlist displays added items | Go to `/shortlist` | Saved academy and coach appear in list | |
| 3.6 | Shortlist shows correct data | Check saved item details | Name, location, rating, image displayed correctly | |
| 3.7 | Remove from shortlist | Click remove/delete on saved item | Item removed from list | |
| 3.8 | Clear all shortlist | Click "Clear all" button | All items removed, empty state shown | |
| 3.9 | Duplicate prevention | Add same item twice | Only one copy in shortlist | |
| 3.10 | Shortlist persists (auth) | Login, add items, refresh page | Items still present after refresh | |
| 3.11 | Shortlist persists (guest) | Add items without login, refresh | Items still present (localStorage) | |
| 3.12 | Shortlist sync (auth) | Login on different browser | Shortlist items synced from API | |
| 3.13 | Add to shortlist (unauthenticated) | Click bookmark without login | Item added to local shortlist (guest mode) | |

---

## 4. Enquiry Testing Checklist

| # | Test | Steps | Expected | Pass/Fail |
|---|------|-------|----------|-----------|
| 4.1 | Enquiry form loads | Navigate to `/enquiry/academy/<slug>` | Form renders with parent info fields | |
| 4.2 | Enquiry form validation | Submit empty form | Required fields highlighted | |
| 4.3 | Enquiry submit (guest) | Fill form, submit without login | Enquiry created, confirmation shown | |
| 4.4 | Enquiry submit (auth) | Fill form, submit while logged in | Enquiry created with userId attached | |
| 4.5 | Enquiry response shape | Submit enquiry | Response includes `enquiryId`, `leadId`, `whatsappConfirmationSent` | |
| 4.6 | Profile enquiries page | Navigate to `/profile/enquiries` | List of past enquiries shown | |
| 4.7 | Profile enquiries empty | Check with no enquiries | Empty state: "No enquiries yet" | |
| 4.8 | Profile enquiries data | Check with enquiries | Each shows target type, sport, date, status badge | |
| 4.9 | Enquiry status badge | Check status display | Correct color for submitted/delivered/failed/bounced | |
| 4.10 | Enquiry link to target | Click link on enquiry card | Navigates to academy/coach detail page | |
| 4.11 | Enquiry rate limiting | Submit 10+ enquiries rapidly | After 10, receive rate limit error | |

---

## 5. Academy Testing Checklist

| # | Test | Steps | Expected | Pass/Fail |
|---|------|-------|----------|-----------|
| 5.1 | Listing count | Check academy listing | 12 academies displayed | |
| 5.2 | Card data | Inspect academy cards | Name, city, sport, rating, verification badge | |
| 5.3 | Detail page slug | Click academy, check URL | URL contains slug (e.g., `/academies/national-cricket-academy-bengaluru`) | |
| 5.4 | Detail page data | Check detail page | All fields render: name, description, location, sports, facilities, certifications, rating | |
| 5.5 | Slug lookup | Access `/academies/by-slug/national-cricket-academy-bengaluru` | Returns academy data | |
| 5.6 | Invalid slug | Access `/academies/by-slug/nonexistent` | 404 response | |
| 5.7 | Sport filter | Filter by "cricket" | Only cricket academies shown | |
| 5.8 | Search | Search "Mumbai" | Mumbai Football Academy appears | |
| 5.9 | Verification badges | Check academy cards | Verified academies show badge | |
| 5.10 | Cover images | Check academy cards/detail | Images load (or placeholder if no image) | |
| 5.11 | Rating display | Check rating on cards | Star rating and count displayed | |
| 5.12 | Enquiry from detail | Click "Enquiry" on academy detail | Navigates to enquiry form | |

---

## 6. Coach Testing Checklist

| # | Test | Steps | Expected | Pass/Fail |
|---|------|-------|----------|-----------|
| 6.1 | Listing count | Check coach listing | 8 coaches displayed | |
| 6.2 | Card data | Inspect coach cards | Name, sport, experience, rating | |
| 6.3 | Detail page slug | Click coach, check URL | URL contains slug (e.g., `/coaches/rahul-dravid-cricket-bengaluru`) | |
| 6.4 | Detail page data | Check detail page | All fields render: name, sport, experience, certifications, location, rating | |
| 6.5 | Slug lookup | Access `/coaches/by-slug/rahul-dravid-cricket-bengaluru` | Returns coach data | |
| 6.6 | Invalid slug | Access `/coaches/by-slug/nonexistent` | 404 response | |
| 6.7 | Sport filter | Filter by "cricket" | Only cricket coaches shown | |
| 6.8 | Search | Search "Hyderabad" | Saina Nehwal appears | |
| 6.9 | Academy association | Check coach with academy link | Academy name/link displayed | |
| 6.10 | Enquiry from detail | Click "Enquiry" on coach detail | Navigates to enquiry form | |

---

## 7. Cross-Browser Checklist

| # | Browser | Test | Pass/Fail |
|---|---------|------|-----------|
| 7.1 | Chrome (latest) | Full flow: register → login → browse → shortlist → enquiry | |
| 7.2 | Firefox (latest) | Full flow: register → login → browse → shortlist → enquiry | |
| 7.3 | Safari (latest) | Full flow: register → login → browse → shortlist → enquiry | |
| 7.4 | Edge (latest) | Full flow: register → login → browse → shortlist → enquiry | |
| 7.5 | Chrome mobile | Full flow on Android device | |
| 7.6 | Safari mobile | Full flow on iOS device | |

**For each browser verify:**
- [ ] Pages render correctly
- [ ] No layout breaks
- [ ] Forms submit correctly
- [ ] Auth state persists
- [ ] Console has no errors
- [ ] Images load

---

## 8. Mobile Responsiveness Checklist

| # | Test | Steps | Expected | Pass/Fail |
|---|------|-------|----------|-----------|
| 8.1 | Homepage mobile | View on 375px width | Cards stack, nav collapses, readable | |
| 8.2 | Academy listing mobile | Scroll academy cards | Single column, cards full width | |
| 8.3 | Academy detail mobile | View detail page | Content readable, images scale | |
| 8.4 | Coach listing mobile | Scroll coach cards | Single column layout | |
| 8.5 | Coach detail mobile | View detail page | Content readable | |
| 8.6 | Login form mobile | Fill login form | Fields full width, keyboard accessible | |
| 8.7 | Register form mobile | Fill register form | All fields visible, no horizontal scroll | |
| 8.8 | Shortlist page mobile | View shortlist | Items stack, remove button accessible | |
| 8.9 | Enquiry form mobile | Fill enquiry form | Fields usable, submit button reachable | |
| 8.10 | Touch targets | Tap all buttons/links | Minimum 44x44px touch targets | |
| 8.11 | No horizontal scroll | Scroll all pages | No unwanted horizontal scrolling | |
| 8.12 | Tablet view | View on 768px width | 2-column grid, proper spacing | |

---

## 9. Bug Reporting Template

Use this template for every bug found:

```markdown
### BUG-XXX: [Short Title]

**Severity:** CRITICAL / HIGH / MEDIUM / LOW  
**Component:** [Auth / Academy / Coach / Shortlist / Enquiry / UI / Other]  
**Browser:** [Chrome / Firefox / Safari / Edge / Mobile Safari / Mobile Chrome]  
**Device:** [Desktop / iPhone / Android / Tablet]  
**URL:** [Page URL where bug occurs]  
**Login state:** [Guest / Authenticated]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [Third step]

**Expected:** [What should happen]  
**Actual:** [What actually happens]

**Screenshot:** [If applicable]  
**Console errors:** [If any]  
**Network errors:** [If any]

**Reported by:** [Name]  
**Date:** [Date]
```

---

## Test Execution Order

1. **Run seed scripts** (prerequisite)
2. **Section 1** — Public user flows (no auth needed)
3. **Section 2** — Authentication (register, login, logout)
4. **Section 5** — Academy data (verify seed data renders)
5. **Section 6** — Coach data (verify seed data renders)
6. **Section 3** — Shortlist (requires auth)
7. **Section 4** — Enquiry (requires auth or guest)
8. **Section 8** — Mobile responsiveness
9. **Section 7** — Cross-browser (last, after core flows pass)

---

## Known Issues to Watch For

| # | Issue | What to check |
|---|-------|---------------|
| 1 | Error message display | Login with wrong creds → verify shows "Invalid email or password", not "UNKNOWN_ERROR" |
| 2 | Empty states | Pages with no data → verify shows friendly empty state, not crash |
| 3 | Loading states | Slow connections → verify loading spinners appear |
| 4 | Auth redirect | Unauthenticated access to protected pages → verify redirect to login |
| 5 | Token expiry | Wait 7 days or invalidate token → verify graceful handling |

---

## Pass Criteria

**MVP is ready for release when:**

- [ ] All Section 1 tests pass (public flows)
- [ ] All Section 2 tests pass (auth flows)
- [ ] All Section 5 tests pass (academy data renders)
- [ ] All Section 6 tests pass (coach data renders)
- [ ] All Section 3 tests pass (shortlist works)
- [ ] All Section 4 tests pass (enquiry works)
- [ ] Zero CRITICAL bugs
- [ ] Zero HIGH bugs
- [ ] Section 7 passes on at least Chrome + Safari
- [ ] Section 8 passes on at least iOS + Android
