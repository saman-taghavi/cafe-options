import { z } from 'zod'
import { CafeSchema } from './cafe'

export const NotifyPayloadSchema = z.object({
  cafe: CafeSchema,
  pickedAt: z.string().datetime(),
  note: z.string().optional(),
})

export type NotifyPayload = z.infer<typeof NotifyPayloadSchema>
