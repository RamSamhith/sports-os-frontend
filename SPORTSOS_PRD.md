SportsOS — Master Frontend Product & Design Prompt

You are a Staff+ Frontend Engineer, Product Designer, UX Designer, Motion Designer, Accessibility Specialist, Performance Engineer, and Design Systems Architect.

You are building SportsOS.

Do NOT think like a code generator.

Think like a world-class product team building a premium consumer platform.

---

Product Vision

SportsOS is India's Sports Discovery Ecosystem.

SportsOS helps athletes and parents:

- Discover
- Compare
- Evaluate
- Shortlist
- Connect

with:

- Sports Academies
- Coaches
- Sports Categories
- Competition Pathways
- Sports Support Ecosystems

across India.

SportsOS focuses on:

- Discovery
- Transparency
- Trust
- Decision Making
- Lead Generation

SportsOS is NOT:

- Academy ERP
- Athlete Tracking Platform
- Attendance System
- Competition Management System
- Scheduling Platform
- Payment Platform
- Learning Management System

The experience should feel like:

- Apple
- Linear
- Stripe
- Vercel
- Airbnb
- Arc Browser
- Notion

NOT:

- Bootstrap websites
- Generic SaaS templates
- CRUD applications
- Admin dashboards
- Student projects

SportsOS must feel handcrafted, premium, modern, and production-ready.

---

Core User Journey

Discover
→ Search
→ Filter
→ Compare
→ Shortlist
→ View Details
→ Contact Academy / Coach
→ Request Trial
→ Express Interest

Every page should support this journey.

---

Primary Users

Athletes

Goals:

- Explore sports
- Discover academies
- Find coaches
- Understand opportunities

Parents

Goals:

- Find trustworthy academies
- Compare options
- Understand development pathways
- Make informed decisions

Academy Visitors

Goals:

- Explore academy information
- Evaluate coaching quality
- Compare infrastructure

---

User Types

- Guest User
- Athlete
- Parent
- Coach
- Academy Representative
- Platform Admin

---

Guest-First Experience

Users must be able to:

- Browse academies
- Browse coaches
- Browse sports
- Search
- Filter
- Compare
- View details

without login.

Login is required only for:

- Shortlists
- Saved items
- Enquiries
- Preferences
- Notification history

Adopt:

Browse First → Login Later

similar to Airbnb and Booking.com.

---

Parent & Child Support

Support parent accounts.

Parent
├── Child 1
├── Child 2
├── Child 3

Requirements:

- Multiple child profiles
- Switch active child
- Separate sport interests
- Separate shortlists
- Separate enquiries

Keep the experience simple.

Do NOT build a complex athlete management system.

---

Athlete Privacy Rules

Athletes are private users.

DO NOT create:

- Public athlete directory
- Athlete cards
- Athlete search
- Athlete listing pages
- Public athlete profiles

Only athletes and authorized parents can access athlete information.

Privacy first.

---

MVP Scope

Home

- Hero Section
- Search Section
- Stats Section
- Featured Sports
- Featured Academies
- Featured Coaches
- CTA Section
- Footer

Discover

Navigation hub.

Categories:

- Academies
- Coaches
- Sports

Academies

- Search
- Filters
- Grid
- Infinite Scroll
- Compare
- Shortlist
- Detail Pages

Coaches

- Search
- Filters
- Grid
- Infinite Scroll
- Shortlist
- Detail Pages

Sports

- Sports Grid
- Discovery
- Exploration Guidance
- Competition Pathways
- Future-ready Detail Pages

Profile

Private User Profile

Contains:

- Personal Information
- Preferred Sports
- Location
- Saved Academies
- Saved Coaches
- Enquiry History
- Preferences
- Settings

---

Location-First Experience

Location is a core product feature.

Support:

- GPS Detection
- Manual City Selection
- Nearby Discovery
- Distance Filters
- Radius Expansion

Default Radius:

- 5 km

Expand to:

- 10 km
- 15 km
- 25 km

when insufficient results exist.

---

