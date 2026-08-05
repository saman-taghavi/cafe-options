import { Drawer } from 'vaul'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, ExternalLink, Navigation } from 'lucide-react'
import { useState, useEffect } from 'react'
import { type Cafe } from '../lib/schema/cafe'
import { cn } from '../lib/utils/cn'
import { PickCeremony } from './ceremony/PickCeremony'

export function CafeSheet({ 
  cafe, 
  open, 
  onOpenChange 
}: { 
  cafe: Cafe | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) {
  const [showCeremony, setShowCeremony] = useState(false)

  // Reset ceremony state when drawer closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => setShowCeremony(false), 300)
    }
  }, [open])

  if (!cafe) return null

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] mt-24 max-h-[90vh] fixed bottom-0 left-0 right-0 z-50 overflow-hidden outline-none">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-neutral-300 rounded-full z-10" />
          
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-md rounded-full text-neutral-600 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto w-full h-full pb-safe">
            {/* Hero Image */}
            <div className="relative w-full h-72 sm:h-96 bg-neutral-100 shrink-0">
              {cafe.media[0] && (
                <img 
                  src={cafe.media[0].url} 
                  alt={cafe.media[0].alt}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="px-6 py-8 max-w-3xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {cafe.vibes.map(vibe => (
                  <span key={vibe} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm font-medium capitalize">
                    {vibe.replace('-', ' ')}
                  </span>
                ))}
              </div>

              <h2 className="text-3xl font-bold text-neutral-900 mb-2">{cafe.name}</h2>
              <div className="flex items-center text-neutral-500 mb-6">
                <MapPin className="w-4 h-4 mr-1.5" />
                <span>{cafe.location.neighborhood} • {cafe.location.address}</span>
              </div>

              <div className="relative overflow-hidden mb-8">
                <AnimatePresence mode="wait">
                  {showCeremony ? (
                    <motion.div
                      key="ceremony"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <PickCeremony cafe={cafe} onComplete={() => onOpenChange(false)} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="text-lg text-neutral-700 leading-relaxed mb-8">
                        {cafe.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col gap-1 text-center">
                          <span className="text-sm font-medium text-neutral-500">Laptop Friendly</span>
                          <span className="text-lg font-semibold text-neutral-900">{cafe.features.laptopFriendly ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col gap-1 text-center">
                          <span className="text-sm font-medium text-neutral-500">Food available</span>
                          <span className="text-lg font-semibold text-neutral-900">{cafe.features.food ? 'Yes' : 'Snacks only'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => setShowCeremony(true)}
                          className="w-full py-4 bg-rose-500 text-white rounded-2xl font-medium text-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                        >
                          Let's go here!
                        </button>

                        <a 
                          href={cafe.location.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 bg-neutral-100 text-neutral-900 rounded-2xl font-medium text-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                        >
                          <Navigation className="w-5 h-5" />
                          View on Maps
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
