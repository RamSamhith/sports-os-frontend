import { z } from 'zod';

export const emailSchema = z.string().min(1, 'Email is required').email('Enter a valid email address');

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits');

export function validateEmail(value: string): string {
  if (!value.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
  return '';
}

export function validatePhone(value: string): string {
  if (!value.trim()) return 'Phone number is required';
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 10) return 'Phone number must be exactly 10 digits';
  return '';
}

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug');

export const enquiryFormSchema = z.object({
  targetType: z.enum(['academy', 'coach']),
  targetId: z.string().min(1),
  intent: z.enum(['contact', 'callback', 'trial', 'enrollment_interest']),
  parentName: z.string().min(2).max(80),
  parentEmail: emailSchema,
  parentPhone: phoneSchema,
  childName: z.string().min(1).max(80).optional(),
  childAge: z.coerce.number().int().min(3).max(25).optional(),
  sport: z.string().min(1),
  message: z.string().max(1000).optional(),
});

export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;
