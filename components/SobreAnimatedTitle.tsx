'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'

const TITLE = 'VEREDAS SINCE 2019'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.038,
      delayChildren: 0.08,
    },
  },
}

const letterVariants = {
  hidden: {
    y: '0.55em',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export default function SobreAnimatedTitle() {
  const { translations: t } = useLang()
  const chars = TITLE.split('')

  return (
    <div className="px-6 pb-10 pt-32 md:px-10 md:pt-36">
      <p
        className="mb-6 uppercase"
        style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: '#4277f6' }}
      >
        {t.pages.eyebrow}
      </p>

      <motion.h1
        className="m-0 flex flex-wrap justify-center gap-y-1 px-1 text-center"
        style={{
          fontFamily: 'var(--font-condensed)',
          fontWeight: 800,
          fontSize: 'clamp(2.75rem, 14vw, 9rem)',
          lineHeight: 1,
          letterSpacing: '0.02em',
          color: '#242424',
          textTransform: 'uppercase',
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={TITLE}
      >
        {chars.map((char, i) =>
          char === ' ' ? (
            <span key={`sp-${i}`} className="inline-block w-[0.28em] shrink-0" aria-hidden />
          ) : (
            <motion.span key={`${char}-${i}`} variants={letterVariants} className="inline-block">
              {char}
            </motion.span>
          )
        )}
      </motion.h1>

      <div className="mt-8 h-px bg-neutral-100 md:mt-10" />
    </div>
  )
}
