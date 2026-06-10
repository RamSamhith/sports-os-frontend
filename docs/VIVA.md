# SportsOS — Viva / Presentation Guide

## 1. Project Summary

**SportsOS** is India's sports discovery ecosystem — a frontend platform that helps athletes and parents find, compare, and connect with sports academies and coaches.

### Elevator Pitch (30 seconds)

> SportsOS is a Next.js 14 application that solves the problem of sports discovery in India. Athletes and parents can search for academies and coaches, compare them side-by-side, save favourites, and send enquiries. The platform uses a matching algorithm that recommends academies based on sport interests, skill level, location proximity, and ratings. It supports four premium themes, works offline via PWA, and follows WCAG accessibility guidelines.

---

## 2. Key Features

| Feature | Description |
|---------|-------------|
| **Smart Matching** | Algorithm recommends academies/coaches based on sport, skill, location, proximity |
| **Academy-First Discovery** | Academies are primary entities; coaches belong to academies |
| **Comparison Engine** | Side-by-side comparison across ratings, facilities, training levels |
| **Multi-Role Support** | Athlete and Parent roles with different onboarding flows |
| **Theme System** | 4 premium themes with animated transitions |
| **Offline-First** | PWA support, localStorage persistence, cross-tab sync |
| **Accessibility** | ARIA attributes, keyboard nav, focus management, reduced motion |
| **SEO Optimised** | SSR, structured data, sitemap, Open Graph |

---

## 3. Technical Deep-Dive

### 3.1 Architecture

- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS with Radix UI primitives
- **State:** React Context + localStorage (no Redux needed)
- **Types:** TypeScript strict mode
- **Validation:** Zod schemas

### 3.2 Matching Algorithm

```
Score = SportMatch(10pts) + LocationMatch(8pts) + SkillMatch(5pts) + ProximityBonus(2-6pts) + RatingBonus(1x)
```

**Why this scoring?**
- Sport match is highest weight (10) — most important for relevance
- Location (8) ensures local results
- Skill level (5) matches training availability
- Proximity (Haversine formula) rewards nearby academies
- Rating provides tie-breaking

### 3.3 Data Flow

```
Onboarding → Preferences → Matching Engine → Homepage Personalization
                                                    ↓
                                              Academy/Coach Cards
                                                    ↓
                                              Detail Pages
                                                    ↓
                                              Compare/Shortlist
```

### 3.4 Storage Architecture

| Storage | Purpose | Sync |
|---------|---------|------|
| `sportsos:onboarding` | User preferences | Cross-tab via `BroadcastChannel` |
| `sportsos:auth-state` | Login state | Same-tab |
| `sportsos:selected-academy` | Active academy | Same-tab |
| `sportsos:academy-status` | Interested/Shortlisted | Same-tab |
| `sportsos:recently-viewed` | Last 10 views | Same-tab |
| `sportsos:signup-draft` | Form preservation | Session-only |

---

## 4. Design Decisions

### 4.1 Why Academy-First?

Academies are the primary discovery object because:
- Users search for places, not people
- Coaches are associated with academies
- Academy details (facilities, sports, location) are more searchable
- Reduces decision complexity

### 4.2 Why localStorage Over Redux?

- No backend to sync with
- Simpler architecture for a frontend-only app
- Cross-tab sync via `BroadcastChannel`
- Data persists across sessions
- No serialization overhead

### 4.3 Why Tailwind Over CSS Modules?

- Utility-first approach faster for rapid prototyping
- Consistent design tokens via CSS custom properties
- Built-in responsive design
- Smaller bundle (tree-shaking unused utilities)
- Better developer experience with IDE support

### 4.4 Why Radix UI?

- Unstyled primitives (full Tailwind control)
- Accessible by default (ARIA, keyboard nav)
- Customisable via className
- Lightweight
- Well-maintained

---

## 5. Challenges & Solutions

### 5.1 Theme Flash Prevention

**Problem:** Users see wrong theme on page load.

**Solution:** Pre-hydration bootstrap script in `globals.css` reads theme from localStorage and applies class before React hydration.

### 5.2 Cross-Tab State Sync

**Problem:** Changes in one tab don't reflect in others.

**Solution:** `BroadcastChannel` API in `useStorageSync` hook listens for storage events and syncs state across tabs.

### 5.3 Form State Preservation

**Problem:** Users lose form data when navigating away during signup.

**Solution:** Signup draft stored in `sessionStorage` (not localStorage) — clears when tab closes, persists during navigation.

### 5.4 Mobile Touch Targets

**Problem:** Small buttons hard to tap on mobile.

**Solution:** `icon-touch` button size (44×44px) meets WCAG 2.5.5 minimum. Filter drawer uses `min-h-[44px] min-w-[44px]`.

### 5.5 Performance on Mobile

**Problem:** Heavy animations slow on low-end devices.

