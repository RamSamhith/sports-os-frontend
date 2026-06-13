import type { LocationSummary } from './location';
import type { Rating } from './common';
import type { Certification, VerificationStatus } from './academy';

export type CoachStatus = 'draft' | 'published' | 'suspended';

export interface Coach {
  id: string;
  slug: string;
  name: string;
  avatar?: string;
  certifications: Certification[];
  experienceYears: number;
  sportsCoached: string[]; // sport slugs
  specialization: string[];
  academyId?: string;
  location: LocationSummary;
  contact: {
    phone?: string;
    email?: string;
  };
  verificationStatus: VerificationStatus;
  rating: Rating;
  sourceCount: number;
  dataProvenance?: {
    sourceType?: string;
    sourceUrl?: string;
    confidenceScore?: number;
    lastVerifiedAt?: string;
  }[];
  status: CoachStatus;
  lastUpdatedAt: string;
  createdAt: string;
}
