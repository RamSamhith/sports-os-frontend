/**
 * Comprehensive matching verification for ALL supported sports.
 * Run: npx tsx scripts/test-matching.ts
 */
import { academies } from '../data/academies'
import { coaches } from '../data/coaches'
import { sportTaxonomy } from '../lib/constants/sport-taxonomy'
import { getSuggestedAcademies, getSuggestedCoaches } from '../lib/utils/matching'
import type { OnboardingData } from '../types/domain/onboarding'

const USER_LAT = 12.9716 // Bengaluru
const USER_LNG = 77.5946

// Collect unique sports from academy data
const sportsInAcademies = new Set<string>()
academies.forEach(a => a.sportsOffered.forEach(s => sportsInAcademies.add(s)))

// Also test sports in taxonomy that have NO academies
const sportsWithAcademies = [...sportsInAcademies].sort()
const sportsWithoutAcademies = sportTaxonomy
  .map(s => s.slug)
  .filter(s => !sportsInAcademies.has(s))
  .sort()

console.log('=== ACADEMIES WITH SPORT MATCHES ===')
console.log(`Total academies in dataset: ${academies.length}\n`)

let allPassed = true

for (const sport of sportsWithAcademies) {
  const displayName = sportTaxonomy.find(s => s.slug === sport)?.name ?? sport
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`SPORT: ${displayName} (${sport})`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

  // Create onboarding data for this sport + Bengaluru
  const onboarding: OnboardingData = {
    athlete: {
      age: 14,
      gender: 'male',
      location: 'Bengaluru',
      sportInterests: [sport],
      skillLevel: 'beginner',
      goals: 'Learn and improve',
    },
  }

  const result = getSuggestedAcademies(academies, onboarding, USER_LAT, USER_LNG, 6)

  // TEST 1: Primary contains only academies matching this sport
  const primaryNames = result.primary.map(a => `${a.name} [${a.sportsOffered.join(', ')}] (${a.location.city})`)

  // Check each primary academy actually offers this sport
  let primaryHasWrongSport = false
  for (const a of result.primary) {
    const slugSport = sport.toLowerCase().trim()
    const hasIt = a.sportsOffered.some(s => s.toLowerCase().trim() === slugSport)
    if (!hasIt) {
      primaryHasWrongSport = true
      console.log(`  ❌ PRIMARY ERROR: ${a.name} does NOT offer ${displayName} (offers: ${a.sportsOffered.join(', ')})`)
    }
  }

  if (primaryHasWrongSport) {
    console.log(`  FAIL: Primary contains academies for wrong sports`)
    allPassed = false
  } else {
    console.log(`  ✅ Primary only contains academies offering ${displayName}`)
  }

  // TEST 2: Show primary academies
  if (result.primary.length > 0) {
    console.log(`  📋 Primary academies (${result.primary.length}):`)
    result.primary.forEach((a, i) => {
      const cityMatch = a.location.city === 'Bengaluru' ? ' ✅ SAME CITY' : ''
      console.log(`     ${i + 1}. ${a.name} — ${a.location.city}, ${a.location.state}${cityMatch}`)
    })
  } else {
    console.log(`  ⚠️  No PRIMARY academies for ${displayName}`)
  }

  // TEST 3: Fallback only appears when primary is empty
  if (result.primary.length > 0 && result.fallback.length > 0) {
    console.log(`  ❌ FAIL: Fallback appears alongside primary (${result.fallback.length} fallback items)`)
    allPassed = false
  } else {
    console.log(`  ✅ Fallback: ${result.fallback.length} items (${result.primary.length === 0 ? 'shown because no sport match' : 'hidden because primary exists'})`)
  }

  if (result.fallback.length > 0) {
    console.log(`  📋 Fallback academies (${result.fallback.length}):`)
    result.fallback.forEach((a, i) => {
      console.log(`     ${i + 1}. ${a.name} — ${a.sportsOffered.join(', ')} in ${a.location.city}`)
    })
  }

  // TEST 4: hasExactMatch matches primary presence
  if (result.hasExactMatch !== (result.primary.length > 0)) {
    console.log(`  ❌ FAIL: hasExactMatch=${result.hasExactMatch} but primary.length=${result.primary.length}`)
    allPassed = false
  } else {
    console.log(`  ✅ hasExactMatch = ${result.hasExactMatch}`)
  }

  // TEST 5: Sorting — same city should come first
  if (result.primary.length >= 2) {
    const firstCity = result.primary[0].location.city
    const secondCity = result.primary[1].location.city
    if (firstCity === 'Bengaluru' && secondCity !== 'Bengaluru') {
      console.log(`  ✅ Sorting: Bengaluru academy listed first`)
    } else if (firstCity !== 'Bengaluru' && secondCity === 'Bengaluru') {
      console.log(`  ⚠️  NOTE: Non-Bengaluru academy listed before Bengaluru one`)
    }
  }

  console.log(`  ------------------------------`)
}

