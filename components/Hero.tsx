'use client'

import { useLayoutEffect, useRef, useState } from 'react'
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
const HERO_TITLE_VISUAL_BOOST = 1.18

export default function Hero({
  videoUrl,
  titulo,
}: HeroProps) {
  const { translations: t } = useLang()
  const containerRef = useRef<HTMLElement>(null)
  const titleContainerRef = useRef<HTMLHeadingElement>(null)
  const titleTextRef = useRef<HTMLSpanElement>(null)
  const resolvedUrl = videoUrl ?? '/hero-background.webm'
  const word = (titulo ?? 'VEREDAS').toUpperCase()
  const [titleFontPx, setTitleFontPx] = useState<number | null>(null)

  useLayoutEffect(() => {
    const fitTitle = () => {
      const container = titleContainerRef.current
      const text = titleTextRef.current
      if (!container || !text) return

      const probePx = 320
      text.style.fontSize = `${probePx}px`

      const containerRect = container.getBoundingClientRect()
      const textRect = text.getBoundingClientRect()

      const fitByWidth = (containerRect.width * 0.9 * probePx) / Math.max(textRect.width, 1)
      const fitByHeight = (containerRect.height * 0.96 * probePx) / Math.max(textRect.height, 1)
      setTitleFontPx(Math.min(fitByWidth, fitByHeight) * HERO_TITLE_VISUAL_BOOST)
    }

    fitTitle()
    window.addEventListener('resize', fitTitle)
    return () => window.removeEventListener('resize', fitTitle)
  }, [word])

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
            ref={titleContainerRef}
            className="absolute inset-0 m-0 flex items-center justify-center"
            aria-label={t.hero.titulo}
          >
            <span
              ref={titleTextRef}
              className="block text-center"
              style={{
                fontFamily: 'var(--font-big-shoulders)',
                fontWeight: 900,
                fontSize: titleFontPx ? `${titleFontPx}px` : '1px',
                color: '#1a1a1a',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                lineHeight: 0.82,
                letterSpacing: '-0.06em',
                transform: 'scaleY(1.35)',
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
