export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'verify'
  | 'reject'
  | 'suspend'
  | 'restore'
  | 'assign'
  | 'status_change';

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  diff?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
  ip?: string;
  userAgent?: string;
  reason?: string;
  createdAt: string;
}
