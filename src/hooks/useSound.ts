import { useCallback, useEffect, useRef, useState } from 'react'
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
 * on/off choice in localStorage and keeps cuelume's own (module-global)
 * enabled flag in sync.
 *
 * `enabledRef` exists so `toggle()` can flip cuelume's global flag
 * *synchronously*, in the same tick as the click that called it. Routing
 * that through a React state updater instead (`setEnabled(prev => ...)`)
 * doesn't guarantee the updater runs before the next line of the same
 * event handler — so a `play(...)` immediately after `toggle()` could see
 * the *old* enabled value and silently no-op, making the very sound meant
 * to confirm "sound is now on" never play.
 */
export function useSound() {
  const [enabled, setEnabled] = useState(false)
  const enabledRef = useRef(false)

  useEffect(() => {
    const prefs = readPrefs()
    enabledRef.current = prefs.sound
    setEnabled(prefs.sound)
    cueSetEnabled(prefs.sound)
    cueSetVolume(0.55)
  }, [])

  const toggle = useCallback(() => {
    const next = !enabledRef.current
    enabledRef.current = next
    writePrefs({ sound: next })
    cueSetEnabled(next)
    setEnabled(next)
  }, [])

  const play = useCallback((name: SoundName) => {
    cuePlay(name)
  }, [])

  return { enabled, toggle, play }
}
