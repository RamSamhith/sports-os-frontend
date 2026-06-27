// lib/gmail.js
// Frontend-only Gmail fetch helpers (uses the OAuth access_token from
// @react-oauth/google's useGoogleLogin).

const GMAIL_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

async function gmailFetch(url, accessToken) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gmail API error ${res.status}: ${body}`);
  }
  return res.json();
}

/**
 * Fetch the most recent N emails (full payload) for the signed-in user.
 */
export async function fetchEmails(accessToken, maxResults = 50) {
  const list = await gmailFetch(
    `${GMAIL_BASE}/messages?maxResults=${maxResults}`,
    accessToken
  );

  if (!list.messages || list.messages.length === 0) return [];

  // Gmail API has no batch-get in plain REST, so fetch in parallel chunks
  // to avoid hammering the rate limit.
  const CHUNK = 10;
  const results = [];
  for (let i = 0; i < list.messages.length; i += CHUNK) {
    const chunk = list.messages.slice(i, i + CHUNK);
    const chunkResults = await Promise.all(
      chunk.map((m) =>
        gmailFetch(`${GMAIL_BASE}/messages/${m.id}?format=full`, accessToken)
      )
    );
    results.push(...chunkResults);
  }
  return results;
}

function decodeBase64Url(data) {
  try {
    const normalized = data.replace(/-/g, '+').replace(/_/g, '/');
    // atob is available in browser environments
    return decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
  } catch {
    return '';
  }
}

function walkParts(part, acc) {
  if (!part) return;
  if (part.body?.data && (part.mimeType === 'text/plain' || part.mimeType === 'text/html')) {
    acc.push(decodeBase64Url(part.body.data));
  }
  if (part.parts) {
    part.parts.forEach((p) => walkParts(p, acc));
  }
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ');
}

/**
 * Pull subject + snippet + plain-text body out of a Gmail message object.
 */
export function extractEmailText(email) {
  const headers = email.payload?.headers || [];
  const subject = headers.find((h) => h.name === 'Subject')?.value || '';
  const from = headers.find((h) => h.name === 'From')?.value || '';
  const snippet = email.snippet || '';

  const bodyParts = [];
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
