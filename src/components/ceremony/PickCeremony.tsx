import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { CheckCircle2, Copy, Send, Heart, Loader2, Sparkles, CalendarHeart, Clock } from 'lucide-react'
import { type Cafe } from '../../lib/schema/cafe'
import { useSound } from '../../hooks/useSound'
import { DateCard } from './DateCard'

function formatWhen(date: string, time: string) {
  if (!date) return ''
  const [y, m, d] = date.split('-').map(Number)
  const dateObj = new Date(y, (m ?? 1) - 1, d ?? 1)
  const dateLabel = dateObj.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
  if (!time) return dateLabel
  const [hh, mm] = time.split(':').map(Number)
  const timeObj = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0)
  const timeLabel = timeObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return `${dateLabel} · ${timeLabel}`
}

export function PickCeremony({ cafe, onComplete }: { cafe: Cafe, onComplete: () => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [copied, setCopied] = useState(false)
  const [note, setNote] = useState('')
  const [plannedDate, setPlannedDate] = useState('')
  const [plannedTime, setPlannedTime] = useState('')
  const { play } = useSound()

  const whenLabel = formatWhen(plannedDate, plannedTime)

  const handlePick = async () => {
    play('press')
    setStatus('sending')
    try {
      const noteLine = note.trim() ? `\nHer note: "${note.trim()}"` : ''
      const whenLine = whenLabel ? `\nWhen: ${whenLabel}` : ''
      const response = await fetch('https://ntfy.sh/saman-cafe-options-78ro0urem6', {
        method: 'POST',
        body: `She picked ${cafe.name}! 🎉${whenLine}${noteLine}`,
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
        filteredHistory.unshift({
          id: cafe.id,
          name: cafe.name,
          date: new Date().toISOString(),
          note: note.trim() || undefined,
          plannedFor: plannedDate ? { date: plannedDate, time: plannedTime || undefined } : undefined,
        })
        localStorage.setItem('cafe-options:pick-history', JSON.stringify(filteredHistory))
      } catch (e) {}

      setStatus('success')
      play('success')
    } catch {
      setStatus('error')
      play('error')
    }
  }

  const copyToClipboard = () => {
    const whenLine = whenLabel ? `\n${whenLabel}` : ''
    const noteLine = note.trim() ? `\n"${note.trim()}"` : ''
    navigator.clipboard.writeText(`Hey Saman, let's go to ${cafe.name}!${whenLine}${noteLine}\n${cafe.location.mapsUrl}`)
    setCopied(true)
    play('success')
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
                  className="absolute rounded-full border border-coral/40"
                  initial={{ width: 128, height: 128, opacity: 0.5 }}
                  animate={{ width: 190, height: 190, opacity: 0 }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
                />
              ))}
            </>
          )}

          <motion.div
            onClick={handlePick}
            className="relative w-32 h-32 bg-coral-soft/50 hover:bg-coral-soft cursor-pointer rounded-full flex items-center justify-center transition-colors shadow-sm active:scale-95 z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className="w-12 h-12 text-coral fill-coral/20 animate-heartbeat" />
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
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-2 flex items-center gap-1.5">
              <CalendarHeart className="w-4 h-4" /> When should we go?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="date"
                  value={plannedDate}
                  onChange={e => setPlannedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral transition-all"
                />
              </div>
              <div className="relative">
                <input
                  type="time"
                  value={plannedTime}
                  onChange={e => setPlannedTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral transition-all"
                />
              </div>
            </div>
            {whenLabel && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-coral mt-2 flex items-center gap-1.5 font-medium"
              >
                <Clock className="w-3.5 h-3.5" /> {whenLabel}
              </motion.p>
            )}
          </div>

          <div className="relative">
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Say something to him — optional (“window seat, please?”)"
              rows={2}
              maxLength={180}
              className="w-full resize-none px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-ink placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral transition-all font-script text-lg"
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

          <DateCard cafe={cafe} note={note} when={whenLabel} />

          <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3 w-full mt-6 mb-2">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <p className="font-medium text-sm text-left">He got it! Check your messages soon.</p>
          </div>
          <p className="text-xs text-neutral-400 flex items-center gap-1 mb-4">
            <Sparkles className="w-3 h-3" /> Tip: screenshot the card above to keep it
          </p>
          <button onClick={() => { play('release'); onComplete() }} className="text-neutral-500 font-medium py-2">Close</button>
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
            <button onClick={() => { play('press'); setStatus('idle') }} className="text-neutral-500 text-sm mt-4">Try again</button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