// Test sports WITHOUT academies
console.log(`\n\n=== SPORTS WITHOUT ACADEMIES IN DATASET ===`)
for (const sport of sportsWithoutAcademies) {
  const displayName = sportTaxonomy.find(s => s.slug === sport)?.name ?? sport
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`SPORT: ${displayName} (${sport}) — NO academies in dataset`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

  const onboarding: OnboardingData = {
    athlete: {
      age: 14,
      gender: 'male',
      location: 'Bengaluru',
      sportInterests: [sport],
      skillLevel: 'beginner',
      goals: 'Learn and improve',
    },
  }

  const result = getSuggestedAcademies(academies, onboarding, USER_LAT, USER_LNG, 6)

  if (result.primary.length === 0 && result.hasExactMatch === false) {
    console.log(`  ✅ No primary academies (correct — no ${displayName} academies exist)`)
  } else {
    console.log(`  ❌ FAIL: Expected empty primary but got ${result.primary.length} items`)
    allPassed = false
  }

  if (result.fallback.length > 0) {
    console.log(`  ✅ Fallback shown: ${result.fallback.length} academies in same location`)
    result.fallback.forEach((a, i) => {
      console.log(`     ${i + 1}. ${a.name} — ${a.sportsOffered.join(', ')} in ${a.location.city}`)
    })
    // Check fallback doesn't contain the sport we're searching for
    const fallbackHasSport = result.fallback.some(a =>
      a.sportsOffered.some(s => s.toLowerCase() === sport.toLowerCase())
    )
    if (fallbackHasSport) {
      console.log(`  ❌ FAIL: Fallback contains ${displayName} academy (should be excluded)`)
      allPassed = false
    } else {
      console.log(`  ✅ Fallback excludes ${displayName} academies`)
    }
  } else {
    console.log(`  ⚠️  No fallback academies in Bengaluru`)
  }
}

// Test multi-sport academy (ac_010: yoga + gymnastics)
console.log(`\n\n=== MULTI-SPORT ACADEMY: YOGA & GYMNASTICS TRADITION ===`)
for (const sport of ['yoga', 'gymnastics']) {
  const displayName = sportTaxonomy.find(s => s.slug === sport)?.name ?? sport
  console.log(`\n--- Testing: ${displayName} ---`)
  const onboarding: OnboardingData = {
    athlete: {
      age: 14,
      gender: 'male',
      location: 'Bengaluru',
      sportInterests: [sport],
      skillLevel: 'beginner',
      goals: 'Learn',
    },
  }
  const result = getSuggestedAcademies(academies, onboarding, USER_LAT, USER_LNG, 6)
  const matchNames = result.primary.map(a => a.name)
  const hasYogaGym = matchNames.includes('Yoga & Gymnastics Tradition')
  if (hasYogaGym) {
    console.log(`  ✅ Yoga & Gymnastics Tradition found for ${displayName}`)
  } else {
    console.log(`  ❌ FAIL: Yoga & Gymnastics Tradition NOT found for ${displayName}`)
    allPassed = false
  }
}

console.log(`\n\n${'='.repeat(60)}`)
if (allPassed) {
  console.log('✅ ALL TESTS PASSED — Matching algorithm verified for all sports')
} else {
  console.log('❌ SOME TESTS FAILED — See above for details')
}
console.log(`${'='.repeat(60)}`)

// Coach matching verification
console.log(`\n\n=== COACH MATCHING VERIFICATION ===`)
const coachSports = new Set<string>()
coaches.forEach(c => c.sportsCoached.forEach(s => coachSports.add(s)))

for (const sport of [...coachSports].sort()) {
  const displayName = sportTaxonomy.find(s => s.slug === sport)?.name ?? sport
  const onboarding: OnboardingData = {
    athlete: {
      age: 14,
      gender: 'male',
      location: 'Bengaluru',
      sportInterests: [sport],
      skillLevel: 'beginner',
      goals: 'Learn',
    },
  }
  const result = getSuggestedCoaches(coaches, onboarding, USER_LAT, USER_LNG, 4)
  const coachNames = result.primary.map(c => `${c.name} (${c.sportsCoached.join(', ')})`)
  const wrongCoaches = result.primary.filter(c =>
    !c.sportsCoached.some(s => s.toLowerCase() === sport.toLowerCase())
  )
  if (wrongCoaches.length > 0) {
    console.log(`  ❌ ${displayName}: Wrong coaches in results: ${wrongCoaches.map(c => c.name).join(', ')}`)
    allPassed = false
  } else if (result.primary.length > 0) {
    console.log(`  ✅ ${displayName}: ${result.primary.length} coach(es) matched`)
  } else {
    console.log(`  ⚠️  ${displayName}: No coach matches${result.fallback.length > 0 ? ` (${result.fallback.length} fallback)` : ''}`)
  }
}

// Final result
process.exit(allPassed ? 0 : 1)
