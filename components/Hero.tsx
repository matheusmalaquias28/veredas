'use client'

import { useRef, useLayoutEffect, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import type { PortableTextBlock } from 'next-sanity'

function videoMimeType(url: string): string {
  const path = url.split('?')[0].toLowerCase()
  if (path.endsWith('.webm')) return 'video/webm'
  if (path.endsWith('.mp4') || path.endsWith('.m4v')) return 'video/mp4'
  if (path.endsWith('.ogg') || path.endsWith('.ogv')) return 'video/ogg'
  return 'video/mp4'
}

interface HeroProps {
  videoUrl?: string | null
  titulo?: string | null
  /** String ou Portable Text (Sanity). */
  subtexto?: string | PortableTextBlock[] | null
  ctaTexto?: string | null
  ctaLink?: string | null
}

/** Altura de scroll da seção (viewport). */
export const HERO_SCROLL_SECTION_VH = 2.6

/** Espaço após o hero antes da próxima seção. */
export const HERO_BOTTOM_SPACING_VH = 0.2

const SCROLL_SECTION_VH = HERO_SCROLL_SECTION_VH

/** Escala inicial do vídeo (âncora inferior). */
const VIDEO_INITIAL_SCALE = 0.34

/** Deslocamento vertical (vh) para centralizar o vídeo pequeno no meio da tela. */
const VIDEO_CENTER_OFFSET_VH = (0.5 - VIDEO_INITIAL_SCALE / 2) * 100

export default function Hero({
  videoUrl,
  titulo,
}: HeroProps) {
  const { translations: t } = useLang()
  const containerRef = useRef<HTMLElement>(null)
  const titleInnerRef = useRef<HTMLSpanElement>(null)
  const resolvedUrl = videoUrl ?? '/hero-background.webm'
  const word = (titulo ?? 'VEREDAS').toUpperCase()
  const charCount = Math.max(1, word.length)
  const letterGapPx = 2
  const gapsTotalPx = (charCount - 1) * letterGapPx

  const [titleFontPx, setTitleFontPx] = useState<number | null>(null)

  useLayoutEffect(() => {
    const measure = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const widthFactor = 0.38
      const heightDivisor = 0.58
      const fsW = (vw - gapsTotalPx) / (charCount * widthFactor)
      const fsH = vh / heightDivisor
      let fs = Math.min(fsW, fsH)

      const el = titleInnerRef.current
      if (el) {
        el.style.fontSize = `${fs}px`
        const r = el.getBoundingClientRect()
        const pad = 0.992
        const sw = (vw * pad) / Math.max(r.width, 1)
        const sh = (vh * pad) / Math.max(r.height, 1)
        fs *= Math.min(sw, sh)
      }

      setTitleFontPx(fs)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [word, charCount, gapsTotalPx])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  /**
   * Máscara de baixo para cima: inset inferior 0% → 100% (some a partir da base).
   */
  const titleMaskBottomInset = useTransform(scrollYProgress, [0, 0.72], [0, 100])
  const titleClipPath = useMotionTemplate`inset(0% 0% ${titleMaskBottomInset}% 0%)`

  /**
   * Fase 1 (~0–40%): vídeo sobe da base até o centro (escala fixa).
   * Fase 2 (~40–56%): no centro, expande rápido até tela cheia (scale 1 + y → 0).
   * Restante: mantém fullscreen enquanto a seção ainda rola (sticky).
   */
  const VIDEO_AT_CENTER = 0.4
  const VIDEO_FULLSCREEN = 0.56

  const videoY = useTransform(
    scrollYProgress,
    [0, VIDEO_AT_CENTER, VIDEO_FULLSCREEN, 1],
    ['0vh', `-${VIDEO_CENTER_OFFSET_VH}vh`, '0vh', '0vh']
  )

  const videoScale = useTransform(
    scrollYProgress,
    [0, VIDEO_AT_CENTER, VIDEO_FULLSCREEN, 1],
    [VIDEO_INITIAL_SCALE, VIDEO_INITIAL_SCALE, 1, 1]
  )

  return (
    <section
      ref={containerRef}
      className="relative mb-[20vh] w-full bg-background"
      style={{ minHeight: `${SCROLL_SECTION_VH * 100}vh` }}
    >
      <div className="sticky top-0 h-[100dvh] min-h-[100svh] w-full bg-background">
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center [will-change:clip-path]"
          style={{ clipPath: titleClipPath }}
        >
          <h1
            className="m-0 flex max-h-[100dvh] max-w-[100vw] items-center justify-center p-0 text-center"
            aria-label={t.hero.titulo}
          >
            <span
              ref={titleInnerRef}
              className="inline-block text-[#242424]"
              style={{
                visibility: titleFontPx == null ? 'hidden' : 'visible',
                fontFamily: 'var(--font-condensed)',
                fontWeight: 800,
                fontSize: titleFontPx != null ? `${titleFontPx}px` : '1px',
                lineHeight: 1,
                letterSpacing: `${letterGapPx}px`,
                textTransform: 'uppercase',
              }}
            >
              {word}
            </span>
          </h1>
        </motion.div>

        <div className="absolute inset-0 z-[2] flex items-end justify-center overflow-hidden">
          <motion.div
            className="relative h-[100dvh] min-h-[100svh] w-[100vw] max-w-[100vw] will-change-transform"
            style={{
              y: videoY,
              scale: videoScale,
              transformOrigin: '50% 100%',
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden
            >
              <source src={resolvedUrl} type={videoMimeType(resolvedUrl)} />
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
