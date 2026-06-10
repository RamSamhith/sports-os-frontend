'use client'

import { useOnboarding } from '@/lib/hooks/use-onboarding'
import { useRecentlyViewed } from '@/lib/hooks/use-recently-viewed'
import { getSuggestedAcademies, getSuggestedCoaches } from '@/lib/utils/matching'
import { academies } from '@/data/academies'
import { coaches } from '@/data/coaches'
import { MatchingExplanation } from './matching-explanation'
import { SuggestedAcademies } from './suggested-academies'
import { SuggestedCoaches } from './suggested-coaches'
import { RecentlyViewed } from './recently-viewed'
import { ContinueExploring } from './continue-exploring'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'

const USER_LAT = 12.9716
const USER_LNG = 77.5946

export function PersonalizedHome() {
  const { data: onboarding, completed } = useOnboarding()
  const { recentAcademies, recentCoaches } = useRecentlyViewed()

  if (!completed || !onboarding) return null

  const suggestedAcademies = getSuggestedAcademies(academies, onboarding, USER_LAT, USER_LNG, 6)
  const suggestedCoaches = getSuggestedCoaches(coaches, onboarding, USER_LAT, USER_LNG, 6)

  const lastAcademy = recentAcademies[0]
  const lastCoach = recentCoaches[0]
  const showContinueExploring = lastAcademy || lastCoach
  const showRecentlyViewed = recentAcademies.length > 0 || recentCoaches.length > 0

  const hasContent =
    suggestedAcademies.length > 0 ||
    suggestedCoaches.length > 0 ||
    showContinueExploring ||
    showRecentlyViewed

  if (!hasContent) return null

  return (
    <div className="space-y-0">
      <Section>
        <Container size="lg">
          <MatchingExplanation />
        </Container>
      </Section>

      {showContinueExploring && (
        <Section>
          <Container size="lg">
            <ContinueExploring lastAcademy={lastAcademy} lastCoach={lastCoach} />
          </Container>
        </Section>
      )}

      {suggestedAcademies.length > 0 && (
        <Section>
          <Container size="lg">
            <SuggestedAcademies academies={suggestedAcademies} />
          </Container>
        </Section>
      )}

      {suggestedCoaches.length > 0 && (
        <Section>
          <Container size="lg">
            <SuggestedCoaches coaches={suggestedCoaches} />
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
