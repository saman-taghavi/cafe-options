import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { cn } from '../lib/utils/cn'
import { useSound } from '../hooks/useSound'

function Pill({
  active,
  onClick,
  children,
  variant = 'default',
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  variant?: 'default' | 'outline'
}) {
  const { play } = useSound()
  return (
    <motion.button
      onClick={() => {
        play('tick')
        onClick()
      }}
      whileTap={{ scale: 0.94, rotate: active ? 0 : -1.5 }}
      className={cn(
        'relative px-5 py-2 rounded-full text-[13px] font-medium tracking-wide capitalize',
        active
          ? 'text-paper'
          : variant === 'outline'
            ? 'bg-cream border border-dashed border-mocha/25 text-ink-muted hover:border-mocha/50 hover:text-ink'
            : 'bg-paper-warm text-ink-muted hover:bg-neutral-200 hover:text-ink',
      )}
    >
      {active && (
        <motion.span
          layoutId="filter-pill-active"
          className="absolute inset-0 rounded-full bg-ink shadow-sm ring-1 ring-ink/10"
          transition={{ type: 'spring', stiffness: 500, damping: 34 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

export function FilterBar({
  selected,
  onSelect,
  availableVibes,
}: {
  selected: string | null
  onSelect: (v: string | null) => void
  availableVibes: string[]
}) {
  return (
    <div className="w-full mt-8 mb-6">
      <div className="overflow-x-auto pb-4 pt-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2.5 min-w-max items-center">
          <Pill active={selected === null} onClick={() => onSelect(null)}>
            All of ours
          </Pill>

          {/* A little heart in place of a plain divider */}
          <Heart className="w-3 h-3 text-blush fill-blush shrink-0 mx-0.5" />

          {availableVibes.map(vibe => (
            <Pill
              key={vibe}
              active={selected === vibe}
              onClick={() => onSelect(selected === vibe ? null : vibe)}
              variant="outline"
            >
              {vibe.replace('-', ' ')}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  )
}
