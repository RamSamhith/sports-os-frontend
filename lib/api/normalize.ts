/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  TEMPORARY COMPATIBILITY LAYER                             ║
 * ║                                                            ║
 * ║  This file maps raw backend MongoDB documents to the       ║
 * ║  frontend domain types. It exists because the backend      ║
 * ║  currently returns raw documents instead of normalized     ║
 * ║  API responses.                                            ║
 * ║                                                            ║
 * ║  REMOVE AFTER: Backend team delivers corrected API         ║
 * ║  response format matching the frontend domain types.       ║
 * ║                                                            ║
 * ║  To remove:                                                ║
 * ║  1. Delete this file                                       ║
 * ║  2. In academies.ts, coaches.ts, sports.ts — restore       ║
 * ║     direct `get<Type>(path, query)` calls and remove       ║
 * ║     the normalize imports.                                 ║
 * ║  3. Run pnpm typecheck to verify.                          ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import type { Academy, Facility, TrainingLevel, VerificationStatus, AcademyStatus } from '@/types/domain/academy';
import type { Coach, CoachStatus } from '@/types/domain/coach';
import type { Sport, SportCategory, SportType, SportStatus } from '@/types/domain/sport';
import type { LocationSummary } from '@/types/domain/location';
import type { Rating } from '@/types/domain/common';

// ─── Helpers ─────────────────────────────────────────────────

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

function bool(v: unknown, fallback = false): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

function arr<T>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  return [];
}

function optionalArr<T>(v: unknown): T[] | undefined {
  if (Array.isArray(v) && v.length > 0) return v as T[];
  return undefined;
}

function nestedStr(obj: unknown, key: string): string {
  if (obj && typeof obj === 'object' && key in (obj as Record<string, unknown>)) {
    const val = (obj as Record<string, unknown>)[key];
    return typeof val === 'string' ? val : '';
  }
  return '';
}

// ─── Rating normalization ────────────────────────────────────
// Backend may return rating as a plain number or as { average, count }.

function normalizeRating(raw: unknown): Rating {
  if (raw == null) return { average: 0, count: 0 };
  if (typeof raw === 'number') return { average: raw, count: 0 };
  if (typeof raw === 'object' && raw !== null) {
    const r = raw as Record<string, unknown>;
    return {
      average: num(r.average),
      count: num(r.count),
    };
  }
  return { average: 0, count: 0 };
}

// ─── Location normalization ──────────────────────────────────
// Backend may have flat city/state/latitude/longitude or nested location object.

function normalizeLocation(raw: unknown, fallbackCountry = 'India'): LocationSummary {
  if (raw && typeof raw === 'object') {
    const loc = raw as Record<string, unknown>;
    if ('city' in loc) {
      return {
        city: str(loc.city, 'Unknown'),
        state: str(loc.state, 'Unknown'),
        country: str(loc.country, fallbackCountry),
        lat: num(loc.lat),
        lng: num(loc.lng),
        address: loc.address ? str(loc.address) : undefined,
        district: loc.district ? str(loc.district) : undefined,
      };
    }
  }
  return { city: 'Unknown', state: 'Unknown', country: fallbackCountry, lat: 0, lng: 0 };
}

function buildLocationFromFlat(doc: Record<string, unknown>): LocationSummary {
  const loc = doc.location && typeof doc.location === 'object' ? doc.location as Record<string, unknown> : null;
  return {
    city: str(doc.city, str(loc?.city, 'Unknown')),
    state: str(doc.state, str(loc?.state, 'Unknown')),
    country: str(doc.country, 'India'),
    lat: num(doc.latitude ?? doc.lat ?? loc?.lat),
    lng: num(doc.longitude ?? doc.lng ?? loc?.lng),
    address: doc.address ? str(doc.address) : undefined,
    district: doc.district ? str(doc.district) : undefined,
  };
}

// ─── Facility normalization ──────────────────────────────────

const VALID_FACILITIES: Facility[] = [
  'indoor', 'outdoor', 'ground', 'court', 'equipment',
  'changing_room', 'parking', 'physio', 'gym',
];

