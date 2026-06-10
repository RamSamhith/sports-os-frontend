# SportsOS

> India's Sports Discovery Ecosystem

A frontend platform connecting athletes, parents, sports academies, and coaches through intelligent matching, comparison, and discovery tools.

---

## Overview

SportsOS solves the problem of sports discovery in India. Athletes and parents can search for academies and coaches, compare them side-by-side, save favourites, and send enquiries — all powered by a smart matching algorithm that recommends the best fit based on sport interests, skill level, location proximity, and ratings.

**Current State:** Frontend prototype with client-side mock data. No backend, no database, no API integration.

---

## Features

### Core Discovery

- **Smart Matching** — Algorithm recommends academies/coaches based on 5 weighted criteria (sport, location, skill, proximity, rating)
- **Academy-First Design** — Academies are primary discovery objects; coaches belong to academies
- **Full-Text Search** — Search across academies, coaches, and sports with tabbed results
- **Comparison Engine** — Side-by-side comparison across ratings, facilities, training levels
- **Shortlisting** — Save and manage favourite academies, coaches, and sports

### User Experience

- **Multi-Role Support** — Athlete and Parent roles with tailored onboarding flows
- **Theme System** — 4 premium themes with animated transitions (Midnight Ice, Ember Orange, Graphite Titanium, Alpine Light)
- **Atmospheric UI** — Six-layer animated background engine with per-theme gradients
- **Responsive Design** — Mobile-first layout supporting 320px to 1440px viewports
- **Offline Support** — PWA manifest for installability, localStorage persistence

### Quality

- **Accessibility** — WCAG 2.1 AA compliant (ARIA, keyboard nav, focus management, reduced motion)
- **SEO Optimised** — Server-rendered pages, structured data, sitemap, Open Graph
- **Type Safety** — TypeScript strict mode, zero type errors
- **Performance** — Memoized calculations, lazy loading, GPU-aware animations

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router) | 14.2.18 |
| Language | TypeScript (strict) | 5.6.2 |
| Styling | Tailwind CSS | 3.4.13 |
| Components | Radix UI | Various |
| Animations | Framer Motion | 11.11.0 |
| Validation | Zod | 3.23.8 |
| Notifications | Sonner | 1.5.0 |
| Fonts | Geist Sans, Geist Mono, Inter | — |
| Package Manager | pnpm | — |
| Linting | ESLint (next/core-web-vitals) | 8.57.1 |
| Formatting | Prettier + Tailwind plugin | 3.3.3 |
| Git Hooks | Husky | 9.1.6 |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18.17
- pnpm ≥ 8.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SportsOS

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app runs at `http://localhost:3000`.

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm format` | Format code with Prettier |

---

## Project Structure

```
SportsOS/
├── app/                    # Next.js App Router (~57 routes)
│   ├── (public)/           # Guest routes (home, academies, coaches, sports)
│   ├── (auth)/             # Auth routes (login, register, onboarding)
│   ├── (private)/          # Authenticated routes (profile, settings)
│   └── (admin)/            # Admin dashboard (role-gated)
│
├── components/             # React components (~100+ components)
│   ├── ui/                 # Reusable primitives (Button, Card, Input, etc.)
│   ├── home/               # Homepage sections (PersonalizedHome, etc.)
│   ├── academies/          # Academy cards, grids
│   ├── coaches/            # Coach cards, grids
│   ├── academy/            # Academy detail sections
│   ├── compare/            # Comparison view
│   ├── search/             # Search components
│   ├── filters/            # Filter system
│   ├── profile/            # Profile management
│   ├── feedback/           # Error boundaries, skeletons, empty states
│   └── providers/          # Context providers
│
├── lib/
│   ├── hooks/              # Custom React hooks (~15 hooks)
│   ├── utils/              # Utilities (cn, matching, validators)
│   ├── constants/          # Sport taxonomy, radius options
│   └── design-system/      # Design token utilities
│
├── types/                  # TypeScript type definitions (~19 files)
│   └── domain/             # Domain models (academy, coach, sport, etc.)
│
├── data/                   # Static mock data
│   ├── academies.ts        # 12 academies (Bengaluru)
│   ├── coaches.ts          # 8 coaches (Bengaluru)
│   └── sports.ts           # 20 sports
│
├── config/                 # Configuration (site, nav, theme, env)
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md     # System architecture
│   ├── DEVELOPMENT.md      # Developer guide
│   └── VIVA.md             # Presentation/viva guide
│
└── public/                 # Static assets
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](./docs/ARCHITECTURE.md) | System architecture, route structure, state management, matching algorithm |
| [Developer Guide](./docs/DEVELOPMENT.md) | Setup, patterns, common tasks, troubleshooting |
| [Viva Guide](./docs/VIVA.md) | Presentation prep, Q&A, demo script |
| [Architecture (Legacy)](./Architecture.md) | Original architecture document |
| [Admin Architecture](./Admin-Architecture.md) | Admin dashboard architecture |
| [Analytics Architecture](./Analytics-Architecture.md) | Analytics system architecture |
| [SEO Architecture](./SEO-Architecture.md) | SEO implementation details |

