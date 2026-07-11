'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SharedLayout } from '@/components/motion/shared-layout';
import { useAuth } from '@/lib/hooks/use-auth';
import { login as apiLogin } from '@/lib/api/auth';
import { useGoogleAuth, handleSocialAuth } from '@/lib/hooks/use-social-auth';
import { trackGuestStarted } from '@/lib/analytics/events';
import { Loader2 } from 'lucide-react';

interface FieldErrors {
  email?: string;
  password?: string;
}

const formVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
};

export default function LoginPage() {
  const reduced = useReducedMotion();
  const router = useRouter();
  const { setAuth, setProfile, enterGuestMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | null>(null);
  const [socialError, setSocialError] = useState<string | null>(null);
  const googleAuth = useGoogleAuth();

  useEffect(() => {
    if (googleAuth.loaded) {
      googleAuth.initialize((credential) => {
        setSocialLoading('google');
        handleSocialAuth(credential, {
          setAuth,
          setProfile,
          onSuccess: (onboardingCompleted) => {
            setSocialLoading(null);
            if (onboardingCompleted) {
              router.replace('/');
            } else {
              router.replace('/onboarding/role');
            }
          },
          onError: (msg) => {
            setSocialError(msg);
            setSocialLoading(null);
          },
        });
      });
    }
  }, [googleAuth.loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    return e;
  }

  function validateField(field: string, value: string) {
    const e: FieldErrors = {};
    if (field === 'email') {
      if (!value.trim()) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) e.email = 'Enter a valid email address';
    } else if (field === 'password') {
      if (!value) e.password = 'Password is required';
    }
    return e;
  }

  function handleBlur(field: string, value: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldErrors[field as keyof FieldErrors]) {
        next[field as keyof FieldErrors] = fieldErrors[field as keyof FieldErrors];
      } else {
        delete next[field as keyof FieldErrors];
      }
      return next;
    });
  }

  function handleChange(field: string, value: string) {
    if (field === 'email') setEmail(value);
    else if (field === 'password') setPassword(value);

    if (touched[field]) {
      const fieldErrors = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldErrors[field as keyof FieldErrors]) {
          next[field as keyof FieldErrors] = fieldErrors[field as keyof FieldErrors];
        } else {
          delete next[field as keyof FieldErrors];
        }
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setServerError(null);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      const res = await apiLogin({ email: email.trim(), password });
      if (!res.ok) {
        setServerError(res.error.message);
        setIsSubmitting(false);
        return;
      }
      const { token, user } = res.data ?? {};
      if (!token || !user) {
        setServerError('Login succeeded but server response was incomplete. Please try again.');
        setIsSubmitting(false);
        return;
      }

      try {
        localStorage.setItem('sportsos:auth-token', token);
      } catch {
        /* ignore */
      }
      setProfile({ name: user.name ?? '', email: user.email ?? '', phone: user.phone ?? '' });
      setAuth(true, user.onboardingCompleted ?? false);
      setIsSubmitting(false);
      if (user.onboardingCompleted) {
        router.replace('/');
      } else {
        router.replace('/onboarding/role');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('timed out')) {
        setServerError('Server is starting up. Please try again in a moment.');
      } else if (msg) {
        setServerError(msg);
      } else {
        setServerError('Network error. Please check your connection and try again.');
      }
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    if (!googleAuth.loaded) {
      setSocialError('Google Sign-In is loading. Please try again.');
      return;
    }
    googleAuth.prompt();
  }

  function handleGuestContinue() {
    trackGuestStarted();
    enterGuestMode();
    router.replace('/');
  }

  const errorId = (field: string) => `login-${field}-error`;

  return (
    <SharedLayout layoutId="auth-card">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <motion.div
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            variants={
              reduced
                ? undefined
                : {
                    hidden: { opacity: 0, y: -8 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.3, 0, 0, 1] } },
                  }
            }
            className="mb-2 flex items-center justify-center gap-2"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
              <svg
                className="h-5 w-5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
            </span>
            <span className="text-sm font-medium text-primary">Welcome back</span>
          </motion.div>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Welcome back to SportsOS</CardDescription>
        </CardHeader>
        <CardContent>
          {socialError && (
            <div
              role="alert"
              className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {socialError}
            </div>
          )}

          <motion.div
            initial={reduced ? { opacity: 0, y: 8 } : 'hidden'}
            animate={reduced ? { opacity: 1, y: 0 } : 'show'}
            transition={{ delay: 0.25 }}
            className="mb-4 flex flex-col gap-3"
          >
            <Button
              variant="outline"
              className="h-12 w-full gap-2.5"
              size="lg"
              onClick={handleGoogleLogin}
              disabled={socialLoading !== null || isSubmitting}
            >
              {socialLoading === 'google' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full gap-2.5"
              size="lg"
              onClick={handleGuestContinue}
              disabled={isSubmitting}
            >
              Continue as Guest
            </Button>
          </motion.div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            variants={reduced ? undefined : formVariants}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-4"
            noValidate
          >
            {serverError && (
              <div
                role="alert"
                className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {serverError}
              </div>
            )}

            <motion.div
              variants={reduced ? undefined : fieldVariants}
              transition={{ delay: 0.15 }}
              className="flex flex-col gap-1.5"
            >
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={(e) => handleBlur('email', e.target.value)}
                required
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? errorId('email') : undefined}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p id={errorId('email')} role="alert" className="text-xs text-destructive">
                  {errors.email}
                </p>
              )}
            </motion.div>

            <motion.div
              variants={reduced ? undefined : fieldVariants}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-1.5"
            >
              <Label htmlFor="login-password">Password</Label>
              <PasswordInput
                id="login-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={(e) => handleBlur('password', e.target.value)}
                required
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? errorId('password') : undefined}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p id={errorId('password')} role="alert" className="text-xs text-destructive">
                  {errors.password}
                </p>
              )}
            </motion.div>

            <motion.div
              variants={
                reduced
                  ? undefined
                  : {
                      hidden: { opacity: 0, scale: 0.98 },
                      show: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.3, ease: [0.2, 0, 0, 1], delay: 0.25 },
                      },
                    }
              }
              className="mt-2 w-full"
            >
              <Button type="submit" size="lg" className="h-12 w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </motion.div>
          </motion.form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </SharedLayout>
  );
}
