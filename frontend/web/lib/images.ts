/**
 * Image resolver — guarantees every entity has a local image to render.
 *
 * Hierarchy:
 *  1. The entity's own `coverImage` / `avatar` (a real file under /images/...)
 *  2. A sport-aware fallback to a known local asset
 *  3. An inline gradient + initial (handled by ImageWithFallback)
 *
 * All paths resolve to local files in /public. No runtime external URLs.
 */
import { academies } from '@/data/academies';
import { coaches } from '@/data/coaches';
import { sports } from '@/data/sports';

/**
 * Per-fixture lookup: the *guaranteed-resolving* local image path.
 * If the entity already has a coverImage, that wins. Otherwise we map to
 * a known local file under /public/images/{academies|coaches|sports}/.
 */
export const fixtureImages: {
  academies: Record<string, string>;
  coaches: Record<string, string>;
  sports: Record<string, string>;
} = {
  academies: Object.fromEntries(
    academies.map((a) => [a.id, a.coverImage ?? `/images/academies/${a.slug}.svg`]),
  ),
  coaches: Object.fromEntries(
    coaches.map((c) => [c.id, c.avatar ?? `/images/coaches/${c.slug}.svg`]),
  ),
  sports: Object.fromEntries(
    sports.map((s) => [s.id, s.coverImage ?? `/images/sports/${s.slug}.svg`]),
  ),
};
