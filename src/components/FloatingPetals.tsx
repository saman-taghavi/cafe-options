import { useMemo } from 'react'
import { Heart } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const TONES = ['text-blush', 'text-blush-soft', 'text-matcha-soft', 'text-gold-soft']

/**
 * A light CSS-only sprinkle of hearts drifting down past the viewport —
 * pure decoration for moments that earn a little extra magic (the pick
 * ceremony, an empty state). Cheap enough to leave mounted; skipped
 * outright under reduced-motion.
 */
export function FloatingPetals({ count = 10 }: { count?: number }) {
  const reducedMotion = usePrefersReducedMotion()

  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 97) % 100}%`,
        delay: `${(i * 1.7) % 8}s`,
        duration: `${9 + (i % 5) * 2}s`,
        drift: `${(i % 2 === 0 ? 1 : -1) * (30 + (i % 4) * 20)}px`,
        size: 12 + (i % 3) * 6,
        tone: TONES[i % TONES.length],
      })),
    [count],
  )

  if (reducedMotion) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {petals.map((p, i) => (
        <Heart
          key={i}
          className={`absolute -top-4 fill-current opacity-0 ${p.tone}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `petal-fall ${p.duration} linear ${p.delay} infinite`,
            ['--drift' as any]: p.drift,
          }}
        />
      ))}
    </div>
  )
}
