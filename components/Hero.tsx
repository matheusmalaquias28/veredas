'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import HeroViewfinder from '@/components/HeroViewfinder'
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

const MOBILE_MAX_WIDTH_PX = 767
const HERO_TITLE_WIDTH_RATIO = 1
const HERO_TITLE_WIDTH_RATIO_MOBILE = 0.9
const HERO_TITLE_SCALE_Y_DESKTOP = 1.35
const HERO_TITLE_SCALE_Y_MOBILE = 1.2

export default function Hero({
  videoUrl,
  titulo,
}: HeroProps) {
  const { translations: t } = useLang()
  const titleContainerRef = useRef<HTMLHeadingElement>(null)
  const titleTextRef = useRef<HTMLSpanElement>(null)
  const resolvedUrl = videoUrl ?? '/hero-background.webm'
  const word = (titulo ?? 'VEREDAS').toUpperCase()
  const [titleFontPx, setTitleFontPx] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useLayoutEffect(() => {
    const fitTitle = () => {
      const container = titleContainerRef.current
      const text = titleTextRef.current
      if (!container || !text) return

      const viewportWidth = window.innerWidth
      const mobile = viewportWidth <= MOBILE_MAX_WIDTH_PX
      setIsMobile(mobile)

      const scaleY = mobile
        ? HERO_TITLE_SCALE_Y_MOBILE
        : HERO_TITLE_SCALE_Y_DESKTOP
      text.style.transform = `scaleY(${scaleY})`

      const containerRect = container.getBoundingClientRect()
      const widthRatio = mobile
        ? HERO_TITLE_WIDTH_RATIO_MOBILE
        : HERO_TITLE_WIDTH_RATIO
      const maxWidth = containerRect.width * widthRatio
      const maxHeight = containerRect.height

      const probePx = 320
      text.style.fontSize = `${probePx}px`

      const textWidth = text.scrollWidth
      const textHeight = text.scrollHeight
      if (textWidth <= 0 || textHeight <= 0) return

      const fitByWidth = (maxWidth * probePx) / textWidth
      const fitByHeight = (maxHeight * probePx) / textHeight
      let fontPx = Math.min(fitByWidth, fitByHeight)

      for (let pass = 0; pass < 4; pass++) {
        text.style.fontSize = `${fontPx}px`
        const w = text.scrollWidth
        const h = text.scrollHeight
        const scale = Math.min(1, maxWidth / w, maxHeight / h)
        if (scale >= 0.998) break
        fontPx *= scale
      }

      setTitleFontPx(fontPx)
    }

    fitTitle()
    window.addEventListener('resize', fitTitle)
    return () => window.removeEventListener('resize', fitTitle)
  }, [word])

  const titleScaleY = isMobile
    ? HERO_TITLE_SCALE_Y_MOBILE
    : HERO_TITLE_SCALE_Y_DESKTOP

  return (
    <section
      id="hero"
      className="relative h-[100dvh] min-h-[100svh] w-full overflow-hidden bg-black"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        aria-hidden
      >
        <source src={resolvedUrl} type={videoMimeType(resolvedUrl)} />
      </video>

      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <h1
          ref={titleContainerRef}
          className="absolute top-0 right-0 left-0 m-0 flex h-[28dvh] w-full items-start justify-center overflow-hidden px-4 pt-[25px] md:h-[38dvh] md:px-0 md:pt-0"
          aria-label={t.hero.titulo}
        >
          <span
            ref={titleTextRef}
            className="inline-block max-w-full origin-top px-0 text-center"
            style={{
              fontFamily: 'var(--font-big-shoulders)',
              fontWeight: 900,
              fontSize: titleFontPx ? `${titleFontPx}px` : '1px',
              color: '#ffffff',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              lineHeight: 0.82,
              letterSpacing: mobileLetterSpacing(isMobile),
              transform: `scaleY(${titleScaleY})`,
            }}
          >
            {word}
          </span>
        </h1>
      </div>

      <HeroViewfinder
        tagline={t.hero.overlayTagline}
        recLabel={t.hero.rec}
      />
    </section>
  )
}

function mobileLetterSpacing(isMobile: boolean) {
  return isMobile ? '-0.06em' : '-0.04em'
}
