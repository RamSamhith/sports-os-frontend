/**
 * Cloudinary Image URL Builder
 *
 * Generates optimized Cloudinary URLs with:
 * - WebP/AVIF format negotiation
 * - Responsive sizes (srcset)
 * - Blur placeholders (base64)
 * - Automatic compression
 * - CDN delivery
 *
 * Usage:
 *   const src = cloudinaryUrl('academies/my-image', { width: 800, quality: 'auto' });
 *   const srcSet = cloudinarySrcSet('academies/my-image', [400, 800, 1200]);
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
const CLOUDINARY_BASE_URL = CLOUDINARY_CLOUD_NAME
  ? `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`
  : '';

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  blur?: boolean;
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
}

function buildTransformations(options: CloudinaryOptions = {}): string {
  const parts: string[] = [];

  // Size
  if (options.width) parts.push(`w_${options.width}`);
  if (options.height) parts.push(`h_${options.height}`);

  // Crop/resize
  if (options.width && options.height) {
    parts.push('c_fill');
  } else if (options.width) {
    parts.push('c_scale');
  }

  // Gravity
  if (options.gravity) parts.push(`g_${options.gravity}`);

  // Quality
  const quality = options.quality ?? 'auto';
  parts.push(`q_${quality}`);

  // Format
  const format = options.format ?? 'auto';
  parts.push(`f_${format}`);

  // Blur for placeholder
  if (options.blur) {
    parts.push('e_blur:200');
    parts.push('q_30');
  }

  return parts.join(',');
}

/**
 * Build a single Cloudinary URL.
 */
export function cloudinaryUrl(
  publicId: string,
  options: CloudinaryOptions = {}
): string {
  if (!CLOUDINARY_BASE_URL || !publicId) return '';

  // If the URL is already a full URL, return it
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId;
  }

  const transformations = buildTransformations(options);
  return `${CLOUDINARY_BASE_URL}/${transformations}/${publicId}`;
}

/**
 * Build a blur placeholder data URI.
 * Returns a tiny base64-encoded WebP image for LQIP.
 */
export function cloudinaryBlurPlaceholder(publicId: string): string {
  if (!CLOUDINARY_BASE_URL || !publicId) return '';

  if (publicId.startsWith('http://')) return '';

  const url = cloudinaryUrl(publicId, {
    width: 20,
    quality: 30,
    format: 'webp',
    blur: true,
  });

  return url;
}

/**
 * Build srcset for responsive images.
 * Returns a srcSet string and the default src.
 */
export function cloudinarySrcSet(
  publicId: string,
  widths: number[] = [400, 800, 1200, 1600],
  options: Omit<CloudinaryOptions, 'width'> = {}
): { src: string; srcSet: string; blurDataURL?: string } {
  if (!publicId || publicId.startsWith('http://')) {
    return {
      src: publicId || '',
      srcSet: '',
      blurDataURL: undefined,
    };
  }

  const src = cloudinaryUrl(publicId, { ...options, width: widths[1] || widths[0] });
  const srcSet = widths
    .map((w) => `${cloudinaryUrl(publicId, { ...options, width: w })} ${w}w`)
    .join(', ');

  const blurDataURL = cloudinaryBlurPlaceholder(publicId) || undefined;

  return { src, srcSet, blurDataURL };
}

/**
 * Check if Cloudinary is configured.
 */
export function isCloudinaryConfigured(): boolean {
  return !!CLOUDINARY_CLOUD_NAME;
}
