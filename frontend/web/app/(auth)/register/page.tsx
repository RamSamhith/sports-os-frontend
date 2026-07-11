'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/phone-input';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SharedLayout } from '@/components/motion/shared-layout';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { register as apiRegister } from '@/lib/api/auth';
import { useGoogleAuth, handleSocialAuth } from '@/lib/hooks/use-social-auth';
import { trackGuestStarted } from '@/lib/analytics/events';
import { validatePassword, getPasswordErrors } from '@/lib/utils/validators';

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
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
  const { setAuth, setProfile, setOnboarding, isAuthenticated, isLoading, onboardingCompleted, enterGuestMode } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
          onError: (msg) => { setSocialError(msg); setSocialLoading(null); },
        });
      });
    }
  }, [googleAuth.loaded]); // eslint-disable-line react-hooks/exhaustive-deps

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

    if (!phone.trim()) {
      e.phone = 'Phone number is required';
    } else {
      const digits = phone.replace(/\D/g, '');
      if (digits.length !== 10) {
        e.phone = 'Phone number must be exactly 10 digits';
      }
    }

    if (!password) {
      e.password = 'Password is required';
    } else {
      const pwErr = validatePassword(password);
      if (pwErr) e.password = pwErr;
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
    } else if (field === 'phone') {
      if (!value.trim()) e.phone = 'Phone number is required';
      else {
        const digits = value.replace(/\D/g, '');
        if (digits.length !== 10) e.phone = 'Phone number must be exactly 10 digits';
      }
    } else if (field === 'password') {
      const pwErr = validatePassword(value);
      if (pwErr) e.password = pwErr;
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
    else if (field === 'phone') setPhone(value);
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
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });
    setServerError(null);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const res = await apiRegister({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
      });

      if (!res.ok) {
        setServerError(res.error.message);
        setIsSubmitting(false);
        return;
      }

      const { token, user } = res.data ?? {};
      if (!token || !user) {
        setServerError('Registration succeeded but server response was incomplete. Please log in.');
        setIsSubmitting(false);
        return;
      }

      try {
        localStorage.setItem('sportsos:auth-token', token);
      } catch { /* ignore */ }
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

  function handleGuestContinue() {
    trackGuestStarted();
    enterGuestMode();
    router.replace('/');
  }

  async function handleGoogleLogin() {
    if (!googleAuth.loaded) {
      setSocialError('Google Sign-In is loading. Please try again.');
      return;
    }
    googleAuth.prompt();
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
            {socialError && (
              <div role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive mb-4">
                {socialError}
              </div>
            )}

            <motion.div
              initial={reduced ? { opacity: 0, y: 8 } : 'hidden'}
              animate={reduced ? { opacity: 1, y: 0 } : 'show'}
              transition={{ delay: 0.25 }}
              className="flex flex-col gap-3 mb-4"
            >
              <Button variant="outline" className="w-full h-12 gap-2.5" size="lg" onClick={handleGoogleLogin} disabled={socialLoading !== null || isSubmitting}>
                {socialLoading === 'google' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                )}
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full h-12" onClick={handleGuestContinue} disabled={isSubmitting}>
                Continue as Guest
              </Button>
            </motion.div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card text-muted-foreground px-2">or</span>
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
                <div role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {serverError}
                </div>
              )}

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
              transition={{ delay: 0.22 }}
              className="flex flex-col gap-1.5"
            >
              <Label htmlFor="register-phone">Phone number</Label>
              <PhoneInput
                id="register-phone"
                value={phone}
                onChange={(val) => handleChange('phone', val)}
                onBlur={(e) => handleBlur('phone', e.target.value)}
                error={errors.phone}
                autoComplete="tel"
                required
                disabled={isSubmitting}
              />
            </motion.div>

            <motion.div
              variants={reduced ? undefined : fieldVariants}
              transition={{ delay: 0.25 }}
              className="flex flex-col gap-1.5"
            >
              <Label htmlFor="register-password">Password</Label>
              <PasswordInput
                id="register-password"
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
              {password.length > 0 && (
                <div className="mt-1 flex flex-col gap-1">
                  {(() => {
                    const errors = getPasswordErrors(password);
                    const count = Object.keys(errors).length;
                    const strength = count === 0 ? 'strong' : count <= 1 ? 'medium' : 'weak';
                    return (
                      <>
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
                            <span key={key} className={errors[key] ? 'text-muted-foreground' : 'text-green-600'}>
                              {errors[key] ? '○' : '✓'} {label}
                            </span>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
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
              <PasswordInput
                id="register-confirm-password"
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

            <motion.div
              variants={
                reduced
                  ? undefined
                  : {
                      hidden: { opacity: 0, scale: 0.98 },
                      show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.2, 0, 0, 1], delay: 0.35 } },
                    }
              }
              className="mt-2 w-full"
            >
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </motion.div>
            </motion.form>

            <p className="text-muted-foreground mt-4 text-center text-xs">
              Already have an account?{' '}
              <Link href="/login" className="text-foreground hover:underline">
                Sign in
              </Link>
            </p>
        </CardContent>
      </Card>
    </SharedLayout>
  );
}
