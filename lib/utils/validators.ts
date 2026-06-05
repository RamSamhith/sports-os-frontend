import { z } from 'zod';

export const emailSchema = z.string().email();
export const phoneSchema = z
  .string()
  .min(10)
  .max(15)
  .regex(/^\+?[0-9\s-]+$/);

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
