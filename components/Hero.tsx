'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { useLenis } from '@/contexts/LenisContext'
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
  subtexto?: string | PortableTextBlock[] | null
  ctaTexto?: string | null
  ctaLink?: string | null
}

const MOBILE_MAX_WIDTH_PX = 767
const HERO_TITLE_SCALE_Y_DESKTOP = 1.35
const HERO_TITLE_SCALE_Y_MOBILE = 1.2
const VIDEO_SCALE_START = 0.2
const VIDEO_SCALE_END = 1
const PROGRESS_COMPLETE = 0.999

export default function Hero({
  videoUrl,
  titulo,
}: HeroProps) {
  const { translations: t } = useLang()
  const lenis = useLenis()
  const containerRef = useRef<HTMLElement>(null)
  const titleContainerRef = useRef<HTMLHeadingElement>(null)
  const titleTextRef = useRef<HTMLSpanElement>(null)
  const heroExpandedRef = useRef(false)
  const clampingRef = useRef(false)
  const resolvedUrl = videoUrl ?? '/hero.mp4'
  const word = (titulo ?? 'VEREDAS').toUpperCase()
  const [titleFontPx, setTitleFontPx] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [heroExpanded, setHeroExpanded] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)

  const progress = useMotionValue(0)
  const videoScale = useTransform(progress, [0, 1], [VIDEO_SCALE_START, VIDEO_SCALE_END])
  const viewfinderOpacity = useTransform(progress, [0, 0.35], [1, 0])
  const titleOpacity = useTransform(progress, [0.55, 1], [1, 0])

  const getHeroMetrics = () => {
    const hero = containerRef.current
    if (!hero) return null

    const range = window.innerHeight
    const heroTop = hero.offsetTop
    const animationEnd = heroTop + range

    return { hero, range, heroTop, animationEnd }
  }

  const syncHeroProgress = () => {
    if (reducedMotion) return

    const metrics = getHeroMetrics()
    if (!metrics) return

    const { range, heroTop, animationEnd } = metrics
    const localScroll = Math.max(0, window.scrollY - heroTop)
    const nextProgress = Math.min(1, localScroll / range)

    progress.set(nextProgress)

    if (!heroExpandedRef.current && window.scrollY > animationEnd) {
      clampingRef.current = true
      if (lenis) {
        lenis.scrollTo(animationEnd, { immediate: true })
      } else {
        window.scrollTo({ top: animationEnd, behavior: 'auto' })
      }
      clampingRef.current = false
    }
  }

  useMotionValueEvent(progress, 'change', (value) => {
    const expanded = value >= PROGRESS_COMPLETE
    if (expanded !== heroExpandedRef.current) {
      heroExpandedRef.current = expanded
      setHeroExpanded(expanded)
      window.dispatchEvent(
        new CustomEvent(expanded ? 'hero-scroll-unlock' : 'hero-scroll-lock')
      )
    }
  })

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(prefersReduced)
    setViewportHeight(window.innerHeight)

    if (prefersReduced) {
      progress.set(1)
      heroExpandedRef.current = true
      setHeroExpanded(true)
    }
  }, [progress])

  useEffect(() => {
    const onResize = () => {
      setViewportHeight(window.innerHeight)
      syncHeroProgress()
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  })

  useEffect(() => {
    if (reducedMotion) return

    syncHeroProgress()
    window.addEventListener('scroll', syncHeroProgress, { passive: true })

    const onLenisScroll = () => syncHeroProgress()
    lenis?.on('scroll', onLenisScroll)

    return () => {
      window.removeEventListener('scroll', syncHeroProgress)
      lenis?.off('scroll', onLenisScroll)
    }
  }, [lenis, reducedMotion, viewportHeight])

  useLayoutEffect(() => {
    const fitTitle = () => {
      const container = titleContainerRef.current
      const text = titleTextRef.current
      if (!container || !text) return

      const viewportWidth = window.innerWidth
      const mobile = viewportWidth <= MOBILE_MAX_WIDTH_PX
      setIsMobile(mobile)

      const scaleY = mobile ? HERO_TITLE_SCALE_Y_MOBILE : HERO_TITLE_SCALE_Y_DESKTOP
      text.style.transform = `scaleY(${scaleY})`

      const containerRect = container.getBoundingClientRect()
      const maxWidth = containerRect.width
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

  const titleScaleY = isMobile ? HERO_TITLE_SCALE_Y_MOBILE : HERO_TITLE_SCALE_Y_DESKTOP
  const sectionHeightPx = viewportHeight > 0 ? viewportHeight * 2 : undefined

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full"
      style={{ height: sectionHeightPx ?? '200dvh' }}
      data-hero-unlocked={heroExpanded ? 'true' : 'false'}
    >
      <div
        className="sticky top-0 w-full overflow-hidden bg-black"
        style={{ height: viewportHeight > 0 ? viewportHeight : '100dvh' }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          style={{ opacity: reducedMotion ? 1 : titleOpacity }}
        >
          <h1
            ref={titleContainerRef}
            className="absolute inset-0 m-0 flex items-center justify-center overflow-hidden px-2 md:px-4"
            aria-label={t.hero.titulo}
          >
            <span
              ref={titleTextRef}
              className="inline-block max-h-full max-w-full origin-center text-center"
              style={{
                fontFamily: 'var(--font-big-shoulders)',
                fontWeight: 900,
                fontSize: titleFontPx ? `${titleFontPx}px` : '1px',
                color: '#ffffff',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                lineHeight: 0.82,
                letterSpacing: isMobile ? '-0.06em' : '-0.04em',
                transform: `scaleY(${titleScaleY})`,
              }}
            >
              {word}
            </span>
          </h1>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-10 origin-center will-change-transform"
          style={{
            scale: reducedMotion ? VIDEO_SCALE_END : videoScale,
          }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              aria-hidden
            >
              <source src={resolvedUrl} type={videoMimeType(resolvedUrl)} />
            </video>
          </div>
        </motion.div>

        {!reducedMotion && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20"
            style={{ opacity: viewfinderOpacity }}
          >
            <HeroViewfinder
              tagline={t.hero.overlayTagline}
              recLabel={t.hero.rec}
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
