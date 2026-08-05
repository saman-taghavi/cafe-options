import { createFileRoute } from '@tanstack/react-router'
import { getCafes } from '../lib/content/load'

export const Route = createFileRoute('/')({ 
  component: Home,
  loader: async () => {
    return { cafes: getCafes() }
  }
})

function Home() {
  const { cafes } = Route.useLoaderData()
  
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
    <main className="min-h-[100dvh] p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-display mb-8 text-ink font-semibold mt-4">
        Tehran Café Options
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cafes.map(cafe => (
          <article key={cafe.id} className="bg-white rounded-[24px] p-6 shadow-card border border-stone-100 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
            <div>
              <h2 className="text-xl font-bold text-ink">{cafe.name}</h2>
              <p className="text-ink-muted text-sm mt-1">{cafe.location.neighborhood} • {cafe.location.address}</p>
            </div>
            
            <p className="text-ink leading-relaxed text-sm line-clamp-3">
              {cafe.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto pt-4">
              {cafe.vibes.map(vibe => (
                <span key={vibe} className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                  {vibe.replace('-', ' ')}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

