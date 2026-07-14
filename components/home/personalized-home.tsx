'use client'

import { useMemo, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/use-auth'
import { useOnboarding } from '@/lib/hooks/use-onboarding'
import { useChildren } from '@/lib/hooks/use-children'
import { getSuggestedAcademies } from '@/lib/utils/matching'
import { useHomepageData } from '@/lib/hooks/use-homepage-data'
import { Container } from '@/components/layout/container'
import { School, AlertTriangle } from 'lucide-react'
import { AcademyCardSkeleton } from '@/components/feedback/skeletons'
import { AcademyCardPlaceholder } from '@/components/academies/academy-card-placeholder'
import type { OnboardingData, SkillLevel } from '@/lib/hooks/use-onboarding'

const DEFAULT_LAT = 28.6139
const DEFAULT_LNG = 77.209

export function PersonalizedHome() {
  const { role } = useAuth()
  const { data: onboarding, completed, hydrated } = useOnboarding()
  const { activeChild } = useChildren()
  const { academies: apiAcademies, loading, error } = useHomepageData()
  const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG })

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 5000 },
      )
    }
  }, [])

  const effectiveOnboarding = useMemo<OnboardingData | null>(() => {
    if (!onboarding || !completed) return null
    if (role !== 'parent') return onboarding
    if (!onboarding.parent) return onboarding
    if (activeChild) {
      return {
        parent: {
          ...onboarding.parent,
          childName: activeChild.name,
          childAge: activeChild.age,
          sportInterests: activeChild.sportInterests,
          skillLevel: (activeChild.skillLevel as SkillLevel) ?? onboarding.parent.skillLevel,
        },
      }
    }
    return {
      parent: {
        ...onboarding.parent,
        childName: onboarding.parent.childName,
        childAge: onboarding.parent.childAge,
        sportInterests: onboarding.parent.sportInterests,
        skillLevel: onboarding.parent.skillLevel,
      },
    }
  }, [onboarding, completed, role, activeChild])

  const isPersonalized = hydrated && completed && effectiveOnboarding

  const matchingReasons = useMemo(() => {
    if (!isPersonalized || !effectiveOnboarding) return []
    const reasons: Array<{ label: string; variant: 'sport' | 'level' | 'location' }> = []
    const p = effectiveOnboarding.parent
    if (p?.sportInterests?.length) {
      p.sportInterests.forEach((s: string) => reasons.push({ label: s.replace(/-/g, ' '), variant: 'sport' }))
    }
    if (p?.skillLevel) reasons.push({ label: p.skillLevel, variant: 'level' })
    if (p?.location) reasons.push({ label: p.location, variant: 'location' })
    return reasons.slice(0, 4)
  }, [isPersonalized, effectiveOnboarding])

  const academies = useMemo(() => {
    if (!apiAcademies.length) return []

    if (isPersonalized) {
      const result = getSuggestedAcademies(apiAcademies, effectiveOnboarding!, coords.lat, coords.lng, 6)
      return result.primary.length > 0 ? result.primary.slice(0, 6) : result.fallback.slice(0, 6)
    }

    return [...apiAcademies]
      .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
      .slice(0, 6)
  }, [apiAcademies, isPersonalized, effectiveOnboarding, coords])

  const title = isPersonalized ? 'Recommended For You' : 'Top Rated Academies'
  const subtitle = isPersonalized
    ? 'Personalised picks based on your interests.'
    : 'Top-rated, verified academies across India.'

  if (loading) {
    return (
      <Container size="lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <AcademyCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    )
  }

  return (
    <Container size="lg">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
        <Link href="/academies" className="text-muted-foreground hover:text-foreground text-sm min-h-[44px] flex items-center shrink-0">
          View all &rarr;
        </Link>
      </div>

      {/* Matching explanation */}
      {isPersonalized && matchingReasons.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-sm">Based on your profile</span>
          {matchingReasons.map((reason) => (
            <span
              key={reason.label}
              className="border-border/60 bg-card/40 rounded-md border px-2 py-0.5 text-xs font-medium capitalize"
            >
              {reason.label}
            </span>
          ))}
        </div>
      )}

      {error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive/40" />
          <div>
            <p className="text-foreground font-medium">Failed to load academies</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : academies.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
          <School className="h-10 w-10 opacity-40" />
          <p className="text-foreground font-medium">No academies yet</p>
          <p className="text-sm">Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {academies.map((academy, i) => (
            <AcademyCardPlaceholder key={academy.id} academy={academy} priority={i === 0} />
          ))}
        </div>
      )}
    </Container>
  )
}
