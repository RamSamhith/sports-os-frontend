'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { SharedLayout } from '@/components/motion/shared-layout';
import { MessageCircle, Smartphone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn } from '@/lib/utils/cn';

type OtpMethod = 'whatsapp' | 'sms';

const methods: { id: OtpMethod; label: string; description: string; icon: typeof Smartphone }[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp OTP',
    description: 'Get a code on WhatsApp',
    icon: MessageCircle,
  },
  {
    id: 'sms',
    label: 'SMS OTP',
    description: 'Get a code via text message',
    icon: Smartphone,
  },
];

export default function OtpMethodPage() {
  const reduced = useReducedMotion();
  const router = useRouter();
  const { isAuthenticated, isLoading, verified, profile } = useAuth();
  const [selected, setSelected] = useState<OtpMethod | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace('/register');
    else if (verified) router.replace('/onboarding/role');
  }, [isLoading, isAuthenticated, verified, router]);

  function handleContinue() {
    if (!selected) return;
    sessionStorage.setItem('sportsos:otp-method', selected);
    router.push('/verify/signup');
  }

  const maskedContact = selected === 'whatsapp'
    ? profile?.phone
      ? profile.phone.slice(0, -4).replace(/./g, '*') + profile.phone.slice(-4)
      : 'your number'
    : profile?.email
      ? profile.email.slice(0, 2) + '***@' + profile.email.split('@')[1]
      : 'your email';

  return (
    <SharedLayout layoutId="auth-card">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.3, 0, 0, 1] }}
            className="mb-2 flex items-center justify-center gap-2"
          >
            <span className="bg-primary/10 ring-primary/30 relative flex h-8 w-8 items-center justify-center rounded-lg ring-1">
              <Smartphone className="h-4 w-4 text-primary" />
            </span>
            <span className="text-primary text-sm font-medium">Verify Your Account</span>
          </motion.div>

          <motion.h1
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5, ease: [0.3, 0, 0, 1] }}
            className="text-2xl font-bold tracking-tight text-center"
          >
            How should we verify you?
          </motion.h1>

          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="text-muted-foreground mt-1 text-center text-sm"
          >
            Choose a method to receive your verification code
          </motion.p>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45, ease: [0.2, 0, 0, 1] }}
            className="mt-6 flex flex-col gap-3"
          >
            {methods.map((method) => {
              const isSelected = selected === method.id;
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelected(method.id)}
                  className={cn(
                    'flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 outline-none',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                      : 'border-border/60 bg-background/60 hover:border-primary/30 hover:shadow-md',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                      isSelected
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{method.label}</p>
                    <p className="text-muted-foreground text-xs">{method.description}</p>
                  </div>
                  <div
                    className={cn(
                      'h-5 w-5 shrink-0 rounded-full border-2 transition-colors',
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30',
                    )}
                  >
                    {isSelected && (
                      <div className="flex h-full items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35, ease: [0.2, 0, 0, 1] }}
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
            initial={reduced ? { opacity: 0 } : { opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-muted-foreground mt-4 text-center text-xs"
          >
            We&apos;ll send a 6-digit code to {selected ? maskedContact : 'you'}
          </motion.p>
        </CardContent>
      </Card>
    </SharedLayout>
  );
}
