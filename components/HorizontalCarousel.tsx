'use client'

import { useRef, useEffect, ReactNode } from 'react'
import { useLang } from '@/contexts/LanguageContext'

interface HorizontalCarouselProps {
  title: string
  itemCount: number
  id?: string
  /** Quantidade “visível” no desktop (maior = cards menores). Predefinição: 6. */
  visibleCountDesktop?: number
  /** Quantidade “visível” no mobile (<768px). Predefinição: 1.5. */
  visibleCountMobile?: number
  /** Caixa de cor sólida à esquerda (tela cheia) envolvendo o título. */
  titleBlueBox?: boolean
  /** Cor de fundo da caixa (ex.: #4277F6 Elenco, #DB260E Produções). */
  titleBoxColor?: string
  /** Cor do texto dentro da caixa. Predefinição: branco. */
  titleBoxTextColor?: string
  /** Classes Tailwind da linha do título (substitui o `pt-12 pb-6` predefinido). */
  headerRowClassName?: string
  /** Classes extra no `<section>` (ex.: `-mt-8` para aproximar do carrossel anterior). */
  sectionClassName?: string
  /** Margem inferior da régua (ex.: `mb-0` para colar no carrossel seguinte). Predefinição: `mb-4`. */
  bottomRuleMbClass?: string
  children: ReactNode
}

