import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { CheckCircle2, Copy, Send, Heart, Loader2, Sparkles } from 'lucide-react'
import { type Cafe } from '../../lib/schema/cafe'
import { useSound } from '../../hooks/useSound'
import { DateCard } from './DateCard'

export function PickCeremony({ cafe, onComplete }: { cafe: Cafe, onComplete: () => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [copied, setCopied] = useState(false)
  const [note, setNote] = useState('')
  const { play } = useSound()

  const handlePick = async () => {
    setStatus('sending')
    try {
      const noteLine = note.trim() ? `\nHer note: "${note.trim()}"` : ''
      const response = await fetch('https://ntfy.sh/saman-cafe-options-78ro0urem6', {
        method: 'POST',
        body: `She picked ${cafe.name}! 🎉${noteLine}`,
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
        filteredHistory.unshift({ id: cafe.id, name: cafe.name, date: new Date().toISOString(), note: note.trim() || undefined })
        localStorage.setItem('cafe-options:pick-history', JSON.stringify(filteredHistory))
      } catch (e) {}

      setStatus('success')
      play('success')
    } catch {
      setStatus('error')
    }
  }

  const copyToClipboard = () => {
    const noteLine = note.trim() ? `\n"${note.trim()}"` : ''
    navigator.clipboard.writeText(`Hey Saman, let's go to ${cafe.name}!${noteLine}\n${cafe.location.mapsUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 min-h-[50vh]">
      <AnimatePresence mode="wait">
        {status !== 'success' && (
          <motion.div
            key="prompt"
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-2"
          >
            <h2 className="text-2xl font-display">Are you sure this is the one?</h2>
            <p className="text-neutral-500">I'll get a little ping the moment you say yes.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {status !== 'success' && (
        <div className="relative flex items-center justify-center">
          {/* Breathing pulse rings around the heart — idle-only, quiets down once sending */}
          {status === 'idle' && (
            <>
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="absolute rounded-full border border-rose-300"
                  initial={{ width: 128, height: 128, opacity: 0.5 }}
                  animate={{ width: 190, height: 190, opacity: 0 }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
                />
              ))}
            </>
          )}

          <motion.div
            onClick={handlePick}
            className="relative w-32 h-32 bg-rose-50 hover:bg-rose-100 cursor-pointer rounded-full flex items-center justify-center transition-colors shadow-sm active:scale-95 z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500/20 animate-heartbeat" />
          </motion.div>
        </div>
      )}

      {status === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full space-y-4"
        >
          <div className="relative">
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Say something to him — optional (“Saturday morning? window seat?”)"
              rows={2}
              maxLength={180}
              className="w-full resize-none px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all font-script text-lg"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePick}
            className="bg-neutral-900 text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 w-full justify-center shadow-lg"
          >
            <Send className="w-4 h-4" />
            Tell him this is the one ☕
          </motion.button>
        </motion.div>
      )}

      {status === 'sending' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 text-neutral-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Sending it his way...</p>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center w-full"
        >
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={260}
            gravity={0.12}
            colors={['#e8b4b8', '#c04a5a', '#c5d1a5', '#d9a94e', '#fffdf8']}
          />

          <DateCard cafe={cafe} note={note} />

          <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3 w-full mt-6 mb-2">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <p className="font-medium text-sm text-left">He got it! Check your messages soon.</p>
          </div>
          <p className="text-xs text-neutral-400 flex items-center gap-1 mb-4">
            <Sparkles className="w-3 h-3" /> Tip: screenshot the card above to keep it
          </p>
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
