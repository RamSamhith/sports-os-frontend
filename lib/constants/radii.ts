import type { Radius } from '@/types/domain/location';

export const DEFAULT_RADIUS: Radius = 5;
export const RADIUS_OPTIONS: Radius[] = [5, 10, 15, 25];

export function shouldAutoExpand(resultsCount: number, threshold = 5): boolean {
  return resultsCount < threshold;
}
