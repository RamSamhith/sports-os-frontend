import type { AcademySuggestions, CoachSuggestions } from '@/lib/utils/matching';
import type { ApiResponse } from './client';

export interface RecommendationContext {
  userId?: string;
  childId?: string;
  sport?: string;
  city?: string;
  skillLevel?: string;
  age?: number;
}

export async function getAcademyRecommendations(
  ctx?: RecommendationContext,
): Promise<ApiResponse<AcademySuggestions>> {
  const { get } = await import('./client');
  const params: Record<string, string> = {};
  if (ctx?.userId) params.userId = ctx.userId;
  if (ctx?.childId) params.childId = ctx.childId;
  if (ctx?.sport) params.sport = ctx.sport;
  if (ctx?.city) params.city = ctx.city;
  if (ctx?.skillLevel) params.skillLevel = ctx.skillLevel;
  if (ctx?.age !== undefined) params.age = String(ctx.age);
  return get<AcademySuggestions>('/recommendations/academies', params);
}

export async function getCoachRecommendations(
  ctx?: RecommendationContext,
): Promise<ApiResponse<CoachSuggestions>> {
  const { get } = await import('./client');
  const params: Record<string, string> = {};
  if (ctx?.userId) params.userId = ctx.userId;
  if (ctx?.childId) params.childId = ctx.childId;
  if (ctx?.sport) params.sport = ctx.sport;
  if (ctx?.city) params.city = ctx.city;
  if (ctx?.skillLevel) params.skillLevel = ctx.skillLevel;
  if (ctx?.age !== undefined) params.age = String(ctx.age);
  return get<CoachSuggestions>('/recommendations/coaches', params);
}
