export type ReviewTargetType = 'academy' | 'coach';

export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  targetType: ReviewTargetType;
  targetId: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: string;
  moderationStatus: ModerationStatus;
  moderatorId?: string;
}
