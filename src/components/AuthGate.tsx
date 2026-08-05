import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

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
      localStorage.setItem('cafe-options:unlocked', 'true')
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setPasscode('')
    }
  }

  if (!mounted) return null

  if (unlocked) {
    return <>{children}</>
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-[#FAF9F6]">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-6 h-6" />
        </div>
        
        <h1 className="text-2xl font-serif text-neutral-900 mb-2">Our Private List</h1>
        <p className="text-neutral-500 mb-8 font-medium">Enter the passcode to view the cafe options.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value)
              setError(false)
            }}
            placeholder="Passcode"
            className={`w-full px-4 py-3 rounded-xl border text-center text-xl tracking-widest focus:outline-none focus:ring-2 transition-all ${
              error 
                ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                : 'border-neutral-200 focus:border-rose-300 focus:ring-rose-100'
            }`}
          />
          <button 
            type="submit"
            className="w-full bg-neutral-900 text-white rounded-xl py-3 font-medium hover:bg-neutral-800 transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
