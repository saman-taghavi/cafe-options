import { motion } from 'framer-motion'
import { VibeSchema } from '../lib/schema/cafe'
import { cn } from '../lib/utils/cn'

const vibes = VibeSchema.options

export function FilterBar({ 
  selected, 
  onSelect 
}: { 
  selected: string | null, 
  onSelect: (v: string | null) => void 
}) {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-2 min-w-max">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            selected === null 
              ? "bg-neutral-900 text-white" 
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          )}
        >
          All
        </button>
        {vibes.map(vibe => (
          <button
            key={vibe}
            onClick={() => onSelect(selected === vibe ? null : vibe)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize",
              selected === vibe 
                ? "bg-neutral-900 text-white" 
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            )}
          >
            {vibe.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  )
}
