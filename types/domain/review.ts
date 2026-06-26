export type ReviewTargetType = 'academy' | 'coach';

export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export type ReviewRelationship = 'parent' | 'athlete' | 'other';

export interface Review {
  id: string;
  targetType: ReviewTargetType;
  targetId: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  text?: string;
  photos: string[];
  parentName?: string;
  childAge?: number;
  sport?: string;
  relationship: ReviewRelationship;
  helpfulCount: number;
  reportedCount: number;
  isVerified: boolean;
  moderationStatus: ModerationStatus;
  moderatorId?: string;
  createdAt: string;
  updatedAt: string;
}