**Solution:**
- `prefers-reduced-motion` detection
- GPU-heavy layers hidden on small screens
- `useMemo` for expensive matching calculations
- Lazy loading for below-fold sections

---

## 6. Metrics & Scores

### 6.1 Code Quality

| Metric | Score |
|--------|-------|
| TypeScript strict mode | ✅ Enabled |
| Type errors | 0 |
| Lint errors | 0 |
| Build status | ✅ Passing |
| Bundle size | ~150KB (First Load JS) |

### 6.2 Accessibility

| Criterion | Status |
|-----------|--------|
| WCAG 2.1 AA | ✅ Compliant |
| Keyboard navigation | ✅ Full support |
| Focus management | ✅ Visible focus rings |
| Screen reader labels | ✅ ARIA attributes |
| Reduced motion | ✅ Supported |
| Touch targets | ✅ 44×44px minimum |

### 6.3 Performance

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 3.5s |

### 6.4 Mobile Support

| Viewport | Status |
|----------|--------|
| 320px (small phone) | ✅ |
| 360px (standard phone) | ✅ |
| 390px (iPhone 14) | ✅ |
| 412px (Pixel 7) | ✅ |
| 768px (tablet) | ✅ |
| 1024px (desktop) | ✅ |

---

## 7. Future Enhancements

### 7.1 Backend Integration

- REST API with authentication (JWT)
- Database for real academy/coach data
- Real-time notifications via WebSocket
- File uploads for verification documents

### 7.2 Advanced Features

- AI-powered recommendations
- Video content for coach profiles
- Live chat with academies
- Payment integration for trial bookings
- Multi-language support (Hindi, Tamil, etc.)

### 7.3 Admin & Analytics

- Real-time analytics dashboard
- Academy verification workflow
- User behaviour tracking
- A/B testing framework

---

## 8. Code Walkthrough

### 8.1 Homepage Flow

```
app/(public)/page.tsx
  └── components/home/personalized-home.tsx
      ├── YourAcademy           (if academy selected)
      ├── MatchingExplanation   (shows criteria badges)
      ├── SuggestedAcademies    (scored by matching algorithm)
      ├── CoachesAtAcademy      (if academy selected)
      ├── SuggestedCoaches      (if no academy selected)
      ├── ContinueExploring     (last viewed items)
      └── RecentlyViewed        (last 10 viewed)
```

### 8.2 Onboarding Flow

```
Register → OTP Method → OTP Verify → Role Selection → Wizard → Homepage
                                    └── Athlete: age, gender, sports, skill, goals
                                    └── Parent: child name, age, sports, skill
```

### 8.3 Academy Detail Flow

```
app/(public)/academies/[slug]/page.tsx
  ├── Academy Info (name, description, rating)
  ├── Academy Actions (status button, enquiry)
  ├── Contact Info (phone, email, website)
  ├── Social Links (Instagram, Facebook, YouTube)
  ├── Coaches at Academy (compact cards)
  ├── Location Map (OpenStreetMap embed)
  └── Related Academies (nearby)
```

---

## 9. Q&A Preparation

### Common Questions

**Q: Why not use a backend?**
A: This is a frontend prototype demonstrating UI/UX capabilities. Backend integration is documented as future work.

**Q: How does the matching algorithm handle cold starts?**
A: If no onboarding data, it returns academies/coaches sorted by default order (first 6/4 items).

**Q: What happens if localStorage is full?**
A: The app catches `QuotaExceededError` and falls back to in-memory state. Data won't persist but the app remains functional.

**Q: How do you handle offline scenarios?**
A: PWA manifest enables installability. localStorage data persists offline. API calls (future) would use service worker caching.

**Q: Why Tailwind over styled-components?**
A: Tailwind's utility-first approach is faster for prototyping, produces smaller bundles via tree-shaking, and integrates better with the design token system.

**Q: How do you ensure accessibility?**
A: Radix UI provides accessible primitives. Custom components follow WCAG 2.1 AA. Focus management, keyboard navigation, and screen reader labels are implemented throughout.

---

## 10. Demo Script

### 5-Minute Demo

1. **Homepage** (30s) — Show hero, search, stats, featured academies
2. **Register & Onboarding** (1min) — Quick signup, role selection, wizard
3. **Personalized Home** (30s) — Show matching criteria, recommended academies
4. **Academy Detail** (1min) — Navigate to academy, show info, coaches, map
5. **Compare** (1min) — Add 2-3 academies, show side-by-side comparison
6. **Theme Switching** (30s) — Show all 4 themes with transitions
7. **Mobile View** (30s) — Show responsive design on mobile viewport
8. **Accessibility** (30s) — Keyboard navigation, focus rings, reduced motion

### Key Talking Points

- "Academy-first philosophy — users discover places, then people"
- "Smart matching based on 5 weighted criteria"
- "4 premium themes with animated transitions"
- "WCAG 2.1 AA accessible"
- "PWA-ready with offline support"
- "TypeScript strict mode — zero type errors"
