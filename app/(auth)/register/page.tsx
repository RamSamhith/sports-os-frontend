'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SharedLayout } from '@/components/motion/shared-layout';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const formVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
};

export default function RegisterPage() {
  const reduced = useReducedMotion();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): FieldErrors {
    const e: FieldErrors = {};

    if (!name.trim()) {
      e.name = 'Name is required';
    } else if (name.trim().length < 2) {
      e.name = 'Name must be at least 2 characters';
    }

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

    if (!confirmPassword) {
      e.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      e.confirmPassword = 'Passwords do not match';
    }

    return e;
  }

  function validateField(field: string, value: string) {
    const e: FieldErrors = {};

    if (field === 'name') {
      if (!value.trim()) e.name = 'Name is required';
      else if (value.trim().length < 2) e.name = 'Name must be at least 2 characters';
    } else if (field === 'email') {
      if (!value.trim()) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) e.email = 'Enter a valid email address';
    } else if (field === 'password') {
      if (!value) e.password = 'Password is required';
      else if (value.length < 8) e.password = 'Password must be at least 8 characters';
      if (confirmPassword && value !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    } else if (field === 'confirmPassword') {
      if (!value) e.confirmPassword = 'Please confirm your password';
      else if (value !== password) e.confirmPassword = 'Passwords do not match';
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
    if (field === 'name') setName(value);
    else if (field === 'email') setEmail(value);
    else if (field === 'password') setPassword(value);
    else if (field === 'confirmPassword') setConfirmPassword(value);

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
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    // Placeholder: real registration wiring lives in a later phase
    await new Promise((r) => setTimeout(r, 1500));
    localStorage.setItem('sportsos:auth', 'true');
    setIsSubmitting(false);
    router.push('/onboarding/role');
  }

  const errorId = (field: string) => `register-${field}-error`;

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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </span>
            <span className="text-primary text-sm font-medium">Join SportsOS</span>
          </motion.div>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Save favourites, track enquiries, and manage your profile</CardDescription>
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
            <motion.div
              variants={reduced ? undefined : fieldVariants}
              transition={{ delay: 0.15 }}
              className="flex flex-col gap-1.5"
            >
              <Label htmlFor="register-name">Full Name</Label>
              <Input
                id="register-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={(e) => handleBlur('name', e.target.value)}
                required
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? errorId('name') : undefined}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p id={errorId('name')} role="alert" className="text-destructive text-xs">
                  {errors.name}
                </p>
              )}
            </motion.div>

            <motion.div
              variants={reduced ? undefined : fieldVariants}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-1.5"
            >
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
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
              transition={{ delay: 0.25 }}
              className="flex flex-col gap-1.5"
            >
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={(e) => handleBlur('password', e.target.value)}
                required
                autoComplete="new-password"
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
              variants={reduced ? undefined : fieldVariants}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-1.5"
            >
              <Label htmlFor="register-confirm-password">Confirm Password</Label>
              <Input
                id="register-confirm-password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                required
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? errorId('confirmPassword') : undefined}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p id={errorId('confirmPassword')} role="alert" className="text-destructive text-xs">
                  {errors.confirmPassword}
                </p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              variants={
                reduced
                  ? undefined
                  : {
                      hidden: { opacity: 0, scale: 0.98 },
                      show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.2, 0, 0, 1], delay: 0.35 } },
                    }
              }
              className="mt-2 w-full"
              disabled={isSubmitting}
            >
              <Button className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </motion.button>
          </motion.form>

          <motion.div
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            transition={{ delay: 0.4 }}
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
            transition={{ delay: 0.45 }}
            className="grid grid-cols-2 gap-3"
          >
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Sign in
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Continue as Guest
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mt-4 text-center text-xs"
          >
            Already have an account?{' '}
            <Link href="/login" className="text-foreground hover:underline">
              Sign in
            </Link>
          </motion.p>
        </CardContent>
      </Card>
    </SharedLayout>
  );
}
