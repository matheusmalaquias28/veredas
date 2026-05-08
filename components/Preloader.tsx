'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
const MIN_MS = 2000
const TOTAL_STEPS = 100
const DEFAULT_IMAGES = ['/sobre-agencia.png', '/Veredas_92.png']

export default function Preloader({ images = [] }: { images?: string[] }) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)
  const finalImages = useMemo(() => {
    const validImages = images.filter((img) => Boolean(img))
    return (validImages.length > 0 ? validImages : DEFAULT_IMAGES).slice(0, 5)
  }, [images])

  useEffect(() => {
    if (imageIndex >= finalImages.length) {
      setImageIndex(0)
    }
  }, [finalImages.length, imageIndex])

  useEffect(() => {
    if (!visible) return

    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    let cancelled = false
    let progressTimer: ReturnType<typeof setInterval> | null = null
    let imageTimer: ReturnType<typeof setInterval> | null = null

    const finish = () => {
      if (cancelled) return
      setProgress(100)
      setVisible(false)
      document.body.style.overflow = prevBodyOverflow || ''
      document.documentElement.style.overflow = prevHtmlOverflow || ''
    }

    const run = async () => {
      const stepMs = Math.max(14, Math.floor(MIN_MS / TOTAL_STEPS))
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (progressTimer) clearInterval(progressTimer)
            return 100
          }
          return prev + 1
        })
      }, stepMs)

      imageTimer = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % finalImages.length)
      }, 560)

      await Promise.all([
        new Promise((r) => setTimeout(r, MIN_MS)),
        document.fonts?.ready ?? Promise.resolve(),
      ])
      finish()
    }

    run()
    return () => {
      cancelled = true
      if (progressTimer) clearInterval(progressTimer)
      if (imageTimer) clearInterval(imageTimer)
      document.body.style.overflow = prevBodyOverflow || ''
      document.documentElement.style.overflow = prevHtmlOverflow || ''
    }
  }, [finalImages.length, visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black"
          role="status"
          aria-live="polite"
          aria-label="Carregando Veredas"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'inset(100% 0 0 0)',
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-black/[0.08]" />
          <div className="relative z-10 flex w-full items-center justify-center px-6 md:px-10">
            <div className="flex w-full max-w-[1200px] flex-col items-center gap-2 md:grid md:grid-cols-[1fr_min(72vw,420px)_1fr] md:items-center md:gap-4">
              <div className="flex w-[min(72vw,420px)] items-center justify-between md:hidden">
                <p
                  className="text-[clamp(2.3rem,10vw,4rem)] uppercase leading-[0.92] tracking-[0.02em] text-white"
                  style={{ fontFamily: 'var(--font-condensed)', fontWeight: 800 }}
                >
                  VEREDAS
                </p>
                <p
                  className="text-[clamp(1.6rem,7vw,3rem)] uppercase text-white"
                  style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.03em' }}
                >
                  {progress}%
                </p>
              </div>

              <p
                className="hidden justify-self-end text-[clamp(4rem,12vw,8.8rem)] uppercase leading-[0.92] tracking-[0.02em] text-white md:block"
                style={{ fontFamily: 'var(--font-condensed)', fontWeight: 800 }}
              >
                VEREDAS
              </p>

              <div className="relative">
                <div className="relative mx-auto flex h-[min(72vh,760px)] w-[min(72vw,420px)] items-center justify-center overflow-hidden">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={`${finalImages[imageIndex]}-${imageIndex}`}
                      src={finalImages[imageIndex]}
                      alt=""
                      className="absolute inset-0 h-full w-full object-contain"
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.24, ease: 'easeOut' }}
                      draggable={false}
                    />
                  </AnimatePresence>
                </div>

                <div className="mx-auto mt-3 h-[3px] w-[min(72vw,420px)] bg-black/20">
                  <motion.div
                    className="h-full origin-left bg-[var(--brand-blue)]"
                    animate={{ scaleX: Math.max(0.02, progress / 100) }}
                    transition={{ duration: 0.08, ease: 'linear' }}
                  />
                </div>
              </div>

              <p
                className="hidden justify-self-start text-[clamp(2.6rem,8vw,5.2rem)] uppercase text-white md:block"
                style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.03em' }}
              >
                {progress}%
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
