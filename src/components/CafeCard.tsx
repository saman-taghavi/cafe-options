import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Heart, MapPin, Wifi, Zap, Coffee } from 'lucide-react'
import { type Cafe } from '../lib/schema/cafe'
import { cn } from '../lib/utils/cn'

export function CafeCard({ cafe, shortlisted = false, onToggleShortlist }: { cafe: Cafe, shortlisted?: boolean, onToggleShortlist?: () => void }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="group relative flex flex-col bg-white overflow-hidden rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
        {cafe.media[0] && (
          <img 
            src={cafe.media[0].url} 
            alt={cafe.media[0].alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {cafe.vibes.slice(0, 2).map(vibe => (
            <span key={vibe} className="px-2.5 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-neutral-800 rounded-full capitalize">
              {vibe.replace('-', ' ')}
            </span>
          ))}
        </div>

        {/* Shortlist button */}
        <button 
          onClick={onToggleShortlist}
          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-neutral-600 transition-colors hover:text-red-500 hover:bg-white z-10"
        >
          <Heart className={cn("w-5 h-5 transition-colors", shortlisted && "fill-red-500 text-red-500")} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-lg text-neutral-900 mb-1">{cafe.name}</h3>
        
        <div className="flex items-center text-sm text-neutral-500 mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          <span>{cafe.location.neighborhood}</span>
        </div>

        <div className="flex items-center gap-3 text-neutral-400 mt-auto">
          {cafe.features.wifi && <Wifi className="w-4 h-4" />}
          {cafe.features.plugs && <Zap className="w-4 h-4" />}
          {cafe.features.food && <Coffee className="w-4 h-4" />}
        </div>
      </div>
    </motion.div>
  )
}
