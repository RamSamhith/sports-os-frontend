# SportsOS — Developer Guide

## 1. Prerequisites

- **Node.js** ≥ 18.17
- **pnpm** ≥ 8.0
- **Git**

## 2. Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd SportsOS

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app runs at `http://localhost:3000` by default.

## 3. Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript type checking (`tsc --noEmit`) |
| `pnpm format` | Format code with Prettier |

## 4. Project Structure

```
SportsOS/
├── app/                    # Next.js App Router — route-based pages
│   ├── (public)/           # Guest routes (home, academies, coaches, sports)
│   ├── (auth)/             # Auth routes (login, register, onboarding)
│   ├── (private)/          # Authenticated routes (profile, settings)
│   ├── (admin)/            # Admin dashboard (role-gated)
│   ├── layout.tsx          # Root layout (providers, fonts)
│   ├── globals.css         # Global styles + theme definitions
│   └── tokens.css          # Design tokens
│
├── components/             # React components
│   ├── ui/                 # Reusable primitives (Button, Card, Input, etc.)
│   ├── layout/             # Container, Section, Navbar, Footer
│   ├── home/               # Homepage sections
│   ├── academies/          # Academy cards, grids
│   ├── coaches/            # Coach cards, grids
│   ├── academy/            # Academy detail sections
│   ├── sports/             # Sport cards
│   ├── compare/            # Comparison view
│   ├── search/             # Search components
│   ├── filters/            # Filter system
│   ├── profile/            # Profile management
│   ├── enquiry/            # Enquiry forms
│   ├── feedback/           # Error boundaries, skeletons, empty states
│   └── providers/          # Context providers
│
├── lib/
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions (cn, matching, validators)
│   ├── constants/          # Sport taxonomy, radius options, filters
│   ├── design-system/      # Design token utilities
│   ├── analytics/          # Analytics client
│   ├── api/                # API client scaffold
│   ├── cache/              # Cache definitions
│   ├── monitoring/         # Web vitals, error reporting
│   ├── security/           # CSRF, sanitisation
│   └── seo/                # JSON-LD, metadata builders
│
├── types/                  # TypeScript type definitions
│   └── domain/             # Domain models (academy, coach, sport, etc.)
│
├── data/                   # Static mock data
│   ├── academies.ts        # 12 academies (Bengaluru)
│   ├── coaches.ts          # 8 coaches (Bengaluru)
│   └── sports.ts           # 20 sports
│
├── config/                 # Configuration files
│   ├── site.ts             # Site metadata
│   ├── nav.ts              # Navigation structure
│   ├── theme.ts            # Theme definitions
│   └── env.ts              # Environment variables
│
├── public/                 # Static assets (icons, images)
└── scripts/                # Build/utility scripts
```

## 5. Key Patterns

### 5.1 Component Pattern

Every component follows this structure:

```tsx
'use client'

import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'

interface MyComponentProps {
  className?: string
  // ... other props
}

export function MyComponent({ className, ...props }: MyComponentProps) {
  return (
    <div className={cn('base-classes', className)} {...props}>
      {/* content */}
    </div>
  )
}
```

### 5.2 Card Pattern

All entity cards (academies, coaches) follow a consistent pattern:

```tsx
<Link href={`/academies/${academy.slug}`} className="group block">
  <Card className="transition-all hover:shadow-md group-hover:border-primary/50">
    <CardHeader className="pb-2">
      {/* Title + badges */}
    </CardHeader>
    <CardContent className="space-y-2">
      {/* Location, rating, sports */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-primary text-xs font-medium">View Details</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </CardContent>
  </Card>
</Link>
```

### 5.3 Hook Pattern

Custom hooks use React Context for shared state:

```tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useStorageSync } from './use-storage-sync'

interface MyContextValue {
  data: DataType | null
  update: (newData: DataType) => void
}

const MyContext = createContext<MyContextValue | null>(null)

export function MyProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useStorageSync('sportsos:my-key', null)

  return (
    <MyContext.Provider value={{ data, update: setData }}>
      {children}
    </MyContext.Provider>
  )
}

export function useMyHook() {
  const ctx = useContext(MyContext)
  if (!ctx) throw new Error('useMyHook must be used within MyProvider')
  return ctx
}
```

### 5.4 Storage Pattern

All localStorage keys use the `sportsos:` prefix:

```tsx
// Reading
const data = JSON.parse(localStorage.getItem('sportsos:my-key') || 'null')

// Writing
localStorage.setItem('sportsos:my-key', JSON.stringify(data))

// Or use the useStorageSync hook for reactive state
const [data, setData] = useStorageSync('sportsos:my-key', defaultValue)
```

### 5.5 Page Pattern

Pages are server components that render client components:

```tsx
// app/(public)/academies/page.tsx
import { AcademyGrid } from '@/components/academies/academy-grid'

export const metadata = {
  title: 'Sports Academies',
  description: 'Find sports academies near you',
}

export default function AcademiesPage() {
  return (
    <main>
      <AcademyGrid />
    </main>
  )
}
```

## 6. Styling

### 6.1 Tailwind CSS

- Use Tailwind utility classes directly
- Custom utilities via `cn()` from `@/lib/utils/cn`
- Theme tokens via CSS custom properties (`bg-background`, `text-foreground`, etc.)

### 6.2 Theme Tokens

| Token | Usage |
|-------|-------|
| `bg-background` | Page background |
| `bg-card` | Card backgrounds |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text |
| `bg-primary` | Primary buttons, accents |
| `border-border` | Borders |

### 6.3 Component Variants

Use `class-variance-authority` (cva) for component variants:

```tsx
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)
```

## 7. Common Tasks

### 7.1 Adding a New Page

1. Create `app/(public)/my-page/page.tsx`
2. Add metadata export
3. Create client components in `components/`
4. Add navigation entry in `config/nav.ts`

### 7.2 Adding a New Hook

1. Create `lib/hooks/use-my-hook.ts`
2. Add to barrel export in `lib/hooks/index.ts`
3. Use `useStorageSync` for localStorage-backed state
4. Prefix storage key with `sportsos:`

### 7.3 Adding a New Component

1. Determine category (ui, home, academies, etc.)
2. Create file in appropriate `components/` subdirectory
3. Use `'use client'` directive
4. Accept `className` prop for composition
5. Use `cn()` for class merging

### 7.4 Adding a New Storage Key

1. Add to `lib/constants/` if needed
2. Always prefix with `sportsos:`
3. Use `useStorageSync` for reactive state
4. Handle SSR (check `typeof window`)

### 7.5 Modifying the Matching Algorithm

Edit `lib/utils/matching.ts`:
- Adjust weights: `SPORT_WEIGHT`, `LOCATION_WEIGHT`, `SKILL_WEIGHT`
- Modify `proximityBonus()` thresholds
- Update `computeAcademyScore()` or `computeCoachScore()`

## 8. Validation

Before committing, run:

```bash
pnpm typecheck    # Must pass with 0 errors
pnpm lint         # Must pass with 0 errors
pnpm build        # Must complete successfully
```

## 9. Git Workflow

- Branch naming: `phase-*`, `feature/*`, `fix/*`
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, etc.)
- Husky pre-commit hook runs linting
- Never commit secrets, API keys, or credentials

## 10. Troubleshooting

### Theme Flash

The pre-hydration bootstrap script in `globals.css` prevents theme flash. If you see flash:
1. Check the bootstrap script is present in `globals.css`
2. Verify theme class is set on `<html>` element

### localStorage Errors

- Always check `typeof window` before accessing localStorage
- Use the `useStorageSync` hook for reactive state
- Handle JSON parse errors gracefully

### Build Failures

1. Run `pnpm typecheck` to identify type errors
2. Run `pnpm lint` to identify linting issues
3. Check for missing imports or circular dependencies
