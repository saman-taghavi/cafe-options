import { createFileRoute } from '@tanstack/react-router'
import { getCafes } from '../lib/content/load'
import { FilterBar } from '../components/FilterBar'
import { CafeCard } from '../components/CafeCard'
import { CafeSheet } from '../components/CafeSheet'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'

export const Route = createFileRoute('/')({ 
  component: Home,
  loader: async () => {
    return { cafes: getCafes() }
  }
})

function Home() {
  const { cafes } = Route.useLoaderData()
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null)
  const [shortlist, setShortlist] = useState<Set<string>>(new Set())
  const [activeCafe, setActiveCafe] = useState<any>(null)

  
  const filtered = useMemo(() => {
    if (!selectedVibe) return cafes
    return cafes.filter(c => c.vibes.includes(selectedVibe as any))
  }, [cafes, selectedVibe])

  const toggleShortlist = (id: string) => {
    const next = new Set(shortlist)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setShortlist(next)
  }

  if (cafes.length === 0) {
    return (
      <main className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-blush-soft text-mocha flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
            <line x1="6" y1="2" x2="6" y2="4"></line>
            <line x1="10" y1="2" x2="10" y2="4"></line>
            <line x1="14" y1="2" x2="14" y2="4"></line>
          </svg>
        </div>
        
        <h1 className="text-3xl font-display mb-4 text-ink font-semibold">
          No cafés here... yet
        </h1>
        
        <p className="text-ink-muted leading-relaxed mb-10 text-lg">
          This is an intimate, curated list built just for us. 
          Behind the scenes, the list is empty, waiting to be filled with our next favorite spots.
        </p>

        <button className="bg-mocha text-paper-warm px-6 py-3 rounded-pill font-medium hover:bg-ink transition-colors active:scale-95 shadow-card">
          Explore options
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-[100dvh] p-6 max-w-5xl mx-auto pb-24">
      <header className="py-6 sm:py-12">
        <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-ink mb-4">
          Find your next spot.
        </h1>
        <p className="text-lg text-ink-muted max-w-xl mb-8">
          A curated list of cafes in Tehran for working, reading, and hanging out.
        </p>
        
        <FilterBar selected={selectedVibe} onSelect={setSelectedVibe} />
      </header>
      
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map(cafe => (
              <div key={cafe.id} onClick={() => setActiveCafe(cafe)} className="cursor-pointer">
                <CafeCard 
                  cafe={cafe} 
                  shortlisted={shortlist.has(cafe.id)}
                  onToggleShortlist={(e: any) => {
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
              Hmm, haven't found any spots with this vibe yet.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <CafeSheet 
        cafe={activeCafe} 
        open={!!activeCafe} 
        onOpenChange={(open) => !open && setActiveCafe(null)} 
      />
    </main>
  )
}

