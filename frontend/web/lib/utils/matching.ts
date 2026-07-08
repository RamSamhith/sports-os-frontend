import { type Academy } from '@/types/domain/academy'
import type { LocationSummary } from '@/types/domain/location'
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

// ── Data-driven scoring engine ─────────────────────────────────────────
// Each scorer inspects its own data availability and returns 0 when a
// field is absent, so the engine never fails on missing academy data.

export interface ScoringWeights {
  sport: number
  exactCity: number
  district: number
  state: number
  country: number
  distance: number
  age: number
  skill: number
  rating: number
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  sport: 10,
  exactCity: 8,
  district: 6,
  state: 4,
  country: 2,
  distance: 6,
  age: 3,
  skill: 5,
  rating: 1,
}

export interface ScoringContext {
  interests: string[]
  skillLevel?: string
  userAge?: number
  userLocation?: string
  userDistrict?: string
  userState?: string
  userCountry?: string
  userLat?: number
  userLng?: number
}

function getUserState(
  userCity: string | undefined,
  items: Array<{ location: LocationSummary }>,
): string | undefined {
  if (!userCity) return undefined
  const userCityLower = toLower(userCity)
  for (const item of items) {
    if (toLower(item.location.city) === userCityLower) {
      return item.location.state
    }
  }
  return undefined
}

// ── Individual dimension scorers ──────────────────────────────────────
// Each scorer checks if its required data exists (on both academy and
// user).  When data is absent the scorer returns 0 (graceful skip).
// When data is present and matches, the configured weight is returned.

function scoreSport(
  sportsOffered: string[] | undefined,
  interests: string[],
): number {
  if (!sportsOffered?.length || !interests.length) return 0
  const interestSlugs = interests.map(slugify)
  for (const sport of sportsOffered) {
    if (interestSlugs.includes(slugify(sport))) {
      return DEFAULT_WEIGHTS.sport
    }
  }
  return 0
}

function hasSportMatch(
  sportsOffered: string[] | undefined,
  interests: string[],
): boolean {
  return scoreSport(sportsOffered, interests) > 0
}

function scoreLocationHierarchy(
  academyLoc: LocationSummary | undefined,
  ctx: ScoringContext,
): number {
  if (!academyLoc) return 0

  // Cascading hierarchy: the most specific matching level wins.
  if (academyLoc.city && ctx.userLocation &&
      toLower(academyLoc.city) === toLower(ctx.userLocation)) {
    return DEFAULT_WEIGHTS.exactCity
  }
  if (academyLoc.district && ctx.userDistrict &&
      toLower(academyLoc.district) === toLower(ctx.userDistrict)) {
    return DEFAULT_WEIGHTS.district
  }
  if (academyLoc.state && ctx.userState &&
      toLower(academyLoc.state) === toLower(ctx.userState)) {
    return DEFAULT_WEIGHTS.state
  }
  if (academyLoc.country && ctx.userCountry &&
      toLower(academyLoc.country) === toLower(ctx.userCountry)) {
    return DEFAULT_WEIGHTS.country
  }
  return 0
}

function hasLocationMatch(
  academyLoc: LocationSummary | undefined,
  ctx: ScoringContext,
): boolean {
  if (!academyLoc?.city || !ctx.userLocation) return false
  return toLower(academyLoc.city) === toLower(ctx.userLocation)
}

function getLocationMatchLevel(
  academyLoc: LocationSummary | undefined,
  ctx: ScoringContext,
): number {
  if (!academyLoc) return 0
  if (academyLoc.city && ctx.userLocation &&
      toLower(academyLoc.city) === toLower(ctx.userLocation)) return 4
  if (academyLoc.district && ctx.userDistrict &&
      toLower(academyLoc.district) === toLower(ctx.userDistrict)) return 3
  if (academyLoc.state && ctx.userState &&
      toLower(academyLoc.state) === toLower(ctx.userState)) return 2
  if (academyLoc.country && ctx.userCountry &&
      toLower(academyLoc.country) === toLower(ctx.userCountry)) return 1
  return 0
}

function scoreDistance(distanceKm: number | undefined): number {
  if (distanceKm == null) return 0
  if (distanceKm <= 5) return 6
  if (distanceKm <= 15) return 4
  if (distanceKm <= 30) return 2
  return 0
}

