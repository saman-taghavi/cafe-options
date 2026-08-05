import { useState, useMemo } from 'react'
import { FilterBar } from '../components/FilterBar'
import { CafeCard } from '../components/CafeCard'
import { CafeSheet } from '../components/CafeSheet'
import { getCafes } from '../lib/content/load'
import { motion, AnimatePresence } from 'framer-motion'
import { type Cafe } from '../lib/schema/cafe'
import { Copy } from '../lib/content/copy'

export function CafeGrid() {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null)
  const [shortlist, setShortlist] = useState<Set<string>>(new Set())
  const [activeCafe, setActiveCafe] = useState<Cafe | null>(null)
  
  // Need to call this outside of render? No, in a real setup we'd load it at route level
  // but since it's just static files we can load it here.
  const allCafes = useMemo(() => getCafes(), [])

  const filtered = useMemo(() => {
    if (!selectedVibe) return allCafes
    return allCafes.filter(c => c.vibes.includes(selectedVibe as any))
  }, [allCafes, selectedVibe])

  const toggleShortlist = (id: string) => {
    const next = new Set(shortlist)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setShortlist(next)
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <FilterBar selected={selectedVibe} onSelect={setSelectedVibe} />
      
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 pb-32 px-4 md:px-8">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map(cafe => (
              <div key={cafe.id} onClick={() => setActiveCafe(cafe)} className="cursor-pointer">
                <CafeCard 
                  cafe={cafe} 
                  shortlisted={shortlist.has(cafe.id)}
                  onToggleShortlist={(e) => {
                    e?.stopPropagation()
                    toggleShortlist(cafe.id)
                  }}
                />
              </div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="col-span-full py-20 text-center text-neutral-400 font-medium"
            >
              {Copy.hero.emptyFilter}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <CafeSheet 
        cafe={activeCafe} 
        open={!!activeCafe} 
        onOpenChange={(open) => !open && setActiveCafe(null)} 
      />
    </div>
  )
}