---

## Design System

### Components

Built on Radix UI primitives with Tailwind CSS:

- **Primitives** — Button, Card, Input, Label, Badge, Tabs, Select, Switch, Dialog, Sheet, Tooltip
- **Layout** — Container, Section, Navbar, Footer, Sidebar
- **Feedback** — Error Boundary, Skeleton loaders, Empty states, Toast notifications
- **Motion** — Fade-in, hover-lift, scroll-reveal, page transitions, stagger animations

### Themes

| Theme | Class | Character |
|-------|-------|-----------|
| Midnight Ice | `.midnight-ice` | Premium dark — blue aurora, soft gradients |
| Ember Orange | `.ember-orange` | Energetic — warm stadium glow |
| Graphite Titanium | `.graphite-titanium` | Executive — metallic sweep |
| Alpine Light | `.alpine-light` | Accessible light — daylight drift |

Features: Pre-hydration bootstrap (no theme flash), animated transitions, six-layer atmospheric background, `prefers-reduced-motion` support.

### Button System

7 variants × 8 sizes:

| Variant | Description |
|---------|-------------|
| default | Primary action |
| secondary | Secondary action |
| outline | Bordered action |
| ghost | No background |
| destructive | Dangerous action |
| glass | Frosted glass effect |
| link | Text link |

| Size | Dimensions |
|------|-----------|
| sm | h-8 |
| md | h-10 |
| lg | h-11 |
| xl | h-12 |
| icon | h-10 w-10 |
| icon-sm | h-8 w-8 |
| icon-touch | h-11 w-11 (WCAG) |

---

## Authentication Flow

```
Register → OTP Method → OTP Verify → Role Selection → Onboarding Wizard → Homepage
     ↑                                        ↓
     └──── "Edit" preserves form in sessionStorage ────┘
```

- Registration stores draft in `sessionStorage` for "Edit phone/email" flow
- OTP method selection (email/phone) stored in `sessionStorage`
- Onboarding wizard collects: role → sport interests → skill level → location → goals
- Auth state persisted in localStorage via React Context

---

## Matching Algorithm

```
Total Score = SportMatch(10pts) + LocationMatch(8pts) + SkillMatch(5pts) + ProximityBonus(2-6pts) + RatingBonus(1x)
```

| Component | Weight | Logic |
|-----------|--------|-------|
| Sport Match | 10 pts/sport | +10 for each matching sport (fuzzy substring) |
| Location Match | 8 pts | +8 exact city, +6 partial match |
| Skill Match | 5 pts | +5 if academy supports user's level |
| Proximity | 2-6 pts | ≤5km: +6, ≤15km: +4, ≤30km: +2 |
| Rating | 1× avg | +1 point per 1.0 average |

Distance calculated via **Haversine formula** between user and entity coordinates.

---

## State Management

### Storage Keys

| Key | Type | Purpose |
|-----|------|---------|
| `sportsos:onboarding` | localStorage | User preferences (role, sports, skill, goals) |
| `sportsos:auth-state` | localStorage | Authentication state |
| `sportsos:profile` | localStorage | User profile data |
| `sportsos:selected-academy` | localStorage | Active academy ID |
| `sportsos:recently-viewed` | localStorage | Last 10 viewed items |
| `sportsos:academy-status` | localStorage | Interested/Shortlisted/Selected |
| `sportsos:signup-draft` | sessionStorage | Signup form preservation |
| `sportsos:otp-method` | sessionStorage | OTP delivery method |

### React Contexts

- **AuthProvider** — Authentication state, login/logout
- **ThemeProvider** — Theme switching (next-themes)
- **ConsentProvider** — Analytics/cookie consent
- **OfflineProvider** — Online/offline detection

---

## Future Backend Integration

| Area | Current State | Integration Point |
|------|--------------|-------------------|
| Authentication | Client-side mock | JWT + refresh tokens |
| User Profiles | localStorage | REST API |
| Search | Client-side filtering | Full-text search API |
| Academies | Static fixtures | Database + CRUD API |
| Coaches | Static fixtures | Database + CRUD API |
| Sports | Static fixtures | Database + read API |
| Enquiries | Toast only | Form submission API |
| Shortlist | localStorage | Database persistence |
| Analytics | Client-side queue | Event ingestion API |
| Admin | Static mock | Admin API + dashboard |

---

## Known Limitations

- Authentication is client-side only — no server-side session management
- All data is static fixtures — no database or API integration
- Enquiry submissions not persisted — toast notification only
- PWA icons not yet generated (manifest references missing PNG files)
- Admin panel uses hardcoded mock data
- Profile data lost on browser cache clear (localStorage only)
- No real-time notifications or WebSocket support

---

## License

Private — All rights reserved.
