import { useCallback, useEffect, useState } from 'react'
import { play as cuePlay, setEnabled as cueSetEnabled, setVolume as cueSetVolume, type SoundName } from 'cuelume'

const PREFS_KEY = 'cafe-options:prefs'

type Prefs = { sound: boolean }

function readPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (raw) return { sound: false, ...JSON.parse(raw) }
  } catch {}
  return { sound: false }
}

function writePrefs(prefs: Prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {}
}

/**
 * Thin wrapper around `cuelume` (tiny, dependency-free, synthesized-live
 * interaction sounds — no audio files to fetch). Off by default, matching
 * the plan: delight should never arrive as a surprise noise. Persists the
 * on/off choice in localStorage and keeps cuelume's own enabled flag and
 * our React state in sync.
 */
export function useSound() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const prefs = readPrefs()
    setEnabled(prefs.sound)
    cueSetEnabled(prefs.sound)
    cueSetVolume(0.55)
  }, [])

  const toggle = useCallback(() => {
    setEnabled(prev => {
      const next = !prev
      writePrefs({ sound: next })
      cueSetEnabled(next)
      return next
    })
  }, [])

  const play = useCallback((name: SoundName) => {
    cuePlay(name)
  }, [])

  return { enabled, toggle, play }
}
