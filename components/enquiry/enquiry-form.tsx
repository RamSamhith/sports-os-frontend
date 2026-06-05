'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enquiryFormSchema, type EnquiryFormValues } from '@/lib/utils/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function EnquiryForm({
  targetType,
  targetId,
  defaultSport,
}: {
  targetType: 'academy' | 'coach';
  targetId: string;
  defaultSport?: string;
}) {
  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      targetType,
      targetId,
      intent: 'contact',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      sport: defaultSport ?? '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    toast.success('Enquiry submitted');
    form.reset();
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Parent name" error={form.formState.errors.parentName?.message}>
          <Input {...form.register('parentName')} placeholder="Your name" />
        </Field>
        <Field label="Email" error={form.formState.errors.parentEmail?.message}>
          <Input type="email" {...form.register('parentEmail')} placeholder="you@example.com" />
        </Field>
        <Field label="Phone" error={form.formState.errors.parentPhone?.message}>
          <Input type="tel" {...form.register('parentPhone')} placeholder="+91…" />
        </Field>
        <Field label="Sport" error={form.formState.errors.sport?.message}>
          <Input {...form.register('sport')} placeholder="Cricket" />
        </Field>
        <Field label="Child name (optional)">
          <Input {...form.register('childName')} placeholder="Optional" />
        </Field>
        <Field label="Child age (optional)">
          <Input type="number" min={3} max={25} {...form.register('childAge')} placeholder="Optional" />
        </Field>
      </div>
      <Field label="Message (optional)">
        <Textarea rows={4} {...form.register('message')} placeholder="Share anything that helps us help you." />
      </Field>
      <div className="flex justify-end gap-2">
        <Button type="submit">Submit enquiry</Button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}
