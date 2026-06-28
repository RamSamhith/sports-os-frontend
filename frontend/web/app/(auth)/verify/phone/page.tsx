'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SharedLayout } from '@/components/motion/shared-layout';
import { OtpInput } from '@/components/ui/otp-input';
import { Loader2, CheckCircle2, ArrowLeft, Smartphone, RotateCcw } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { verifyOtp, sendOtp } from '@/lib/api/auth';

const FAST = { duration: 0.2, ease: [0.2, 0, 0, 1] as const };

export default function VerifyPhonePage() {
  const reduced = useReducedMotion();
  const router = useRouter();
  const { isAuthenticated, isLoading, profile, onboardingCompleted, setAuth, setProfile, setOnboarding } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace('/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleVerify = useCallback(async (code: string) => {
    const email = profile?.email;
    if (!email) {
      setError('No email found. Please login again.');
      return;
    }

    setIsVerifying(true);
    setError('');

    const res = await verifyOtp({ email, otp: code });

    if (!res.ok) {
      setError(res.error.message);
      setOtp('');
      setIsVerifying(false);
      return;
    }

    // Store token
    try {
      localStorage.setItem('sportsos:auth-token', res.data.token);
    } catch { /* ignore */ }

    setProfile({ name: res.data.user.name, email: res.data.user.email, phone: res.data.user.phone || '' });
    setOnboarding({
      age: res.data.user.age ?? null,
      gender: res.data.user.gender ?? null,
      sportInterests: res.data.user.sportInterests || [],
      skillLevel: res.data.user.skillLevel ?? null,
      goals: res.data.user.goals || '',
      location: res.data.user.location || '',
      children: (res.data.user.children || []).map((c) => ({
        id: c.id,
        parentId: c.parentId,
        name: c.name,
        age: c.age,
        gender: c.gender,
        sportInterests: c.sportInterests || [],
        skillLevel: c.skillLevel,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    });
    setAuth(true, res.data.user.onboardingCompleted);
    setVerified(true);
    setIsVerifying(false);
  }, [profile?.email, setAuth, setProfile, setOnboarding]);

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify(otp);
    }
  }, [otp, handleVerify]);

  async function handleResend() {
    const email = profile?.email;
    if (!email) return;
    setResendCooldown(30);
    setOtp('');
    setError('');
    await sendOtp({ email });
  }

  const screenVariants = {
    enter: { opacity: 0, x: reduced ? 0 : 12 },
    center: { opacity: 1, x: 0, transition: { ...FAST, duration: 0.25 } },
    exit: { opacity: 0, x: reduced ? 0 : -12, transition: { ...FAST, duration: 0.15 } },
  };

  const maskedPhone = profile?.phone
    ? profile.phone.slice(0, -4).replace(/./g, '*') + profile.phone.slice(-4)
    : 'your number';

  return (
    <SharedLayout layoutId="auth-card">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <AnimatePresence mode="wait" initial={false}>
            {verified ? (
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

                <h1 className="text-2xl font-semibold tracking-tight">Phone Verified</h1>
                <p className="text-muted-foreground mt-2 text-sm text-pretty">
                  Your phone number has been verified.
                </p>

                <div className="mt-6 flex w-full flex-col gap-3">
                  <Link href="/">
                    <Button className="w-full gap-2" variant="default">
                      Go to Home
                    </Button>
                  </Link>
                  <Link href="/profile/personal">
                    <Button className="w-full" variant="ghost">
                      Go to Profile
                    </Button>
                  </Link>
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
                    <Smartphone className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-primary text-sm font-medium">Phone Verification</span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-center">Verify your phone</h1>
                <p className="text-muted-foreground mt-1 text-center text-sm">
                  Enter the 6-digit code sent to{' '}
                  <span className="text-foreground font-medium">{maskedPhone}</span>
                </p>

                <div className="mt-6 flex justify-center">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    disabled={isVerifying}
                    length={6}
                  />
                </div>

                {error && (
                  <p role="alert" className="text-destructive mt-3 text-center text-xs">
                    {error}
                  </p>
                )}

                {isVerifying && (
                  <div className="mt-4 flex justify-center">
                    <Loader2 className="text-primary h-5 w-5 animate-spin" />
                  </div>
                )}

                <div className="mt-6 flex w-full flex-col gap-3">
                  <Link href="/login">
                    <Button className="w-full gap-2" variant="outline" disabled={isVerifying}>
                      <ArrowLeft className="h-4 w-4" />
                      Back to Login
                    </Button>
                  </Link>
                  <Button
                    className="w-full"
                    variant="ghost"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isVerifying}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </SharedLayout>
  );
}