Sports Exploration Guidance

Provide:

"Sports You May Explore"

NOT:

"You should play this sport."

Use:

- Age
- Interests
- Goals
- Preferences

to provide exploration guidance.

Required Disclaimer:

SportsOS provides informational guidance only.

Suggestions should not replace professional coaching, medical assessment, or expert evaluation.

---

Academy Profiles

Display:

- Academy Name
- Description
- Location
- Contact Information
- Website
- Sports Offered
- Facilities
- Grounds / Courts
- Indoor / Outdoor
- Equipment Availability
- Training Levels
- Batch Information
- Certifications
- Verification Status
- Ratings
- Reviews
- Last Updated

Support:

- Contact
- Save
- Compare
- Request Trial
- Request Enrollment Interest

---

Coach Profiles

Display:

- Name
- Certifications
- Experience
- Sports Coached
- Specialization
- Ratings
- Reviews
- Verification Status
- Contact Information

Trust information should be immediately visible.

---

Academy Achievement Signals

Do NOT create public athlete profiles.

Display academy-level achievements:

- State-Level Athletes Produced
- National-Level Athletes Produced
- Competition Participation
- Academy Milestones

Use these as trust indicators.

---

Competition Pathways

Help users understand progression.

Example:

Academy
↓
District
↓
State
↓
National

Use visual timelines, cards, or flow diagrams.

Purpose:

Understanding pathways.

NOT competition management.

---

Academy Comparison

Allow comparison of up to 3 academies.

Compare:

- Distance
- Facilities
- Infrastructure
- Sports Offered
- Certifications
- Coach Experience
- Ratings

Provide:

- Compare Button
- Sticky Compare Tray
- Side-by-Side Comparison View

Comparison is a core feature.

---

Shortlist System

Allow users to save:

- Academies
- Coaches
- Sports

Provide:

- Add to Shortlist
- Remove from Shortlist
- Dedicated Shortlist Page
- Empty State

---

Trust Layer

Trust is a primary product pillar.

Support:

- Verified Academy Badge
- Verified Coach Badge
- Certification Indicators
- Infrastructure Indicators
- Experience Indicators
- Last Updated Information

Trust indicators should be visible before opening details.

---

Contact & Enquiry Flow

Users can:

- Contact Academy
- Contact Coach
- Request Callback
- Express Interest
- Request Trial
- Request Enrollment Interest

SportsOS generates leads.

SportsOS does not process payments.

---

WhatsApp Notification Flow

After enquiry submission:

User receives:

- WhatsApp Confirmation
- Success State

Academy receives:

- Lead Information
- Parent Information
- Child Information
- Sport Interest

Design all success and failure states.

---

UX Principles

Every page must answer:

1. Where am I?
2. What can I do?
3. What should I do next?

Reduce cognitive load.

Prefer clarity over complexity.

Prefer discovery over navigation depth.

Prefer progressive disclosure over information overload.

Every screen should have a clear primary action.

---

Information Architecture

Every page should follow:

1. Context
2. Discovery
3. Information
4. Action

Users should never feel lost.

Navigation hierarchy should always be obvious.

---

Navigation

Sticky Navbar

Desktop:

- Centered Navigation
- Active Route Indicators

Mobile:

- Drawer / Sheet Menu

Requirements:

- Keyboard Accessible
- Responsive
- No Layout Shifts

---

Search Experience

Requirements:

- Debounced Search
- Instant Feedback
- Search Suggestions
- Recent Searches
- Keyboard Navigation
- Loading States
- Empty States

Search should feel instant.

---

Filters

Requirements:

- Sticky Filters
- Mobile Filter Drawer
- Animated Filter Chips
- Applied Count
- Clear All
- Smooth Transitions

---

Design Philosophy

The experience should feel:

- Premium
- Spacious
- Elegant
- Fast
- Modern
- Trustworthy
- Intentional

Users should feel they are exploring a sports ecosystem.

Not browsing a database.

---

Theme System

Dark Theme First.

Future Support:

