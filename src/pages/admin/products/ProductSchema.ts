
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome do produto deve ter pelo menos 3 caracteres',
  }),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, {
    message: 'O preço deve ser maior ou igual a zero',
  }),
  image_url: z.string().optional(),
  banner_image_url: z.string().optional(),
  type: z.enum(['physical', 'digital']),
  status: z.boolean(),
  has_whatsapp_support: z.boolean(),
  whatsapp_number: z.string().optional(),
  // Campos de customização de aparência
  use_global_colors: z.boolean().default(true),
  button_color: z.string().optional(),
  heading_color: z.string().optional(),
  banner_color: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
