import { z } from 'zod';

export const emailSchema = z.string().min(1, 'Email is required').email('Enter a valid email address');

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits');

// Password validation matching backend: min 8 chars, uppercase, lowercase, digit
export function validatePassword(value: string): string {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
  if (!/\d/.test(value)) return 'Password must contain at least one number';
  return '';
}

export function getPasswordErrors(value: string): Record<string, string> {
  const errors: Record<string, string> = {};
  if (value.length < 8) errors.minLength = 'At least 8 characters';
  if (!/[A-Z]/.test(value)) errors.uppercase = 'One uppercase letter';
  if (!/[a-z]/.test(value)) errors.lowercase = 'One lowercase letter';
  if (!/\d/.test(value)) errors.number = 'One number';
  return errors;
}

export const enquiryFormSchema = z.object({
  targetType: z.enum(['academy', 'coach']),
  targetId: z.string().min(1),
  intent: z.enum(['contact', 'callback', 'trial', 'enrollment_interest', 'whatsapp']),
  parentName: z.string().min(2).max(80),
  parentEmail: emailSchema,
  parentPhone: phoneSchema,
  childName: z.string().min(1).max(80).optional(),
  childAge: z.coerce.number().int().min(3).max(25).optional(),
  sport: z.string().min(1),
  message: z.string().max(1000).optional(),
});

export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;