function normalizeFacilities(raw: unknown): Facility[] {
  if (Array.isArray(raw)) {
    return raw.filter((f): f is Facility => VALID_FACILITIES.includes(f as Facility));
  }
  if (typeof raw === 'string' && raw.trim()) {
    const lower = raw.toLowerCase();
    const matched: Facility[] = [];
    if (lower.includes('indoor')) matched.push('indoor');
    if (lower.includes('outdoor')) matched.push('outdoor');
    if (lower.includes('ground') || lower.includes('grass')) matched.push('ground');
    if (lower.includes('court')) matched.push('court');
    if (lower.includes('equipment') || lower.includes('machine')) matched.push('equipment');
    if (lower.includes('changing') || lower.includes('locker')) matched.push('changing_room');
    if (lower.includes('parking')) matched.push('parking');
    if (lower.includes('physio')) matched.push('physio');
    if (lower.includes('gym') || lower.includes('fitness')) matched.push('gym');
    return matched;
  }
  return [];
}

// ─── Training level normalization ────────────────────────────

const VALID_LEVELS: TrainingLevel[] = ['beginner', 'intermediate', 'advanced', 'elite'];

function normalizeTrainingLevels(raw: unknown): TrainingLevel[] {
  if (Array.isArray(raw)) {
    return raw.filter((l): l is TrainingLevel => VALID_LEVELS.includes(l as TrainingLevel));
  }
  return [];
}

// ─── Age range normalization ─────────────────────────────────

function normalizeAgeRange(raw: unknown): { min?: number; max?: number } | undefined {
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>;
    return { min: r.min != null ? num(r.min) : undefined, max: r.max != null ? num(r.max) : undefined };
  }
  if (typeof raw === 'string' && raw.trim()) {
    const match = raw.match(/(\d+)/);
    const match2 = raw.match(/(\d+)\D+(\d+)/);
    if (match2) return { min: num(match2[1]), max: num(match2[2]) };
    if (match) return { min: num(match[1]), max: num(match[1]) };
  }
  return undefined;
}

// ─── Verification status normalization ───────────────────────

function normalizeVerificationStatus(raw: unknown): VerificationStatus {
  if (typeof raw === 'string') {
    const lower = raw.toLowerCase();
    if (lower === 'verified') return 'verified';
    if (lower === 'pending') return 'pending';
    if (lower === 'rejected') return 'rejected';
    if (lower === 'unverified') return 'unverified';
  }
  if (typeof raw === 'boolean') return raw ? 'verified' : 'unverified';
  return 'unverified';
}

// ─── Achievement signals normalization ───────────────────────

function normalizeAchievementSignals(raw: unknown) {
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>;
    return {
      stateAthletesProduced: num(r.stateAthletesProduced),
      nationalAthletesProduced: num(r.nationalAthletesProduced),
      competitionParticipations: arr<string>(r.competitionParticipations),
      milestones: arr<string>(r.milestones),
    };
  }
  return {
    stateAthletesProduced: 0,
    nationalAthletesProduced: 0,
    competitionParticipations: [],
    milestones: [],
  };
}

// ─── Check if a raw backend doc is already in normalized form ─

function isNormalizedAcademy(raw: Record<string, unknown>): boolean {
  return (
    typeof raw.id === 'string' &&
    raw.location != null &&
    typeof raw.location === 'object' &&
    'city' in (raw.location as Record<string, unknown>) &&
    raw.rating != null &&
    typeof raw.rating === 'object' &&
    'average' in (raw.rating as Record<string, unknown>) &&
    Array.isArray(raw.sportsOffered)
  );
}

function isNormalizedCoach(raw: Record<string, unknown>): boolean {
  return (
    typeof raw.id === 'string' &&
    raw.location != null &&
    typeof raw.location === 'object' &&
    'city' in (raw.location as Record<string, unknown>) &&
    raw.rating != null &&
    typeof raw.rating === 'object' &&
    'average' in (raw.rating as Record<string, unknown>) &&
    Array.isArray(raw.sportsCoached)
  );
}

function isNormalizedSport(raw: Record<string, unknown>): boolean {
  return (
    typeof raw.id === 'string' &&
    typeof raw.category === 'string' &&
    typeof raw.sportType === 'string' &&
    Array.isArray(raw.physicalBenefits)
  );
}

// ─── Academy Normalization ───────────────────────────────────

