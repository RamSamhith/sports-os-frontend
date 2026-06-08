'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SharedLayout } from '@/components/motion/shared-layout';
import { cn } from '@/lib/utils/cn';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <SharedLayout layoutId="auth-card">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <motion.div
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'show'}
            variants={reduced ? undefined : { hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.3, 0, 0, 1] } } }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
            </span>
            <span className="text-sm font-medium text-primary">Welcome back</span>
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
          >
            <motion.div
              variants={reduced ? undefined : fieldVariants}
              transition={{ delay: 0.15 }}
              className="flex flex-col gap-1.5"
            >
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </motion.div>
            <motion.div
              variants={reduced ? undefined : fieldVariants}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </motion.div>
            <motion.button
              type="submit"
              variants={reduced ? undefined : { hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.2, 0, 0, 1], delay: 0.25 } } }}
              className="mt-2 w-full"
            >
              <Button className="w-full">Sign in</Button>
            </motion.button>
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
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 0, y: 8 } : 'hidden'}
            animate={reduced ? { opacity: 1, y: 0 } : 'show'}
            transition={{ delay: 0.35 }}
            className="grid grid-cols-2 gap-3"
          >
            <Link href="/signup">
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