import { motion } from 'framer-motion'
import { Heart, MapPin, Coffee } from 'lucide-react'
import { type Cafe } from '../../lib/schema/cafe'

/**
 * The souvenir moment — a screenshot-worthy card that closes out the pick
 * ceremony. Gradient-shimmer border, her note in a handwritten font,
 * couple motif. This is the thing she keeps.
 */
export function DateCard({ cafe, note }: { cafe: Cafe; note?: string }) {
  const basePath = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '')
  const imgSrc = cafe.heroImage?.startsWith('/') ? `${basePath}${cafe.heroImage}` : cafe.heroImage
  const today = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <motion.div
      initial={{ y: 16, opacity: 0, rotate: -1.5 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.15 }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Shimmering gradient border */}
      <div className="rounded-[28px] p-[3px] bg-[linear-gradient(120deg,#e8b4b8,#d9a94e,#c5d1a5,#e8b4b8)] bg-[length:200%_100%] animate-[shimmer-sweep_6s_linear_infinite] shadow-glow">
        <div className="rounded-[26px] bg-cream overflow-hidden">
          {imgSrc && (
            <div className="relative h-40 w-full overflow-hidden">
              <img src={imgSrc} alt={cafe.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-cream/90 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {cafe.location.neighborhood}
              </div>
            </div>
          )}

          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-mocha mb-3">
              <Coffee className="w-4 h-4" />
              <Heart className="w-4 h-4 fill-current text-rose-500" />
              <Coffee className="w-4 h-4" />
            </div>

            <p className="text-xs uppercase tracking-[0.18em] text-ink-muted mb-1">Saved for us</p>
            <h3 className="text-2xl font-display font-semibold text-ink mb-3">{cafe.name}</h3>

            {note?.trim() && (
              <p className="font-script text-xl text-mocha leading-snug mb-3 px-2">"{note.trim()}"</p>
            )}

            <div className="flex flex-wrap justify-center gap-1.5 mb-4">
              {cafe.vibes.slice(0, 3).map(vibe => (
                <span key={vibe} className="px-2.5 py-0.5 bg-blush-soft/60 text-mocha rounded-full text-[11px] font-medium capitalize">
                  {vibe.replace('-', ' ')}
                </span>
              ))}
            </div>

            <p className="text-[11px] text-ink-muted/70 tracking-wide">It's a date · {today}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
