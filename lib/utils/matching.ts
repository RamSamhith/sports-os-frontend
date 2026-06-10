import { type Academy } from '@/types/domain/academy'
import { type Coach } from '@/types/domain/coach'
import { type OnboardingData } from '@/types/domain/onboarding'
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy'

// ── Helpers ──────────────────────────────────────────────────────────

function toLower(s: string): string {
  return s.toLowerCase().trim()
}

function slugify(s: string): string {
  return toLower(s).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function sportDisplayName(slug: string): string {
  return sportTaxonomy.find((s) => s.slug === slug)?.name ?? slug
}

function haversineDistance(
  lat1: number, lng1: number, lat2: number, lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const sinHalf =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(sinHalf), Math.sqrt(1 - sinHalf))
}

// ── Debug audit logging ──────────────────────────────────────────────

interface MatchAuditLog {
  timestamp: string
  source: 'onboarding'
  userInterests: string[]
  userLocation: string | undefined
  userSkillLevel: string | undefined
  userAge: number | undefined
  totalAcademies: number
  totalCoaches: number
  topAcademyMatches: { name: string; score: number; sportMatch: boolean; locationMatch: boolean }[]
  topCoachMatches: { name: string; score: number; sportMatch: boolean; locationMatch: boolean }[]
}

export function logMatchingAudit(
  onboarding: OnboardingData,
  academies: Academy[],
  coaches: Coach[],
): void {
  const interests = getInterests(onboarding)
  const skillLevel = getSkillLevel(onboarding)
  const userLocation = getUserLocation(onboarding)
  const userAge = getUserAge(onboarding)

  const scoredAcademies = academies
    .map((a) => ({
      name: a.name,
      ...computeAcademyScore(a, interests, skillLevel, undefined, undefined, userLocation),
      sportMatch: matchSports(a.sportsOffered || [], interests) > 0,
      locationMatch: matchLocation(a.location?.city, userLocation) > 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const scoredCoaches = coaches
    .map((c) => ({
      name: c.name,
      ...computeCoachScore(c, interests, skillLevel, undefined, undefined, userLocation),
      sportMatch: matchSports(c.sportsCoached || [], interests) > 0,
      locationMatch: matchLocation(c.location?.city, userLocation) > 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const audit: MatchAuditLog = {
    timestamp: new Date().toISOString(),
    source: 'onboarding',
    userInterests: interests,
    userLocation,
    userSkillLevel: skillLevel,
    userAge,
    totalAcademies: academies.length,
    totalCoaches: coaches.length,
    topAcademyMatches: scoredAcademies.map((a) => ({
      name: a.name,
      score: a.score,
      sportMatch: a.sportMatch,
      locationMatch: a.locationMatch,
    })),
    topCoachMatches: scoredCoaches.map((c) => ({
      name: c.name,
      score: c.score,
      sportMatch: c.sportMatch,
      locationMatch: c.locationMatch,
    })),
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[SportsOS Matching Audit]', audit)
  }
}

// ── Onboarding data extraction ───────────────────────────────────────

export function getInterests(data: OnboardingData): string[] {
  if (data.athlete?.sportInterests) return data.athlete.sportInterests
  if (data.parent?.sportInterests) return data.parent.sportInterests
  return []
}

export function getSkillLevel(data: OnboardingData): string | undefined {
  return data.athlete?.skillLevel ?? data.parent?.skillLevel
}

export function getUserAge(data: OnboardingData): number | undefined {
  return data.athlete?.age ?? data.parent?.childAge
}

export function getUserLocation(data: OnboardingData): string | undefined {
  return data.athlete?.location ?? data.parent?.location
}

export function getMatchingCriteria(data: OnboardingData): string[] {
  const criteria: string[] = []
  const interests = getInterests(data)
  if (interests.length > 0) {
    criteria.push(...interests.map(sportDisplayName))
  }
  const skill = getSkillLevel(data)
  if (skill) {
    criteria.push(skill.charAt(0).toUpperCase() + skill.slice(1))
  }
  const loc = getUserLocation(data)
  if (loc) {
    criteria.push(loc)
  }
  return criteria
}

// ── Score components ─────────────────────────────────────────────────

const SPORT_WEIGHT = 10
const LOCATION_WEIGHT = 8
const SKILL_WEIGHT = 5
const RATING_BONUS = 1

function matchSports(itemSports: string[], interests: string[]): number {
  const interestSlugs = interests.map(slugify)
  let score = 0
  for (const sport of itemSports) {
    const sportLower = toLower(sport)
    if (interestSlugs.some((s) => sportLower.includes(s) || s.includes(sportLower))) {
      score += SPORT_WEIGHT
    }
  }
  return score
}

function hasSportMatch(itemSports: string[], interests: string[]): boolean {
  return matchSports(itemSports, interests) > 0
}

function matchLocation(itemCity: string | undefined, userLocation: string | undefined): number {
  if (!itemCity || !userLocation) return 0
  const itemLower = toLower(itemCity)
  const userLower = toLower(userLocation)
  if (itemLower === userLower) return LOCATION_WEIGHT
  if (itemLower.includes(userLower) || userLower.includes(itemLower)) return LOCATION_WEIGHT - 2
  return 0
}

function hasLocationMatch(itemCity: string | undefined, userLocation: string | undefined): boolean {
  return matchLocation(itemCity, userLocation) > 0
}

function matchSkillLevel(
  itemLevels: string[] | undefined,
  userLevel: string | undefined,
): number {
  if (!itemLevels || !userLevel) return 0
  return itemLevels.some((l) => toLower(l) === toLower(userLevel)) ? SKILL_WEIGHT : 0
}

function proximityBonus(distanceKm: number | undefined): number {
  if (distanceKm == null) return 0
  if (distanceKm <= 5) return 6
  if (distanceKm <= 15) return 4
  if (distanceKm <= 30) return 2
  return 0
}

// ── Academy scoring ──────────────────────────────────────────────────

interface ScoredAcademy {
  academy: Academy
  score: number
  distance?: number
}

function computeAcademyScore(
  academy: Academy,
  interests: string[],
  skillLevel: string | undefined,
  userLat: number | undefined,
  userLng: number | undefined,
  userLocation?: string,
): ScoredAcademy {
  let score = matchSports(academy.sportsOffered || [], interests)
  score += matchLocation(academy.location?.city, userLocation)
  score += matchSkillLevel(academy.trainingLevels, skillLevel)

  let distance: number | undefined
  if (
    userLat != null && userLng != null &&
    academy.location?.lat && academy.location?.lng
  ) {
    distance = Math.round(
      haversineDistance(userLat, userLng, academy.location.lat, academy.location.lng) * 10,
    ) / 10
    score += proximityBonus(distance)
  }

  if (academy.rating) {
    score += academy.rating.average * RATING_BONUS
  }

  return { academy, score, distance }
}

// ── Coach scoring ────────────────────────────────────────────────────

interface ScoredCoach {
  coach: Coach
  score: number
  distance?: number
}

function computeCoachScore(
  coach: Coach,
  interests: string[],
  skillLevel: string | undefined,
  userLat: number | undefined,
  userLng: number | undefined,
  userLocation?: string,
): ScoredCoach {
  let score = matchSports(coach.sportsCoached || [], interests)
  score += matchLocation(coach.location?.city, userLocation)

  let distance: number | undefined
  if (
    userLat != null && userLng != null &&
    coach.location?.lat && coach.location?.lng
  ) {
    distance = Math.round(
      haversineDistance(userLat, userLng, coach.location.lat, coach.location.lng) * 10,
    ) / 10
    score += proximityBonus(distance)
  }

  if (coach.rating) {
    score += coach.rating.average * RATING_BONUS
  }

  return { coach, score, distance }
}

// ── Public API: Suggested academies ──────────────────────────────────

export interface SuggestedAcademy extends Academy {
  distance?: number
}

export function getSuggestedAcademies(
  academies: Academy[],
  onboarding: OnboardingData | null,
  userLat?: number,
  userLng?: number,
  limit = 6,
): SuggestedAcademy[] {
  if (!onboarding) return academies.slice(0, limit)

  const interests = getInterests(onboarding)
  const skillLevel = getSkillLevel(onboarding)
  const userLocation = getUserLocation(onboarding)

  if (interests.length === 0) return academies.slice(0, limit)

  // Tier 1: Sport match + Location match (best relevance)
  const sportAndLocation = academies
    .filter((a) => hasSportMatch(a.sportsOffered || [], interests) && hasLocationMatch(a.location?.city, userLocation))
    .map((a) => computeAcademyScore(a, interests, skillLevel, userLat, userLng, userLocation))
    .sort((a, b) => b.score - a.score)

  if (sportAndLocation.length >= limit) {
    return sportAndLocation.slice(0, limit).map((r) => ({ ...r.academy, distance: r.distance }))
  }

  // Tier 2: Sport match only (nearby cities fallback)
  const sportOnly = academies
    .filter((a) => hasSportMatch(a.sportsOffered || [], interests) && !hasLocationMatch(a.location?.city, userLocation))
    .map((a) => computeAcademyScore(a, interests, skillLevel, userLat, userLng, userLocation))
    .sort((a, b) => b.score - a.score)

  const combined = [...sportAndLocation, ...sportOnly]

  if (combined.length >= limit) {
    return combined.slice(0, limit).map((r) => ({ ...r.academy, distance: r.distance }))
  }

  // Tier 3: Location match only (different sports, same city)
  const locationOnly = academies
    .filter((a) => !hasSportMatch(a.sportsOffered || [], interests) && hasLocationMatch(a.location?.city, userLocation))
    .map((a) => computeAcademyScore(a, interests, skillLevel, userLat, userLng, userLocation))
    .sort((a, b) => b.score - a.score)

  const allCombined = [...combined, ...locationOnly]

  if (allCombined.length >= limit) {
    return allCombined.slice(0, limit).map((r) => ({ ...r.academy, distance: r.distance }))
  }

  // Tier 4: Everything else (fallback)
  const remaining = academies
    .filter((a) => !allCombined.some((c) => c.academy.id === a.id))
    .map((a) => computeAcademyScore(a, interests, skillLevel, userLat, userLng, userLocation))
    .sort((a, b) => b.score - a.score)

  return [...allCombined, ...remaining]
    .slice(0, limit)
    .map((r) => ({ ...r.academy, distance: r.distance }))
}

// ── Public API: Suggested coaches ────────────────────────────────────

export interface SuggestedCoach extends Coach {
  distance?: number
}

export function getSuggestedCoaches(
  coaches: Coach[],
  onboarding: OnboardingData | null,
  userLat?: number,
  userLng?: number,
  limit = 6,
): SuggestedCoach[] {
  if (!onboarding) return coaches.slice(0, limit)

  const interests = getInterests(onboarding)
  const skillLevel = getSkillLevel(onboarding)
  const userLocation = getUserLocation(onboarding)

  if (interests.length === 0) return coaches.slice(0, limit)

  // Tier 1: Sport match + Location match
  const sportAndLocation = coaches
    .filter((c) => hasSportMatch(c.sportsCoached || [], interests) && hasLocationMatch(c.location?.city, userLocation))
    .map((c) => computeCoachScore(c, interests, skillLevel, userLat, userLng, userLocation))
    .sort((a, b) => b.score - a.score)

  if (sportAndLocation.length >= limit) {
    return sportAndLocation.slice(0, limit).map((r) => ({ ...r.coach, distance: r.distance }))
  }

  // Tier 2: Sport match only
  const sportOnly = coaches
    .filter((c) => hasSportMatch(c.sportsCoached || [], interests) && !hasLocationMatch(c.location?.city, userLocation))
    .map((c) => computeCoachScore(c, interests, skillLevel, userLat, userLng, userLocation))
    .sort((a, b) => b.score - a.score)

  const combined = [...sportAndLocation, ...sportOnly]

  if (combined.length >= limit) {
    return combined.slice(0, limit).map((r) => ({ ...r.coach, distance: r.distance }))
  }

  // Tier 3: Location match only
  const locationOnly = coaches
    .filter((c) => !hasSportMatch(c.sportsCoached || [], interests) && hasLocationMatch(c.location?.city, userLocation))
    .map((c) => computeCoachScore(c, interests, skillLevel, userLat, userLng, userLocation))
    .sort((a, b) => b.score - a.score)

  const allCombined = [...combined, ...locationOnly]

  if (allCombined.length >= limit) {
    return allCombined.slice(0, limit).map((r) => ({ ...r.coach, distance: r.distance }))
  }

  // Tier 4: Everything else
  const remaining = coaches
    .filter((c) => !allCombined.some((x) => x.coach.id === c.id))
    .map((c) => computeCoachScore(c, interests, skillLevel, userLat, userLng, userLocation))
    .sort((a, b) => b.score - a.score)

  return [...allCombined, ...remaining]
    .slice(0, limit)
    .map((r) => ({ ...r.coach, distance: r.distance }))
}

// ── Public API: Nearby academies (distance-sorted) ───────────────────

export function getNearbyAcademies(
  academies: Academy[],
  userLat?: number,
  userLng?: number,
  limit = 6,
): SuggestedAcademy[] {
  if (userLat == null || userLng == null) return academies.slice(0, limit)

  return academies
    .map((a) => {
      const loc = a.location
      if (!loc?.lat || !loc?.lng) return { ...a, distance: undefined }
      return {
        ...a,
        distance: Math.round(haversineDistance(userLat, userLng, loc.lat, loc.lng) * 10) / 10,
      }
    })
    .sort((a, b) => {
      if (a.distance == null && b.distance == null) return 0
      if (a.distance == null) return 1
      if (b.distance == null) return -1
      return a.distance - b.distance
    })
    .slice(0, limit)
}

// ── Public API: Nearby coaches (distance-sorted) ─────────────────────

export function getNearbyCoaches(
  coaches: Coach[],
  userLat?: number,
  userLng?: number,
  limit = 6,
): SuggestedCoach[] {
  if (userLat == null || userLng == null) return coaches.slice(0, limit)

  return coaches
    .map((c) => {
      const loc = c.location
      if (!loc?.lat || !loc?.lng) return { ...c, distance: undefined }
      return {
        ...c,
        distance: Math.round(haversineDistance(userLat, userLng, loc.lat, loc.lng) * 10) / 10,
      }
    })
    .sort((a, b) => {
      if (a.distance == null && b.distance == null) return 0
      if (a.distance == null) return 1
      if (b.distance == null) return -1
      return a.distance - b.distance
    })
    .slice(0, limit)
}
