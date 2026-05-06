'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LogoVeredas from '@/components/LogoVeredas'

const MIN_MS = 1650

const BRAND_BARS = [
  'var(--brand-flame)',
  'var(--brand-blue)',
  'var(--brand-pink)',
  'var(--brand-sun)',
] as const

export default function Preloader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!visible) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    let cancelled = false
    const finish = () => {
      if (cancelled) return
      setVisible(false)
      document.body.style.overflow = prevOverflow || ''
    }

    const run = async () => {
      await Promise.all([
        new Promise((r) => setTimeout(r, MIN_MS)),
        document.fonts?.ready ?? Promise.resolve(),
      ])
      finish()
    }

    run()
    return () => {
      cancelled = true
      document.body.style.overflow = prevOverflow || ''
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background"
          role="status"
          aria-live="polite"
          aria-label="Carregando Veredas"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background:
                'radial-gradient(ellipse 80% 55% at 50% 45%, rgba(66,119,246,0.12) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 70% 60%, rgba(255,171,219,0.1) 0%, transparent 50%)',
            }}
          />

          <motion.div
            className="pointer-events-none absolute h-[min(58vw,420px)] w-[min(58vw,420px)] rounded-full border border-neutral-200"
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: [0.88, 1.02, 0.95], opacity: [0, 0.5, 0.22] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className="relative flex flex-col items-center gap-14 px-6">
            <div className="relative">
              <motion.div
                className="pointer-events-none absolute -inset-8 overflow-hidden rounded-lg md:-inset-12"
                initial={false}
              >
                <motion.div
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-neutral-800/20 to-transparent"
                  style={{ skewX: '-18deg' }}
                  animate={{ x: ['-120%', '220%'] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatDelay: 0.35,
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.82, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <LogoVeredas
                  className="relative z-[1] h-16 w-auto text-[#242424] drop-shadow-[0_0_32px_rgba(0,0,0,0.08)] sm:h-20 md:h-28"
                  aria-hidden
                />
              </motion.div>
            </div>

            <div className="flex h-2 w-[min(300px,72vw)] gap-1.5 overflow-hidden rounded-full bg-neutral-200/80 p-px sm:h-2.5">
              {BRAND_BARS.map((color, i) => (
                <motion.div
                  key={color}
                  className="h-full flex-1 origin-left rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.35 + i * 0.14,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-neutral-200/50 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
