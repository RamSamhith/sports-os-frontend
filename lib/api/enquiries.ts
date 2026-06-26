import { post, get } from './client';
import type { ApiResponse } from './client';
import type { Enquiry } from '@/types/domain/enquiry';

export interface EnquiryCreatePayload {
  targetType: 'academy' | 'coach';
  targetId: string;
  intent?: 'contact' | 'callback' | 'trial' | 'enrollment_interest' | 'whatsapp';
  parentInfo: { name: string; email: string; phone: string };
  childInfo?: { name: string; age?: number };
  sportInterest: string;
  message?: string;
}

export interface EnquiryCreateResponse {
  enquiryId: string;
  leadId: string | null;
  whatsappConfirmationSent: boolean;
}

export async function createEnquiry(
  payload: EnquiryCreatePayload,
): Promise<ApiResponse<EnquiryCreateResponse>> {
  return post<EnquiryCreateResponse>('/enquiries', payload);
}

export async function getMyEnquiries(): Promise<ApiResponse<Enquiry[]>> {
  return get<Enquiry[]>('/enquiries/me');
}
