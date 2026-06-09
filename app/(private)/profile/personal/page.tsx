'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { CheckCircle2 } from 'lucide-react';

interface ProfileErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function PersonalPage() {
  const { role, profile, setProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);

  // Hydrate from auth profile
  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
    setHydrated(true);
  }, [profile.name, profile.email, profile.phone]);

  function validate(): ProfileErrors {
    const e: ProfileErrors = {};

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

    return e;
  }

  function validateField(field: string, value: string) {
    const e: ProfileErrors = {};

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
    }

    return e;
  }

  function handleBlur(field: string, value: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldErrors[field as keyof ProfileErrors]) {
        next[field as keyof ProfileErrors] = fieldErrors[field as keyof ProfileErrors];
      } else {
        delete next[field as keyof ProfileErrors];
      }
      return next;
    });
  }

  function handleChange(field: string, value: string) {
    if (field === 'name') setName(value);
    else if (field === 'email') setEmail(value);
    else if (field === 'phone') setPhone(value);

    setSaved(false);

    if (touched[field]) {
      const fieldErrors = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldErrors[field as keyof ProfileErrors]) {
          next[field as keyof ProfileErrors] = fieldErrors[field as keyof ProfileErrors];
        } else {
          delete next[field as keyof ProfileErrors];
        }
        return next;
      });
    }
  }

  function handleSave() {
    setTouched({ name: true, email: true, phone: true });

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setSaved(true);
  }

  const errorId = (field: string) => `personal-${field}-error`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardDescription>
          {role === 'parent'
            ? 'Your parent profile details.'
            : 'Your athlete profile details.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="personal-name">Full name</Label>
            <Input
              id="personal-name"
              placeholder="Your name"
              value={name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={(e) => handleBlur('name', e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? errorId('name') : undefined}
              disabled={!hydrated}
            />
            {errors.name && (
              <p id={errorId('name')} role="alert" className="text-destructive text-xs">
                {errors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="personal-email">Email</Label>
            <Input
              id="personal-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={(e) => handleBlur('email', e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? errorId('email') : undefined}
              disabled={!hydrated}
            />
            {errors.email && (
              <p id={errorId('email')} role="alert" className="text-destructive text-xs">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="personal-phone">Phone number</Label>
            <Input
              id="personal-phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={(e) => handleBlur('phone', e.target.value)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? errorId('phone') : undefined}
              disabled={!hydrated}
            />
            {errors.phone && (
              <p id={errorId('phone')} role="alert" className="text-destructive text-xs">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-success flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </span>
          )}
          <Button onClick={handleSave} disabled={!hydrated}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
