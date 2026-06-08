'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const features = [
  { title: 'Find Academies', description: 'Discover top-rated sports academies near you' },
  { title: 'Discover Coaches', description: 'Connect with certified coaches across sports' },
  { title: 'Explore Sports', description: 'Explore 20+ sports and find your passion' },
  { title: 'Compare Options', description: 'Side-by-side comparison for confident decisions' },
];

const heroRevealVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.3, 0, 0, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } },
};

export default function WelcomePage() {
  const reduced = useReducedMotion();

  return (
    <div className="relative isolate min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:py-24">
        <motion.div
          initial={reduced ? { opacity: 0 } : 'hidden'}
          animate={reduced ? { opacity: 1 } : 'show'}
          variants={reduced ? undefined : heroRevealVariants}
          className="w-full max-w-3xl text-center"
        >
          <motion.div
            variants={reduced ? undefined : staggerContainer}
            className="flex flex-col gap-4"
          >
            <motion.div
              variants={reduced ? undefined : { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.2, 0, 0, 1] } } }}
              className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Welcome to SportsOS
            </motion.div>

            <motion.h1
              variants={reduced ? undefined : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.3, 0, 0, 1] } } }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance"
            >
              Discover Your{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary/80 bg-clip-text text-transparent">
                Sporting Journey
              </span>
            </motion.h1>

            <motion.p
              variants={reduced ? undefined : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1], delay: 0.1 } } }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
            >
              The premium platform for athletes and parents to find academies, discover coaches,
              explore sports, and compare options — all in one place.
            </motion.p>
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            variants={reduced ? undefined : staggerContainer}
            transition={{ delay: 0.15 }}
            className="mt-10 grid gap-4 sm:grid-cols-2"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={reduced ? undefined : featureCardVariants}
                className="group"
              >
                <Card className="h-full border-border/60 bg-background/60 backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 0, y: 16 } : 'hidden'}
            animate={reduced ? { opacity: 1, y: 0 } : 'show'}
            variants={reduced ? undefined : heroRevealVariants}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto min-w-[160px] gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="20" x2="20" y1="8" y2="14" />
                  <line x1="23" x2="17" y1="11" y2="11" />
                </svg>
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[160px]">
                Login
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto min-w-[160px]">
                Continue as Guest
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            transition={{ delay: 0.45 }}
            className="mt-10 text-sm text-muted-foreground/70"
          >
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}