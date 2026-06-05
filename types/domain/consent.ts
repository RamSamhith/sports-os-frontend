export type ConsentCategory = 'analytics' | 'marketing' | 'whatsapp';

export interface ConsentRecord {
  id: string;
  userId?: string;
  sessionId?: string;
  category: ConsentCategory;
  granted: boolean;
  version: string;
  createdAt: string;
}
