import { Drawer } from 'vaul'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { X, MapPin, Navigation } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { type Cafe } from '../lib/schema/cafe'
import { PickCeremony } from './ceremony/PickCeremony'
import { InstagramEmbed } from './InstagramEmbed'
import { MapPeek } from './MapPeek'
import { WebsiteCard } from './WebsiteCard'
import { FloatingPetals } from './FloatingPetals'
import { useSound } from '../hooks/useSound'

const sectionContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const sectionItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
}

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
  const scrollRef = useRef<HTMLDivElement>(null)
  const { play } = useSound()

  // Fix base routing for local dev vs GH Pages
  const basePath = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '')
  const heroSrc = cafe?.heroImage?.startsWith('/') ? `${basePath}${cafe.heroImage}` : cafe?.heroImage

  const instagramMedia = cafe?.media.find(m => m.url.includes('instagram.com'))

  // Subtle Ken-Burns parallax on the hero image as you scroll the sheet —
  // the photo drifts and breathes instead of sitting there static.
  const { scrollY } = useScroll({ container: scrollRef })
  const heroY = useTransform(scrollY, [0, 300], [0, 90])
  const heroScale = useTransform(scrollY, [0, 300], [1.08, 1.22])

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
        <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] mt-24 max-h-[90dvh] fixed bottom-0 left-0 right-0 z-50 overflow-hidden outline-none shadow-sheet">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-neutral-300 rounded-full z-10" />

          <motion.button
            onClick={() => { play('release'); onOpenChange(false) }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-md rounded-full text-neutral-600 z-10"
          >
            <X className="w-5 h-5" />
          </motion.button>

          <div ref={scrollRef} className="overflow-y-auto w-full h-full pb-safe">
            {/* Hero Image */}
            <div className="relative w-full shrink-0 bg-neutral-100 h-72 sm:h-96 mb-6 overflow-hidden">
              <FloatingPetals count={6} />
              {heroSrc ? (
                <motion.img
                  src={heroSrc}
                  alt={cafe.name}
                  style={{ y: heroY, scale: heroScale }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : cafe.media[0] && !cafe.media[0].url.includes('instagram.com') ? (
                <motion.img
                  src={cafe.media[0].url}
                  alt={cafe.media[0].alt}
                  style={{ y: heroY, scale: heroScale }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-neutral-100 to-neutral-200">
                   <div className="font-serif italic text-neutral-400 text-xl">{cafe.name}</div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="px-6 pb-8 max-w-3xl mx-auto">
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
                      variants={sectionContainer}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0 }}
                    >
                      <motion.p variants={sectionItem} className="text-lg text-neutral-700 leading-relaxed mb-8">
                        {cafe.description}
                      </motion.p>

                      <motion.div variants={sectionItem} className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col gap-1 text-center">
                          <span className="text-sm font-medium text-neutral-500">Wifi</span>
                          <span className="text-lg font-semibold text-neutral-900">{cafe.features.wifi ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col gap-1 text-center">
                          <span className="text-sm font-medium text-neutral-500">Food available</span>
                          <span className="text-lg font-semibold text-neutral-900">{cafe.features.food ? 'Yes' : 'Snacks only'}</span>
                        </div>
                      </motion.div>

                      <div className="flex flex-col gap-3">
                        {instagramMedia && (
                          <motion.div variants={sectionItem} className="my-2">
                            <InstagramEmbed url={instagramMedia.url} />
                          </motion.div>
                        )}

                        {cafe.location.mapsEmbedUrl && (
                          <motion.div variants={sectionItem}>
                            <MapPeek embedUrl={cafe.location.mapsEmbedUrl} />
                          </motion.div>
                        )}

                        {cafe.websitePreview && (
                          <motion.div variants={sectionItem}>
                            <WebsiteCard preview={cafe.websitePreview} />
                          </motion.div>
                        )}

                        <motion.button
                          variants={sectionItem}
                          onClick={() => { play('chime'); setShowCeremony(true) }}
                          whileHover={{ scale: 1.015 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative w-full py-4 bg-coral text-white rounded-2xl font-medium text-lg flex items-center justify-center gap-2 overflow-hidden group"
                        >
                          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                          <span className="relative">Let's go here!</span>
                        </motion.button>

                        <motion.a variants={sectionItem}
                          href={cafe.location.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => play('press')}
                          className="w-full py-4 bg-neutral-100 text-neutral-900 rounded-2xl font-medium text-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                        >
                          <Navigation className="w-5 h-5" />
                          View on Maps
                        </motion.a>
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
