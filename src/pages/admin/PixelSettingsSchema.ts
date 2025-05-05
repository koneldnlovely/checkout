
import * as z from 'zod';
import { PixelConfig } from '@/services/pixelConfigService';

// Schema for individual pixel entries
export const googleAdsPixelSchema = z.object({
  id: z.string().optional(),
  googleAdsId: z.string().optional().default(''),
  conversionLabel: z.string().optional().default(''),
  enabled: z.boolean().default(false),
});

export const facebookPixelSchema = z.object({
  id: z.string().optional(),
  facebookPixelId: z.string().optional().default(''),
  facebookToken: z.string().optional().default(''),
  enabled: z.boolean().default(false),
});

export const taboolaPixelSchema = z.object({
  taboolaAccountId: z.string().optional().default(''),
  enabled: z.boolean().default(false),
});

export const tiktokPixelSchema = z.object({
  tiktokPixelId: z.string().optional().default(''),
  enabled: z.boolean().default(false),
});

export const outbrainPixelSchema = z.object({
  outbrainPixelId: z.string().optional().default(''),
  enabled: z.boolean().default(false),
});

export const uolAdsPixelSchema = z.object({
  uolAdsId: z.string().optional().default(''),
  enabled: z.boolean().default(false),
});

// Schema for form validation
export const pixelConfigSchema = z.object({
  id: z.number().optional(),
  googleAdsPixels: z.array(googleAdsPixelSchema).default([]),
  facebookPixels: z.array(facebookPixelSchema).default([]),
  taboolaPixel: taboolaPixelSchema.default({}),
  tiktokPixel: tiktokPixelSchema.default({}),
  outbrainPixel: outbrainPixelSchema.default({}),
  uolAdsPixel: uolAdsPixelSchema.default({}),
});

export type PixelConfigFormValues = z.infer<typeof pixelConfigSchema>;
export type GoogleAdsPixel = z.infer<typeof googleAdsPixelSchema>;
export type FacebookPixel = z.infer<typeof facebookPixelSchema>;
