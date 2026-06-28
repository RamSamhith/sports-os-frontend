/**
 * Sanitizers and guards. These are conservative placeholders; the real implementation
 * will use a vetted HTML sanitizer (e.g. DOMPurify on the server).
 */

const ALLOWED_TAGS = new Set([
  'b', 'strong', 'i', 'em', 'u', 'br', 'p', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
]);

export function stripUnsafeHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<([a-z][a-z0-9]*)([^>]*)>/gi, (match, tag: string) =>
      ALLOWED_TAGS.has(tag.toLowerCase()) ? match : '',
    )
    .replace(/ on[a-z]+="[^"]*"/gi, '')
    .replace(/ on[a-z]+='[^']*'/gi, '');
}

export function safeText(input: string | undefined | null, fallback = ''): string {
  if (!input) return fallback;
  return stripUnsafeHtml(input);
}
