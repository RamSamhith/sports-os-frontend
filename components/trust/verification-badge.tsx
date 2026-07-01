import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type VerificationStep = 'pending' | 'documents_submitted' | 'under_review' | 'verified' | 'rejected';

export interface VerificationFlowProps {
  currentStep: VerificationStep;
  className?: string;
}

const STEPS: { key: VerificationStep; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'documents_submitted', label: 'Documents Submitted' },
  { key: 'under_review', label: 'Under Review' },
];

const REJECTED_STEP = { key: 'rejected' as const, label: 'Rejected' };
const VERIFIED_STEP = { key: 'verified' as const, label: 'Verified' };

function stepIndex(step: VerificationStep): number {
  if (step === 'rejected' || step === 'verified') return 3;
  return STEPS.findIndex((s) => s.key === step);
}

function StatusIcon({ status }: { status: 'completed' | 'current' | 'upcoming' | 'rejected' }) {
  if (status === 'completed') {
    return <CheckCircle2 className="h-5 w-5 text-success" />;
  }
  if (status === 'rejected') {
    return <XCircle className="h-5 w-5 text-destructive" />;
  }
  if (status === 'current') {
    return (
      <span className="relative flex h-5 w-5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75" />
        <Circle className="relative h-5 w-5 text-primary fill-primary" />
      </span>
    );
  }
  return <Circle className="h-5 w-5 text-muted-foreground/40" />;
}

export function VerificationFlow({ currentStep, className }: VerificationFlowProps) {
  const currentIdx = stepIndex(currentStep);
  const isRejected = currentStep === 'rejected';
  const isVerified = currentStep === 'verified';
  const terminalStep = isRejected ? REJECTED_STEP : isVerified ? VERIFIED_STEP : null;

  const displaySteps = terminalStep ? [...STEPS, terminalStep] : STEPS;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {displaySteps.map((step, i) => {
        const idx = i;
        let status: 'completed' | 'current' | 'upcoming' | 'rejected' = 'upcoming';

        if (isRejected && step.key === 'rejected') {
          status = 'rejected';
        } else if (isVerified && step.key === 'verified') {
          status = 'completed';
        } else if (idx < currentIdx) {
          status = 'completed';
        } else if (idx === currentIdx) {
          status = 'current';
        }

        return (
          <div key={step.key} className="flex items-center gap-1">
            <div className="flex items-center gap-1.5">
              <StatusIcon status={status} />
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap',
                  status === 'current' && 'text-foreground',
                  status === 'completed' && 'text-success',
                  status === 'rejected' && 'text-destructive',
                  status === 'upcoming' && 'text-muted-foreground/60',
                )}
              >
                {step.label}
              </span>
            </div>
            {i < displaySteps.length - 1 && (
              <div
                className={cn(
                  'mx-1 h-px w-4',
                  idx < currentIdx || (isRejected && i < displaySteps.length - 1) || (isVerified && i < displaySteps.length - 1)
                    ? 'bg-success'
                    : 'bg-muted-foreground/20',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
