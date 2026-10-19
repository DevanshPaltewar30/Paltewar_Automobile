import { z } from 'zod'

export const customerSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name must be less than 100 characters'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[+]?[\d\s\-()]+$/, 'Invalid phone number format'),
  alternateMobileNumber: z
    .string()
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[+]?[\d\s\-()]+$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  address: z.string().max(500, 'Address too long').optional().or(z.literal('')),
  city: z.string().max(100, 'City name too long').optional().or(z.literal('')),
  district: z
    .string()
    .max(100, 'District name too long')
    .optional()
    .or(z.literal('')),
  state: z
    .string()
    .max(100, 'State name too long')
    .optional()
    .or(z.literal('')),
  workDescription: z
    .string()
    .max(1000, 'Work description too long')
    .optional()
    .or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
  notes: z.string().max(2000, 'Notes too long').optional().or(z.literal('')),
})

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must be less than 100 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type CustomerFormData = z.infer<typeof customerSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type LoginFormData = z.infer<typeof loginSchema>
