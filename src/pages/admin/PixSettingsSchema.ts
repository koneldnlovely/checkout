
import * as z from 'zod';
import { PixConfig } from '@/services/pixConfigService';

// Schema for form validation - updated to match the database schema
export const pixConfigSchema = z.object({
  id: z.number().optional(), // Changed from string to number
  chavepix: z.string().min(1, 'Chave PIX é obrigatória'),
  tipochave: z.string().min(1, 'Tipo de chave é obrigatório'),
  beneficiario: z.string().min(1, 'Nome do beneficiário é obrigatório'),
  copiaecola: z.string().min(1, 'Código copia e cola é obrigatório'),
  mensagemopcional: z.string().nullable().optional(), // Allow null values
});

export type PixConfigFormValues = z.infer<typeof pixConfigSchema>;
