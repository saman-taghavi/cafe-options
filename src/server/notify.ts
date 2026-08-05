import { createServerFn } from '@tanstack/react-start'
import { NotifyPayloadSchema } from '../lib/schema/notify'

// In a real app we would use Resend / Twilio / Telegram Bot API here.
// For GitHub Pages SPA, this server fn won't run as a true backend, 
// but we structure it as an example of TanStack Start server functions.
export const notifySaman = createServerFn({ method: "POST" })
  .validator((data: unknown) => NotifyPayloadSchema.parse(data))
  .handler(async ({ data }) => {
    console.log('--- NOTIFY EVENT TRIGGERED ---')
    console.log(`Cafe picked: ${data.cafe.name}`)
    console.log(`When: ${data.pickedAt}`)
    
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1000))
    
    // 90% success rate
    if (Math.random() > 0.1) {
      return { success: true, message: "Saman has been notified!" }
    } else {
      throw new Error("Failed to send notification via network.")
    }
  })
