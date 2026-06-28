# SportsOS Mobile App — Frontend Requirements Document

**Version:** 1.0  
**Date:** June 2026  
**Status:** Draft  
**Classification:** Internal  

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [User Personas](#2-user-personas)
3. [Information Architecture](#3-information-architecture)
4. [Screen-by-Screen Requirements](#4-screen-by-screen-requirements)
5. [Component Specifications](#5-component-specifications)
6. [Navigation & Flow](#6-navigation--flow)
7. [State Management](#7-state-management)
8. [API Integration](#8-api-integration)
9. [Performance Requirements](#9-performance-requirements)
10. [Accessibility](#10-accessibility)
11. [Platform Requirements](#11-platform-requirements)
12. [Future Features Backlog](#12-future-features-backlog)

---

## 1. Product Overview

### 1.1 Purpose

SportsOS is India's Sports Discovery Ecosystem. The mobile app helps parents, students, and athletes discover, compare, shortlist, and connect with sports academies and coaches across India.

### 1.2 Scope

- **In Scope:** Frontend mobile application (React Native / Expo) mirroring the existing Next.js web app.
- **Out of Scope:** Backend changes, AI features, payments, subscriptions, chat systems, multilingual support.

### 1.3 Design Principles

| Principle | Description |
|-----------|-------------|
| **Academy-First** | Academies are the primary discovery object; coaches belong to academies |
| **Minimal Scroll** | Horizontal carousels over vertical lists; information density over whitespace |
| **Progressive Disclosure** | Show essentials first, details on tap |
| **Guest-Friendly** | Full browsing without authentication; prompt login at conversion moments |
| **Offline-Aware** | Graceful degradation when network is unavailable |

### 1.4 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo managed workflow) |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router (file-based) |
| State | Zustand + React Query (TanStack Query) |
| Styling | NativeWind (Tailwind CSS for RN) |
| Storage | AsyncStorage + MMKV |
| Maps | react-native-maps |
| Icons | lucide-react-native |

---

## 2. User Personas

### 2.1 Parent (Primary)

- **Age:** 30–50
- **Goal:** Find the best sports academy for their child
- **Needs:** Compare academies, check facilities, read reviews, contact via phone/WhatsApp
- **Behavior:** Browses on mobile, compares 3–5 academies, calls or sends enquiry

### 2.2 Student / Athlete

- **Age:** 12–25
- **Goal:** Find coaching and training options
- **Needs:** Search by sport, check coach certifications, view academy details
- **Behavior:** Uses search heavily, shortlists options, shares with parents

### 2.3 Guest Browser

- **Goal:** Explore options without commitment
- **Needs:** Browse academies, search, compare — no login required
- **Behavior:** Downloads app, browses, converts to user when saving/enquiring

---

## 3. Information Architecture

### 3.1 Screen Map

```
App
├── Home (tab)
│   ├── Hero + Search Bar
│   ├── Recommended Academies (carousel)
│   ├── Popular Sports (carousel)
│   ├── Cities Section (carousel)
│   ├── Testimonials (carousel)
│   └── Footer Links
│
├── Search (tab)
│   ├── Search Input
│   ├── Tabs: All | Academies | Sports | Cities
│   ├── Trending Searches
│   ├── Recent Searches
│   └── Results List
│
├── Shortlist (tab)
│   ├── Saved Academies
│   ├── Saved Coaches
│   └── Empty State
│
├── Profile (tab)
│   ├── Guest Profile (unauthenticated)
│   │   ├── Guest Badge
│   │   ├── Continue as Guest
│   │   └── Login / Sign Up CTA
│   └── User Profile (authenticated)
│       ├── Avatar + Name
│       ├── Settings
│       ├── Recently Viewed
│       ├── My Enquiries
│       ├── Dark Mode Toggle
│       ├── Accessibility Settings
│       └── Logout
│
├── Academy Detail (stack)
│   ├── Gallery (image carousel)
│   ├── Info Header (name, city, rating)
│   ├── Quick Actions (Call, WhatsApp, Enquiry)
│   ├── Facilities
│   ├── Coaches Section
│   ├── Reviews
│   ├── Achievements / Certifications
│   ├── Location Map
│   └── Related Academies (carousel)
│
├── Coach Detail (stack)
│   ├── Avatar + Name
│   ├── Certifications
│   ├── Sports Coached
│   ├── Academy Affiliation
│   └── Contact Actions
│
├── Sport Detail (stack)
│   ├── Sport Header
│   ├── Benefits
│   ├── Age Suitability
│   └── Related Academies
│
├── City Detail (stack)
│   ├── City Header
│   ├── Academies in City
│   └── Coaches in City
│
├── Compare (stack)
│   ├── Side-by-Side Table
│   ├── Ratings
│   ├── Facilities
│   └── Training Levels
│
├── Enquiry (modal)
│   ├── Enquiry Form
│   ├── Intent Selection
│   └── Success State
│
├── Auth (stack)
│   ├── Login
│   ├── Register
│   ├── Forgot Password
│   ├── OTP Verification
│   └── Social Login (Google)
│
└── Onboarding (stack)
    ├── Welcome
    ├── Role Selection (Parent / Athlete)
    ├── Sport Interests
    ├── Skill Level
    └── Location
```

### 3.2 Data Models

```typescript
// Academy
interface Academy {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: {
    address?: string;
    city: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  sportsOffered: Sport[];
  facilities: Facility[];
  trainingLevels: TrainingLevel[];
  certifications: Certification[];
  images: string[];
  rating: number;
  reviewsCount: number;
  savesCount: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

// Coach
interface Coach {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  certifications: Certification[];
  experienceYears: number;
  sportsCoached: Sport[];
  specialization: string;
  academyId?: string;
  location: {
    city: string;
    state: string;
  };
  contact: {
    phone?: string;
  };
  rating: number;
}

// Sport
interface Sport {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  benefits: string[];
  explorationGuidance: {
    ageSuitability: { min: number; max: number };
  };
}

// Facility (enum)
type Facility =
  | 'indoor' | 'outdoor' | 'ground' | 'court'
  | 'equipment' | 'changing_room' | 'parking'
  | 'physio' | 'gym';

// Certification
interface Certification {
  name: string;
  issuer: string;
  year: number;
  documentUrl?: string;
}

// Review
interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// User
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'athlete' | 'parent';
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  children?: Child[];
}

// Shortlist
interface ShortlistItem {
  id: string;
  entityType: 'academy' | 'coach' | 'sport';
  entityId: string;
  addedAt: string;
}
```

---

## 4. Screen-by-Screen Requirements

### 4.1 Home Screen

**Purpose:** Primary discovery hub. Users should find what they need within 2 scrolls.

| Section | Requirements | Data Source |
|---------|-------------|-------------|
| **Hero** | App name, tagline, search bar with city selector. Tap search → Search screen. | Static + location |
| **Recommended Academies** | Horizontal carousel. Card shows: image, name, city, rating, review count, save button. Tap → Academy Detail. | `GET /academies/recommended` |
| **Popular Sports** | Horizontal carousel. Card shows: icon, name, benefits preview. Tap → Sport Detail. | `GET /sports` |
| **Cities** | Horizontal carousel. Card shows: city name, academy count. Tap → City Detail. | `GET /cities` |
| **Testimonials** | Horizontal carousel. Card shows: quote, author, role. | Static or `GET /reviews/featured` |

**Interactions:**
- Pull-to-refresh refreshes all sections
- Horizontal carousels support swipe and snap
- Search bar is sticky on scroll
- Skeleton loading on initial load

**Components:**
- `HomeScreen`
- `HeroSection`
- `SearchBar`
- `AcademyCarousel`
- `SportCarousel`
- `CityCarousel`
- `TestimonialCarousel`
- `AcademyCard`
- `SportCard`
- `CityCard`
- `TestimonialCard`

---

### 4.2 Search Screen

**Purpose:** Find academies, sports, and cities by keyword.

| Element | Requirements |
|---------|-------------|
| **Search Input** | Auto-focus, clear button, debounce 300ms |
| **Tabs** | All, Academies, Sports, Cities — horizontal scrollable |
| **Trending** | Shown when input is empty. Static list or API-driven. |
| **Recent** | Stored locally (AsyncStorage). Max 10. Clear all option. |
| **Results** | List view with infinite scroll. 20 items per page. |
| **Empty State** | Illustration + "No results found" + suggestion text |
| **Loading** | Skeleton cards during fetch |

**API Calls:**
- `GET /search/suggest?q={query}` — trending + suggestions
- `GET /search?q={query}&type={tab}&page={n}&pageSize=20`

**Components:**
- `SearchScreen`
- `SearchInput`
- `SearchTabs`
- `TrendingList`
- `RecentList`
- `SearchResults`
- `SearchResultCard`
- `EmptyState`

---

### 4.3 Academy Listing Screen

**Purpose:** Browse all academies with filters.

| Element | Requirements |
|---------|-------------|
| **Header** | "Academies" title, filter icon with count badge |
| **Filter Bar** | Horizontal scrollable chips: Sport, City, Facility, Level, Status |
| **Active Filters** | Shown below header as removable chips |
| **Academy Cards** | Image, name, city, rating, review count, facilities count, save button |
| **Sort** | By relevance (default), rating, reviews, saves |
| **Infinite Scroll** | Load more on scroll. 20 per page. |
| **Skeleton** | 6 skeleton cards on initial load |
| **Empty** | "No academies found" with filter reset |

**API Calls:**
- `GET /academies?sport={}&city={}&facility={}&level={}&status={}&sort={}&page={}&pageSize=20`

**Components:**
- `AcademyListing`
- `FilterBar`
- `FilterChip`
- `ActiveFilters`
- `AcademyCard`
- `AcademyCardSkeleton`
- `InfiniteScroll`

---

### 4.4 Academy Detail Screen

**Purpose:** Full academy profile. Users decide to call, enquire, or shortlist.

| Section | Requirements |
|---------|-------------|
| **Gallery** | Horizontal image carousel. Fullscreen view on tap. |
| **Header** | Name, city/state, rating stars, review count, save button |
| **Quick Actions** | Call (tel:), WhatsApp (wa.me), Enquiry (modal) — sticky bottom bar |
| **About** | Description text (truncated, expandable) |
| **Facilities** | Icon grid with labels. Each facility shows icon + name. |
| **Coaches** | Horizontal carousel of coach cards. Tap → Coach Detail. |
| **Reviews** | Top 3 reviews + "See all" link. Rating distribution bar chart. |
| **Achievements** | Certification cards: name, issuer, year |
| **Location Map** | Static map preview. Tap → opens Google Maps. "Get Directions" button. |
| **Related Academies** | Horizontal carousel. Same city or sport. |

**API Calls:**
- `GET /academies/{slug}` — full academy data
- `GET /academies/{slug}/reviews?page={}&pageSize=10` — paginated reviews
- `GET /academies/{slug}/related` — related academies

**Components:**
- `AcademyDetail`
- `ImageGallery`
- `AcademyHeader`
- `QuickActionsBar`
- `FacilitiesGrid`
- `CoachesCarousel`
- `CoachCard`
- `ReviewsSection`
- `ReviewCard`
- `RatingDistribution`
- `CertificationsList`
- `LocationMap`
- `RelatedAcademies`
- `EnquiryModal`

---

### 4.5 Coach Detail Screen

**Purpose:** Full coach profile. Users decide to contact or shortlist.

| Section | Requirements |
|---------|-------------|
| **Header** | Avatar, name, experience, rating |
| **Certifications** | List with name, issuer, year |
| **Sports** | Chips showing sports coached |
| **Academy** | Affiliated academy name + link to Academy Detail |
| **Contact** | Call button (if phone available) |
| **Bottom Bar** | Call, WhatsApp, Enquiry — sticky |

**API Calls:**
- `GET /coaches/{slug}` — full coach data

**Components:**
- `CoachDetail`
- `CoachHeader`
- `CertificationsList`
- `SportsChips`
- `AcademyLink`
- `ContactActions`

---

### 4.6 Sport Detail Screen

**Purpose:** Sport information page. Users explore the sport and find related academies.

| Section | Requirements |
|---------|-------------|
| **Header** | Sport icon, name |
| **Benefits** | Bulleted list of benefits |
| **Age Suitability** | Min–max age range display |
| **Related Academies** | List of academies offering this sport |

**API Calls:**
- `GET /sports/{slug}` — sport details
- `GET /sports/{slug}/academies` — related academies

**Components:**
- `SportDetail`
- `SportHeader`
- `BenefitsList`
- `AgeSuitability`
- `RelatedAcademies`

---

### 4.7 City Detail Screen

**Purpose:** City landing page. Users explore academies and coaches in a specific city.

| Section | Requirements |
|---------|-------------|
| **Header** | City name, state, academy count |
| **Academies** | List of academies in city |
| **Coaches** | List of coaches in city |

**API Calls:**
- `GET /cities/{city}` — city info
- `GET /cities/{city}/academies` — academies in city
- `GET /cities/{city}/coaches` — coaches in city

**Components:**
- `CityDetail`
- `CityHeader`
- `AcademyList`
- `CoachList`

---

### 4.8 Compare Screen

**Purpose:** Side-by-side comparison of 2–3 academies.

| Element | Requirements |
|---------|-------------|
| **Selection** | Max 3 academies. Remove/add from shortlist. |
| **Table** | Rows: Rating, Reviews, Facilities, Training Levels, Certifications, City |
| **Sticky Header** | Academy names + images stay visible while scrolling rows |
| **Empty** | "Add academies to compare" with CTA to browse |

**API Calls:**
- `GET /compare?id1={}&id2={}(&id3={})` — comparison data

**Components:**
- `CompareScreen`
- `CompareTable`
- `CompareRow`
- `CompareHeader`
- `EmptyCompare`

---

### 4.9 Shortlist Screen

**Purpose:** View saved academies, coaches, and sports.

| Element | Requirements |
|---------|-------------|
| **Tabs** | Academies, Coaches, Sports |
| **Cards** | Same card format as listing screens |
| **Swipe to Remove** | Swipe left to remove from shortlist |
| **Empty** | Illustration + "Nothing saved yet" + Browse CTA |
| **Compare CTA** | Floating button: "Compare (2/3)" when 2+ academies selected |

**Components:**
- `ShortlistScreen`
- `ShortlistTabs`
- `ShortlistCard`
- `EmptyShortlist`
- `CompareFAB`

---

### 4.10 Profile Screen

**Purpose:** User account management and settings.

#### Guest State

| Element | Requirements |
|---------|-------------|
| **Guest Badge** | "Guest User" label with icon |
| **Guest Icon** | Generic avatar |
| **Login CTA** | Primary button: "Login / Sign Up" |
| **Guest Features** | Dark mode toggle, accessibility settings |

#### Authenticated State

| Element | Requirements |
|---------|-------------|
| **Avatar** | User photo or initials fallback |
| **Name + Email** | Display from profile |
| **Settings List** | Dark Mode, Accessibility, About, Help |
| **Recently Viewed** | Last 10 viewed academies/coaches |
| **My Enquiries** | List of sent enquiries with status |
| **Logout** | Confirmation dialog |

**Components:**
- `ProfileScreen`
- `GuestProfile`
- `UserProfile`
- `SettingsList`
- `RecentlyViewed`
- `MyEnquiries`

---

### 4.11 Auth Screens

#### Login

| Element | Requirements |
|---------|-------------|
| **Email Input** | With validation |
| **Password Input** | Show/hide toggle |
| **Login Button** | Primary CTA |
| **Social Login** | Google button |
| **Forgot Password** | Link → Forgot Password screen |
| **Sign Up** | Link → Register screen |

#### Register

| Element | Requirements |
|---------|-------------|
| **Name Input** | Required |
| **Email Input** | With validation |
| **Password Input** | With strength indicator |
| **Phone Input** | Optional, with country code |
| **Role Selection** | Parent / Athlete radio |
| **Register Button** | Primary CTA |
| **Social Login** | Google button |
| **Login Link** | "Already have an account? Login" |

#### Forgot Password

| Element | Requirements |
|---------|-------------|
| **Email Input** | Required |
| **Send Reset Link** | Primary CTA |
| **Success State** | "Check your email" message |

#### OTP Verification

| Element | Requirements |
|---------|-------------|
| **OTP Input** | 6-digit code, auto-advance |
| **Resend** | Countdown timer, then "Resend OTP" |
| **Verify Button** | Primary CTA |

**API Calls:**
- `POST /auth/login` — email + password
- `POST /auth/register` — full registration
- `POST /auth/forgot-password` — send reset email
- `POST /auth/verify-otp` — verify OTP code
- `POST /auth/refresh` — refresh token

**Components:**
- `LoginScreen`
- `RegisterScreen`
- `ForgotPasswordScreen`
- `OTPVerificationScreen`
- `SocialLoginButtons`
- `AuthInput`
- `AuthButton`

---

### 4.12 Enquiry Modal

**Purpose:** Send enquiry to academy/coach without leaving the screen.

| Element | Requirements |
|---------|-------------|
| **Intent** | Radio: "Visit Academy", "Phone Call", "WhatsApp", "Other" |
| **Message** | Textarea, pre-filled with intent template |
| **Contact Info** | Pre-filled from profile (name, email, phone) |
| **Submit** | Primary CTA |
| **Success** | "Enquiry sent!" with checkmark animation |

**API Calls:**
- `POST /enquiries` — submit enquiry

**Components:**
- `EnquiryModal`
- `IntentSelector`
- `EnquiryForm`
- `EnquirySuccess`

---

### 4.13 Onboarding Flow

**Purpose:** Personalize experience for new users.

| Screen | Requirements |
|--------|-------------|
| **Welcome** | App intro, "Get Started" CTA |
| **Role** | Select: Parent or Athlete |
| **Sports** | Multi-select sport chips |
| **Skill Level** | Beginner / Intermediate / Advanced |
| **Location** | City picker or auto-detect |

**Components:**
- `OnboardingFlow`
- `WelcomeScreen`
- `RoleSelection`
- `SportSelection`
- `SkillLevelSelection`
- `LocationSelection`

---

## 5. Component Specifications

### 5.1 Reusable Components

| Component | Props | Description |
|-----------|-------|-------------|
| `AcademyCard` | `academy, onSave, onCompare, showCompare` | Standard academy card for listings |
| `CoachCard` | `coach, onSave` | Standard coach card for listings |
| `SportCard` | `sport` | Sport card with icon and name |
| `CityCard` | `city, academyCount` | City card with count |
| `RatingStars` | `rating, size` | Star rating display (supports half stars) |
| `ReviewCard` | `review` | Review with rating, text, author |
| `CertificationIndicator` | `count, size` | Badge showing certification count |
| `FacilityBadge` | `facility` | Icon + label for a facility |
| `VerificationBadge` | `status` | Verified / Pending / Unverified badge |
| `EmptyState` | `illustration, title, description, action` | Reusable empty state |
| `SkeletonCard` | `type` | Loading skeleton (academy, coach, sport) |
| `FilterChip` | `label, active, onRemove` | Filter chip with optional remove |
| `SearchInput` | `value, onChange, onFocus, placeholder` | Search bar with icons |
| `BottomSheet` | `isVisible, onClose, children` | Modal bottom sheet |
| `StickyBar` | `children` | Sticky bottom action bar |

### 5.2 Academy Card Layout

```
┌─────────────────────────────────────┐
│ [Image Carousel]              [♡]   │
│                                     │
│ Academy Name                  ★ 4.5 │
│ City, State               (120)     │
│                                     │
│ [Indoor] [Court] [Gym]    +2 more  │
│                                     │
│ ✓ Verified                          │
└─────────────────────────────────────┘
```

### 5.3 Coach Card Layout

```
┌─────────────────────────────────────┐
│ [Avatar]  Coach Name           ★ 4.2│
│           8 years exp               │
│           Cricket, Football         │
│           3 Certifications          │
│           Academy Name              │
└─────────────────────────────────────┘
```

### 5.4 Academy Detail Layout

```
┌─────────────────────────────────────┐
│ [Gallery Carousel]           [♡]   │
│                                     │
│ Academy Name                        │
│ City, State                  ★ 4.5  │
│ (120 reviews)                       │
│                                     │
│ ┌──────┬──────┬──────┐             │
│ │ Call │ WA   │Enquiry│  ← Sticky  │
│ └──────┴──────┴──────┘             │
│                                     │
│ About                               │
│ Description text...                 │
│                                     │
│ Facilities                          │
│ [Indoor] [Court] [Gym] [Parking]   │
│                                     │
│ Coaches                             │
│ [Coach] [Coach] [Coach]  →         │
│                                     │
│ Reviews                             │
│ ★★★★☆ "Great academy..."           │
│ [See all reviews]                   │
│                                     │
│ Achievements                        │
│ [Cert 1] [Cert 2]                  │
│                                     │
│ Location                            │
│ [Map Preview]  [Get Directions]     │
│                                     │
│ Related Academies                   │
│ [Academy] [Academy] [Academy]  →   │
└─────────────────────────────────────┘
```

---

## 6. Navigation & Flow

### 6.1 Tab Navigation

```
┌─────────────────────────────────────┐
│                                     │
│         [Screen Content]            │
│                                     │
├─────────────────────────────────────┤
│  🏠      🔍      ♡      👤        │
│  Home  Search Shortlist Profile     │
└─────────────────────────────────────┘
```

**Rules:**
- 4 tabs: Home, Search, Shortlist, Profile
- Active tab highlighted with accent color
- Badge on Shortlist tab showing count
- Tab bar hidden on detail screens
- Tab bar reappears on back navigation

### 6.2 Navigation Flows

#### Discovery Flow

```
Home → Search → Results → Academy Detail → Enquiry Modal
Home → Recommended → Academy Detail → Call / WhatsApp
Home → Sport → Sport Detail → Related Academies → Academy Detail
Home → City → City Detail → Academy List → Academy Detail
```

#### Comparison Flow

```
Academy Listing → Add to Compare → Compare Screen (2–3 academies)
Academy Detail → Add to Compare → Compare Screen
Shortlist → Add to Compare → Compare Screen
```

#### Shortlist Flow

```
Any Academy Card → Save (♡) → Shortlist Tab
Academy Detail → Save (♡) → Shortlist Tab
Shortlist Tab → Remove (swipe) → Removed
Shortlist Tab → Compare (FAB) → Compare Screen
```

#### Auth Flow

```
Profile (Guest) → Login → Home (authenticated)
Profile (Guest) → Register → Onboarding → Home
Any Save/Enquiry action → Login Prompt → Auth → Resume action
```

### 6.3 Deep Links

| Route | Deep Link | Description |
|-------|-----------|-------------|
| Academy Detail | `sportsos://academy/{slug}` | Open specific academy |
| Coach Detail | `sportsos://coach/{slug}` | Open specific coach |
| Sport Detail | `sportsos://sport/{slug}` | Open specific sport |
| City Detail | `sportsos://city/{city}` | Open specific city |

---

## 7. State Management

### 7.1 Store Architecture

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `useAuthStore` | User session, tokens, profile | AsyncStorage (tokens), MMKV (profile) |
| `useShortlistStore` | Saved items | AsyncStorage |
| `useCompareStore` | Items in comparison | Memory only |
| `useSearchStore` | Recent searches, trending | AsyncStorage (recent) |
| `useLocationStore` | User location, selected city | AsyncStorage |
| `useThemeStore` | Dark mode preference | AsyncStorage |
| `useOnboardingStore` | Onboarding completion status | AsyncStorage |

### 7.2 Cache Strategy

| Data | Cache Time | Stale Time | Refetch |
|------|-----------|------------|---------|
| Academy list | 5 min | 10 min | On pull-to-refresh |
| Academy detail | 5 min | 10 min | On revisit |
| Sports list | 30 min | 1 hour | On pull-to-refresh |
| Cities list | 1 hour | 2 hours | On pull-to-refresh |
| Search results | 2 min | 5 min | On new search |
| Reviews | 5 min | 10 min | On pull-to-refresh |

### 7.3 Offline Support

| Feature | Offline Behavior |
|---------|-----------------|
| Browse cached academies | ✅ Works from cache |
| Search | ❌ Shows "No connection" |
| Shortlist | ✅ Works locally, syncs when online |
| Compare | ✅ Works for cached academies |
| Enquiry | ❌ Queues for later submission |
| Auth | ❌ Requires connection |

---

## 8. API Integration

### 8.1 Base Configuration

```typescript
const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  retries: 2,
  retryDelay: 1000,
};
```

### 8.2 Endpoint Map

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/academies` | List academies (filtered, paginated) | No |
| GET | `/academies/{slug}` | Academy detail | No |
| GET | `/academies/{slug}/reviews` | Academy reviews | No |
| GET | `/academies/{slug}/related` | Related academies | No |
| GET | `/coaches` | List coaches | No |
| GET | `/coaches/{slug}` | Coach detail | No |
| GET | `/sports` | List sports | No |
| GET | `/sports/{slug}` | Sport detail | No |
| GET | `/search?q={query}` | Search all | No |
| GET | `/search/suggest?q={query}` | Search suggestions | No |
| GET | `/compare?id1=&id2=` | Compare academies | No |
| POST | `/auth/login` | Email login | No |
| POST | `/auth/register` | Register | No |
| POST | `/auth/forgot-password` | Reset password | No |
| POST | `/auth/verify-otp` | Verify OTP | No |
| POST | `/auth/refresh` | Refresh token | No |
| GET | `/auth/me` | Current user | Yes |
| PATCH | `/auth/profile` | Update profile | Yes |
| GET | `/shortlist` | Get shortlist | Yes |
| POST | `/shortlist` | Add to shortlist | Yes |
| DELETE | `/shortlist/{id}` | Remove from shortlist | Yes |
| POST | `/enquiries` | Submit enquiry | Yes |
| GET | `/enquiries` | List user enquiries | Yes |
| POST | `/reviews` | Submit review | Yes |

### 8.3 Error Handling

| Status Code | Handling |
|-------------|----------|
| 400 | Show validation error message |
| 401 | Attempt token refresh; if fails → login prompt |
| 403 | Show "Access denied" |
| 404 | Show "Not found" empty state |
| 429 | Show "Too many requests, try later" |
| 500 | Show generic error + retry button |
| Network Error | Show offline state + cached data |

---

## 9. Performance Requirements

| Metric | Target |
|--------|--------|
| Time to Interactive | < 2 seconds (on 4G) |
| First Contentful Paint | < 1 second |
| Image loading | Progressive with blur placeholder |
| List rendering | Virtualized (FlatList) |
| Search debounce | 300ms |
| API timeout | 10 seconds |
| Bundle size | < 5MB (initial) |
| Memory usage | < 150MB |

### 9.1 Optimization Strategies

- **Lazy Loading:** Screens loaded on demand via Expo Router
- **Image Optimization:** WebP format, CDN-cached, progressive loading
- **List Virtualization:** FlatList for all lists > 20 items
- **Memoization:** React.memo for card components, useMemo for calculations
- **Debouncing:** Search input debounced at 300ms
- **Skeleton Loading:** Shown during all API fetches
- **Prefetching:** Prefetch next page when user is 80% through current page

---

## 10. Accessibility

### 10.1 Requirements

| Feature | Implementation |
|---------|---------------|
| Screen Reader | All interactive elements have accessible labels |
| Focus Management | Logical tab order, focus trapped in modals |
| Color Contrast | WCAG 2.1 AA (4.5:1 for text, 3:1 for large text) |
| Touch Targets | Minimum 44x44pt |
| Reduced Motion | Respect `prefers-reduced-motion` setting |
| Dynamic Type | Support system font scaling |
| Dark Mode | Full support with proper contrast ratios |

### 10.2 Accessibility Labels

```typescript
// Example accessibility props
<AcademyCard
  accessible={true}
  accessibilityLabel={`Academy: ${name}, ${city}, rated ${rating} stars`}
  accessibilityHint="Double tap to view academy details"
  accessibilityRole="button"
/>

<SaveButton
  accessibilityLabel={isSaved ? "Remove from shortlist" : "Add to shortlist"}
  accessibilityRole="toggle"
/>
```

---

## 11. Platform Requirements

### 11.1 Android

| Requirement | Value |
|-------------|-------|
| Min SDK | 23 (Android 6.0) |
| Target SDK | 34 (Android 14) |
| Permissions | Location (optional), Camera (optional), Storage |
| Stores | Google Play Store |

### 11.2 iOS

| Requirement | Value |
|-------------|-------|
| Min iOS | 15.0 |
| Target iOS | 17.0 |
| Permissions | Location (optional), Camera (optional), Photo Library |
| Stores | Apple App Store |

### 11.3 Shared

| Feature | Support |
|---------|---------|
| Dark Mode | ✅ System + Manual toggle |
| Landscape | ❌ Portrait only |
| Tablets | ✅ Responsive layout |
| Notch / Dynamic Island | ✅ Safe area insets |
| Pull-to-refresh | ✅ On all list screens |
| Haptic Feedback | ✅ On save, compare, submit actions |

---

## 12. Future Features Backlog

> Simple and necessary features to be added in later phases.

### Phase 2 — Authentication Improvements

| Feature | Description | Effort |
|---------|-------------|--------|
| Phone OTP Login | Login with phone number + SMS OTP | S |
| SMS OTP Verification | Verify phone via SMS instead of email | S |
| Profile Editing | Edit name, email, phone, password | M |
| Profile Photo | Upload/change profile picture | S |

### Phase 3 — User Dashboard

| Feature | Description | Effort |
|---------|-------------|--------|
| Saved Academies | Dedicated screen for saved academies | S |
| Recently Viewed | List of last 10 viewed items | S |
| Search History | Clear individual search entries | S |
| Session Management | View active devices, logout all | M |

### Phase 4 — Social & Sharing

| Feature | Description | Effort |
|---------|-------------|--------|
| WhatsApp Share | Share academy via WhatsApp | S |
| Copy Link | Copy academy deep link | S |
| Native Share | Use OS share sheet | S |
| Social Links | Show Instagram, Facebook, Website on academy detail | S |
| Google Maps Link | Open academy in Google Maps app | S |

### Phase 5 — Enhanced Discovery

| Feature | Description | Effort |
|---------|-------------|--------|
| Nearby Academies | Show academies near user location | M |
| Location-Based Search | Auto-detect city, filter by distance | M |
| Additional Filters | Gender, Age Groups, Certifications, Facilities | M |
| Sort Options | By distance, rating, reviews, newest | S |

### Phase 6 — Review Improvements

| Feature | Description | Effort |
|---------|-------------|--------|
| Review Images | Upload photos with review | M |
| Helpful Count | "Was this review helpful?" button | S |
| Review Sorting | By newest, highest, lowest, most helpful | S |

### Phase 7 — Polish

| Feature | Description | Effort |
|---------|-------------|--------|
| Better Notifications | Push notifications for enquiries, saved academies | M |
| Better Loading States | Skeleton improvements, shimmer effects | S |
| Better Error States | Illustrated error pages with retry | S |
| App Store Screenshots | Generate screenshots for stores | S |

---

## Appendix A: Facility Icons Mapping

| Facility | Icon | Label |
|----------|------|-------|
| indoor | `warehouse` | Indoor |
| outdoor | `sun` | Outdoor |
| ground | `mountain` | Ground |
| court | `layout-grid` | Court |
| equipment | `dumbbell` | Equipment |
| changing_room | `shirt` | Changing Room |
| parking | `car` | Parking |
| physio | `heart-pulse` | Physio |
| gym | `fitness-center` | Gym |

## Appendix B: Color Tokens

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| background | `#FFFFFF` | `#0A0A0A` |
| surface | `#F5F5F5` | `#1A1A1A` |
| primary | `#2563EB` | `#3B82F6` |
| secondary | `#10B981` | `#34D399` |
| accent | `#F59E0B` | `#FBBF24` |
| text | `#111827` | `#F9FAFB` |
| textSecondary | `#6B7280` | `#9CA3AF` |
| border | `#E5E7EB` | `#374151` |
| error | `#EF4444` | `#F87171` |
| success | `#10B981` | `#34D399` |

## Appendix C: Typography Scale

| Name | Size | Weight | Use |
|------|------|--------|-----|
| H1 | 28px | Bold | Screen titles |
| H2 | 22px | Semibold | Section headers |
| H3 | 18px | Semibold | Card titles |
| Body | 16px | Regular | Body text |
| Caption | 14px | Regular | Secondary text |
| Small | 12px | Regular | Labels, badges |
| Micro | 10px | Medium | Tab labels |

---

**Document End**

*Generated for SportsOS Mobile App v1.0*
