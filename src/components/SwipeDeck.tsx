import { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Coffee, Heart, X } from 'lucide-react'
import { SwipeCard } from './SwipeCard'
import { type Cafe } from '../lib/schema/cafe'

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

  const total = cafes.length

  if (index >= total) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6"
      >
        <div className="w-14 h-14 rounded-full bg-blush-soft text-mocha flex items-center justify-center mb-5">
          <Coffee className="w-6 h-6" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-ink mb-2">That's the whole stack</h3>
        <p className="text-ink-muted mb-6 max-w-sm">
          You've been through every spot on this list. Check your shortlist, or start the deck again from the top.
        </p>
        <button
          onClick={() => setIndex(0)}
          className="bg-mocha text-paper-warm px-6 py-2.5 rounded-pill font-medium hover:bg-ink transition-colors active:scale-95"
        >
          Start over
        </button>
      </motion.div>
    )
  }

  const activeCafe = cafes[index]
  const stack = cafes.slice(index, index + VISIBLE_STACK)

  function commit(dir: 'left' | 'right') {
    if (dir === 'right') onToggleShortlist(activeCafe.id, null)
    else onDismiss(activeCafe)
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
    if (Math.abs(info.offset.x) > 6) wasDragged.current = true
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
        <button
          onClick={() => triggerSwipe('left')}
          aria-label="Skip this cafe"
          className="w-14 h-14 rounded-full bg-cream border border-ink/10 shadow-soft flex items-center justify-center text-ink-muted hover:text-mocha hover:border-mocha/30 transition-colors active:scale-90"
        >
          <X className="w-6 h-6" />
        </button>
        <button
          onClick={() => triggerSwipe('right')}
          aria-label="Save this cafe"
          className="w-16 h-16 rounded-full bg-rose-500 shadow-card flex items-center justify-center text-white hover:bg-rose-600 transition-colors active:scale-90"
        >
          <Heart className="w-7 h-7 fill-white" />
        </button>
      </div>
    </div>
  )
}