export function normalizeAcademy(raw: unknown): Academy {
  if (!raw || typeof raw !== 'object') {
    return emptyAcademy();
  }
  const doc = raw as Record<string, unknown>;

  // Already normalized? Return as-is.
  if (isNormalizedAcademy(doc)) {
    return doc as unknown as Academy;
  }

  const id = str(doc.id ?? doc._id ?? doc.academyId, '');
  const ratingVal = doc.rating;
  const ratingCount = num(doc.reviewCount ?? doc.ratingCount);

  return {
    id,
    slug: str(doc.slug, id || 'unknown'),
    name: str(doc.name, 'Unnamed Academy'),
    description: str(doc.description),
    location: normalizeLocation(doc.location) || buildLocationFromFlat(doc),
    contact: {
      phone: str(doc.contactNumber ?? nestedStr(doc.contact, 'phone') ?? doc.phone),
      email: str(doc.email ?? nestedStr(doc.contact, 'email')),
      website: str(doc.website ?? nestedStr(doc.contact, 'website') ?? doc.googleMapsLink),
    },
    sportsOffered: normalizeSportsOffered(doc),
    facilities: normalizeFacilities(doc.facilities),
    trainingLevels: normalizeTrainingLevels(doc.trainingLevels),
    ageRange: normalizeAgeRange(doc.ageRange ?? doc.ageGroups),
    batchInformation: str(doc.batchInformation ?? doc.batchTimings),
    certifications: arr(doc.certifications),
    verificationStatus: normalizeVerificationStatus(doc.verificationStatus ?? doc.verified),
    achievementSignals: normalizeAchievementSignals(doc.achievementSignals),
    rating: normalizeRatingWithCount(ratingVal, ratingCount),
    coverImage: str(doc.coverImage ?? doc.academyImage),
    gallery: arr(doc.gallery),
    sourceCount: num(doc.sourceCount),
    status: str(doc.status, 'published') as AcademyStatus,
    lastUpdatedAt: str(doc.lastUpdatedAt ?? doc.updatedAt ?? doc.createdAt, new Date().toISOString()),
    createdAt: str(doc.createdAt, new Date().toISOString()),
  };
}

function normalizeSportsOffered(doc: Record<string, unknown>): string[] {
  if (Array.isArray(doc.sportsOffered)) return doc.sportsOffered.filter((s): s is string => typeof s === 'string');
  if (typeof doc.sport === 'string' && doc.sport.trim()) return [doc.sport.trim().toLowerCase()];
  if (typeof doc.sports === 'string' && doc.sports.trim()) {
    return doc.sports.split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean);
  }
  return [];
}

function normalizeRatingWithCount(ratingRaw: unknown, countFallback: number): Rating {
  if (ratingRaw == null) return { average: 0, count: countFallback };
  if (typeof ratingRaw === 'number') return { average: ratingRaw, count: countFallback };
  if (typeof ratingRaw === 'object' && ratingRaw !== null) {
    const r = ratingRaw as Record<string, unknown>;
    return {
      average: num(r.average),
      count: num(r.count, countFallback),
    };
  }
  return { average: 0, count: countFallback };
}

// ─── Coach Normalization ─────────────────────────────────────

export function normalizeCoach(raw: unknown): Coach {
  if (!raw || typeof raw !== 'object') {
    return emptyCoach();
  }
  const doc = raw as Record<string, unknown>;

  if (isNormalizedCoach(doc)) {
    return doc as unknown as Coach;
  }

  const id = str(doc.id ?? doc._id ?? doc.coachId, '');

  return {
    id,
    slug: str(doc.slug, id || 'unknown'),
    name: str(doc.name, 'Unnamed Coach'),
    avatar: str(doc.avatar ?? doc.coachImage ?? doc.photo),
    certifications: arr(doc.certifications),
    experienceYears: num(doc.experienceYears ?? doc.experience),
    sportsCoached: normalizeSportsCoached(doc),
    specialization: normalizeStringArray(doc.specialization),
    academyId: doc.academyId ? str(doc.academyId) : undefined,
    location: normalizeLocation(doc.location) || buildLocationFromFlat(doc),
    contact: {
      phone: str(doc.contactNumber ?? nestedStr(doc.contact, 'phone') ?? doc.phone),
      email: str(doc.email ?? nestedStr(doc.contact, 'email')),
    },
    bio: doc.bio ? str(doc.bio) : undefined,
    achievements: optionalArr<string>(doc.achievements),
    verificationStatus: normalizeVerificationStatus(doc.verificationStatus ?? doc.verified),
    rating: normalizeRatingWithCount(doc.rating, num(doc.reviewCount)),
    sourceCount: num(doc.sourceCount),
    status: str(doc.status, 'published') as CoachStatus,
    lastUpdatedAt: str(doc.lastUpdatedAt ?? doc.updatedAt ?? doc.createdAt, new Date().toISOString()),
    createdAt: str(doc.createdAt, new Date().toISOString()),
  };
}

