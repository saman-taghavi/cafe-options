import { useState } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { CheckCircle2, Copy, Send, Heart, Loader2 } from 'lucide-react'
import { type Cafe } from '../../lib/schema/cafe'
import { cn } from '../../lib/utils/cn'

export function PickCeremony({ cafe, onComplete }: { cafe: Cafe, onComplete: () => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [copied, setCopied] = useState(false)

  const handlePick = async () => {
    setStatus('sending')
    try {
      const response = await fetch('https://ntfy.sh/saman-cafe-options-78ro0urem6', {
        method: 'POST',
        body: `She picked ${cafe.name}! 🎉`,
        headers: {
          'Title': 'New Cafe Date Picked!',
          'Tags': 'coffee,heart',
          'Authorization': `Bearer tk_rslwsgbzachy78ro0urem6dtjwzb8`
        }
      })
      if (!response.ok) throw new Error('Ntfy failed')
      
      // Save log to local history
      try {
        const historyJson = localStorage.getItem('cafe-options:pick-history')
        const history = historyJson ? JSON.parse(historyJson) : []
        // Optional logic: filter out if already exists, or just prepend
        const filteredHistory = history.filter((h: any) => h.id !== cafe.id)
        filteredHistory.unshift({ id: cafe.id, name: cafe.name, date: new Date().toISOString() })
        localStorage.setItem('cafe-options:pick-history', JSON.stringify(filteredHistory))
      } catch (e) {}
      
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`Hey Saman, let's go to ${cafe.name}!\n${cafe.location.mapsUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 min-h-[50vh]">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif">You picked this one?</h2>
        <p className="text-neutral-500">I'll get a notification if you say yes.</p>
      </div>

      <div className="relative">
        <div className="w-32 h-32 bg-rose-50 rounded-full flex items-center justify-center">
          <Heart className="w-12 h-12 text-rose-500" />
        </div>
      </div>

      {status === 'idle' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePick}
          className="bg-neutral-900 text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 w-full justify-center shadow-lg"
        >
          <Send className="w-4 h-4" />
          Tell Saman
        </motion.button>
      )}

      {status === 'sending' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 text-neutral-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Sending pigeon...</p>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full">
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} colors={['#f43f5e', '#fb7185', '#fda4af']} />
          <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3 w-full mb-4">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <p className="font-medium text-sm text-left">He got it! Check your messages soon.</p>
          </div>
          <button onClick={onComplete} className="text-neutral-500 font-medium py-2">Close</button>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full space-y-4">
          <div className="bg-orange-50 text-orange-700 p-4 rounded-2xl flex items-start gap-3 w-full">
            <div className="mt-0.5 shrink-0">😅</div>
            <div className="text-sm text-left">
              <p className="font-medium">The notification pigeon got lost.</p>
              <p className="opacity-80 mt-1">Network might be flaky. You can manually copy the link instead.</p>
            </div>
          </div>
          
          <button 
            onClick={copyToClipboard}
            className="bg-neutral-100 text-neutral-700 px-6 py-3 rounded-full font-medium flex items-center gap-2 w-full justify-center transition-colors hover:bg-neutral-200"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy invite link'}
          </button>
          
          <div className="flex justify-center">
            <button onClick={() => setStatus('idle')} className="text-neutral-500 text-sm mt-4">Try again</button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
