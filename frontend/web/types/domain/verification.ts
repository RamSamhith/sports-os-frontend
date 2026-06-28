import type { VerificationEvidence } from './academy';

export type VerificationCaseStatus =
  | 'queued'
  | 'under_review'
  | 'needs_info'
  | 'verified'
  | 'rejected';

export interface VerificationCase {
  id: string;
  targetType: 'academy' | 'coach';
  targetId: string;
  status: VerificationCaseStatus;
  submittedAt: string;
  assignedTo?: string;
  decidedAt?: string;
  evidence: VerificationEvidence[];
  reviewerNotes?: string;
  decisionReason?: string;
  auditLogId?: string;
}
