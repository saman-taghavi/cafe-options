import { CafeSchema, type Cafe } from '../schema/cafe'

// Vite glob import of raw JSON strings or direct object modules
const cafeModules = import.meta.glob('../../../content/cafes/*.json', { eager: true })

export function getCafes(): Cafe[] {
  const cafes: Cafe[] = []
  
  for (const path in cafeModules) {
    const raw = cafeModules[path]
    // Depending on Vite config, eager json import might give an object { default: {...} } or just {...}
    const data = (raw as any).default || raw
    
    // Safely parse it through our schema to strip comments/unknown fields
    const parsed = CafeSchema.safeParse(data)
    
    if (parsed.success) {
      if (parsed.data.status === 'active') {
        cafes.push(parsed.data)
      }
    } else {
      console.warn(`Failed to process cafe from ${path}:`, parsed.error)
    }
  }
  
  return cafes.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
}
