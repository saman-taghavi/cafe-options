import { useEffect, useState } from 'react'

/**
 * Tracks `prefers-reduced-motion`. Every heavy motion/3D piece in the app
 * checks this before doing anything — a scrapbook should never fight
 * someone's vestibular settings to feel loved.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    query.addEventListener('change', handler)
    return () => query.removeEventListener('change', handler)
  }, [])

  return reduced
}
