import { useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Heart, MapPin, Wifi, Zap, Coffee, Camera } from 'lucide-react'
import { type Cafe } from '../lib/schema/cafe'
import { cn } from '../lib/utils/cn'
import { HeartBurst } from './HeartBurst'
import { useSound } from '../hooks/useSound'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

// A washi-tape strip in one of a few on-theme colors, picked deterministically
// per cafe so the same card always gets the same "hand-placed" tape.
const TAPE_TONES = [
  'bg-blush/70',
  'bg-matcha-soft/70',
  'bg-gold-soft/70',
  'bg-blush-soft/80',
]

function hashString(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return hash
}

export function CafeCard({ cafe, shortlisted = false, onToggleShortlist }: { cafe: Cafe, shortlisted?: boolean, onToggleShortlist?: () => void }) {
  // Fix base routing for local dev vs GH Pages
  const basePath = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '')
  const imgSrc = cafe.heroImage?.startsWith('/') ? `${basePath}${cafe.heroImage}` : cafe.heroImage

  const cardRef = useRef<HTMLDivElement>(null)
  const [burstKey, setBurstKey] = useState(0)
  const { play } = useSound()
  const reducedMotion = usePrefersReducedMotion()

  // A tiny, deterministic "someone placed this by hand" tilt + tape color —
  // stable per card so the corkboard doesn't reshuffle itself on re-render.
  const { baseRotate, tapeTone, tapeRotate, tapeLeft } = useMemo(() => {
    const hash = hashString(cafe.id)
    return {
      baseRotate: ((hash % 7) - 3) * 0.6, // roughly -1.8deg .. 1.8deg
      tapeTone: TAPE_TONES[hash % TAPE_TONES.length],
      tapeRotate: ((hash >> 3) % 9) - 4, // -4deg .. 4deg
      tapeLeft: 18 + ((hash >> 5) % 40), // 18% .. 58%
    }
  }, [cafe.id])

  // Gentle 3D tilt that follows the pointer — a photograph you can pick up
  // and angle toward the light, not a "SaaS card hover effect".
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), { stiffness: 250, damping: 22 })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), { stiffness: 250, damping: 22 })

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  function handlePointerLeave() {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    if (!shortlisted) {
      setBurstKey(k => k + 1)
      play('sparkle')
    }
    onToggleShortlist?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: baseRotate }}
      animate={{ opacity: 1, y: 0, rotate: baseRotate }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ rotate: 0, scale: 1.03, transition: { duration: 0.35 } }}
      className="relative"
    >
      {/* Washi tape, hand-placed at a slight angle over the top edge */}
      <div
        className={cn('absolute -top-2.5 h-5 w-14 z-20 shadow-sm', tapeTone)}
        style={{ left: `${tapeLeft}%`, transform: `translateX(-50%) rotate(${tapeRotate}deg)` }}
      />

      <motion.div
        ref={cardRef}
        layout
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        whileHover={{ boxShadow: '0 16px 36px rgba(60,42,30,0.2)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="group flex flex-col bg-cream overflow-hidden rounded-sm border border-ink/5 shadow-card p-2.5 pb-4"
      >
        <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden rounded-[2px]">
          {cafe.heroImage ? (
            <img
              src={imgSrc}
              alt={cafe.media[0]?.alt ?? cafe.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : cafe.media[0] && (
            <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-100 transition-transform duration-500 group-hover:scale-105 flex flex-col justify-center items-center text-center p-6 bg-[length:400%_400%] animate-pulse-slow">
               <h4 className="font-serif italic text-2xl text-neutral-400 opacity-60 mb-2">{cafe.name}</h4>
               <Camera className="w-5 h-5 text-neutral-300" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {cafe.vibes.slice(0, 2).map(vibe => (
              <span key={vibe} className="px-2.5 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-neutral-800 rounded-full capitalize">
                {vibe.replace('-', ' ')}
              </span>
            ))}
          </div>

          {/* Shortlist button */}
          <div className="absolute top-3 right-3 z-10">
            <HeartBurst burstKey={burstKey} />
            <motion.button
              onClick={handleToggle}
              whileTap={{ scale: 0.8 }}
              animate={shortlisted ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.35 }}
              className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-neutral-600 transition-colors hover:text-red-500 hover:bg-white"
            >
              <Heart className={cn("w-5 h-5 transition-colors", shortlisted && "fill-red-500 text-red-500")} />
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col flex-1 pt-4 px-1.5" style={{ transform: 'translateZ(1px)' }}>
          <h3 className="font-display font-semibold text-lg text-ink mb-1">{cafe.name}</h3>

          <div className="flex items-center text-sm text-ink-muted mb-3 font-script text-base">
            <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span>{cafe.location.neighborhood}</span>
          </div>

          <div className="flex items-center gap-3 text-ink-muted/70 mt-auto">
            {cafe.features.wifi && <Wifi className="w-4 h-4" />}
            {cafe.features.plugs && <Zap className="w-4 h-4" />}
            {cafe.features.food && <Coffee className="w-4 h-4" />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
