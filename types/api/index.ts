import type { Pagination } from '@/types/domain/common';
import type { EnquiryIntent, EnquiryTargetType } from '@/types/domain/enquiry';

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface ListResponse<T> {
  items: T[];
  pagination: Pagination;
}

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
