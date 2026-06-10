'use client'

import { useMemo, useEffect } from 'react'
import { useOnboarding } from '@/lib/hooks/use-onboarding'
import { useRecentlyViewed } from '@/lib/hooks/use-recently-viewed'
import { useAcademySelection } from '@/lib/hooks/use-academy-selection'
import { getSuggestedAcademies, getSuggestedCoaches, logMatchingAudit } from '@/lib/utils/matching'
import { academies } from '@/data/academies'
import { coaches } from '@/data/coaches'
import { MatchingExplanation } from './matching-explanation'
import { SuggestedAcademies } from './suggested-academies'
import { SuggestedCoaches } from './suggested-coaches'
import { RecentlyViewed } from './recently-viewed'
import { ContinueExploring } from './continue-exploring'
import { YourAcademy } from './your-academy'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'

const USER_LAT = 12.9716
const USER_LNG = 77.5946

export function PersonalizedHome() {
  const { data: onboarding, completed, hydrated } = useOnboarding()
  const { recentAcademies, recentCoaches } = useRecentlyViewed()
  const { selectedAcademyId } = useAcademySelection()

  const suggestions = useMemo(
    () => {
      if (!onboarding || !completed) {
        return { academies: { primary: [], fallback: [], hasExactMatch: false }, coaches: { primary: [], fallback: [], hasExactMatch: false } }
      }
      return {
        academies: getSuggestedAcademies(academies, onboarding, USER_LAT, USER_LNG, 6),
        coaches: getSuggestedCoaches(coaches, onboarding, USER_LAT, USER_LNG, 4),
      }
    },
    [onboarding, completed]
  )

  const { academies: suggestedAcademies, coaches: suggestedCoaches } = suggestions

  const academyCoaches = useMemo(
    () => selectedAcademyId ? coaches.filter((c) => c.academyId === selectedAcademyId) : [],
    [selectedAcademyId]
  )

  // Debug audit: log matching source and results
  useEffect(() => {
    if (completed && onboarding) {
      logMatchingAudit(onboarding, academies, coaches)
    }
  }, [completed, onboarding])

  if (!hydrated || !completed || !onboarding) return null

  const lastAcademy = recentAcademies[0]
  const lastCoach = recentCoaches[0]
  const showContinueExploring = lastAcademy || lastCoach
  const showRecentlyViewed = recentAcademies.length > 0 || recentCoaches.length > 0

  const hasContent =
    suggestedAcademies.primary.length > 0 ||
    suggestedAcademies.fallback.length > 0 ||
    academyCoaches.length > 0 ||
    suggestedCoaches.primary.length > 0 ||
    suggestedCoaches.fallback.length > 0 ||
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
              title="Popular in Your Area"
              viewAllHref="/academies"
            />
          </Container>
        </Section>
      )}

      {academyCoaches.length > 0 && (
        <Section>
          <Container size="lg">
            <SuggestedCoaches
              coaches={academyCoaches}
              title="Coaches at Your Academy"
            />
          </Container>
        </Section>
      )}

      {!selectedAcademyId && suggestedCoaches.primary.length > 0 && (
        <Section>
          <Container size="lg">
            <SuggestedCoaches
              coaches={suggestedCoaches.primary}
              title="Coaches For You"
              viewAllHref="/coaches"
            />
          </Container>
        </Section>
      )}

      {!selectedAcademyId && !suggestedCoaches.hasExactMatch && suggestedCoaches.fallback.length > 0 && (
        <Section>
          <Container size="lg">
            <SuggestedCoaches
              coaches={suggestedCoaches.fallback}
              title="Coaches in Your Area"
              viewAllHref="/coaches"
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
