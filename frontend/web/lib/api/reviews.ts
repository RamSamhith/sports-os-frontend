import { post, get, put, del } from './client';
import type { ApiResponse } from './client';

export interface Review {
  id: string;
  userId: { _id: string; name: string; avatar?: string };
  targetId: string;
  targetType: 'academy' | 'coach';
  rating: number;
  title?: string;
  text?: string;
  photos: string[];
  parentName?: string;
  childAge?: number;
  sport?: string;
  relationship: 'parent' | 'athlete' | 'other';
  helpfulCount: number;
  reportedCount: number;
  isVerified: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
}

export interface ReviewCreatePayload {
  targetId: string;
  targetType: 'academy' | 'coach';
  rating: number;
  title?: string;
  text?: string;
  photos?: string[];
  parentName?: string;
  childAge?: number;
  sport?: string;
  relationship?: 'parent' | 'athlete' | 'other';
}

export async function getReviews(
  targetType: string,
  targetId: string,
  params?: { sort?: string; limit?: number; skip?: number },
): Promise<ApiResponse<ReviewsResponse>> {
  const query: Record<string, string> = {};
  if (params?.sort) query.sort = params.sort;
  if (params?.limit) query.limit = String(params.limit);
  if (params?.skip) query.skip = String(params.skip);
  return get<ReviewsResponse>(`/reviews/${targetType}/${targetId}`, query);
}

export async function createReview(
  payload: ReviewCreatePayload,
): Promise<ApiResponse<{ reviewId: string }>> {
  return post<{ reviewId: string }>('/reviews', payload);
}

export async function updateReview(
  id: string,
  payload: Partial<Pick<ReviewCreatePayload, 'rating' | 'title' | 'text' | 'photos'>>,
): Promise<ApiResponse<Review>> {
  return put<Review>(`/reviews/${id}`, payload);
}

export async function deleteReview(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  return del<{ deleted: boolean }>(`/reviews/${id}`);
}

export async function getMyReviews(): Promise<ApiResponse<Review[]>> {
  return get<Review[]>('/reviews/me');
}
