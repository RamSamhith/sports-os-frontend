'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence, type Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/phone-input';
import { useAuth } from '@/lib/hooks/use-auth';
import { login as apiLogin, register as apiRegister } from '@/lib/api/auth';
import { useGoogleAuth, handleSocialAuth } from '@/lib/hooks/use-social-auth';
import { trackLogin, trackSignup, trackOAuthAttempt, trackOAuthSuccess, trackOAuthError, trackGuestStarted } from '@/lib/analytics/events';
import { validatePassword } from '@/lib/utils/validators';
import { Loader2, ArrowLeft, X } from 'lucide-react';
import { ease, duration } from '@/components/motion/constants';

type ModalView = 'choose' | 'login' | 'register';

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: ease.standard } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: ease.accelerate } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 420, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    transition: { duration: 0.12, ease: ease.accelerate },
  },
};

const viewVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 20 : -20,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.standard, ease: ease.athletic },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -20 : 20,
    transition: { duration: duration.fast, ease: ease.accelerate },
  }),
};

const formFieldVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: ease.athletic } },
};

export function AuthModal({
  open,
  onOpenChange,
  defaultView = 'choose',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultView?: ModalView;
}) {
  const reduced = !!useReducedMotion();
  const router = useRouter();
  const { setAuth, setProfile, enterGuestMode } = useAuth();
  const [view, setView] = useState<ModalView>(defaultView);
  const [direction, setDirection] = useState(1);
  const [socialError, setSocialError] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<'google' | null>(null);

  const googleAuth = useGoogleAuth();

  useEffect(() => {
    if (open) {
      setView(defaultView);
      setDirection(1);
      setSocialError(null);
    }
  }, [open, defaultView]);

  useEffect(() => {
    if (open && googleAuth.loaded && view === 'choose') {
      googleAuth.initialize((credential) => {
        setSocialLoading('google');
        handleSocialAuth(credential, {
          setAuth,
          setProfile,
          onSuccess: (onboardingCompleted) => {
            trackOAuthSuccess('google');
            trackLogin('google');
            onOpenChange(false);
            setSocialLoading(null);
            if (onboardingCompleted === false) {
              router.replace('/onboarding/role');
            }
          },
          onError: (msg) => { trackOAuthError('google', msg); setSocialError(msg); setSocialLoading(null); },
        });
      });
    }
  }, [open, googleAuth.loaded, view]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const navigateView = useCallback((next: ModalView) => {
    setDirection(next === 'choose' ? -1 : 1);
    setView(next);
  }, []);

  const handleGoogleLogin = async () => {
    if (!googleAuth.loaded) {
      setSocialError('Google Sign-In is loading. Please try again.');
      return;
    }
    trackOAuthAttempt('google');
    googleAuth.prompt();
  };

  const handleGuestContinue = useCallback(() => {
    trackGuestStarted();
    enterGuestMode();
    onOpenChange(false);
    router.replace('/');
  }, [enterGuestMode, onOpenChange, router]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-[var(--z-modal)] bg-background/80 backdrop-blur-sm"
            variants={reduced ? undefined : overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
            variants={reduced ? undefined : cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Dialog.Title className="sr-only">Authentication</Dialog.Title>
            <Dialog.Description className="sr-only">Sign in or create an account</Dialog.Description>
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>

            <div className="relative z-10 w-full max-w-sm">
              <AnimatePresence mode="wait" custom={direction}>
                {view === 'choose' && (
                  <ChooseView
                    key="choose"
                    custom={direction}
                    variants={reduced ? undefined : viewVariants}
                    onSelect={(v) => navigateView(v)}
                    onGoogle={handleGoogleLogin}
                    onGuest={handleGuestContinue}
                    googleLoaded={googleAuth.loaded}
                    socialLoading={socialLoading}
                    socialError={socialError}
                    reduced={reduced}
                  />
                )}
                {view === 'login' && (
                  <LoginView
                    key="login"
                    custom={direction}
                    variants={reduced ? undefined : viewVariants}
                    onBack={() => navigateView('choose')}
                    onSwitch={() => navigateView('register')}
                    onSuccess={handleClose}
                    reduced={reduced}
                  />
                )}
                {view === 'register' && (
                  <RegisterView
                    key="register"
                    custom={direction}
                    variants={reduced ? undefined : viewVariants}
                    onBack={() => navigateView('choose')}
                    onSwitch={() => navigateView('login')}
                    onSuccess={handleClose}
                    onOpenChange={onOpenChange}
                    reduced={reduced}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ChooseView({
  onSelect,
  onGoogle,
  onGuest,
  googleLoaded,
  socialLoading,
  socialError,
  reduced,
  custom,
  variants,
}: {
  onSelect: (view: ModalView) => void;
  onGoogle: () => void;
  onGuest: () => void;
  googleLoaded: boolean;
  socialLoading: 'google' | null;
  socialError: string | null;
  reduced: boolean;
  custom?: number;
  variants?: Variants;
}) {
  return (
    <motion.div custom={custom} variants={variants} initial="enter" animate="center" exit="exit">
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome to SportsOS</CardTitle>
        <CardDescription>Find and book sports academies near you</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {socialError && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {socialError}
          </div>
        )}

        <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible">
          <Button
            className="w-full h-12 gap-2.5"
            size="lg"
            variant="outline"
            onClick={onGoogle}
            disabled={socialLoading !== null}
          >
            {socialLoading === 'google' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            )}
            Continue with Google
          </Button>
        </motion.div>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card text-muted-foreground px-2">or</span>
          </div>
        </div>

        <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
          <Button className="w-full h-12" size="lg" onClick={() => onSelect('login')}>
            Sign in with Email
          </Button>
        </motion.div>

        <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
          <Button className="w-full h-12" size="lg" variant="ghost" onClick={onGuest}>
            Continue as Guest
          </Button>
        </motion.div>

        <p className="text-muted-foreground text-center text-xs mt-2">
          Don&apos;t have an account?{' '}
          <button onClick={() => onSelect('register')} className="text-foreground font-medium hover:underline">Sign up</button>
        </p>
      </CardContent>
    </Card>
    </motion.div>
  );
}

function LoginView({
  onBack,
  onSwitch,
  onSuccess,
  reduced,
  custom,
  variants,
}: {
  onBack: () => void;
  onSwitch: () => void;
  onSuccess: () => void;
  reduced: boolean;
  custom?: number;
  variants?: Variants;
}) {
  const { setAuth, setProfile } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    const pwErr = validatePassword(password);
    if (pwErr) e.password = pwErr;
    return e;
  }

  function validateField(field: string, value: string) {
    const e: FieldErrors = {};
    if (field === 'email') {
      if (!value.trim()) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) e.email = 'Enter a valid email address';
    } else if (field === 'password') {
      const pwErr = validatePassword(value);
      if (pwErr) e.password = pwErr;
    }
    return e;
  }

  function handleBlur(field: string, value: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fe = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (fe[field as keyof FieldErrors]) next[field as keyof FieldErrors] = fe[field as keyof FieldErrors];
      else delete next[field as keyof FieldErrors];
      return next;
    });
  }

  function handleChange(field: string, value: string) {
    if (field === 'email') setEmail(value);
    else if (field === 'password') setPassword(value);
    if (touched[field]) {
      const fe = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (fe[field as keyof FieldErrors]) next[field as keyof FieldErrors] = fe[field as keyof FieldErrors];
        else delete next[field as keyof FieldErrors];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setServerError(null);
    const ve = validate();
    setErrors(ve);
    if (Object.keys(ve).length > 0) return;
    setIsSubmitting(true);
    try {
      const res = await apiLogin({ email: email.trim(), password });
      if (!res.ok) {
        if (res.error.code === 'EMAIL_NOT_VERIFIED') {
          try { sessionStorage.setItem('sportsos:verify-email', email.trim()); } catch { /* ignore */ }
          setIsSubmitting(false);
          onSuccess();
          router.push('/verify/signup');
          return;
        }
        setServerError(res.error.message);
        setIsSubmitting(false);
        return;
      }
      try { localStorage.setItem('sportsos:auth-token', res.data.token); } catch { /* ignore */ }
      const userPhone = res.data.user.phone ?? '';
      setProfile({ name: res.data.user.name, email: res.data.user.email, phone: userPhone });
      setAuth(true, res.data.user.onboardingCompleted ?? false);
      trackLogin('email');
      setIsSubmitting(false);
      onSuccess();
      if (!res.data.user.onboardingCompleted) {
        router.replace('/onboarding/role');
      }
    } catch {
      setServerError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  }

  const errorId = (f: string) => `modal-login-${f}-error`;

  return (
    <motion.div custom={custom} variants={variants} initial="enter" animate="center" exit="exit">
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription className="text-xs">Welcome back to SportsOS</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {serverError && (
            <div role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </div>
          )}
          <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.05 }} className="flex flex-col gap-1.5">
            <Label htmlFor="modal-login-email">Email</Label>
            <Input
              id="modal-login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={(e) => handleBlur('email', e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? errorId('email') : undefined}
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && <p id={errorId('email')} role="alert" className="text-destructive text-xs">{errors.email}</p>}
          </motion.div>
          <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="flex flex-col gap-1.5">
            <Label htmlFor="modal-login-password">Password</Label>
            <Input
              id="modal-login-password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={(e) => handleBlur('password', e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? errorId('password') : undefined}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            {errors.password && <p id={errorId('password')} role="alert" className="text-destructive text-xs">{errors.password}</p>}
          </motion.div>
          <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : 'Sign in'}
            </Button>
          </motion.div>
        </form>
        <p className="text-muted-foreground mt-4 text-center text-xs">
          Don&apos;t have an account?{' '}
          <button onClick={onSwitch} className="text-foreground font-medium hover:underline">Sign up</button>
        </p>
      </CardContent>
    </Card>
    </motion.div>
  );
}

