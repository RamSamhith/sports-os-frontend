/**
 * Gmail API helpers — frontend-only.
 *
 * Uses the OAuth access token obtained via Google Identity Services
 * (google.accounts.oauth2) to call the Gmail REST API directly.
 *
 * SECURITY: The access token lives in React state only (never localStorage).
 * It is short-lived (~1 hour) and automatically refreshed by GIS.
 */

const GMAIL_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

// ─── Types ─────────────────────────────────────────────────────

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload?: {
    headers?: Array<{ name: string; value: string }>;
    mimeType?: string;
    body?: { data?: string };
    parts?: GmailMessagePart[];
  };
}

export interface GmailMessagePart {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailMessagePart[];
}

export interface ExtractedEmail {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  fullText: string;
}

// ─── Internal helpers ──────────────────────────────────────────

async function gmailFetch(url: string, accessToken: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gmail API error ${res.status}: ${body}`);
  }
  return res.json();
}

function decodeBase64Url(data: string): string {
  try {
    const normalized = data.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
  } catch {
    return '';
  }
}

function walkParts(part: GmailMessagePart, acc: string[]): void {
  if (!part) return;
  if (
    part.body?.data &&
    (part.mimeType === 'text/plain' || part.mimeType === 'text/html')
  ) {
    acc.push(decodeBase64Url(part.body.data));
  }
  if (part.parts) {
    part.parts.forEach((p) => walkParts(p, acc));
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ');
}

// ─── Public API ────────────────────────────────────────────────

/**
 * Fetch the most recent N email messages (full payload) for the signed-in user.
 * Fetches in parallel chunks of 10 to respect Gmail rate limits.
 */
export async function fetchEmails(
  accessToken: string,
  maxResults = 50,
): Promise<GmailMessage[]> {
  const list = (await gmailFetch(
    `${GMAIL_BASE}/messages?maxResults=${maxResults}`,
    accessToken,
  )) as { messages?: Array<{ id: string }> };

  if (!list.messages || list.messages.length === 0) return [];

  const CHUNK = 10;
  const results: GmailMessage[] = [];
  for (let i = 0; i < list.messages.length; i += CHUNK) {
    const chunk = list.messages.slice(i, i + CHUNK);
    const chunkResults = await Promise.all(
      chunk.map((m) =>
        gmailFetch(`${GMAIL_BASE}/messages/${m.id}?format=full`, accessToken),
      ),
    );
    results.push(...(chunkResults as GmailMessage[]));
  }
  return results;
}

/**
 * Extract subject, from, snippet, and plain-text body from a Gmail message.
 */
export function extractEmailText(email: GmailMessage): ExtractedEmail {
  const headers = email.payload?.headers || [];
  const subject = headers.find((h) => h.name === 'Subject')?.value || '';
  const from = headers.find((h) => h.name === 'From')?.value || '';
  const snippet = email.snippet || '';

  const bodyParts: string[] = [];
  if (email.payload) walkParts(email.payload, bodyParts);
  const body = stripHtml(bodyParts.join(' '));

  return {
    id: email.id,
    subject,
    from,
    snippet,
    fullText: `${subject} ${snippet} ${body}`,
  };
}
