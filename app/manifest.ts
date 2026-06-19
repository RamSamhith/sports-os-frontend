import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'SportsOS',
    description: siteConfig.description,
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    background_color: '#0B1020',
    theme_color: '#0B1020',
    orientation: 'any',
    categories: ['education', 'sports', 'lifestyle'],
    lang: 'en-IN',
    dir: 'ltr',
    prefer_related_applications: false,
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Search Academies',
        short_name: 'Search',
        url: '/search',
        description: 'Search for sports academies across India',
      },
      {
        name: 'Compare',
        short_name: 'Compare',
        url: '/compare',
        description: 'Compare academies and coaches side by side',
      },
      {
        name: 'My Shortlist',
        short_name: 'Shortlist',
        url: '/shortlist',
        description: 'View your saved shortlisted academies',
      },
    ],
  };
}
