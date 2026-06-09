'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type FieldErrors = Partial<Record<keyof EnquiryFormValues, string>>;

interface EnquiryFormValues {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  sport: string;
  childName?: string;
  childAge?: string;
  message?: string;
}

const initialValues: EnquiryFormValues = {
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  sport: '',
  childName: '',
  childAge: '',
  message: '',
};

function validate(values: EnquiryFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (values.parentName.trim().length < 2) errors.parentName = 'Please enter your name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.parentEmail)) errors.parentEmail = 'Enter a valid email';
  if (values.parentPhone.replace(/\D/g, '').length < 10) errors.parentPhone = 'Enter a valid phone';
  if (values.sport.trim().length === 0) errors.sport = 'Required';
  if (values.childAge && Number.isNaN(Number(values.childAge))) errors.childAge = 'Must be a number';
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
  const [values, setValues] = React.useState<EnquiryFormValues>({
    ...initialValues,
    sport: defaultSport ?? '',
  });
  const [errors, setErrors] = React.useState<FieldErrors>({});
  // targetType / targetId are present for callers that need them; we keep them
  // in the closure so future submit handlers can include them.
  void targetType;
  void targetId;

  const set = <K extends keyof EnquiryFormValues>(key: K, value: EnquiryFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    toast.success('Enquiry submitted');
    setValues({ ...initialValues, sport: defaultSport ?? '' });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
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
        <Button type="submit">Submit enquiry</Button>
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
