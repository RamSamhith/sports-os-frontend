'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SharedLayout } from '@/components/motion/shared-layout';
import { Loader2, CheckCircle2, ArrowLeft, Mail, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { sendForgotPasswordOtp, verifyResetOtp, resetPassword, checkProvider } from '@/lib/api/auth';
import { trackForgotPasswordStarted, trackPasswordResetSuccess } from '@/lib/analytics/events';
import { getPasswordErrors } from '@/lib/utils/validators';

const FAST = { duration: 0.2, ease: [0.2, 0, 0, 1] as const };

type Step = 'email' | 'otp' | 'password' | 'success' | 'oauth-notice';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  );
}

function ForgotPasswordContent() {
  const reduced = useReducedMotion();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<Step>('email');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [oauthProvider, setOauthProvider] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) router.replace('/');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (step === 'email') inputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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

  function getPasswordStrength(): 'weak' | 'medium' | 'strong' {
    const errors = getPasswordErrors(newPassword);
    const count = Object.keys(errors).length;
    if (count === 0) return 'strong';
    if (count <= 1) return 'medium';
    return 'weak';
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const v = validate(email);
    setError(v);
    if (v) return;

    trackForgotPasswordStarted();
    setIsSubmitting(true);
    setError('');

    try {
      const providerRes = await checkProvider(email.toLowerCase().trim());
      if (providerRes.ok && providerRes.data.provider && providerRes.data.provider !== 'credentials') {
        setOauthProvider(providerRes.data.provider);
        setStep('otp');
        setIsSubmitting(false);
        return;
      }

      const result = await sendForgotPasswordOtp({ email: email.toLowerCase().trim() });
      setIsSubmitting(false);

      if (result.ok) {
        setStep('otp');
        setResendCooldown(30);
      } else {
        setError(result.error?.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setIsSubmitting(false);
      setError('Network error. Please try again.');
    }
  }

  const handleOtpComplete = useCallback(async (code: string) => {
    if (isSubmitting || code.length !== 6) return;
    setIsSubmitting(true);
    setError('');

    try {
      const res = await verifyResetOtp({ email: email.toLowerCase().trim(), otp: code });
      setIsSubmitting(false);

      if (res.ok) {
        setResetToken(res.data.resetToken);
        setStep('password');
      } else {
        setError(res.error?.message || 'Invalid code. Please try again.');
        setOtp('');
      }
    } catch {
      setIsSubmitting(false);
      setError('Network error. Please try again.');
    }
  }, [email, isSubmitting]);

  useEffect(() => {
    if (otp.length === 6 && step === 'otp') {
      handleOtpComplete(otp);
    }
  }, [otp, step, handleOtpComplete]);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pwErrors = getPasswordErrors(newPassword);
    setPasswordErrors(pwErrors);
    if (Object.keys(pwErrors).length > 0) return;

    if (newPassword !== confirmPassword) {
      setPasswordErrors((prev) => ({ ...prev, match: 'Passwords do not match' }));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword({ token: resetToken, password: newPassword });
      setIsSubmitting(false);

      if (res.ok) {
        trackPasswordResetSuccess();
        setStep('success');
      } else {
        setError(res.error?.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setIsSubmitting(false);
      setError('Network error. Please try again.');
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    try {
      const result = await sendForgotPasswordOtp({ email: email.toLowerCase().trim() });
      if (result.ok) {
        setResendCooldown(30);
        setOtp('');
      }
    } catch {
      // Network error — user can retry
    }
  }

  const screenVariants = {
    enter: { opacity: 0, x: reduced ? 0 : 12 },
    center: { opacity: 1, x: 0, transition: { ...FAST, duration: 0.25 } },
    exit: { opacity: 0, x: reduced ? 0 : -12, transition: { ...FAST, duration: 0.15 } },
  };

  const strength = getPasswordStrength();
  const pwErrors = getPasswordErrors(newPassword);

  return (
    <SharedLayout layoutId="auth-card">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <AnimatePresence mode="wait" initial={false}>
            {step === 'success' ? (
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
                <h1 className="text-2xl font-bold tracking-tight">Password updated</h1>
                <p className="text-muted-foreground mt-2 text-sm text-pretty">
                  Your password has been updated successfully. You can now sign in with your new password.
                </p>
                <Link href="/login" className="mt-6 w-full">
                  <Button className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </motion.div>
            ) : step === 'otp' && oauthProvider ? (
              <motion.div
                key="oauth-notice"
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={reduced ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
                >
                  <Shield className="h-7 w-7 text-primary" />
                </motion.div>
                <h1 className="text-2xl font-bold tracking-tight">Account uses Google</h1>
                <p className="text-muted-foreground mt-2 text-sm text-pretty">
                  This account uses Google Sign In. No password reset required.
                </p>
                <div className="mt-6 flex w-full flex-col gap-3">
                  <Button
                    className="w-full gap-2"
                    onClick={() => {
                      router.replace('/login');
                    }}
                  >
                    Continue with Google
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => { setStep('email'); setOauthProvider(''); setEmail(''); }}>
                    Use a different email
                  </Button>
                </div>
              </motion.div>
            ) : step === 'otp' ? (
              <motion.div
                key="otp"
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="bg-primary/10 ring-primary/30 relative flex h-8 w-8 items-center justify-center rounded-lg ring-1">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-primary text-sm font-medium">Verify Code</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-center">Enter reset code</h1>
                <p className="text-muted-foreground mt-1 text-center text-sm">
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>

                {error && (
                  <div role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive mt-4">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex flex-col items-center gap-4">
                  <OtpInput value={otp} onChange={setOtp} length={6} disabled={isSubmitting} autoFocus />

                  {isSubmitting && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying…
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
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
              </motion.div>
            ) : step === 'password' ? (
              <motion.div
                key="password"
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="bg-primary/10 ring-primary/30 relative flex h-8 w-8 items-center justify-center rounded-lg ring-1">
                    <Shield className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-primary text-sm font-medium">New Password</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-center">Set new password</h1>
                <p className="text-muted-foreground mt-1 text-center text-sm">
                  Create a strong password for your account
                </p>

                {error && (
                  <div role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive mt-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="mt-6 flex flex-col gap-4" noValidate>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="At least 8 characters"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setPasswordErrors({}); }}
                        autoComplete="new-password"
                        disabled={isSubmitting}
                      />
                      <button type="button" onClick={() => setShowNewPassword(v => !v)} className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2" tabIndex={-1} aria-label={showNewPassword ? 'Hide password' : 'Show password'}>
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {newPassword.length > 0 && (
                      <div className="mt-1 flex flex-col gap-1">
                        <div className="flex gap-1">
                          {(['weak', 'medium', 'strong'] as const).map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full ${
                                (level === 'weak' && strength === 'weak') ||
                                (level === 'medium' && (strength === 'medium' || strength === 'strong')) ||
                                (level === 'strong' && strength === 'strong')
                                  ? level === 'weak' ? 'bg-red-500' : level === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                          {[
                            { key: 'minLength', label: '8+ characters' },
                            { key: 'uppercase', label: 'Uppercase' },
                            { key: 'lowercase', label: 'Lowercase' },
                            { key: 'number', label: 'Number' },
                          ].map(({ key, label }) => (
                            <span key={key} className={pwErrors[key] ? 'text-muted-foreground' : 'text-green-600'}>
                              {pwErrors[key] ? '○' : '✓'} {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        disabled={isSubmitting}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2" tabIndex={-1} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordErrors.match && (
                      <p role="alert" className="text-destructive text-xs">{passwordErrors.match}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating…
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </form>
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
                  Enter your email and we&apos;ll send you a reset code
                </p>

                <form onSubmit={handleEmailSubmit} className="mt-6 flex flex-col gap-4" noValidate>
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
                      'Send Reset Code'
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
