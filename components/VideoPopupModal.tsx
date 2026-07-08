'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import type { ParsedVideo } from '@/lib/videoUrl'

type VideoPopupModalProps = {
  open: boolean
  onClose: () => void
  video: ParsedVideo | null
  title?: string
}

export default function VideoPopupModal({ open, onClose, video, title }: VideoPopupModalProps) {
  const { translations: t } = useLang()
  const modalTitle = title ?? t.videoModal.defaultTitle
  useEffect(() => {
    if (!open) return

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
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
      {open && video ? (
        <>
          <motion.button
            type="button"
            aria-label={t.videoModal.closeVideoAria}
            className="fixed inset-0 z-[250] cursor-default bg-black/88 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={modalTitle}
            className="fixed inset-0 z-[251] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative w-full max-w-5xl">
              <button
                type="button"
                onClick={onClose}
                className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center text-white/80 transition-colors hover:text-white md:-right-2 md:-top-14"
                aria-label={t.actions.fechar}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              <div className="overflow-hidden rounded-sm bg-black shadow-2xl ring-1 ring-white/10">
                {video.kind === 'file' ? (
                  <video
                    key={video.src}
                    src={video.src}
                    controls
                    autoPlay
                    playsInline
                    className="aspect-video max-h-[80svh] w-full bg-black object-contain"
                  />
                ) : (
                  <iframe
                    key={video.embedUrl}
                    src={video.embedUrl}
                    title={modalTitle}
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="aspect-video max-h-[80svh] w-full border-0 bg-black"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}
