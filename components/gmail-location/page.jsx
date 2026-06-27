// app/gmail-locations/page.jsx
'use client';
import { useState } from 'react';
import GmailLogin from '@/components/GmailLogin';
import UserLocation from '@/components/UserLocation';
import { fetchEmails, extractEmailText } from '@/lib/gmail';
import { summarizeLocations } from '@/lib/locationDetector';

export default function GmailLocationsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [perEmail, setPerEmail] = useState([]);
  const [grouped, setGrouped] = useState([]);
  const [tab, setTab] = useState('emails'); // 'emails' | 'summary'
  const [userLoc, setUserLoc] = useState(null);

  async function handleAuthSuccess(accessToken) {
    setLoading(true);
    setError(null);
    try {
      const rawEmails = await fetchEmails(accessToken, 50);
      const extracted = rawEmails.map((e) => extractEmailText(e));
      const { perEmail, grouped } = summarizeLocations(
        extracted.map((e) => ({ id: e.id, subject: e.subject, text: e.fullText }))
      );

      // attach snippet/from back for display
      const merged = perEmail.map((p) => {
        const orig = extracted.find((e) => e.id === p.id);
        return { ...p, snippet: orig?.snippet, from: orig?.from };
      });

      setPerEmail(merged);
      setGrouped(grouped);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong fetching emails.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>Gmail Location Detector</h1>

      <UserLocation onLocation={setUserLoc} />
      {userLoc && (
        <div
          style={{
            background: '#f0f6ff',
            border: '1px solid #d0e0ff',
            borderRadius: 8,
            padding: 10,
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          మీ ఇప్పటి location: {userLoc.address || `${userLoc.latitude}, ${userLoc.longitude}`}
        </div>
      )}

      {perEmail.length === 0 && (
        <GmailLogin
          onSuccess={handleAuthSuccess}
          onError={() => setError('Google sign-in failed. Please try again.')}
        />
      )}

      {loading && <p>Scanning your last 50 emails for locations…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {perEmail.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 8, margin: '20px 0' }}>
            <button onClick={() => setTab('emails')} style={tabStyle(tab === 'emails')}>
              Emails ({perEmail.length})
            </button>
            <button onClick={() => setTab('summary')} style={tabStyle(tab === 'summary')}>
              Location Summary ({grouped.length})
            </button>
          </div>

          {tab === 'emails' && (
            <div>
              {perEmail.map((e) => (
                <div
                  key={e.id}
                  style={{
                    border: e.hasLocation ? '2px solid #4285f4' : '1px solid #e0e0e0',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{e.subject || '(no subject)'}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{e.from}</div>
                  <div style={{ fontSize: 13, color: '#333', margin: '6px 0' }}>{e.snippet}</div>
                  {e.hasLocation && (
                    <div style={{ fontSize: 13 }}>
                      {e.places.length > 0 && (
                        <span>📍 {e.places.join(', ')}</span>
                      )}
                      {e.pincodes.length > 0 && (
                        <span style={{ marginLeft: 8 }}>📮 {e.pincodes.join(', ')}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'summary' && (
            <div>
              {grouped.length === 0 && <p>No locations detected in these emails.</p>}
              {grouped.map((g) => (
                <div
                  key={g.name}
                  style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}
                >
                  <div style={{ fontWeight: 600 }}>
                    📍 {g.name} <span style={{ color: '#888' }}>({g.count} email{g.count > 1 ? 's' : ''})</span>
                  </div>
                  <ul style={{ margin: '4px 0 0 18px', fontSize: 13, color: '#555' }}>
                    {g.emails.slice(0, 5).map((em) => (
                      <li key={em.id}>{em.subject || '(no subject)'}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function tabStyle(active) {
  return {
    padding: '8px 14px',
    borderRadius: 6,
    border: active ? '2px solid #4285f4' : '1px solid #ccc',
    background: active ? '#eef3ff' : '#fff',
    cursor: 'pointer',
    fontWeight: active ? 600 : 400,
  };
}
