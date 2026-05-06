'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

/**
 * Scroll inercial (Lenis). Mais suave que scroll-behavior: smooth do CSS.
 * Respeita prefers-reduced-motion (não inicializa).
 */
export default function LenisSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const html = document.documentElement
    html.classList.add('lenis', 'lenis-smooth')

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.038,
      wheelMultiplier: 0.78,
      touchMultiplier: 0.92,
      smoothWheel: true,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    })
    lenisRef.current = lenis

    return () => {
      lenis.destroy()
      lenisRef.current = null
      html.classList.remove('lenis', 'lenis-smooth')
    }
  }, [])

  useEffect(() => {
    lenisRef.current?.resize()
  }, [pathname])

  return null
}
