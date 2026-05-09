'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useLang } from '@/contexts/LanguageContext'

type FormSuccessModalProps = {
  open: boolean
  onClose: () => void
}

function fireConfetti() {
  const count = 3
  const defaults = { startVelocity: 28, spread: 360, ticks: 60, zIndex: 300 }

  const shoot = (particleRatio: number, opts: confetti.Options) => {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(200 * particleRatio),
      origin: { x: 0.5, y: 0.45 },
    })
  }

  shoot(0.25, { spread: 26, startVelocity: 55 })
  shoot(0.2, { spread: 60 })
  shoot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
  shoot(0.1, { spread: 120, startVelocity: 45, decay: 0.92, scalar: 1.2 })
  shoot(0.1, { spread: 120, startVelocity: 35 })

  for (let i = 0; i < count; i++) {
    window.setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ['#db260e', '#4277f6', '#ffabdb', '#ffc801'],
      })
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ['#db260e', '#4277f6', '#ffabdb', '#ffc801'],
      })
    }, 320 + i * 220)
  }
}

export default function FormSuccessModal({ open, onClose }: FormSuccessModalProps) {
  const { translations: t } = useLang()
  const copy = t.formSuccess
  const firedRef = useRef(false)

  useEffect(() => {
    if (!open) {
      firedRef.current = false
      return
    }
    if (firedRef.current) return
    firedRef.current = true

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) {
      const id = window.requestAnimationFrame(() => fireConfetti())
      return () => window.cancelAnimationFrame(id)
    }
    return undefined
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            aria-label={copy.close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-success-title"
            className="relative z-[201] w-full max-w-md rounded-2xl border border-white/15 bg-[#1a1a1a] px-8 py-10 text-center shadow-2xl"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <h2
              id="form-success-title"
              className="text-balance text-xl font-semibold leading-snug text-white md:text-2xl"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {copy.title}
            </h2>
            <p
              className="mt-6 text-sm italic text-white/75 md:text-base"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {copy.tagline}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 inline-flex min-w-[140px] items-center justify-center rounded-lg bg-[var(--brand-blue)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {copy.close}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}
