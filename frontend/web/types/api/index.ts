import type { EnquiryIntent, EnquiryTargetType } from '@/types/domain/enquiry';

export type { ApiSuccess, ApiFailure, ApiResponse, ListResponse } from '@/lib/api/client';

export interface SearchSuggestRequest {
  query: string;
  entity?: 'academy' | 'coach' | 'sport' | 'all';
  limit?: number;
}

export interface SearchSuggestResponse {
  suggestions: Array<{
    entity: 'academy' | 'coach' | 'sport';
    id: string;
    slug: string;
    label: string;
    sublabel?: string;
  }>;
}

export interface EnquiryCreateRequest {
  targetType: EnquiryTargetType;
  targetId: string;
  intent: EnquiryIntent;
  parentInfo: { name: string; email: string; phone: string };
  childInfo?: { name: string; age: number };
  sportInterest: string;
  message?: string;
}

export interface EnquiryCreateResponse {
  enquiryId: string;
  leadId: string;
  whatsappConfirmationSent: boolean;
}
