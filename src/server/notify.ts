import { createServerFn } from '@tanstack/react-start'
import { NotifyPayloadSchema } from '../lib/schema/notify'

// Fallback logic for GitHub pages which doesn't support running this server function.
// Usually you would hook directly to Ntfy / SMS / email APIs here.
export const notifySaman = createServerFn({ method: "POST" })
  .validator((data: unknown) => NotifyPayloadSchema.parse(data))
  .handler(async ({ data }) => {
    console.log('--- NOTIFY EVENT TRIGGERED ---')
    console.log(`Cafe picked: ${data.cafe.name}`)
    console.log(`When: ${data.pickedAt}`)
    
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1000))
    
    // We send payload to NTFY via REST hook in real environment:
    try {
      const resp = await fetch('https://ntfy.sh/saman-cafe-options-78ro0urem6', {
        method: 'POST',
        body: `She picked ${data.cafe.name}! 🎉`,
        headers: {
          'Title': 'New Cafe Date Picked!',
          'Tags': 'coffee,heart',
          'Authorization': `Bearer tk_rslwsgbzachy78ro0urem6dtjwzb8`
        }
      })
      if (!resp.ok) {
         throw new Error("NTFY failed")
      }
      return { success: true, message: "Saman has been notified via Ntfy!" }
    } catch(e) {
      // In SPA environment on GH pages this serverFn doesn't actually run serverside,
      // The frontend will mock the call when inside static export.
      throw new Error("Failed to send notification via network.")
    }
  })
