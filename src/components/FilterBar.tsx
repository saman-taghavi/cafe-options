import { motion } from 'framer-motion'
import { cn } from '../lib/utils/cn'

export function FilterBar({ 
  selected, 
  onSelect,
  availableVibes
}: { 
  selected: string | null, 
  onSelect: (v: string | null) => void,
  availableVibes: string[]
}) {
  return (
    <div className="w-full relative mt-8 mb-6">
      {/* Soft gradient fades for edge scrolling */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none" />
      
      <div className="overflow-x-auto pb-4 pt-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2.5 min-w-max items-center">
          <button
            onClick={() => onSelect(null)}
            className={cn(
              "px-5 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300",
              selected === null 
                ? "bg-ink text-paper shadow-sm scale-100" 
                : "bg-paper-warm text-ink-muted hover:bg-neutral-200 hover:text-ink scale-95"
            )}
          >
            All matches
          </button>
          
          {/* Vertical separator */}
          <div className="h-4 w-px bg-neutral-200 mx-1" />

          {availableVibes.map(vibe => (
            <button
              key={vibe}
              onClick={() => onSelect(selected === vibe ? null : vibe)}
              className={cn(
                "px-5 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 capitalize",
                selected === vibe 
                  ? "bg-ink text-paper shadow-sm scale-100 ring-1 ring-ink/10" 
                  : "bg-white border border-neutral-200/60 text-ink-muted hover:border-neutral-300 hover:text-ink hover:bg-neutral-50 scale-95"
              )}
            >
              {vibe.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
