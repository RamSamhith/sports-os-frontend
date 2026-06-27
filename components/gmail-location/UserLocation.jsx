// components/UserLocation.jsx
'use client';
import { useState } from 'react';

export default function UserLocation({ onLocation }) {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  function detectLocation() {
    if (!('geolocation' in navigator)) {
      setError('మీ బ్రౌజర్ Geolocation support చేయడం లేదు.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });

        // Reverse geocode using OpenStreetMap Nominatim (free, no API key).
        // For production scale, swap this for Google Geocoding API.
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const display = data.display_name || null;
          setAddress(display);
          onLocation?.({ latitude, longitude, address: display });
        } catch {
          onLocation?.({ latitude, longitude, address: null });
        }

        setStatus('done');
      },
      (err) => {
        setError(
          err.code === 1
            ? 'Location permission denied చేశారు. Browser settings లో allow చేయండి.'
            : 'Location fetch చేయడంలో సమస్య వచ్చింది.'
        );
        setStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={detectLocation}
        disabled={status === 'loading'}
        style={{
          padding: '8px 14px',
          borderRadius: 8,
          border: '1px solid #dadce0',
          background: '#fff',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        {status === 'loading' ? 'Detecting…' : '📍 Detect my current location'}
      </button>

      {status === 'done' && coords && (
        <div style={{ marginTop: 8, fontSize: 14 }}>
          <div>
            Lat/Lng: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
          </div>
          {address && <div>Address: {address}</div>}
        </div>
      )}

      {status === 'error' && (
        <div style={{ marginTop: 8, color: 'crimson', fontSize: 14 }}>{error}</div>
      )}
    </div>
  );
}
