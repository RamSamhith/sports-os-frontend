'use client'

import { useMemo, useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { useOnboarding } from '@/lib/hooks/use-onboarding'
import { useChildren } from '@/lib/hooks/use-children'
import { useRecentlyViewed } from '@/lib/hooks/use-recently-viewed'
import { getSuggestedAcademies, logMatchingAudit } from '@/lib/utils/matching'
import { getAcademies } from '@/lib/api/academies'
import type { OnboardingData, SkillLevel } from '@/lib/hooks/use-onboarding'
import type { Academy } from '@/types/domain/academy'
import { MatchingExplanation } from './matching-explanation'
import { SuggestedAcademies } from './suggested-academies'
import { RecentlyViewed } from './recently-viewed'
import { ContinueExploring } from './continue-exploring'
import { YourAcademy } from './your-academy'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'

const DEFAULT_LAT = 28.6139
const DEFAULT_LNG = 77.209

export function PersonalizedHome() {
  const { role } = useAuth()
  const { data: onboarding, completed, hydrated } = useOnboarding()
  const { activeChild } = useChildren()
  const { recentAcademies, recentCoaches } = useRecentlyViewed()
  const [apiAcademies, setApiAcademies] = useState<Academy[]>([])
  const [apiError, setApiError] = useState<string | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: DEFAULT_LAT, lng: DEFAULT_LNG })

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 5000 },
      )
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const academiesRes = await getAcademies({ pageSize: 200 })
        if (cancelled) return
        if (academiesRes.ok) setApiAcademies(academiesRes.data.items)
      } catch (err) {
        if (!cancelled) setApiError(err instanceof Error ? err.message : 'Failed to load')
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const effectiveOnboarding = useMemo<OnboardingData | null>(() => {
    if (!onboarding || !completed) return null
    if (role !== 'parent' || !activeChild || !onboarding.parent) return onboarding
    return {
      parent: {
        ...onboarding.parent,
        childName: activeChild.name,
        childAge: activeChild.age,
        sportInterests: activeChild.sportInterests,
        skillLevel: (activeChild.skillLevel as SkillLevel) ?? onboarding.parent.skillLevel,
      },
    }
  }, [onboarding, completed, role, activeChild])

  const suggestions = useMemo(
    () => {
      if (!effectiveOnboarding) {
        return { academies: { primary: [], fallback: [], hasExactMatch: false } }
      }
      return {
        academies: getSuggestedAcademies(apiAcademies, effectiveOnboarding, coords.lat, coords.lng, 6),
      }
    },
    [effectiveOnboarding, apiAcademies, coords]
  )

  const { academies: suggestedAcademies } = suggestions

  const lastAcademy = recentAcademies[0]
  const showContinueExploring = !!lastAcademy
  const showRecentlyViewed = recentAcademies.length > 0

  useEffect(() => {
    if (completed && effectiveOnboarding && apiAcademies.length > 0) {
      logMatchingAudit(effectiveOnboarding, apiAcademies, [])
    }
  }, [completed, effectiveOnboarding, role, activeChild, apiAcademies])

  if (!hydrated || !completed || !effectiveOnboarding) return null

  const hasContent =
    suggestedAcademies.primary.length > 0 ||
    suggestedAcademies.fallback.length > 0 ||
    showContinueExploring ||
    showRecentlyViewed

  if (!hasContent) return null

  return (
    <div className="space-y-0">
      <Section>
        <Container size="lg">
          <YourAcademy />
        </Container>
      </Section>

      {suggestedAcademies.hasExactMatch && (
        <Section>
          <Container size="lg">
            <MatchingExplanation />
          </Container>
        </Section>
      )}

      {suggestedAcademies.primary.length > 0 && (
        <Section>
          <Container size="lg">
            <SuggestedAcademies
              academies={suggestedAcademies.primary}
              title="Recommended For You"
              viewAllHref="/academies"
            />
          </Container>
        </Section>
      )}

      {!suggestedAcademies.hasExactMatch && suggestedAcademies.fallback.length > 0 && (
        <Section>
          <Container size="lg">
            <SuggestedAcademies
              academies={suggestedAcademies.fallback}
              title="Explore More Academies"
              viewAllHref="/academies"
            />
          </Container>
        </Section>
      )}

      {showContinueExploring && (
        <Section>
          <Container size="lg">
            <ContinueExploring lastAcademy={lastAcademy} lastCoach={recentCoaches[0]} />
          </Container>
        </Section>
      )}

      {showRecentlyViewed && (
        <Section>
          <Container size="lg">
            <RecentlyViewed academies={recentAcademies} coaches={recentCoaches} />
          </Container>
        </Section>
      )}
    </div>
  )
}
