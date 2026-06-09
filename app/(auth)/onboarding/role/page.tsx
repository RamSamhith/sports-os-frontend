'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SharedLayout } from '@/components/motion/shared-layout';
import { cn } from '@/lib/utils/cn';
import { Check, ArrowRight, User, Users } from 'lucide-react';
import { useAuth, type OnboardingRole } from '@/lib/hooks/use-auth';

type Role = OnboardingRole;

const roles: {
  id: Role;
  label: string;
  icon: typeof User;
  description: string;
  benefits: string[];
}[] = [
  {
    id: 'athlete',
    label: 'Athlete',
    icon: User,
    description: 'I am pursuing sports for myself.',
    benefits: ['Discover sports', 'Find academies', 'Compare options', 'Track your journey'],
  },
  {
    id: 'parent',
    label: 'Parent',
    icon: Users,
    description: 'I am managing sports opportunities for my child.',
    benefits: ['Manage children', 'Compare academies', 'Track progress', 'Plan pathways'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.2, 0, 0, 1] },
  },
};

const checkVariants = {
  unchecked: { scale: 0, opacity: 0 },
  checked: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.3, 0, 0, 1] } },
};

const titleVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.3, 0, 0, 1] } },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] } },
};

const footerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
};

export default function RoleSelectionPage() {
  const reduced = useReducedMotion();
  const router = useRouter();
  const { setRole } = useAuth();
  const [selected, setSelected] = useState<Role | null>(null);

  function handleSelect(role: Role) {
    setSelected(role);
  }

  function handleKeyDown(e: React.KeyboardEvent, role: Role) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(role);
    }
  }

  function handleContinue() {
    if (!selected) return;
    setRole(selected);
    router.push('/profile/personal');
  }

  return (
    <SharedLayout layoutId="auth-card">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6">
          <motion.div
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            variants={reduced ? undefined : badgeVariants}
            className="mb-1 flex items-center justify-center gap-2"
          >
            <span className="bg-primary/10 ring-primary/30 relative flex h-8 w-8 items-center justify-center rounded-lg ring-1">
              <User className="h-4 w-4 text-primary" />
            </span>
            <span className="text-primary text-sm font-medium">Set up your profile</span>
          </motion.div>

          <motion.h1
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            variants={reduced ? undefined : titleVariants}
            transition={{ delay: 0.05 }}
            className="text-2xl font-bold tracking-tight text-center"
          >
            Who are you?
          </motion.h1>

          <motion.p
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            variants={reduced ? undefined : subtitleVariants}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1 text-center text-sm"
          >
            Choose the option that best describes you
          </motion.p>

          <motion.div
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            variants={reduced ? undefined : containerVariants}
            className="mt-6 grid gap-4 sm:grid-cols-2"
            role="radiogroup"
            aria-label="Select your role"
          >
            {roles.map((role) => {
              const isSelected = selected === role.id;
              const Icon = role.icon;

              return (
                <motion.div
                  key={role.id}
                  variants={reduced ? undefined : cardVariants}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, role.id)}
                  onClick={() => handleSelect(role.id)}
                  whileHover={
                    reduced
                      ? undefined
                      : { y: -4, scale: 1.01, transition: { duration: 0.18, ease: [0.2, 0, 0, 1] } }
                  }
                  whileTap={reduced ? undefined : { scale: 0.995 }}
                  className={cn(
                    'group relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 outline-none',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                      : 'border-border/60 bg-background/60 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5',
                  )}
                >
                  {/* Glow effect on hover / selected */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300',
                      'bg-gradient-to-br from-primary/5 via-transparent to-accent/5',
                      isSelected ? 'opacity-100' : 'group-hover:opacity-60',
                    )}
                  />

                  <div className="relative z-10">
                    <div className="mb-3 flex items-center justify-between">
                      <div
                        className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-200',
                          isSelected
                            ? 'bg-primary/15 text-primary'
                            : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <AnimatePresence mode="wait">
                        {isSelected ? (
                          <motion.span
                            key="check"
                            variants={reduced ? undefined : checkVariants}
                            initial="unchecked"
                            animate="checked"
                            exit="unchecked"
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary"
                          >
                            <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-6 w-6 rounded-full border-2 border-muted-foreground/30"
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    <h2 className="text-lg font-semibold">{role.label}</h2>
                    <p className="text-muted-foreground mt-0.5 text-sm">{role.description}</p>

                    <ul className="mt-3 space-y-1.5">
                      {role.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm">
                          <span
                            className={cn(
                              'flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
                              isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground',
                            )}
                          >
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          </span>
                          <span className={isSelected ? 'text-foreground' : 'text-muted-foreground'}>
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            variants={reduced ? undefined : buttonVariants}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Button
              className="w-full gap-2"
              size="lg"
              disabled={!selected}
              onClick={handleContinue}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.p
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            variants={reduced ? undefined : footerVariants}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mt-4 text-center text-xs"
          >
            You can change this later in your profile settings
          </motion.p>
        </CardContent>
      </Card>
    </SharedLayout>
  );
}