export default function HorizontalCarousel({
  title,
  itemCount,
  id,
  children,
  visibleCountDesktop = 6,
  visibleCountMobile = 1.5,
  titleBlueBox = false,
  titleBoxColor = '#4277F6',
  titleBoxTextColor = '#ffffff',
  headerRowClassName,
  sectionClassName,
  bottomRuleMbClass = 'mb-4',
}: HorizontalCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { translations: t } = useLang()

  const state = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentTranslate: 0,
    dragOffset: 0,
    maxTranslate: 0,
    isHorizontalDrag: false,
    isHovered: false,
    scrollLocked: false,
    previousBodyOverflowY: '',
    previousHtmlOverflowY: '',
    suppressClick: false,
  })

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const s = state.current

    const recalculate = () => {
      const isMobile = window.innerWidth < 768
      const visibleCount = isMobile ? visibleCountMobile : visibleCountDesktop
      const gap = isMobile ? 12 : 16
      const itemWidth = (window.innerWidth - gap * (visibleCount - 1)) / visibleCount
      s.maxTranslate = Math.max(0, (itemCount - visibleCount) * (itemWidth + gap))
      s.currentTranslate = Math.max(-s.maxTranslate, Math.min(0, s.currentTranslate))
      track.style.setProperty('--cc-vis', String(visibleCount))
      track.style.setProperty('--cc-gap', `${gap}px`)
      applyTransform()
    }

    const applyTransform = () => {
      const raw = s.currentTranslate + s.dragOffset
      const clamped = Math.max(-s.maxTranslate, Math.min(0, raw))
      track.style.transform = `translateX(${clamped}px)`
    }

    // Mouse drag
    const handleMouseDown = (e: MouseEvent) => {
      s.isDragging = true
      s.startX = e.clientX
      s.dragOffset = 0
      s.suppressClick = false
      track.style.cursor = 'grabbing'
      track.style.transition = 'none'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!s.isDragging) return
      s.dragOffset = e.clientX - s.startX
      applyTransform()
    }

    const handleMouseUp = () => {
      if (!s.isDragging) return
      const draggedEnoughToCancelClick = Math.abs(s.dragOffset) > 6
      s.isDragging = false
      s.currentTranslate = Math.max(-s.maxTranslate, Math.min(0, s.currentTranslate + s.dragOffset))
      s.dragOffset = 0
      s.suppressClick = draggedEnoughToCancelClick
      track.style.cursor = 'grab'
    }

    const handleMouseEnter = () => {
      s.isHovered = true
      if (!s.scrollLocked) {
        s.previousBodyOverflowY = document.body.style.overflowY
        s.previousHtmlOverflowY = document.documentElement.style.overflowY
        document.body.style.overflowY = 'hidden'
        document.documentElement.style.overflowY = 'hidden'
        s.scrollLocked = true
      }
    }

    const handleMouseLeave = () => {
      s.isHovered = false
      if (s.scrollLocked) {
        document.body.style.overflowY = s.previousBodyOverflowY
        document.documentElement.style.overflowY = s.previousHtmlOverflowY
        s.scrollLocked = false
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (!s.isHovered) return

      const movement = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (movement === 0) return

      e.preventDefault()
      e.stopPropagation()
      s.currentTranslate = Math.max(-s.maxTranslate, Math.min(0, s.currentTranslate - movement))
      s.dragOffset = 0
      applyTransform()
    }

    const handleTrackClickCapture = (e: MouseEvent) => {
      if (!s.suppressClick) return
      e.preventDefault()
      e.stopPropagation()
      s.suppressClick = false
    }

    // Touch drag
    const handleTouchStart = (e: TouchEvent) => {
      s.startX = e.touches[0].clientX
      s.startY = e.touches[0].clientY
      s.isDragging = false
      s.isHorizontalDrag = false
      s.dragOffset = 0
    }

    const handleTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - s.startX
      const dy = e.touches[0].clientY - s.startY

      if (!s.isDragging && !s.isHorizontalDrag) {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
          s.isDragging = true
          s.isHorizontalDrag = true
        } else if (Math.abs(dy) > 8) {
          return // vertical scroll — don't interfere
        }
      }

      if (s.isDragging) {
        e.preventDefault()
        s.dragOffset = dx
        applyTransform()
      }
    }

    const handleTouchEnd = () => {
      if (s.isDragging) {
        s.currentTranslate = Math.max(-s.maxTranslate, Math.min(0, s.currentTranslate + s.dragOffset))
        s.dragOffset = 0
      }
      s.isDragging = false
      s.isHorizontalDrag = false
    }

    recalculate()

    window.addEventListener('resize', recalculate, { passive: true })
    track.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    track.addEventListener('mouseenter', handleMouseEnter)
    track.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    track.addEventListener('click', handleTrackClickCapture, true)
    track.addEventListener('touchstart', handleTouchStart, { passive: true })
    track.addEventListener('touchmove', handleTouchMove, { passive: false })
    track.addEventListener('touchend', handleTouchEnd)

    return () => {
      if (s.scrollLocked) {
        document.body.style.overflowY = s.previousBodyOverflowY
        document.documentElement.style.overflowY = s.previousHtmlOverflowY
        s.scrollLocked = false
      }
      window.removeEventListener('resize', recalculate)
      track.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      track.removeEventListener('mouseenter', handleMouseEnter)
      track.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('wheel', handleWheel, true)
      track.removeEventListener('click', handleTrackClickCapture, true)
      track.removeEventListener('touchstart', handleTouchStart)
      track.removeEventListener('touchmove', handleTouchMove)
      track.removeEventListener('touchend', handleTouchEnd)
    }
  }, [itemCount, visibleCountDesktop, visibleCountMobile])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative min-h-[100svh] bg-background ${sectionClassName ?? ''}`}
    >
      <div className="sticky top-0 flex min-h-[100svh] flex-col overflow-hidden">
        {/* Section header */}
        <div
          className={`flex flex-shrink-0 items-end justify-between px-6 md:px-10 ${
            headerRowClassName ?? 'pt-12 pb-6'
          }`}
        >
          <h2
            className={
              titleBlueBox ? 'm-0 self-start -ml-6 shrink-0 md:-ml-10' : 'm-0'
            }
            style={
              titleBlueBox
                ? {
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                    fontWeight: 400,
                    letterSpacing: '-0.025em',
                    lineHeight: 1,
                  }
                : {
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                    fontWeight: 400,
                    color: '#242424',
                    letterSpacing: '-0.025em',
                  }
            }
          >
            {titleBlueBox ? (
              <span
                className="inline-block p-[20px]"
                style={{ backgroundColor: titleBoxColor, color: titleBoxTextColor }}
              >
                {title}
              </span>
            ) : (
              title
            )}
          </h2>
          <span
            className="hidden md:block text-xs tracking-[0.2em] uppercase pb-2"
            style={{ color: 'rgba(36,36,36,0.35)' }}
          >
            {t.carousel.drag}
          </span>
        </div>

        {/* Track */}
        <div className="flex-1 flex items-start overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-stretch will-change-transform"
            style={{
              paddingLeft: 'clamp(1.5rem, 2.5vw, 2.5rem)',
              paddingRight: 'clamp(1.5rem, 2.5vw, 2.5rem)',
              gap: 'clamp(12px, 1vw, 16px)',
              cursor: 'grab',
              userSelect: 'none',
            }}
          >
            {children}
          </div>
        </div>

        {/* Bottom rule */}
        <div
          className={`mx-6 md:mx-10 flex-shrink-0 ${bottomRuleMbClass}`}
          style={{ height: '1px', background: 'rgba(0,0,0,0.08)' }}
        />
      </div>
    </section>
  )
}
