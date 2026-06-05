export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string;
  deviceInfo?: string;
  ipHash?: string;
  expiresAt: string;
  revokedAt?: string;
  createdAt: string;
}
