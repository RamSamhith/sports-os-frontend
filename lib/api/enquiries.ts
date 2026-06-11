import type { Enquiry } from '@/types/domain/enquiry';
import type { EnquiryCreateRequest, EnquiryCreateResponse } from '@/types/api';
import type { ApiResponse } from './client';

export async function getEnquiries(): Promise<ApiResponse<Enquiry[]>> {
  const { get } = await import('./client');
  return get<Enquiry[]>('/enquiries');
}

export async function createEnquiry(data: EnquiryCreateRequest): Promise<ApiResponse<EnquiryCreateResponse>> {
  const { post } = await import('./client');
  return post<EnquiryCreateResponse>('/enquiries', data);
}