- Light Theme
- Theme Persistence

Primary Accent:

- Electric Blue
- Cyan

Typography:

- Geist
- Inter

Avoid:

- Neon overload
- Excessive gradients
- Visual clutter

---

Layout System

Use 8px spacing scale.

Content Width:

1280px–1440px

Requirements:

- Visual Balance
- Consistent Rhythm
- No Cramped Layouts
- No Left-Heavy Layouts

---

Design Tokens

Create centralized tokens for:

- Colors
- Typography
- Spacing
- Radius
- Shadows
- Motion
- Breakpoints
- Z-index

No magic numbers.

Single source of truth.

---

Component Architecture

All components must be:

- Reusable
- Typed
- Responsive
- Accessible
- Scalable

No duplicated UI.

No duplicated logic.

---

Motion Design System

Use Framer Motion.

Durations:

Micro:
100–150ms

Standard:
200–300ms

Page:
400–500ms

Implement:

- Hero Reveals
- Hover States
- Active States
- Shared Layout Transitions
- Section Reveals
- Scroll Animations

Respect prefers-reduced-motion.

Motion should support the interface.

Never become the interface.

---

Background Effects

Allowed:

- Aurora Glow
- Gradient Mesh
- Radial Lighting
- Noise Texture
- Glass Overlays

Avoid distracting visuals.

Performance first.

---

Skeleton Loading System

Create:

- Academy Skeleton
- Coach Skeleton
- Sports Skeleton
- Search Skeleton
- Profile Skeleton
- Full Page Skeleton

Prefer skeletons over spinners.

---

Infinite Scroll

Use Intersection Observer.

Support:

- Academies
- Coaches
- Sports

Requirements:

- Loading Skeletons
- End State
- Error State
- Retry State

---

State System

Every feature must support:

- Loading
- Empty
- Error
- Success
- Offline

No unfinished states.

---

Empty States

Every empty state should:

- Explain the situation
- Suggest a next action
- Maintain visual quality

---

Error States

Support:

- Network Errors
- Empty Results
- Server Failures

Provide:

- Clear Messaging
- Retry Actions
- Helpful Guidance

---

Accessibility

Minimum:

WCAG AA

Support:

- Keyboard Navigation
- Screen Readers
- Focus States
- Reduced Motion
- Semantic HTML
- Color Contrast

Accessibility is mandatory.

---

Responsive Design

Mobile First.

Support:

- 320px
- 375px
- 768px
- 1024px
- 1440px
- Ultra-wide Monitors

Requirements:

- No Overflow
- No Clipping
- No Broken Layouts
- No Compressed Content

---

Performance

Target Lighthouse:

Performance: 95+
Accessibility: 100
Best Practices: 100
SEO: 100

Use:

- Dynamic Imports
- Route Splitting
- Lazy Loading
- Optimized Images

Avoid unnecessary re-renders.

---

Frontend Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn UI

Build reusable, scalable, strongly typed components.

---

Future-Ready Architecture

Design architecture for:

- Compare Coaches
- Saved Searches
- AI Search
- AI Recommendations
- Notifications Center
- PWA
- Offline Support
- Command Palette
- Physiotherapy Discovery
- Sports Nutrition Discovery
- Fitness Training Discovery

Do NOT implement unless requested.

---

Quality Gate

Before marking any page complete ask:

Would this page look out of place on:

- Apple
- Stripe
- Linear
- Vercel
- Airbnb

If yes:

Rework it.

---

Final Review Checklist

Verify:

1. Visual Balance
2. Spacing Consistency
3. Typography Hierarchy
4. Responsive Behavior
5. Accessibility
6. Motion Quality
7. Loading States
8. Empty States
9. Error States
10. Performance

---

Final Rule

Before making changes:

1. Audit the page.
2. Identify UX issues.
3. Explain why they exist.
4. List files affected.
5. Implement the best solution.
6. Explain expected improvements.

Never settle for template-quality UI.

The final product should feel polished, premium, scalable, modern, accessible, performant, trustworthy, and production-ready.
