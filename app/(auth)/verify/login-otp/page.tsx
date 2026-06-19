'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { SharedLayout } from '@/components/motion/shared-layout';
import { useAuth } from '@/lib/hooks/use-auth';
import { verifyLoginOtp, sendLoginOtp } from '@/lib/api/auth';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VerifyLoginOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyLoginOtpContent />
    </Suspense>
  );
}

function VerifyLoginOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth, setProfile, isAuthenticated, isLoading, onboardingCompleted } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedEmail = sessionStorage.getItem('sportsos:verify-email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      if (onboardingCompleted) router.replace('/');
    }
  }, [isLoading, isAuthenticated, onboardingCompleted, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerify = useCallback(async (code: string) => {
    if (isSubmitting || code.length !== 6) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await verifyLoginOtp({ email, otp: code });
      if (!res.ok) {
        setError(res.error.message);
        setIsSubmitting(false);
        setOtp('');
        return;
      }

      try {
        localStorage.setItem('sportsos:auth-token', res.data.token);
      } catch { /* ignore */ }

      const userPhone = res.data.user.phone ?? '';
      setProfile({ name: res.data.user.name, email: res.data.user.email, phone: userPhone });
      setAuth(true, res.data.user.onboardingCompleted);

      try { sessionStorage.removeItem('sportsos:verify-email'); } catch { /* ignore */ }

      if (res.data.user.onboardingCompleted) {
        router.replace('/');
      } else {
        router.replace('/onboarding/role');
      }
    } catch {
      setError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  }, [email, isSubmitting, setAuth, setProfile, router]);

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify(otp);
    }
  }, [otp, handleVerify]);

  async function handleResend() {
    if (resendCooldown > 0) return;
    try {
      await sendLoginOtp({ email });
      setResendCooldown(30);
    } catch { /* ignore */ }
  }

  function handleEditEmail() {
    try { sessionStorage.removeItem('sportsos:verify-email'); } catch { /* ignore */ }
    router.replace('/login');
  }

  return (
    <SharedLayout layoutId="auth-card">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <button onClick={handleEditEmail} className="text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1 text-xs">
            <ArrowLeft className="h-3 w-3" /> Back to sign in
          </button>
          <CardTitle className="text-2xl">Enter your code</CardTitle>
          <CardDescription>
            We sent a 6-digit code to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <div role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <OtpInput
            value={otp}
            onChange={setOtp}
            length={6}
            disabled={isSubmitting}
            autoFocus
          />

          {isSubmitting && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying…
            </div>
          )}

          <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
            <p>
              Didn&apos;t receive a code?{' '}
              {resendCooldown > 0 ? (
                <span>Resend in {resendCooldown}s</span>
              ) : (
                <button onClick={handleResend} className="text-primary font-medium hover:underline">
                  Resend code
                </button>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </SharedLayout>
  );
}
