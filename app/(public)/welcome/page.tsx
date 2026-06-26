'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { AuthModal } from '@/components/auth/auth-modal';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Search, Trophy, ArrowRightLeft, ArrowRight } from 'lucide-react';
import { ease, duration } from '@/components/motion/constants';

const features = [
  { title: 'Find Academies', description: 'Discover top-rated sports academies near you', href: '/academies', icon: Search },
  { title: 'Explore Sports', description: 'Explore 20+ sports and find your passion', href: '/sports', icon: Trophy },
  { title: 'Compare Options', description: 'Side-by-side comparison for confident decisions', href: '/compare', icon: ArrowRightLeft },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: ease.athletic },
  },
};

const heroRevealVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: ease.emphasized },
  },
};

export default function WelcomePage() {
  const reduced = useReducedMotion();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace('/');
      return;
    }
    const timer = setTimeout(() => {
      setAuthModalOpen(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      {/* Subtle diagonal field line — sports-inspired accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="bg-primary/[0.04] absolute -left-32 top-0 h-[200%] w-px origin-top -rotate-[25deg]" />
        <div className="bg-primary/[0.04] absolute left-0 top-0 h-[200%] w-px origin-top -rotate-[25deg] translate-x-24" />
        <div className="bg-primary/[0.03] absolute -right-32 top-0 h-[200%] w-px origin-top rotate-[25deg]" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:py-24">
        <motion.div
          initial={reduced ? { opacity: 0 } : 'hidden'}
          animate={reduced ? { opacity: 1 } : 'show'}
          variants={reduced ? undefined : heroRevealVariants}
          className="w-full max-w-3xl text-center"
        >
          <motion.div
            variants={reduced ? undefined : staggerContainer}
            className="flex flex-col gap-5"
          >
            {/* Badge */}
            <motion.div
              variants={reduced ? undefined : { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: ease.snap } } }}
              className="mb-1 inline-flex items-center gap-2 self-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              The Sports Discovery Platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={reduced ? undefined : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: ease.emphasized } } }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              Your Sporting Journey{' '}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Starts Here
              </span>
            </motion.h1>

            {/* Supporting copy */}
            <motion.p
              variants={reduced ? undefined : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.standard, delay: 0.06 } } }}
              className="text-muted-foreground mx-auto max-w-xl text-lg sm:text-xl"
              style={{ textWrap: 'balance' }}
            >
              Find academies, explore sports, and compare
              options — all in one trusted platform.
            </motion.p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            variants={reduced ? undefined : staggerContainer}
            transition={{ delay: 0.12 }}
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={reduced ? undefined : featureCardVariants}
                  whileHover={reduced ? undefined : { y: -4, transition: { duration: duration.fast, ease: ease.athletic } }}
                  whileTap={reduced ? undefined : { scale: 0.985, transition: { duration: duration.micro } }}
                  className="group"
                >
                  <Link href={feature.href} className="block h-full">
                    <Card className="h-full border-border/60 bg-background/60 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3.5">
                          <div className="bg-primary/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 group-hover:bg-primary/15">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">{feature.title}</CardTitle>
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                            </div>
                            <CardDescription className="mt-0.5 text-sm leading-relaxed">{feature.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={reduced ? { opacity: 0, y: 12 } : 'hidden'}
            animate={reduced ? { opacity: 1, y: 0 } : 'show'}
            variants={reduced ? undefined : heroRevealVariants}
            transition={{ delay: 0.25 }}
            className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto min-w-[180px] gap-2"
              onClick={() => setAuthModalOpen(true)}
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[140px]">
                Login
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto min-w-[140px] text-muted-foreground">
                Explore as Guest
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground/60 mt-10 text-xs"
          >
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </motion.p>
        </motion.div>
      </main>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultView="choose"
      />
    </div>
  );
}
