'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, labels }: ProgressIndicatorProps) {
  const reduced = useReducedMotion();

  return (
    <div className="flex flex-col gap-2" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemax={totalSteps} aria-label={`Step ${currentStep + 1} of ${totalSteps}`}>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="relative h-1 flex-1 overflow-hidden rounded-full bg-muted">
            {reduced ? (
              <div
                className={cn(
                  'absolute inset-y-0 left-0 rounded-full transition-all duration-300',
                  i <= currentStep ? 'bg-primary' : 'bg-transparent',
                )}
                style={{ width: i < currentStep ? '100%' : i === currentStep ? '100%' : '0%' }}
              />
            ) : (
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: i <= currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.4, ease: [0.2, 0, 0, 1], delay: i === currentStep ? 0.1 : 0 }}
              />
            )}
          </div>
        ))}
      </div>
      {labels && labels[currentStep] && (
        <p className="text-muted-foreground text-xs">
          {labels[currentStep]} &middot; Step {currentStep + 1} of {totalSteps}
        </p>
      )}
    </div>
  );
}
