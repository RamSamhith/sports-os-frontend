'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { createEnquiry, type EnquiryCreatePayload } from '@/lib/api/enquiries';
import { useAuth } from '@/lib/hooks/use-auth';
import { GuestGuard } from '@/components/auth/guest-guard';

type FieldErrors = Partial<Record<keyof EnquiryFormValues, string>>;

interface EnquiryFormValues {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  sport: string;
  intent: 'trial' | 'contact' | 'callback' | 'enrollment_interest' | 'whatsapp';
  childName?: string;
  childAge?: string;
  message?: string;
}

const initialValues: EnquiryFormValues = {
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  sport: '',
  intent: 'trial',
  childName: '',
  childAge: '',
  message: '',
};

const intentOptions = [
  { value: 'trial', label: 'Book a Trial Session', description: 'Schedule a free trial class' },
  { value: 'contact', label: 'Request a Call', description: 'Get a phone call from the academy' },
  { value: 'whatsapp', label: 'WhatsApp', description: 'Connect via WhatsApp message' },
  { value: 'callback', label: 'Request Callback', description: 'We\'ll call you at a convenient time' },
  { value: 'enrollment_interest', label: 'Enrollment Interest', description: 'Show interest in enrolling' },
] as const;

function validate(values: EnquiryFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (values.parentName.trim().length < 2) errors.parentName = 'Please enter your name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.parentEmail)) errors.parentEmail = 'Enter a valid email';
  if (values.parentPhone.replace(/\D/g, '').length < 10) errors.parentPhone = 'Enter a valid phone';
  if (values.sport.trim().length === 0) errors.sport = 'Required';
  if (values.childAge && (Number.isNaN(Number(values.childAge)) || Number(values.childAge) < 3 || Number(values.childAge) > 25)) errors.childAge = 'Age must be between 3 and 25';
  return errors;
}

export function EnquiryForm({
  targetType,
  targetId,
  defaultSport,
}: {
  targetType: 'academy' | 'coach';
  targetId: string;
  defaultSport?: string;
}) {
  const router = useRouter();
  const { isGuest, isAuthenticated } = useAuth();
  const [values, setValues] = React.useState<EnquiryFormValues>({
    ...initialValues,
    sport: defaultSport ?? '',
  });
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const set = <K extends keyof EnquiryFormValues>(key: K, value: EnquiryFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    const payload: EnquiryCreatePayload = {
      targetType,
      targetId,
      intent: values.intent,
      parentInfo: {
        name: values.parentName.trim(),
        email: values.parentEmail.trim(),
        phone: values.parentPhone.trim(),
      },
      sportInterest: values.sport.trim(),
    };

    if (values.childName?.trim()) {
      payload.childInfo = {
        name: values.childName.trim(),
        age: values.childAge ? Number(values.childAge) : 0,
      };
    }

    if (values.message?.trim()) {
      payload.message = values.message.trim();
    }

    try {
      const res = await createEnquiry(payload);

      if (!res.ok) {
        setServerError(res.error.message);
        setIsSubmitting(false);
        return;
      }

      toast.success('Enquiry submitted');
      setIsSubmitting(false);
      router.push('/enquiry/success');
    } catch {
      setServerError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {serverError && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Intent Selection */}
      <div className="flex flex-col gap-2">
        <Label>How would you like to connect?</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {intentOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => set('intent', option.value)}
              className={`border-border/60 rounded-lg border p-3 text-left transition-colors ${
                values.intent === option.value
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'bg-card/40 hover:border-foreground/20'
              }`}
            >
              <p className="text-sm font-medium">{option.label}</p>
              <p className="text-muted-foreground mt-0.5 text-[11px]">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Parent name" error={errors.parentName} fieldName="parentName">
          <Input value={values.parentName} onChange={(e) => set('parentName', e.target.value)} placeholder="Your name" />
        </Field>
        <Field label="Email" error={errors.parentEmail} fieldName="parentEmail">
          <Input
            type="email"
            value={values.parentEmail}
            onChange={(e) => set('parentEmail', e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Phone" error={errors.parentPhone} fieldName="parentPhone">
          <Input
            type="tel"
            value={values.parentPhone}
            onChange={(e) => set('parentPhone', e.target.value)}
            placeholder="+91…"
          />
        </Field>
        <Field label="Sport" error={errors.sport} fieldName="sport">
          <Input value={values.sport} onChange={(e) => set('sport', e.target.value)} placeholder="Cricket" />
        </Field>
        <Field label="Child name (optional)" fieldName="childName">
          <Input value={values.childName ?? ''} onChange={(e) => set('childName', e.target.value)} placeholder="Optional" />
        </Field>
        <Field label="Child age (optional)" error={errors.childAge} fieldName="childAge">
          <Input
            type="number"
            min={3}
            max={25}
            value={values.childAge ?? ''}
            onChange={(e) => set('childAge', e.target.value)}
            placeholder="Optional"
          />
        </Field>
      </div>
      <Field label="Message (optional)" fieldName="message">
        <Textarea
          rows={4}
          value={values.message ?? ''}
          onChange={(e) => set('message', e.target.value)}
          placeholder="Share anything that helps us help you."
        />
      </Field>
      <div className="flex justify-end gap-2">
        {isGuest || !isAuthenticated ? (
          <GuestGuard>
            <Button type="button">
              Submit enquiry
            </Button>
          </GuestGuard>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit enquiry'}
          </Button>
        )}
      </div>
    </form>
  );
}

function Field({ label, error, fieldName, children }: { label: string; error?: string; fieldName: string; children: React.ReactNode }) {
  const errorId = error ? `field-${fieldName}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={`field-${fieldName}`}>{label}</Label>
      <div id={`field-${fieldName}`} aria-invalid={!!error || undefined} aria-describedby={errorId}>
        {children}
      </div>
      {error ? <p id={errorId} role="alert" className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}