function normalizeSportsCoached(doc: Record<string, unknown>): string[] {
  if (Array.isArray(doc.sportsCoached)) return doc.sportsCoached.filter((s): s is string => typeof s === 'string');
  if (typeof doc.sport === 'string' && doc.sport.trim()) return [doc.sport.trim().toLowerCase()];
  return [];
}

function normalizeStringArray(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((s): s is string => typeof s === 'string');
  if (typeof raw === 'string' && raw.trim()) return raw.split(',').map((s: string) => s.trim()).filter(Boolean);
  return [];
}

// ─── Sport Normalization ─────────────────────────────────────

export function normalizeSport(raw: unknown): Sport {
  if (!raw || typeof raw !== 'object') {
    return emptySport();
  }
  const doc = raw as Record<string, unknown>;

  if (isNormalizedSport(doc)) {
    return doc as unknown as Sport;
  }

  const id = str(doc.id ?? doc._id ?? doc.sportId, '');

  return {
    id,
    slug: str(doc.slug, id || 'unknown'),
    name: str(doc.name, 'Unnamed Sport'),
    category: normalizeSportCategory(doc.category),
    sportType: normalizeSportType(doc.sportType ?? doc.type),
    description: doc.description ? str(doc.description) : undefined,
    shortDescription: str(doc.shortDescription ?? doc.description),
    fullDescription: str(doc.fullDescription ?? doc.description),
    origin: str(doc.origin),
    popularityInIndia: str(doc.popularityInIndia),
    popularityWorldwide: str(doc.popularityWorldwide),
    icon: str(doc.icon),
    coverImage: str(doc.coverImage ?? doc.image),
    howToPlay: str(doc.howToPlay),
    objectiveOfGame: str(doc.objectiveOfGame),
    teamSize: str(doc.teamSize),
    matchDuration: str(doc.matchDuration),
    scoringSystem: str(doc.scoringSystem),
    playingSurface: str(doc.playingSurface),
    requiredEquipment: arr<string>(doc.requiredEquipment),
    ageGroups: str(doc.ageGroups),
    beginnerFriendly: bool(doc.beginnerFriendly),
    olympicSport: bool(doc.olympicSport),
    estimatedMonthlyCost: str(doc.estimatedMonthlyCost),
    playingSeason: str(doc.playingSeason) as 'All Year' | 'Seasonal',
    trainingFrequency: str(doc.trainingFrequency),
    averageLearningTime: str(doc.averageLearningTime),
    injuryRisk: str(doc.injuryRisk, 'Low') as 'Low' | 'Medium' | 'High',
    fitnessLevelRequired: str(doc.fitnessLevelRequired, 'Medium') as 'Low' | 'Medium' | 'High',
    suitableFor: arr<string>(doc.suitableFor) as ('Kids' | 'Teens' | 'Adults' | 'Seniors')[],
    individualOrTeam: normalizeParticipationType(doc.individualOrTeam ?? doc.participationType),
    indoorOutdoor: normalizeSportCategory(doc.indoorOutdoor ?? doc.category),
    physicalBenefits: arr<string>(doc.physicalBenefits),
    mentalBenefits: arr<string>(doc.mentalBenefits),
    skillsDeveloped: arr<string>(doc.skillsDeveloped),
    careerOpportunities: arr<string>(doc.careerOpportunities),
    scholarships: arr<string>(doc.scholarships),
    professionalLeagues: arr<string>(doc.professionalLeagues),
    tournaments: arr(doc.tournaments),
    competitionPathway: doc.competitionPathway && typeof doc.competitionPathway === 'object'
      ? doc.competitionPathway as Sport['competitionPathway']
      : { levels: [] },
    explorationGuidance: doc.explorationGuidance && typeof doc.explorationGuidance === 'object'
      ? doc.explorationGuidance as Sport['explorationGuidance']
      : undefined,
    status: str(doc.status, 'published') as SportStatus,
  };
}

