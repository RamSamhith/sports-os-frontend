/**
 * CSRF token placeholder. The real implementation will use double-submit cookies or a
 * server-stored token tied to the session.
 */
export function generateCsrfToken(): string {
  const arr = new Uint8Array(32);
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}
