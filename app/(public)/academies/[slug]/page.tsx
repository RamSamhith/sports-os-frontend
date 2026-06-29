import type { Metadata } from 'next';
import { getAcademy } from '@/lib/api/academies';
import { siteConfig } from '@/config/site';
import { AcademyDetailView } from '@/components/academy/academy-detail-view';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getAcademy(slug);

  if (!res.ok || !res.data) {
    return {
      title: 'Academy Not Found',
      description: 'The academy you are looking for could not be found.',
    };
  }

  const academy = res.data;
  const title = `${academy.name} - Sports Academy in ${academy.location.city}`;
  const description = (academy?.description ?? '').slice(0, 160)
    || `Find ${academy.name} in ${academy.location.city}, ${academy.location.state}. Sports: ${(academy.sportsOffered ?? []).join(', ')}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/academies/${academy.slug}`,
      siteName: siteConfig.name,
      images: academy.coverImage ? [{ url: academy.coverImage, width: 1200, height: 630 }] : [],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: academy.coverImage ? [academy.coverImage] : [],
    },
    alternates: {
      canonical: `${siteConfig.url}/academies/${academy.slug}`,
    },
  };
}

export default async function AcademyDetailPage({ params }: Props) {
  const { slug } = await params;

  const res = await getAcademy(slug);
  const academy = res.ok ? res.data : null;

  const jsonLd = academy
    ? {
        '@context': 'https://schema.org',
        '@type': 'SportsActivityLocation',
        name: academy.name,
        description: academy.description || undefined,
        url: `${siteConfig.url}/academies/${academy.slug}`,
        image: academy.coverImage || undefined,
        address: {
          '@type': 'PostalAddress',
          streetAddress: academy.location.address,
          addressLocality: academy.location.city,
          addressRegion: academy.location.state,
          addressCountry: academy.location.country,
        },
        geo: academy.location.lat && academy.location.lng
          ? { '@type': 'GeoCoordinates', latitude: academy.location.lat, longitude: academy.location.lng }
          : undefined,
        aggregateRating: (academy.rating?.count ?? 0) > 0
          ? {
              '@type': 'AggregateRating',
              ratingValue: academy.rating?.average ?? 0,
              reviewCount: academy.rating?.count ?? 0,
            }
          : undefined,
        sport: academy.sportsOffered,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <AcademyDetailView slug={slug} />
    </>
  );
}
