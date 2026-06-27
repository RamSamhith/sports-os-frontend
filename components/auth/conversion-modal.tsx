'use client';

import { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { useGoogleAuth, handleSocialAuth } from '@/lib/hooks/use-social-auth';
import { trackGuestConversion } from '@/lib/analytics/events';
import { Loader2, X, Lock } from 'lucide-react';
import { ease } from '@/components/motion/constants';

type ModalView = 'choose' | 'login';

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

interface ConversionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Contextual message shown below the title */
  actionLabel?: string;
}

export function ConversionModal({ open, onOpenChange, actionLabel }: ConversionModalProps) {
  const reduced = !!useReducedMotion();
  const router = useRouter();
  const { setAuth, setProfile, convertGuestToUser } = useAuth();
  const [socialLoading, setSocialLoading] = useState<'google' | null>(null);
  const [socialError, setSocialError] = useState<string | null>(null);

  const googleAuth = useGoogleAuth();

  function handleGoogleLogin() {
    setSocialLoading('google');
    if (!googleAuth.loaded) {
      setSocialError('Google Sign-In is loading. Please try again.');
      setSocialLoading(null);
      return;
    }
    googleAuth.initialize((credential) => {
      handleSocialAuth(credential, {
        setAuth,
        setProfile,
        onSuccess: () => {
          setSocialLoading(null);
          convertGuestToUser();
          trackGuestConversion('google');
          onOpenChange(false);
        },
        onError: (msg) => { setSocialError(msg); setSocialLoading(null); },
      });
    });
    googleAuth.prompt();
  }

  function handleEmailLogin() {
    trackGuestConversion('email_login');
    onOpenChange(false);
    router.push('/login');
  }

  function handleEmailSignup() {
    trackGuestConversion('email_signup');
    onOpenChange(false);
    router.push('/register');
  }

  function handleOtpLogin() {
    trackGuestConversion('otp_login');
    onOpenChange(false);
    router.push('/login');
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
              >
                <Card className="relative overflow-hidden">
                  <Dialog.Close asChild>
                    <button className="absolute right-3 top-3 text-muted-foreground hover:text-foreground rounded-full p-1" aria-label="Close">
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Sign in to continue</CardTitle>
                    <CardDescription>
                      {actionLabel ?? 'Create an account to save your favourites, make enquiries, and get personalised recommendations.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {socialError && (
                      <div role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {socialError}
                      </div>
                    )}

                    <Button variant="outline" className="w-full h-11 gap-2.5" size="lg" onClick={handleGoogleLogin} disabled={socialLoading !== null}>
                      {socialLoading === 'google' ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      )}
                      Continue with Google
                    </Button>

                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card text-muted-foreground px-2">or</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full h-11" onClick={handleEmailLogin}>
                      Sign in with email
                    </Button>
                    <Button variant="outline" className="w-full h-11" onClick={handleOtpLogin}>
                      Continue with OTP
                    </Button>

                    <div className="mt-2 text-center text-sm text-muted-foreground">
                      Don&apos;t have an account?{' '}
                      <button onClick={handleEmailSignup} className="text-foreground font-medium hover:underline">
                        Create account
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
