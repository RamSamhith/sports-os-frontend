'use client'

import { useMemo, useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { useOnboarding } from '@/lib/hooks/use-onboarding'
import { useChildren } from '@/lib/hooks/use-children'
import { useRecentlyViewed } from '@/lib/hooks/use-recently-viewed'
import { getSuggestedAcademies, logMatchingAudit } from '@/lib/utils/matching'
import { getAcademies } from '@/lib/api/academies'
import { getCoaches } from '@/lib/api/coaches'
import type { OnboardingData, SkillLevel } from '@/lib/hooks/use-onboarding'
import { MatchingExplanation } from './matching-explanation'
import { SuggestedAcademies } from './suggested-academies'
import { RecentlyViewed } from './recently-viewed'
import { ContinueExploring } from './continue-exploring'
import { YourAcademy } from './your-academy'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'

export function PersonalizedHome() {
  const { role } = useAuth()
  const { data: onboarding, completed, hydrated } = useOnboarding()
  const { activeChild } = useChildren()
  const { recentAcademies, recentCoaches } = useRecentlyViewed()
  const [apiAcademies, setApiAcademies] = useState<any[]>([])
  const [apiCoaches, setApiCoaches] = useState<any[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [academiesRes, coachesRes] = await Promise.all([
        getAcademies({ pageSize: 200 }),
        getCoaches({ pageSize: 200 }),
      ])
      if (cancelled) return
      if (academiesRes.ok) setApiAcademies(academiesRes.data.items)
      if (coachesRes.ok) setApiCoaches(coachesRes.data.items)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const USER_LAT = 12.9716
  const USER_LNG = 77.5946

  const effectiveOnboarding = useMemo<OnboardingData | null>(() => {
    if (!onboarding || !completed) return null
    if (role !== 'parent' || !activeChild || !onboarding.parent) return onboarding
    return {
      parent: {
        ...onboarding.parent,
        childName: activeChild.name,
        childAge: activeChild.age,
        sportInterests: [activeChild.sport],
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
        academies: getSuggestedAcademies(apiAcademies, effectiveOnboarding, USER_LAT, USER_LNG, 6),
      }
    },
    [effectiveOnboarding, apiAcademies]
  )

  const { academies: suggestedAcademies } = suggestions

  const lastAcademy = recentAcademies[0]
  const lastCoach = recentCoaches[0]
  const showContinueExploring = lastAcademy || lastCoach
  const showRecentlyViewed = recentAcademies.length > 0 || recentCoaches.length > 0

  useEffect(() => {
    if (completed && effectiveOnboarding && apiAcademies.length > 0) {
      logMatchingAudit(effectiveOnboarding, apiAcademies, apiCoaches)
    }
  }, [completed, effectiveOnboarding, role, activeChild, apiAcademies, apiCoaches])

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
            <ContinueExploring lastAcademy={lastAcademy} lastCoach={lastCoach} />
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
