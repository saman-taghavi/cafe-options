import { createFileRoute } from '@tanstack/react-router'
import { getCafes, getAvailableVibes } from '../lib/content/load'
import { FilterBar } from '../components/FilterBar'
import { CafeCard } from '../components/CafeCard'
import { CafeSheet } from '../components/CafeSheet'
import { SwipeDeck } from '../components/SwipeDeck'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'

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

  const [history, setHistory] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cafe-options:hearts')
      if (stored) {
        setShortlist(new Set(JSON.parse(stored)))
      }
      const historyJson = localStorage.getItem('cafe-options:pick-history')
      if (historyJson) {
        setHistory(JSON.parse(historyJson))
      }
    } catch (e) {}
  }, [])

  const toggleShortlist = (id: string) => {
    const next = new Set(shortlist)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setShortlist(next)
    
    try {
      localStorage.setItem('cafe-options:hearts', JSON.stringify(Array.from(next)))
    } catch (e) {}
  }

  const filtered = useMemo(() => {
    if (!selectedVibe) return cafes
    if (selectedVibe === 'shortlist') return cafes.filter(c => shortlist.has(c.id))
    if (selectedVibe === 'history') {
      const historyIds = new Set(history.map(h => h.id))
      return cafes.filter(c => historyIds.has(c.id))
    }
    return cafes.filter(c => c.vibes.includes(selectedVibe as any))
  }, [cafes, selectedVibe, shortlist, history])

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
        <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-ink mb-4 max-w-sm">
          Where are we going today?
        </h1>
        <p className="text-lg text-ink-muted max-w-xl mb-8 font-serif italic">
          I've hand-picked these spots just for us. Take your time, pick a vibe, and let me know when you've found the one you love.
        </p>
        
        <div className="flex bg-neutral-100 p-1 rounded-full w-fit mb-6">
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-ink' : 'text-neutral-500 hover:text-ink'}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setViewMode('swipe')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${viewMode === 'swipe' ? 'bg-white shadow-sm text-ink' : 'text-neutral-500 hover:text-ink'}`}
          >
            Swipe
          </button>
        </div>
        
        <FilterBar 
          selected={selectedVibe} 
          onSelect={setSelectedVibe} 
          availableVibes={getAvailableVibes(cafes)}
        />
        
        {(shortlist.size > 0 || history.length > 0) && (
          <div className="flex flex-wrap gap-3 mt-4">
            {shortlist.size > 0 && (
              <button 
                onClick={() => setSelectedVibe(selectedVibe === 'shortlist' ? null : 'shortlist')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 flex items-center gap-2 ${
                  selectedVibe === 'shortlist'
                    ? 'bg-rose-500 text-white shadow-md' 
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={selectedVibe === 'shortlist' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                My Shortlist ({shortlist.size})
              </button>
            )}
            
            {history.length > 0 && (
              <button 
                onClick={() => setSelectedVibe(selectedVibe === 'history' ? null : 'history')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 flex items-center gap-2 ${
                  selectedVibe === 'history'
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="m9 10 2 2 4-4"></path></svg>
                We Went Here ({history.length})
              </button>
            )}
          </div>
        )}
      </header>
      
      <motion.div layout className="pt-6">
        {viewMode === 'swipe' ? (
          <SwipeDeck 
            cafes={filtered}
            shortlist={shortlist}
            onToggleShortlist={toggleShortlist}
            onDismiss={() => {}}
            onPick={setActiveCafe}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        )}
      </motion.div>

      <CafeSheet 
        cafe={activeCafe} 
        open={!!activeCafe} 
        onOpenChange={(open) => !open && setActiveCafe(null)} 
      />
    </main>
  )
}