function RegisterView({
  onBack,
  onSwitch,
  onSuccess,
  onOpenChange,
  reduced,
  custom,
  variants,
}: {
  onBack: () => void;
  onSwitch: () => void;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
  reduced: boolean;
  custom?: number;
  variants?: Variants;
}) {
  const { setAuth, setProfile, isAuthenticated, onboardingCompleted, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;
    const isEditing = typeof window !== 'undefined' && sessionStorage.getItem('sportsos:editing-contact') === 'true';
    if (isEditing) {
      sessionStorage.removeItem('sportsos:editing-contact');
      return;
    }
    if (!onboardingCompleted) {
      router.push('/onboarding/role');
    } else {
      onSuccess();
      router.push('/');
    }
  }, [isLoading, isAuthenticated, onboardingCompleted, router, onSuccess]);

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!name.trim()) e.name = 'Name is required';
    else if (name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!phone.trim()) e.phone = 'Phone number is required';
    else {
      const digits = phone.replace(/\D/g, '');
      if (digits.length !== 10) e.phone = 'Phone number must be exactly 10 digits';
    }
    if (!password) e.password = 'Password is required';
    else {
      const pwErr = validatePassword(password);
      if (pwErr) e.password = pwErr;
    }
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (confirmPassword !== password) e.confirmPassword = 'Passwords do not match';
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
      if (!value) e.confirmPassword = 'Please confirm';
      else if (value !== password) e.confirmPassword = 'Passwords do not match';
    }
    return e;
  }

  function handleBlur(field: string, value: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fe = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (fe[field as keyof FieldErrors]) next[field as keyof FieldErrors] = fe[field as keyof FieldErrors];
      else delete next[field as keyof FieldErrors];
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
      const fe = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (fe[field as keyof FieldErrors]) next[field as keyof FieldErrors] = fe[field as keyof FieldErrors];
        else delete next[field as keyof FieldErrors];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });
    setServerError(null);
    const ve = validate();
    setErrors(ve);
    if (Object.keys(ve).length > 0) return;
    setIsSubmitting(true);
    try {
      const res = await apiRegister({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
      if (!res.ok) {
        setServerError(res.error.message);
        setIsSubmitting(false);
        return;
      }
      if (res.data.requiresVerification) {
        try { sessionStorage.setItem('sportsos:verify-email', res.data.email); } catch { /* ignore */ }
        trackSignup('email');
        setIsSubmitting(false);
        onOpenChange(false);
        router.push('/verify/signup');
        return;
      }
      setIsSubmitting(false);
      onOpenChange(false);
    } catch {
      setServerError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  }

  const errorId = (f: string) => `modal-register-${f}-error`;

  return (
    <motion.div custom={custom} variants={variants} initial="enter" animate="center" exit="exit">
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-xl">Create Account</CardTitle>
            <CardDescription className="text-xs">Join SportsOS today</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {serverError && (
            <div role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </div>
          )}
          <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.05 }} className="flex flex-col gap-1.5">
            <Label htmlFor="modal-reg-name">Full Name</Label>
            <Input
              id="modal-reg-name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={(e) => handleBlur('name', e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? errorId('name') : undefined}
              disabled={isSubmitting}
              autoComplete="name"
            />
            {errors.name && <p id={errorId('name')} role="alert" className="text-destructive text-xs">{errors.name}</p>}
          </motion.div>
          <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.08 }} className="flex flex-col gap-1.5">
            <Label htmlFor="modal-reg-email">Email</Label>
            <Input
              id="modal-reg-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={(e) => handleBlur('email', e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? errorId('email') : undefined}
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && <p id={errorId('email')} role="alert" className="text-destructive text-xs">{errors.email}</p>}
          </motion.div>
          <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.10 }} className="flex flex-col gap-1.5">
            <Label htmlFor="modal-reg-phone">Phone number</Label>
            <PhoneInput
              id="modal-reg-phone"
              value={phone}
              onChange={(val) => handleChange('phone', val)}
              onBlur={(e) => handleBlur('phone', e.target.value)}
              error={errors.phone}
              autoComplete="tel"
              required
              disabled={isSubmitting}
            />
          </motion.div>
          <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.11 }} className="flex flex-col gap-1.5">
            <Label htmlFor="modal-reg-password">Password</Label>
            <Input
              id="modal-reg-password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={(e) => handleBlur('password', e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? errorId('password') : undefined}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            {errors.password && <p id={errorId('password')} role="alert" className="text-destructive text-xs">{errors.password}</p>}
          </motion.div>
          <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.14 }} className="flex flex-col gap-1.5">
            <Label htmlFor="modal-reg-confirm">Confirm Password</Label>
            <Input
              id="modal-reg-confirm"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? errorId('confirm') : undefined}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p id={errorId('confirm')} role="alert" className="text-destructive text-xs">{errors.confirmPassword}</p>}
          </motion.div>
          <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.17 }}>
            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</> : 'Create account'}
            </Button>
          </motion.div>
        </form>
        <p className="text-muted-foreground mt-4 text-center text-xs">
          Already have an account?{' '}
          <button onClick={onSwitch} className="text-foreground font-medium hover:underline">Sign in</button>
        </p>
      </CardContent>
    </Card>
    </motion.div>
  );
}
