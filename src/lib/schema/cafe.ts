import { z } from 'zod'

export const VibeSchema = z.enum([
  'laptop-friendly',
  'minimalist',
  'scandi',
  'brutalist',
  'sunset',
  'date-spot',
  'reading',
  'specialty',
  'hidden',
  'patisserie',
  'roastery',
  'vintage',
  'music',
  'matcha',
  'casual',
  'grab-and-go'
])

export const LocationSchema = z.enum([
  'Fereshteh',
  'Pasdaran',
  'Shahrak Gharb',
  'Ekbatan',
  'Valiasr',
  'Vanak',
  'Downtown',
  'Saadat Abad',
  'Tajrish',
  'Niavaran',
])

export const ArrondissementSchema = z.union([
  z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), 
  z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10), 
  z.literal(11), z.literal(12), z.literal(13), z.literal(14), z.literal(15), 
  z.literal(16), z.literal(17), z.literal(18), z.literal(19), z.literal(20)
])

export const InstagramMediaSchema = z.object({
  url: z.string().url().refine(val => val.includes('instagram.com/p/') || val.includes('instagram.com/reel/'), {
    message: "Must be a valid Instagram post or reel URL"
  }),
  alt: z.string(),
  credit: z.string().optional()
})

const BaseCafeSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens"),
  name: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  
  // Location
  location: z.object({
    neighborhood: LocationSchema,
    arrondissement: ArrondissementSchema,
    address: z.string(),
    mapsUrl: z.string().url(),
  }),
  
  // Vibe & Features
  vibes: z.array(VibeSchema).min(1).max(3),
  features: z.object({
    laptopFriendly: z.boolean(),
    wifi: z.boolean(),
    plugs: z.boolean(),
    terrace: z.boolean(),
    food: z.boolean(),
  }),
  
  // Media (IG URLs for embedding or scraping later)
  media: z.array(InstagramMediaSchema).min(1).max(5),
  
  // Editorial
  description: z.string().min(50).max(300),
  
  // Status
  status: z.enum(['active', 'closed', 'draft']).default('active'),
  
  // Metadata
  addedAt: z.string().datetime(),
})

export const CafeSchema = BaseCafeSchema

export type Vibe = z.infer<typeof VibeSchema>
export type Location = z.infer<typeof LocationSchema>
export type Arrondissement = z.infer<typeof ArrondissementSchema>
export type InstagramMedia = z.infer<typeof InstagramMediaSchema>
export type Cafe = z.infer<typeof CafeSchema>