function scoreAge(
  userAge: number | undefined,
  academyAgeRange: { min?: number; max?: number } | undefined,
): number {
  if (userAge == null) return 0
  if (academyAgeRange?.min == null || academyAgeRange?.max == null) return 0
  return (userAge >= academyAgeRange.min && userAge <= academyAgeRange.max)
    ? DEFAULT_WEIGHTS.age
    : 0
}

function scoreSkill(
  userLevel: string | undefined,
  trainingLevels: string[] | undefined,
): number {
  if (!userLevel || !trainingLevels?.length) return 0
  return trainingLevels.some((l) => toLower(l) === toLower(userLevel))
    ? DEFAULT_WEIGHTS.skill
    : 0
}

function scoreRating(rating: { average?: number } | undefined): number {
  if (rating?.average == null) return 0
  return rating.average * DEFAULT_WEIGHTS.rating
}

// ── Academy scoring ──────────────────────────────────────────────────

interface ScoredAcademy {
  academy: Academy
  score: number
  distance?: number
}

function computeAcademyScore(
  academy: Academy,
  ctx: ScoringContext,
): ScoredAcademy {
  let score = scoreSport(academy.sportsOffered, ctx.interests)
  score += scoreLocationHierarchy(academy.location, ctx)
  score += scoreSkill(ctx.skillLevel, academy.trainingLevels)
  score += scoreAge(ctx.userAge, academy.ageRange)

  let distance: number | undefined
  if (
    ctx.userLat != null && ctx.userLng != null &&
    academy.location.lat != null && academy.location.lng != null
  ) {
    distance = Math.round(
      haversineDistance(ctx.userLat, ctx.userLng, academy.location.lat, academy.location.lng) * 10,
    ) / 10
    score += scoreDistance(distance)
  }

  score += scoreRating(academy.rating)

  return { academy, score, distance }
}

// ── Public API: Suggested academies ──────────────────────────────────

export interface SuggestedAcademy extends Academy {
  distance?: number
}

export interface AcademySuggestions {
  primary: SuggestedAcademy[]
  fallback: SuggestedAcademy[]
  hasExactMatch: boolean
}

export function getSuggestedAcademies(
  academies: Academy[],
  onboarding: OnboardingData | null,
  userLat?: number,
  userLng?: number,
  limit = 6,
): AcademySuggestions {
  const empty: AcademySuggestions = { primary: [], fallback: [], hasExactMatch: false }
  if (!Array.isArray(academies)) return empty;
  if (!onboarding) return { ...empty, primary: academies.slice(0, limit), fallback: [] }

  const interests = getInterests(onboarding)
  if (interests.length === 0) return { ...empty, primary: academies.slice(0, limit), fallback: [] }

  const userLocation = getUserLocation(onboarding)

  const ctx: ScoringContext = {
    interests,
    skillLevel: getSkillLevel(onboarding),
    userAge: getUserAge(onboarding),
    userLocation,
    userState: getUserState(userLocation, academies),
    userLat,
    userLng,
  }

  // ONLY sport-matching academies (mandatory sport match for primary)
  const sportMatches = academies
    .filter((a) => hasSportMatch(a.sportsOffered, interests))
    .map((a) => computeAcademyScore(a, ctx))

  // Sort by: location match level first, then total score
  const sorted = sportMatches.sort((a, b) => {
    const aLoc = getLocationMatchLevel(a.academy.location, ctx)
    const bLoc = getLocationMatchLevel(b.academy.location, ctx)
    if (aLoc !== bLoc) return bLoc - aLoc
    return b.score - a.score
  })

  const primary = sorted.slice(0, limit).map((r) => ({ ...r.academy, distance: r.distance }))

  // Fallback: same-city academies with different sports (only when no sport matches exist)
  if (primary.length === 0) {
    const fallback = academies
      .filter((a) => !hasSportMatch(a.sportsOffered, interests) && hasLocationMatch(a.location, ctx))
      .map((a) => computeAcademyScore(a, ctx))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => ({ ...r.academy, distance: r.distance }))

    return { primary: [], fallback, hasExactMatch: false }
  }

  return { primary, fallback: [], hasExactMatch: true }
}