function normalizeSportCategory(raw: unknown): SportCategory {
  if (typeof raw === 'string') {
    const lower = raw.toLowerCase();
    if (lower === 'indoor') return 'Indoor';
    if (lower === 'outdoor') return 'Outdoor';
    return 'Both';
  }
  return 'Both';
}

function normalizeSportType(raw: unknown): SportType {
  if (typeof raw === 'string') {
    const lower = raw.toLowerCase();
    if (lower === 'team') return 'team';
    if (lower === 'individual') return 'individual';
    return 'both';
  }
  return 'both';
}

function normalizeParticipationType(raw: unknown): 'Individual' | 'Team' | 'Both' {
  if (typeof raw === 'string') {
    const lower = raw.toLowerCase();
    if (lower === 'team') return 'Team';
    if (lower === 'individual') return 'Individual';
    return 'Both';
  }
  return 'Both';
}

// ─── Empty fallbacks ─────────────────────────────────────────

function emptyAcademy(): Academy {
  return {
    id: '',
    slug: '',
    name: 'Unnamed Academy',
    description: '',
    location: { city: 'Unknown', state: 'Unknown', country: 'India', lat: 0, lng: 0 },
    contact: {},
    sportsOffered: [],
    facilities: [],
    trainingLevels: [],
    certifications: [],
    verificationStatus: 'unverified',
    achievementSignals: {
      stateAthletesProduced: 0,
      nationalAthletesProduced: 0,
      competitionParticipations: [],
      milestones: [],
    },
    rating: { average: 0, count: 0 },
    gallery: [],
    sourceCount: 0,
    status: 'published',
    lastUpdatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
}

function emptyCoach(): Coach {
  return {
    id: '',
    slug: '',
    name: 'Unnamed Coach',
    certifications: [],
    experienceYears: 0,
    sportsCoached: [],
    specialization: [],
    location: { city: 'Unknown', state: 'Unknown', country: 'India', lat: 0, lng: 0 },
    contact: {},
    verificationStatus: 'unverified',
    rating: { average: 0, count: 0 },
    sourceCount: 0,
    status: 'published',
    lastUpdatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
}

function emptySport(): Sport {
  return {
    id: '',
    slug: '',
    name: 'Unnamed Sport',
    category: 'Both',
    sportType: 'both',
    shortDescription: '',
    fullDescription: '',
    origin: '',
    popularityInIndia: '',
    popularityWorldwide: '',
    icon: '',
    coverImage: '',
    howToPlay: '',
    objectiveOfGame: '',
    teamSize: '',
    matchDuration: '',
    scoringSystem: '',
    playingSurface: '',
    requiredEquipment: [],
    ageGroups: '',
    beginnerFriendly: false,
    olympicSport: false,
    estimatedMonthlyCost: '',
    playingSeason: 'All Year',
    trainingFrequency: '',
    averageLearningTime: '',
    injuryRisk: 'Low',
    fitnessLevelRequired: 'Medium',
    suitableFor: [],
    individualOrTeam: 'Both',
    indoorOutdoor: 'Both',
    physicalBenefits: [],
    mentalBenefits: [],
    skillsDeveloped: [],
    careerOpportunities: [],
    scholarships: [],
    professionalLeagues: [],
    tournaments: [],
    competitionPathway: { levels: [] },
    status: 'published',
  };
}

// ─── Batch normalization helpers ─────────────────────────────

export function normalizeAcademies(rawItems: unknown[]): Academy[] {
  return rawItems.map(normalizeAcademy);
}

export function normalizeCoaches(rawItems: unknown[]): Coach[] {
  return rawItems.map(normalizeCoach);
}

export function normalizeSports(rawItems: unknown[]): Sport[] {
  return rawItems.map(normalizeSport);
}
