# Matching Engine Flow

## Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           ScoringContext                                 │
│  interests[]  skillLevel?  userAge?  userLocation?  userState?  coords  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    getSuggestedAcademies(onboarding)                      │
│                                                                          │
│  1. Extract interests from onboarding (mandatory filter)                  │
│  2. Build ScoringContext from onboarding + derived state                  │
│  3. Filter: hasSportMatch(sportsOffered, interests) === true              │
│  4. Map through data-driven scoring engine                                │
│  5. Sort: locationMatchLevel ↓ → total score ↓                            │
│  6. Slice top N → primary                                                │
│  7. If primary empty: fallback = same-city, different-sport academies    │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      Data-Driven Scoring Engine                           │
│                                                                          │
│  For each academy:                                                        │
│                                                                          │
│    field           | auto-activates when...         | returns weight     │
│    ────────────────┼─────────────────────────────────┼──────────────────── │
│    sport           | sportsOffered[] has length      | 10 (mandatory)    │
│    exactCity       | location.city + userLocation    | 8                  │
│    district        | location.district + userDistrict| 6                  │
│    state           | location.state + userState      | 4                  │
│    country         | location.country + userCountry  | 2                  │
│    distance        | both lat/lng exist              | ≤6 (proximity)    │
│    age             | ageRange.{min,max} + userAge    | 3                  │
│    skill           | trainingLevels[] + userLevel    | 5                  │
│    rating          | rating.average exists           | avg * 1            │
│    ────────────────┴─────────────────────────────────┴──────────────────── │
│                                                                          │
│  Location hierarchy: only the deepest matching level contributes          │
│    City > District > State > Country                                      │
│                                                                          │
│  Every scorer returns 0 when its required data is missing                 │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                              Output                                       │
│                                                                          │
│  AcademySuggestions {                                                     │
│    primary:        sport-matched academies, sorted by relevance          │
│    fallback:       same-city, different-sport (only if primary empty)    │
│    hasExactMatch:  true if primary is non-empty                          │
│  }                                                                        │
└──────────────────────────────────────────────────────────────────────────┘
```

## Scoring Function Signatures

```
scoreSport(sportsOffered[], interests[])          → 10 | 0
scoreLocationHierarchy(location, ctx)             → 8 | 6 | 4 | 2 | 0
scoreDistance(distanceKm)                         → 6 | 4 | 2 | 1 | 0
scoreAge(userAge, ageRange)                       → 3 | 0
scoreSkill(userLevel, trainingLevels[])           → 5 | 0
scoreRating(rating)                               → average * 1
```

## Sort Priority

1. Location match level (city=4 > district=3 > state=2 > country=1 > none=0)
2. Total score (sum of all auto-detected dimensions)
