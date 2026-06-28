'use client';

import * as React from 'react';
import { Star, Quote, Loader2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { getAcademies } from '@/lib/api/academies';
import { getReviews, type Review } from '@/lib/api/reviews';

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const academiesRes = await getAcademies({ pageSize: 50 });
        if (cancelled || !academiesRes.ok) { setLoading(false); return; }

        const topAcademies = academiesRes.data.items
          .sort((a, b) => b.rating.average - a.rating.average)
          .slice(0, 5);

        const reviewPromises = topAcademies.map((a) =>
          getReviews('academy', a.id, { sort: '-rating', limit: 2 })
        );
        const reviewResults = await Promise.all(reviewPromises);

        if (cancelled) return;

        const allReviews = reviewResults
          .filter((r) => r.ok)
          .flatMap((r) => r.data.reviews)
          .filter((r) => r.rating >= 4 && r.text)
          .sort((a, b) => b.rating - a.rating || b.helpfulCount - a.helpfulCount)
          .slice(0, 3);

        setTestimonials(allReviews);
      } catch {
        // fallback to empty
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <Section spacing="sm">
        <Container size="lg">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">What parents say</h2>
            <p className="text-muted-foreground text-xs">Trusted by families across India.</p>
          </div>
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </Container>
      </Section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <Section spacing="sm">
      <Container size="lg">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">What parents say</h2>
          <p className="text-muted-foreground text-xs">Trusted by families across India.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="border-border/60 bg-card/40 rounded-xl border p-4"
            >
              <Quote className="text-muted-foreground/20 h-8 w-8 mb-2" />
              {t.title && <p className="text-sm font-medium mb-1">{t.title}</p>}
              <p className="text-sm leading-relaxed mb-3">{t.text}</p>
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-3 w-3 ${
                      j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
                {t.isVerified && (
                  <span className="text-[9px] text-emerald-600 ml-1 font-medium">Verified</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold uppercase">
                  {t.parentName?.split(' ').map((n) => n[0]).join('') || t.userId?.name?.split(' ').map((n) => n[0]).join('') || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.parentName || t.userId?.name || 'Parent'}</p>
                  {t.sport && (
                    <p className="text-muted-foreground text-[11px]">Sport: {t.sport}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
