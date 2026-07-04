'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SharedLayout } from '@/components/motion/shared-layout';
import { Loader2, CheckCircle2, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '@/lib/api/auth';

const FAST = { duration: 0.2, ease: [0.2, 0, 0, 1] as const };

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter' },
  { test: (p: string) => /\d/.test(p), label: 'One number' },
];

function ResetPasswordForm() {
  const reduced = useReducedMotion();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(password));
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  function validateField(name: string, value: string): string {
    if (name === 'password') {
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(value)) return 'Must contain at least one uppercase letter';
      if (!/[a-z]/.test(value)) return 'Must contain at least one lowercase letter';
      if (!/\d/.test(value)) return 'Must contain at least one number';
    }
    if (name === 'confirmPassword') {
      if (!value) return 'Please confirm your password';
      if (value !== password) return 'Passwords do not match';
    }
    return '';
  }

  function handleChange(name: string, value: string) {
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
    if (touched.confirmPassword && name === 'password') {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField('confirmPassword', confirmPassword),
      }));
    }
  }

  function handleBlur(name: string) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const value = name === 'password' ? password : confirmPassword;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError('');

    const passwordErr = validateField('password', password);
    const confirmErr = validateField('confirmPassword', confirmPassword);
    setErrors({ password: passwordErr, confirmPassword: confirmErr });
    setTouched({ password: true, confirmPassword: true });

    if (passwordErr || confirmErr) return;
    if (!token) {
      setGlobalError('Invalid or missing reset token. Please request a new link.');
      return;
    }

    setIsSubmitting(true);

    const result = await resetPassword({ token, password });

    setIsSubmitting(false);

    if (result.ok) {
      setResetSuccess(true);
    } else {
      setGlobalError(result.error?.message || 'Something went wrong. Please try again.');
    }
  }

  if (!token) {
    return (
      <SharedLayout layoutId="auth-card">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <Lock className="h-7 w-7 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Invalid Link</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                This password reset link is invalid or missing a token.
              </p>
              <Link href="/forgot-password" className="mt-6">
                <Button className="w-full">Request New Link</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </SharedLayout>
    );
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
            {resetSuccess ? (
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

                <h1 className="text-2xl font-bold tracking-tight">Password Reset</h1>
                <p className="text-muted-foreground mt-2 text-sm text-pretty">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>

                <Link href="/login" className="mt-6">
                  <Button className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
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
                    <Lock className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-primary text-sm font-medium">New Password</span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-center">Set new password</h1>
                <p className="text-muted-foreground mt-1 text-center text-sm">
                  Choose a strong password for your account
                </p>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
                  {globalError && (
                    <div className="rounded-md bg-destructive/10 px-3 py-2">
                      <p role="alert" className="text-destructive text-xs">{globalError}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        autoComplete="new-password"
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
                        tabIndex={0}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p id="password-error" role="alert" className="text-destructive text-xs">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                        autoComplete="new-password"
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
                        tabIndex={0}
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p id="confirm-error" role="alert" className="text-destructive text-xs">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {PASSWORD_RULES.map((rule) => (
                      <div key={rule.label} className="flex items-center gap-2">
                        <div
                          className={`h-1.5 w-1.5 rounded-full transition-colors ${
                            rule.test(password) ? 'bg-green-500' : 'bg-muted-foreground/30'
                          }`}
                        />
                        <span
                          className={`text-xs transition-colors ${
                            rule.test(password) ? 'text-green-600' : 'text-muted-foreground'
                          }`}
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !allRulesPassed || !passwordsMatch}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Resetting…
                      </>
                    ) : (
                      'Reset Password'
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <SharedLayout layoutId="auth-card">
          <Card className="w-full max-w-sm">
            <CardContent className="pt-6 flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </CardContent>
          </Card>
        </SharedLayout>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
