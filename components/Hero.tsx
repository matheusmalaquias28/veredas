'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  animate,
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
const VIDEO_SCALE_START_DESKTOP = 0.2
const VIDEO_SCALE_START_MOBILE = 0.26
const VIDEO_SCALE_END = 1
const PROGRESS_COMPLETE = 0.999
const MOBILE_AUTO_DURATION_S = 4.5

function isMobileViewport() {
  return window.innerWidth <= MOBILE_MAX_WIDTH_PX
}

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
  const isMobileRef = useRef(false)
  const reducedMotionRef = useRef(false)
  const mobileAnimStartedRef = useRef(false)
  const resolvedUrl = videoUrl ?? '/hero.mp4'
  const word = (titulo ?? 'VEREDAS').toUpperCase()
  const [titleFontPx, setTitleFontPx] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= MOBILE_MAX_WIDTH_PX
  )
  const [reducedMotion, setReducedMotion] = useState(false)
  const [heroExpanded, setHeroExpanded] = useState(false)

  const progress = useMotionValue(0)

  const videoScale = useTransform(progress, (value) => {
    const start = isMobileRef.current ? VIDEO_SCALE_START_MOBILE : VIDEO_SCALE_START_DESKTOP
    return start + value * (VIDEO_SCALE_END - start)
  })
  const viewfinderOpacity = useTransform(progress, [0, 0.35], [1, 0])
  const titleOpacity = useTransform(progress, [0.55, 1], [1, 0])

  isMobileRef.current = isMobile
  reducedMotionRef.current = reducedMotion

  const setExpandedState = useCallback((expanded: boolean) => {
    if (expanded === heroExpandedRef.current) return
    heroExpandedRef.current = expanded
    setHeroExpanded(expanded)
    window.dispatchEvent(
      new CustomEvent(expanded ? 'hero-scroll-unlock' : 'hero-scroll-lock')
    )
  }, [])

  const syncDesktopProgress = useCallback(() => {
    if (isMobileRef.current || reducedMotionRef.current) return

    const hero = containerRef.current
    if (!hero) return

    const viewport = window.innerHeight
    const range = hero.offsetHeight - viewport
    if (range <= 1) return

    const scrolled = Math.max(0, -hero.getBoundingClientRect().top)
    progress.set(Math.min(1, scrolled / range))
  }, [progress])

  const startMobileAnimation = useCallback(() => {
    if (!isMobileRef.current || reducedMotionRef.current || mobileAnimStartedRef.current) return
    mobileAnimStartedRef.current = true
    progress.set(0)
    animate(progress, 1, {
      duration: MOBILE_AUTO_DURATION_S,
      ease: [0.22, 1, 0.36, 1],
    })
  }, [progress])

  useMotionValueEvent(progress, 'change', (value) => {
    if (reducedMotionRef.current) return
    setExpandedState(value >= PROGRESS_COMPLETE)
  })

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = isMobileViewport()
    setReducedMotion(prefersReduced)
    setIsMobile(mobile)
    isMobileRef.current = mobile

    if (prefersReduced) {
      progress.set(1)
      setExpandedState(true)
    }
  }, [progress, setExpandedState])

  useEffect(() => {
    if (!isMobile || reducedMotion) return

    const start = () => startMobileAnimation()
    window.addEventListener('preloader-complete', start)

    const id = requestAnimationFrame(() => {
      if (document.documentElement.style.overflow !== 'hidden') {
        start()
      }
    })

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('preloader-complete', start)
      mobileAnimStartedRef.current = false
    }
  }, [isMobile, reducedMotion, startMobileAnimation])

  useEffect(() => {
    if (reducedMotion || isMobile) return

    const onScroll = () => syncDesktopProgress()
    const onReady = () => {
      lenis?.resize()
      syncDesktopProgress()
    }

    onReady()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onReady)
    window.addEventListener('preloader-complete', onReady)
    lenis?.on('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onReady)
      window.removeEventListener('preloader-complete', onReady)
      lenis?.off('scroll', onScroll)
    }
  }, [isMobile, lenis, reducedMotion, syncDesktopProgress])

  useLayoutEffect(() => {
    const fitTitle = () => {
      const container = titleContainerRef.current
      const text = titleTextRef.current
      if (!container || !text) return

      const mobile = window.innerWidth <= MOBILE_MAX_WIDTH_PX
      setIsMobile(mobile)
      isMobileRef.current = mobile

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
      className="relative h-[100svh] w-full md:h-[200svh]"
      data-hero-unlocked={heroExpanded ? 'true' : 'false'}
    >
      <div
        data-hero-sticky
        className="top-0 h-[100svh] w-full overflow-hidden bg-black md:sticky"
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
