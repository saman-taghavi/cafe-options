import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const word = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/**
 * Splits a headline into words and reveals them with a soft staggered
 * rise + blur-in — the "someone spent time on this" first five seconds.
 */
export function AnimatedHeadline({
  text,
  className,
  as: Tag = 'h1',
}: {
  text: string
  className?: string
  as?: 'h1' | 'h2'
}) {
  const words = text.split(' ')

  return (
    <Tag className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        animate="show"
        className="inline-block"
        aria-label={text}
      >
        {words.map((w, i) => (
          <motion.span key={i} variants={word} className="inline-block mr-[0.28em] last:mr-0">
            {w}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  )
}
