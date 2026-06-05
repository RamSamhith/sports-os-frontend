import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export interface PageMetadataInput {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const title = input.title.includes(siteConfig.name) ? input.title : `${input.title} · ${siteConfig.name}`;
  const description = input.description ?? siteConfig.description;
  const url = input.path ? `${siteConfig.url}${input.path}` : siteConfig.url;
  const image = input.image ?? `${siteConfig.url}/og.png`;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: siteConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: input.noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  };
}
