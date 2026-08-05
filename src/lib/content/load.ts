import { CafeSchema, type Cafe } from '../schema/cafe'

import { createRequire } from 'node:module'
const _require = typeof require !== 'undefined' ? require : createRequire(import.meta.url)

export function getCafes(): Cafe[] {
  const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node'
  
  if (isNode && typeof window === 'undefined') {
    // Import via dynamic import or direct require trick
    const fs = _require('node:fs')
    const path = _require('node:path')
    const cafesDir = path.resolve(process.cwd(), 'content/cafes')
    const files = fs.readdirSync(cafesDir).filter((f: string) => f.endsWith('.json'))
    const cafes: Cafe[] = []
    
    for (const file of files) {
      const p = path.join(cafesDir, file)
      const data = JSON.parse(fs.readFileSync(p, 'utf-8'))
      const parsed = CafeSchema.safeParse(data)
      if (parsed.success) {
        if (parsed.data.status === 'active') {
          cafes.push(parsed.data)
        }
      }
    }
    
    return cafes.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
  }

  // Vite glob import of raw JSON strings or direct object modules
  // @ts-ignore
  const cafeModules = import.meta.glob('../../../content/cafes/*.json', { eager: true })

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
