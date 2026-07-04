'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { School, Trophy, MapPin } from 'lucide-react';
import { SearchAutocomplete } from '@/components/search/search-autocomplete';
import { ease } from '@/components/motion/constants';
import { useHomepageData } from '@/lib/hooks/use-homepage-data';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.emphasized } },
};

const shortcuts = [
  { label: 'Academies', href: '/academies', icon: School },
  { label: 'Sports', href: '/sports', icon: Trophy },
  { label: 'Cities', href: '/cities', icon: MapPin },
];

function formatCount(n: number): string {
  if (n >= 1000) {
    return `${Math.floor(n / 100) * 100}+`;
  }
  return `${n}+`;
}

export function Hero() {
  const reduced = useReducedMotion();
  const { academiesTotal, sportsTotal, loading } = useHomepageData();

  return (
    <section className="relative pt-16 pb-10 md:pt-24 md:pb-14">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <motion.div
          initial={reduced ? false : 'hidden'}
          animate="show"
          variants={reduced ? undefined : stagger}
          className="flex flex-col items-center"
        >
          <motion.h1
            variants={reduced ? undefined : fadeUp}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            style={{ textWrap: 'balance' }}
          >
            Find the Right Sports Academy
          </motion.h1>

          <motion.p
            variants={reduced ? undefined : fadeUp}
            className="text-muted-foreground mt-3 max-w-lg text-base sm:text-lg"
            style={{ textWrap: 'balance' }}
          >
            Verified academies, sports, and cities across India.
          </motion.p>
        </motion.div>

        {/* Search — the hero element */}
        <motion.div
          initial={reduced ? false : 'hidden'}
          animate="show"
          variants={reduced ? undefined : fadeUp}
          className="mt-7 w-full"
        >
          <SearchAutocomplete placeholder="Search academies, sports, cities…" size="lg" />
        </motion.div>

        {/* Quick navigation shortcuts */}
        <motion.div
          initial={reduced ? false : 'hidden'}
          animate="show"
          variants={reduced ? undefined : stagger}
          className="mt-5 flex items-center gap-3"
        >
          {shortcuts.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group border-border/60 bg-card/40 hover:border-primary/40 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:shadow-sm"
            >
              <s.icon className="text-muted-foreground h-4 w-4 transition-colors group-hover:text-primary" />
              {s.label}
            </Link>
          ))}
        </motion.div>

        {/* Subtle trust stats */}
        {!loading && (
          <motion.div
            initial={reduced ? false : 'hidden'}
            animate="show"
            variants={reduced ? undefined : stagger}
            className="mt-6 flex items-center gap-5 text-center"
          >
            <span className="text-muted-foreground text-sm">
              <span className="text-foreground font-semibold">{formatCount(academiesTotal)}</span> academies
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-muted-foreground text-sm">
              <span className="text-foreground font-semibold">{formatCount(sportsTotal)}</span> sports
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
