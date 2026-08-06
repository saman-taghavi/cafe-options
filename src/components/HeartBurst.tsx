import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'

/**
 * A quick radial burst of tiny hearts, fired once per `burstKey` change.
 * Purely decorative feedback for "I just hearted this" — pass an
 * ever-incrementing key so re-firing the same value twice in a row still
 * animates (AnimatePresence keys off it).
 */
export function HeartBurst({ burstKey }: { burstKey: number }) {
  const particles = useMemo(() => Array.from({ length: 7 }, (_, i) => i), [])

  if (burstKey === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      <AnimatePresence>
        <motion.div key={burstKey} className="absolute inset-0 flex items-center justify-center">
          {particles.map(i => {
            const angle = (i / particles.length) * Math.PI * 2 + Math.random() * 0.4
            const dist = 22 + Math.random() * 20
            return (
              <motion.span
                key={i}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.3 }}
                animate={{
                  opacity: 0,
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist - 12,
                  scale: 0.9 + Math.random() * 0.5,
                }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                className="absolute text-rose-500"
              >
                <Heart className="w-3 h-3 fill-current" />
              </motion.span>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
