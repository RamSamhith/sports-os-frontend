import type { LocationSummary } from './location';
import type { Rating } from './common';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type AcademyStatus = 'draft' | 'published' | 'suspended';

export type Facility =
  | 'indoor'
  | 'outdoor'
  | 'ground'
  | 'court'
  | 'equipment'
  | 'changing_room'
  | 'parking'
  | 'physio'
  | 'gym';

export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  documentUrl?: string;
}

export interface AchievementSignals {
  stateAthletesProduced: number;
  nationalAthletesProduced: number;
  competitionParticipations: string[];
  milestones: string[];
}

export interface Academy {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: LocationSummary;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  sportsOffered: string[]; // sport slugs
  facilities: Facility[];
  trainingLevels: TrainingLevel[];
  batchInformation?: string;
  certifications: Certification[];
  verificationStatus: VerificationStatus;
  verificationEvidence?: VerificationEvidence[];
  achievementSignals: AchievementSignals;
  rating: Rating;
  coverImage?: string;
  gallery: string[];
  status: AcademyStatus;
  lastUpdatedAt: string;
  createdAt: string;
  indexedAt?: string;
}

export interface VerificationEvidence {
  id: string;
  type: 'document' | 'image' | 'note';
  url?: string;
  text?: string;
  uploadedBy: string;
  uploadedAt: string;
  hash?: string;
}
