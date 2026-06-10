'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ProgressIndicator } from './progress-indicator';
import { SharedLayout } from '@/components/motion/shared-layout';

interface WizardShellProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  title: string;
  subtitle?: string;
  onNext: () => void;
  onBack: () => void;
  canNext: boolean;
  isLastStep: boolean;
  children: React.ReactNode;
}

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export function WizardShell({
  currentStep,
  totalSteps,
  stepLabels,
  title,
  subtitle,
  onNext,
  onBack,
  canNext,
  isLastStep,
  children,
}: WizardShellProps) {
  const reduced = useReducedMotion();

  return (
    <SharedLayout layoutId="auth-card">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col gap-5 pt-6">
          <div className="flex flex-col gap-3">
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
              labels={stepLabels}
            />
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="text-muted-foreground mt-0.5 text-sm">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="relative min-h-[200px] overflow-hidden">
            <AnimatePresence mode="wait" custom={reduced ? 0 : 1}>
              <motion.div
                key={currentStep}
                custom={reduced ? 0 : 1}
                variants={reduced ? undefined : pageVariants}
                initial={reduced ? { opacity: 0 } : 'enter'}
                animate={reduced ? { opacity: 1 } : 'center'}
                exit={reduced ? { opacity: 0 } : 'exit'}
                transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={onBack} className="flex-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Button onClick={onNext} disabled={!canNext} className="flex-1 gap-2">
              {isLastStep ? 'Complete' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </SharedLayout>
  );
}
