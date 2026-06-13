'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SharedLayout } from '@/components/motion/shared-layout';
import { useAuth } from '@/lib/hooks/use-auth';
import { login as apiLogin } from '@/lib/api/auth';
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
  const { setAuth, setProfile, isAuthenticated, isLoading, verified, onboardingCompleted } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug: log mount
  useEffect(() => {
    console.log('[AUTH DEBUG] LoginPage mounted');
    return () => console.log('[AUTH DEBUG] LoginPage unmounted');
  }, []);

  // Redirect fully onboarded users away from login page.
  // For all other cases, the handleSubmit is the sole navigation source.
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      // MVP: verification skipped — only check onboardingCompleted
      if (onboardingCompleted) {
        router.replace('/');
      }
    }
  }, [isLoading, isAuthenticated, onboardingCompleted, router]);

  function validate(): FieldErrors {
    const e: FieldErrors = {};

    if (!email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email address';
    }

    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 8) {
      e.password = 'Password must be at least 8 characters';
    }

    return e;
  }

  function validateField(field: string, value: string) {
    const e: FieldErrors = {};

    if (field === 'email') {
      if (!value.trim()) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) e.email = 'Enter a valid email address';
    } else if (field === 'password') {
      if (!value) e.password = 'Password is required';
      else if (value.length < 8) e.password = 'Password must be at least 8 characters';
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

      // Store token
      try {
        localStorage.setItem('sportsos:auth-token', res.data.token);
      } catch { /* ignore */ }

      setProfile({ name: res.data.user.name, email: res.data.user.email, phone: (res.data.user as unknown as Record<string, unknown>).phone as string ?? '' });
      setAuth(true);
      setIsSubmitting(false);
      router.replace('/');
    } catch {
      setServerError('Network error. Please try again.');
      setIsSubmitting(false);
    }
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
            <span className="bg-primary/10 ring-primary/30 relative flex h-8 w-8 items-center justify-center rounded-lg ring-1">
              <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
            </span>
            <span className="text-primary text-sm font-medium">Welcome back</span>
          </motion.div>
          <CardTitle className="text-2xl">Sign in to SportsOS</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
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
                <p id={errorId('email')} role="alert" className="text-destructive text-xs">
                  {errors.email}
                </p>
              )}
            </motion.div>

            <motion.div
              variants={reduced ? undefined : fieldVariants}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link href="/forgot-password" className="text-primary text-sm hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="login-password"
                type="password"
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
                <p id={errorId('password')} role="alert" className="text-destructive text-xs">
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
                      show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.2, 0, 0, 1], delay: 0.25 } },
                    }
              }
              className="mt-2 w-full"
            >
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
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

          <motion.div
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            transition={{ delay: 0.3 }}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2">Or continue with</span>
            </div>
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 0, y: 8 } : 'hidden'}
            animate={reduced ? { opacity: 1, y: 0 } : 'show'}
            transition={{ delay: 0.35 }}
            className="grid grid-cols-2 gap-3"
          >
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Continue as Guest
              </Button>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </SharedLayout>
  );
}
