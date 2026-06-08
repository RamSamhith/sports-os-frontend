'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SharedLayout } from '@/components/motion/shared-layout';
import { Loader2, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

const FAST = { duration: 0.2, ease: [0.2, 0, 0, 1] as const };

export default function ForgotPasswordPage() {
  const reduced = useReducedMotion();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Redirect authenticated users to home
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Focus input on mount and on resend
  useEffect(() => {
    if (!sent) {
      inputRef.current?.focus();
    }
  }, [sent]);

  function validate(value: string): string {
    if (!value.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
    return '';
  }

  function handleBlur() {
    setTouched(true);
    setError(validate(email));
  }

  function handleChange(value: string) {
    setEmail(value);
    if (touched) setError(validate(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const v = validate(email);
    setError(v);
    if (v) return;

    setIsSubmitting(true);
    // Placeholder: real email delivery lives in a later phase
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setSent(true);
  }

  function handleResend() {
    setSent(false);
    setEmail('');
    setTouched(false);
    setError('');
  }

  const screenVariants = {
    enter: { opacity: 0, x: reduced ? 0 : 12 },
    center: { opacity: 1, x: 0, transition: { ...FAST, duration: 0.25 } },
    exit: { opacity: 0, x: reduced ? 0 : -12, transition: { ...FAST, duration: 0.15 } },
  };

  return (
    <SharedLayout layoutId="auth-card">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div
                key="success"
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={reduced ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.05 }}
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
                >
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </motion.div>

                <h1 className="text-2xl font-bold tracking-tight">Check your inbox</h1>
                <p className="text-muted-foreground mt-2 text-sm text-pretty">
                  If an account exists for{' '}
                  <span className="text-foreground font-medium">{email}</span>, a password reset link
                  has been sent.
                </p>

                <div className="mt-6 flex w-full flex-col gap-3">
                  <Link href="/login">
                    <Button className="w-full gap-2" variant="default">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Login
                    </Button>
                  </Link>
                  <Button
                    className="w-full"
                    variant="ghost"
                    onClick={handleResend}
                  >
                    Resend Email
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="bg-primary/10 ring-primary/30 relative flex h-8 w-8 items-center justify-center rounded-lg ring-1">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-primary text-sm font-medium">Password Reset</span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-center">Forgot password?</h1>
                <p className="text-muted-foreground mt-1 text-center text-sm">
                  Enter your email and we&apos;ll send you a reset link
                </p>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input
                      ref={inputRef}
                      id="forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      autoComplete="email"
                      aria-invalid={!!error}
                      aria-describedby={error ? 'forgot-email-error' : undefined}
                      disabled={isSubmitting}
                    />
                    {error && (
                      <p id="forgot-email-error" role="alert" className="text-destructive text-xs">
                        {error}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>

                <p className="text-muted-foreground mt-4 text-center text-xs">
                  Remember your password?{' '}
                  <Link href="/login" className="text-foreground hover:underline">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </SharedLayout>
  );
}
