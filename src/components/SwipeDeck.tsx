import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Coffee, Heart, X } from 'lucide-react'
import { SwipeCard } from './SwipeCard'
import { type Cafe } from '../lib/schema/cafe'
import { useSound } from '../hooks/useSound'

const VISIBLE_STACK = 3
const COMMIT_THRESHOLD = 90

export function SwipeDeck({
  cafes,
  onPick,
  onDismiss,
  shortlist,
  onToggleShortlist,
}: {
  cafes: Cafe[]
  onPick: (cafe: Cafe) => void
  onDismiss: (cafe: Cafe) => void
  shortlist: Set<string>
  onToggleShortlist: (id: string, e: any) => void
}) {
  const [index, setIndex] = useState(0)
  const [flingDir, setFlingDir] = useState<'left' | 'right' | null>(null)
  const dragX = useMotionValue(0)
  const likeOpacity = useTransform(dragX, [16, 110], [0, 1])
  const nopeOpacity = useTransform(dragX, [-110, -16], [1, 0])
  const wasDragged = useRef(false)
  const { play } = useSound()

  // `cafes` is a fresh array reference on every filter recompute even when
  // its actual contents haven't changed (e.g. hearting a card while a vibe
  // filter is active). Only reset the deck when the underlying pool of
  // cafes truly changes — otherwise switching to "My Shortlist" after
  // swiping deep into the full deck left `index` stuck past the new
  // (much shorter) list, showing "No more cafes" instead of the shortlist.
  const poolKey = useMemo(() => cafes.map(c => c.id).join('|'), [cafes])
  useEffect(() => {
    setIndex(0)
    setFlingDir(null)
    dragX.set(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolKey])

  const total = cafes.length

  if (index >= total) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 mt-12"
      >
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-6 border border-neutral-200 shadow-sm">
          <Coffee className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-3xl font-display font-medium text-neutral-900 mb-3">No more cafes</h3>
        <p className="text-neutral-500 text-lg mb-8 max-w-[280px] font-serif italic text-balance leading-snug">
          we went through all the cafes in Tehran I think!
        </p>
        <button
          onClick={() => { play('ready'); setIndex(0) }}
          className="bg-neutral-900 text-white px-8 py-3.5 rounded-full font-medium shadow-sm hover:bg-neutral-800 transition-all active:scale-[0.98]"
        >
          Start over
        </button>
      </motion.div>
    )
  }

  const activeCafe = cafes[index]
  const stack = cafes.slice(index, index + VISIBLE_STACK)

  function commit(dir: 'left' | 'right') {
    if (dir === 'right') {
      onToggleShortlist(activeCafe.id, null)
      play('sparkle')
    } else {
      onDismiss(activeCafe)
      play('whisper')
    }
    setIndex(i => i + 1)
    setFlingDir(null)
    dragX.set(0)
  }

  function triggerSwipe(dir: 'left' | 'right') {
    if (flingDir) return
    setFlingDir(dir)
  }

  function handleDragStart() {
    wasDragged.current = false
  }

  function handleDrag(_: any, info: any) {
    dragX.set(info.offset.x)
    if (Math.abs(info.offset.x) > 20 || Math.abs(info.offset.y) > 20) {
      wasDragged.current = true
    }
  }

  function handleDragEnd(_: any, info: any) {
    if (info.offset.x > COMMIT_THRESHOLD) triggerSwipe('right')
    else if (info.offset.x < -COMMIT_THRESHOLD) triggerSwipe('left')
    else dragX.set(0)
  }

  function handleTap() {
    if (wasDragged.current) {
      wasDragged.current = false
      return
    }
    play('page')
    onPick(activeCafe)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs font-medium tracking-[0.14em] uppercase text-ink-muted mb-4">
        {Math.min(index + 1, total)} of {total}
      </div>

      <div className="relative w-full max-w-sm h-[520px]">
        {stack
          .map((cafe, i) => ({ cafe, i }))
          .reverse()
          .map(({ cafe, i }) => {
            const isTop = i === 0

            return (
              <motion.div
                key={cafe.id}
                className={
                  'absolute inset-0 rounded-card ' +
                  (isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none')
                }
                drag={isTop ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragStart={isTop ? handleDragStart : undefined}
                onDrag={isTop ? handleDrag : undefined}
                onDragEnd={isTop ? handleDragEnd : undefined}
                onClick={isTop ? handleTap : undefined}
                initial={false}
                animate={
                  isTop && flingDir
                    ? {
                        x: flingDir === 'right' ? 520 : -520,
                        rotate: flingDir === 'right' ? 22 : -22,
                        opacity: 0,
                        transition: { duration: 0.32, ease: 'easeIn' },
                      }
                    : {
                        x: 0,
                        rotate: 0,
                        opacity: 1 - i * 0.18,
                        scale: 1 - i * 0.045,
                        y: i * 12,
                        transition: { type: 'spring', stiffness: 400, damping: 32 },
                      }
                }
                onAnimationComplete={() => {
                  if (isTop && flingDir) commit(flingDir)
                }}
                style={{ originY: 1, zIndex: VISIBLE_STACK - i }}
              >
                <SwipeCard
                  cafe={cafe}
                  shortlisted={shortlist.has(cafe.id)}
                  onToggleShortlist={(e: any) => {
                    e?.stopPropagation?.()
                    onToggleShortlist(cafe.id, e)
                  }}
                />
              </motion.div>
            )
          })}

        {/* Ink-stamp reactions, tied to live drag distance */}
        <motion.div
          className="absolute top-8 left-6 px-4 py-1.5 rounded-lg border-[3px] font-display font-bold text-lg uppercase tracking-wide -rotate-12 pointer-events-none z-20"
          style={{ opacity: nopeOpacity, borderColor: '#6b4226', color: '#6b4226' }}
        >
          Skip
        </motion.div>
        <motion.div
          className="absolute top-8 right-6 px-4 py-1.5 rounded-lg border-[3px] font-display font-bold text-lg uppercase tracking-wide rotate-12 pointer-events-none z-20"
          style={{ opacity: likeOpacity, borderColor: '#e8b4b8', color: '#c04a5a' }}
        >
          Save
        </motion.div>
      </div>

      {/* Tactile controls — same effect as the drag gesture */}
      <div className="flex items-center gap-6 mt-7">
        <motion.button
          onClick={() => triggerSwipe('left')}
          aria-label="Skip this cafe"
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.05 }}
          className="w-14 h-14 rounded-full bg-cream border border-ink/10 shadow-soft flex items-center justify-center text-ink-muted hover:text-mocha hover:border-mocha/30 transition-colors"
        >
          <X className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={() => triggerSwipe('right')}
          aria-label="Save this cafe"
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.08 }}
          className="w-16 h-16 rounded-full bg-coral shadow-card flex items-center justify-center text-white hover:brightness-95 transition-all"
        >
          <Heart className="w-7 h-7 fill-white" />
        </motion.button>
      </div>
    </div>
  )
}
