'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SearchAutocomplete } from '@/components/search/search-autocomplete';
import { AuroraBackground } from '@/components/layout/aurora-background';
import { TrackedCTA } from '@/components/analytics/tracked-cta';
import { ease } from '@/components/motion/constants';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: ease.emphasized },
  },
};

const badgeVariant = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: ease.snap } },
};

export function Hero() {
  const router = useRouter();
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden py-12 md:py-20 ambient-shimmer">
      <AuroraBackground />

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-primary/[0.04] absolute -left-20 top-0 h-[180%] w-px origin-top -rotate-[22deg]" />
        <div className="bg-primary/[0.03] absolute -right-20 top-0 h-[180%] w-px origin-top rotate-[22deg]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={reduced ? false : 'hidden'}
          animate="show"
          variants={reduced ? undefined : staggerContainer}
          className="flex flex-col items-center"
        >
          <motion.span
            variants={reduced ? undefined : badgeVariant}
            className="border-border/60 bg-card/40 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
          >
            <span className="bg-primary h-1.5 w-1.5 rounded-full" />
            Trusted by athletes across India
          </motion.span>

          <motion.h1
            variants={reduced ? undefined : fadeUp}
            className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl"
            style={{ textWrap: 'balance' }}
          >
            Find the right sports ecosystem for you.
          </motion.h1>

          <motion.p
            variants={reduced ? undefined : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: ease.standard, delay: 0.06 } } }}
            className="text-muted-foreground mt-3 max-w-xl text-base md:text-lg"
            style={{ textWrap: 'balance' }}
          >
            Academies, sports, and pathways across India — in one trusted place.
          </motion.p>
        </motion.div>

        <motion.div
          initial={reduced ? false : 'hidden'}
          animate="show"
          variants={reduced ? undefined : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.standard, delay: 0.12 } } }}
          className="mt-6 w-full max-w-xl"
        >
          <SearchAutocomplete placeholder="Search academies, sports, cities…" size="lg" />
        </motion.div>

        <motion.div
          initial={reduced ? false : 'hidden'}
          animate="show"
          variants={reduced ? undefined : staggerContainer}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <TrackedCTA event="home.cta_click" properties={{ cta: 'explore-academies' }} asChild>
            <Link href="/academies" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 min-h-[44px]">
              Explore Academies <ArrowRight className="h-4 w-4" />
            </Link>
          </TrackedCTA>
        </motion.div>
      </div>
    </section>
  );
}
