import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0f172a 60%, #0a0a0a 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, opacity: 0.9 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
            }}
          />
          <div>{siteConfig.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            {siteConfig.tagline}
          </div>
          <div style={{ fontSize: 28, opacity: 0.7 }}>{siteConfig.description}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, opacity: 0.6 }}>
          <div>{siteConfig.url.replace(/^https?:\/\//, '')}</div>
          <div>Discover · Compare · Connect</div>
        </div>
      </div>
    ),
    size,
  );
}
