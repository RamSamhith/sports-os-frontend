'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence, type Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { login as apiLogin, register as apiRegister } from '@/lib/api/auth';
import { Loader2, ArrowLeft } from 'lucide-react';
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

/** Directional slide for view transitions — slides right on forward, left on back. */
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
  const { setAuth, setProfile } = useAuth();
  const [view, setView] = useState<ModalView>(defaultView);
  const [direction, setDirection] = useState(1);

  // Reset view when modal opens
  useEffect(() => {
    if (open) {
      setView(defaultView);
      setDirection(1);
    }
  }, [open, defaultView]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleGuest = useCallback(() => {
    onOpenChange(false);
    router.push('/');
  }, [onOpenChange, router]);

  const navigateView = useCallback((next: ModalView) => {
    setDirection(next === 'choose' ? -1 : 1);
    setView(next);
  }, []);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
          variants={reduced ? undefined : overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-sm"
            variants={reduced ? undefined : cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AnimatePresence mode="wait" custom={direction}>
              {view === 'choose' && (
                <ChooseView
                  key="choose"
                  custom={direction}
                  variants={reduced ? undefined : viewVariants}
                  onSelect={(v) => navigateView(v)}
                  onGuest={handleGuest}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChooseView({
  onSelect,
  onGuest,
  reduced,
  custom,
  variants,
}: {
  onSelect: (view: ModalView) => void;
  onGuest: () => void;
  reduced: boolean;
  custom?: number;
  variants?: Variants;
}) {
  return (
    <motion.div custom={custom} variants={variants} initial="enter" animate="center" exit="exit">
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome to SportsOS</CardTitle>
        <CardDescription>Sign in or create an account to get started</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible">
          <Button className="w-full" size="lg" onClick={() => onSelect('login')}>
            Sign In
          </Button>
        </motion.div>
        <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.05 }}>
          <Button variant="outline" className="w-full" size="lg" onClick={() => onSelect('register')}>
            Create Account
          </Button>
        </motion.div>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card text-muted-foreground px-2">Or</span>
          </div>
        </div>
        <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
          <Button variant="ghost" className="w-full" size="lg" onClick={onGuest}>
            Continue as Guest
          </Button>
        </motion.div>
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
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
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
    const fe = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (fe[field as keyof FieldErrors]) {
        next[field as keyof FieldErrors] = fe[field as keyof FieldErrors];
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
      const fe = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (fe[field as keyof FieldErrors]) {
          next[field as keyof FieldErrors] = fe[field as keyof FieldErrors];
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
    const ve = validate();
    setErrors(ve);
    if (Object.keys(ve).length > 0) return;
    setIsSubmitting(true);
    try {
      const res = await apiLogin({ email: email.trim(), password });
      if (!res.ok) {
        setServerError(res.error.message);
        setIsSubmitting(false);
        return;
      }
      try { localStorage.setItem('sportsos:auth-token', res.data.token); } catch { /* ignore */ }
      setProfile({ name: res.data.user.name, email: res.data.user.email, phone: (res.data.user as unknown as Record<string, unknown>).phone as string ?? '' });
      setAuth(true);
      setIsSubmitting(false);
      onSuccess();
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
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
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
            />
            {errors.password && <p id={errorId('password')} role="alert" className="text-destructive text-xs">{errors.password}</p>}
          </motion.div>
          <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
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
  const { setAuth, setProfile, isAuthenticated, verified, onboardingCompleted, isLoading } = useAuth();
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

  // Navigate after auth state change (fresh registration)
  // The handler only navigates for edit flow — this effect handles everything else
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      const isEditing = typeof window !== 'undefined' && sessionStorage.getItem('sportsos:editing-contact') === 'true';
      if (isEditing) {
        sessionStorage.removeItem('sportsos:editing-contact');
        return;
      }
      // MVP: verification skipped — verified is auto-set by setAuth(true)
      if (!onboardingCompleted) {
        router.push('/onboarding/role');
        return;
      }
      onSuccess();
      router.push('/');
    }
  }, [isLoading, isAuthenticated, verified, onboardingCompleted, router, onSuccess]);

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
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
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
      if (!value) e.password = 'Password is required';
      else if (value.length < 8) e.password = 'Password must be at least 8 characters';
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
      if (fe[field as keyof FieldErrors]) {
        next[field as keyof FieldErrors] = fe[field as keyof FieldErrors];
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
      const fe = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (fe[field as keyof FieldErrors]) {
          next[field as keyof FieldErrors] = fe[field as keyof FieldErrors];
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
      try { localStorage.setItem('sportsos:auth-token', res.data.token); } catch { /* ignore */ }
      setProfile({ name: res.data.user.name, email: res.data.user.email, phone: (res.data.user as unknown as Record<string, unknown>).phone as string ?? phone.trim() });
      const wasAuthenticated = isAuthenticated;
      setAuth(true);
      setIsSubmitting(false);
      if (wasAuthenticated) {
        router.push('/onboarding/role');
      } else {
        onOpenChange(false);
        router.push('/onboarding/role');
      }
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
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
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
            />
            {errors.email && <p id={errorId('email')} role="alert" className="text-destructive text-xs">{errors.email}</p>}
          </motion.div>
          <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.10 }} className="flex flex-col gap-1.5">
            <Label htmlFor="modal-reg-phone">Phone number</Label>
            <Input
              id="modal-reg-phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={(e) => handleBlur('phone', e.target.value)}
              autoComplete="tel"
              required
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? errorId('phone') : undefined}
              disabled={isSubmitting}
            />
            {errors.phone && <p id={errorId('phone')} role="alert" className="text-destructive text-xs">{errors.phone}</p>}
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
              aria-describedby={errors.confirmPassword ? errorId('confirmPassword') : undefined}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <p id={errorId('confirmPassword')} role="alert" className="text-destructive text-xs">{errors.confirmPassword}</p>}
          </motion.div>
          <motion.div variants={reduced ? undefined : formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.17 }}>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
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
