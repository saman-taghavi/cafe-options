import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
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
