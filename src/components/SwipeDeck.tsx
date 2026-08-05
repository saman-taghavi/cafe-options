import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CafeCard } from './CafeCard'
import { type Cafe } from '../lib/schema/cafe'

export function SwipeDeck({ 
  cafes, 
  onPick, 
  onDismiss, 
  shortlist, 
  onToggleShortlist 
}: { 
  cafes: Cafe[], 
  onPick: (cafe: Cafe) => void,
  onDismiss: (cafe: Cafe) => void,
  shortlist: Set<string>,
  onToggleShortlist: (id: string, e: any) => void
}) {
  const [index, setIndex] = useState(0)
  
  if (index >= cafes.length) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6"
      >
        <div className="text-4xl mb-4">👀</div>
        <h3 className="text-xl font-medium mb-2">You've seen them all!</h3>
        <p className="text-neutral-500 mb-6 max-w-sm">
          That's the entire curated list. Want to go back and check your shortlist or switch to the grid view?
        </p>
        <button 
          onClick={() => setIndex(0)} 
          className="bg-neutral-100 px-6 py-2 rounded-full font-medium"
        >
          Start over
        </button>
      </motion.div>
    )
  }

  const activeCafe = cafes[index]

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      // Swipe Right -> Shortlist
      onToggleShortlist(activeCafe.id, null)
      setIndex(i => i + 1)
    } else if (info.offset.x < -threshold) {
      // Swipe Left -> Skip
      onDismiss(activeCafe)
      setIndex(i => i + 1)
    }
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-[500px] flex items-center justify-center perspective-1000">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeCafe.id}
          className="absolute inset-0 cursor-grab active:cursor-grabbing w-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={(custom) => ({
            x: custom === 'right' ? 300 : -300,
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.2 }
          })}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ originX: 0.5, originY: 1 }}
        >
          <div className="h-full bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden pointer-events-none">
            <CafeCard 
              cafe={activeCafe}
              shortlisted={shortlist.has(activeCafe.id)}
              onToggleShortlist={(e: any) => onToggleShortlist(activeCafe.id, e)}
            />
            {/* Added overlay instructions */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
              <div className="flex justify-between items-center text-white/90 text-sm font-medium">
                <span className="bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">← Skip</span>
                <span className="bg-rose-500/80 px-3 py-1 rounded-full backdrop-blur-md">Heart →</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
