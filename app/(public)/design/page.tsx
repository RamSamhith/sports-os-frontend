import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { DesignContent } from './design-content';

export const metadata: Metadata = buildPageMetadata({
  title: 'Design System',
  description: 'SportsOS design system — tokens, components, motion, and patterns.',
  path: '/design',
  noIndex: true,
});

export default function DesignSystemPage() {
  return <DesignContent />;
}
