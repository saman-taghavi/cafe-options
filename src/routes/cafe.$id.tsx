import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getCafes } from '../lib/content/load'
import { CafeSheet } from '../components/CafeSheet'
import { type Cafe } from '../lib/schema/cafe'

export const Route = createFileRoute('/cafe/$id')({
  component: CafeShareRoute,
})

function CafeShareRoute() {
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const [cafe, setCafe] = useState<Cafe | null>(null)

  useEffect(() => {
    const all = getCafes()
    const found = all.find(c => c.slug === id || c.id === id)
    if (found) {
      setCafe(found)
    } else {
      navigate({ to: '/' })
    }
  }, [id, navigate])

  if (!cafe) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center text-neutral-400">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] relative flex items-center justify-center">
      {/* Visual background suggesting context before the drawer handles taking over */}
      <div 
         className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm" 
         style={{ backgroundImage: `url(${cafe.media[0]?.url})` }}
      />
      
      <CafeSheet 
        cafe={cafe} 
        open={true} 
        onOpenChange={(open) => {
          if (!open) navigate({ to: '/' })
        }} 
      />
    </div>
  )
}
