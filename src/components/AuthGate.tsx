import { useState, useEffect, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useSound } from '../hooks/useSound'

// The three.js/postprocessing bundle is meaningfully heavy — split it out
// of the critical path so the gate itself (the first thing you see) paints instantly.
const AmbientCanvas = lazy(() => import('./three/AmbientCanvas').then(m => ({ default: m.AmbientCanvas })))

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [sealOpening, setSealOpening] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const { play } = useSound()

  // Use a simple romantic word for the local passcode.
  const CORRECT_PASSCODE = import.meta.env.VITE_APP_PASSCODE || '2127'

  useEffect(() => {
    setMounted(true)
    if (localStorage.getItem('cafe-options:unlocked') === 'true') {
      setUnlocked(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode.toLowerCase().trim() === CORRECT_PASSCODE) {
      setError(false)
      setSealOpening(true)
      play('arrival')
      localStorage.setItem('cafe-options:unlocked', 'true')
      // Let the little wax-seal-breaking moment play before revealing the app.
      window.setTimeout(() => setUnlocked(true), reducedMotion ? 0 : 620)
    } else {
      setError(true)
      setShakeKey(k => k + 1)
      setPasscode('')
      play('error')
    }
  }

  if (!mounted) return null

  return (
    <AnimatePresence mode="wait">
      {unlocked ? (
        <motion.div
          key="content"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          key="gate"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-paper overflow-hidden"
        >
          <Suspense fallback={null}>
            <AmbientCanvas className="ambient-canvas-host" heartCount={3} />
          </Suspense>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-sm text-center"
          >
            {/* Wax seal / envelope motif */}
            <motion.div
              className="relative w-20 h-20 mx-auto mb-7"
              animate={
                sealOpening
                  ? { scale: [1, 1.25, 0], rotate: [0, -8, 40] }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.6, ease: 'easeIn' }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-mocha to-ink shadow-glow" />
              <div className="absolute inset-0 rounded-full flex items-center justify-center text-blush-soft">
                <Heart className="w-8 h-8 fill-current animate-heartbeat" />
              </div>
              <div className="absolute -inset-1 rounded-full border border-gold/40" />
            </motion.div>

            <h1 className="text-3xl font-display text-ink mb-2">
              Just for <span className="font-script text-4xl text-mocha">us</span>
            </h1>
            <p className="text-ink-muted mb-9 leading-relaxed">
              A little something I've been building for the two of us.
              <br />
              You know the word.
            </p>

            <motion.form
              key={shakeKey}
              onSubmit={handleSubmit}
              className="space-y-4"
              animate={error ? { x: [0, -10, 10, -8, 8, 0] } : {}}
              transition={{ duration: 0.45 }}
            >
              <input
                autoFocus
                type="password"
                value={passcode}
                onChange={e => {
                  setPasscode(e.target.value)
                  setError(false)
                }}
                placeholder="passcode"
                className={`w-full px-4 py-3.5 rounded-2xl border text-center text-xl text-ink font-script tracking-widest bg-cream/60 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all placeholder:font-body placeholder:text-base placeholder:tracking-normal ${
                  error
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/60'
                    : 'border-blush-soft focus:border-blush focus:ring-blush-soft/60'
                }`}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-ink text-paper-warm rounded-2xl py-3.5 font-medium shadow-card transition-colors hover:bg-mocha"
              >
                Open it
              </motion.button>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-rose-500 pt-1"
                >
                  Not quite — try again, love.
                </motion.p>
              )}
            </motion.form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
