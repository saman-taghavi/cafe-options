import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Wifi, Zap, Coffee, TreePine } from 'lucide-react'
import { type Cafe } from '../lib/schema/cafe'
import { cn } from '../lib/utils/cn'
import { HeartBurst } from './HeartBurst'
import { useSound } from '../hooks/useSound'

// Deterministic warm cover-art palette, picked per cafe so the placeholder
// (we can't hotlink real Instagram photos) still feels designed, not empty.
const COVER_THEMES = [
  { from: '#e8b4b8', to: '#6b4226', ink: '#fffdf8' }, // blush -> mocha
  { from: '#c5d1a5', to: '#3c2a1e', ink: '#fffdf8' }, // matcha soft -> ink
  { from: '#8a9a5b', to: '#3c2a1e', ink: '#fffdf8' }, // matcha -> ink
  { from: '#e8b4b8', to: '#7a5f4f', ink: '#fffdf8' }, // blush -> ink-muted
]

function themeForCafe(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return COVER_THEMES[hash % COVER_THEMES.length]
}

export function SwipeCard({
  cafe,
  shortlisted = false,
  onToggleShortlist,
}: {
  cafe: Cafe
  shortlisted?: boolean
  onToggleShortlist?: (e: any) => void
}) {
  const theme = themeForCafe(cafe.id)
  const initial = cafe.name.trim().charAt(0).toUpperCase()
  const patternId = `dots-${cafe.id}`
  const [burstKey, setBurstKey] = useState(0)
  const { play } = useSound()

  function handleToggle(e: any) {
    if (!shortlisted) {
      setBurstKey(k => k + 1)
      play('sparkle')
    }
    onToggleShortlist?.(e)
  }

  // Fix base routing for local dev vs GH Pages
  const basePath = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '')
  const imgSrc = cafe.heroImage?.startsWith('/') ? `${basePath}${cafe.heroImage}` : cafe.heroImage

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden rounded-card bg-cream shadow-card">
      {/* Cover art */}
      <div
        className="relative flex-1 overflow-hidden"
        style={cafe.heroImage ? undefined : { background: `linear-gradient(155deg, ${theme.from} 0%, ${theme.to} 100%)` }}
      >
        {cafe.heroImage ? (
          <>
            <img
              src={imgSrc}
              alt={cafe.media[0]?.alt ?? cafe.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(180deg, ${theme.to}00 45%, ${theme.to}cc 100%)` }}
            />
          </>
        ) : (
          <svg className="absolute inset-0 w-full h-full opacity-[0.14]" aria-hidden="true">
            <defs>
              <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.3" fill={theme.ink} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        )}

        {/* Vibe chips */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[62%] z-10">
          {cafe.vibes.slice(0, 2).map(vibe => (
            <span
              key={vibe}
              className="px-2.5 py-1 text-xs font-medium bg-paper/90 backdrop-blur-sm text-ink rounded-pill capitalize"
            >
              {vibe.replace('-', ' ')}
            </span>
          ))}
        </div>

        {/* Postmark badge — the card's one signature flourish */}
        <div
          className="absolute top-4 right-4 w-16 h-16 rounded-full border-[1.5px] border-dashed flex flex-col items-center justify-center z-10"
          style={{ borderColor: `${theme.ink}99`, color: theme.ink }}
        >
          <span className="font-display italic text-2xl leading-none">{initial}</span>
          <span className="text-[7px] font-semibold tracking-[0.12em] uppercase mt-0.5 opacity-80">
            {cafe.location.neighborhood.split(' ')[0]}
          </span>
        </div>

        {/* Ticket-stub perforation seam */}
        <div className="absolute bottom-0 left-0 right-0 h-0 z-10">
          <div className="absolute -left-3 bottom-0 w-6 h-6 rounded-full bg-paper translate-y-1/2" />
          <div className="absolute -right-3 bottom-0 w-6 h-6 rounded-full bg-paper translate-y-1/2" />
          <div
            className="absolute left-3 right-3 bottom-0 translate-y-1/2 h-0 border-t-2 border-dotted"
            style={{ borderColor: `${theme.ink}55` }}
          />
        </div>
      </div>

      {/* Info panel */}
      <div className="relative shrink-0 bg-cream px-5 pt-6 pb-5">
        <h3 className="font-display font-semibold text-xl text-ink leading-tight mb-1">{cafe.name}</h3>

        <div className="flex items-center text-sm text-ink-muted mb-2.5">
          <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span className="truncate">{cafe.location.neighborhood}</span>
        </div>

        <p className="text-sm text-ink-muted leading-snug line-clamp-2 mb-3">{cafe.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-ink-muted">
            {cafe.features.wifi && <Wifi className="w-4 h-4" />}
            {cafe.features.plugs && <Zap className="w-4 h-4" />}
            {cafe.features.terrace && <TreePine className="w-4 h-4" />}
            {cafe.features.food && <Coffee className="w-4 h-4" />}
          </div>

          <div className="relative -m-2 p-2">
            <HeartBurst burstKey={burstKey} />
            <motion.button
              onClick={handleToggle}
              onPointerDown={e => e.stopPropagation()}
              whileTap={{ scale: 0.8 }}
              animate={shortlisted ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.35 }}
              className="rounded-full text-ink-muted transition-colors hover:text-rose-500"
            >
              <Heart className={cn('w-5 h-5 transition-colors', shortlisted && 'fill-rose-500 text-rose-500')} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
