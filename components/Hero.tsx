'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
import type Lenis from 'lenis'

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

function getScrollY(lenis: Lenis | null): number {
  if (lenis) return lenis.scroll
  return window.scrollY
}

function clampScrollToHeroEnd(
  scrollY: number,
  animationEnd: number,
  lenis: Lenis | null
): number {
  if (scrollY <= animationEnd) return scrollY

  if (lenis) {
    lenis.scrollTo(animationEnd, { immediate: true, force: true })
  } else {
    window.scrollTo({ top: animationEnd, behavior: 'auto' })
  }

  return animationEnd
}

export default function Hero({
  videoUrl,
  titulo,
}: HeroProps) {
  const { translations: t } = useLang()
  const lenis = useLenis()
  const containerRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const titleContainerRef = useRef<HTMLHeadingElement>(null)
  const titleTextRef = useRef<HTMLSpanElement>(null)
  const heroExpandedRef = useRef(false)
  const lenisRef = useRef<Lenis | null>(null)
  const reducedMotionRef = useRef(false)
  const resolvedUrl = videoUrl ?? '/hero.mp4'
  const word = (titulo ?? 'VEREDAS').toUpperCase()
  const [titleFontPx, setTitleFontPx] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [heroExpanded, setHeroExpanded] = useState(false)

  const progress = useMotionValue(0)
  const videoScale = useTransform(progress, [0, 1], [VIDEO_SCALE_START, VIDEO_SCALE_END])
  const viewfinderOpacity = useTransform(progress, [0, 0.35], [1, 0])
  const titleOpacity = useTransform(progress, [0.55, 1], [1, 0])

  lenisRef.current = lenis
  reducedMotionRef.current = reducedMotion

  const getHeroMetrics = useCallback(() => {
    const hero = containerRef.current
    const sticky = stickyRef.current
    if (!hero || !sticky) return null

    const heroTop = hero.offsetTop
    const range = Math.max(1, hero.offsetHeight - sticky.offsetHeight)
    const animationEnd = heroTop + range

    return { range, heroTop, animationEnd }
  }, [])

  const syncHeroProgress = useCallback(() => {
    if (reducedMotionRef.current) return

    const metrics = getHeroMetrics()
    if (!metrics) return

    const lenisInstance = lenisRef.current
    const { range, heroTop, animationEnd } = metrics
    const rawScrollY = getScrollY(lenisInstance)
    const scrollY = heroExpandedRef.current
      ? rawScrollY
      : clampScrollToHeroEnd(rawScrollY, animationEnd, lenisInstance)

    const localScroll = Math.max(0, scrollY - heroTop)
    const nextProgress = Math.min(1, localScroll / range)

    progress.set(nextProgress)
  }, [getHeroMetrics, progress])

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
    reducedMotionRef.current = prefersReduced

    if (prefersReduced) {
      progress.set(1)
      heroExpandedRef.current = true
      setHeroExpanded(true)
    }
  }, [progress])

  useEffect(() => {
    if (reducedMotion) return

    const onMetricsChange = () => {
      lenisRef.current?.resize()
      syncHeroProgress()
    }

    syncHeroProgress()
    window.addEventListener('resize', onMetricsChange)
    window.visualViewport?.addEventListener('resize', onMetricsChange)
    window.visualViewport?.addEventListener('scroll', onMetricsChange)

    return () => {
      window.removeEventListener('resize', onMetricsChange)
      window.visualViewport?.removeEventListener('resize', onMetricsChange)
      window.visualViewport?.removeEventListener('scroll', onMetricsChange)
    }
  }, [reducedMotion, syncHeroProgress])

  useEffect(() => {
    if (reducedMotion) return

    syncHeroProgress()
    window.addEventListener('scroll', syncHeroProgress, { passive: true })

    const onLenisScroll = () => syncHeroProgress()
    lenis?.on('scroll', onLenisScroll)

    let rafId = 0
    const tick = () => {
      if (!heroExpandedRef.current) syncHeroProgress()
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', syncHeroProgress)
      lenis?.off('scroll', onLenisScroll)
      cancelAnimationFrame(rafId)
    }
  }, [lenis, reducedMotion, syncHeroProgress])

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

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[200svh] w-full"
      data-hero-unlocked={heroExpanded ? 'true' : 'false'}
    >
      <div
        ref={stickyRef}
        data-hero-sticky
        className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black"
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
