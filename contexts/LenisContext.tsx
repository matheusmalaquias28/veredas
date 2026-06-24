'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const html = document.documentElement
    html.classList.add('lenis', 'lenis-smooth')

    const instance = new Lenis({
      autoRaf: true,
      lerp: 0.038,
      wheelMultiplier: 0.78,
      touchMultiplier: 0.92,
      smoothWheel: true,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    })
    setLenis(instance)

    return () => {
      instance.destroy()
      setLenis(null)
      html.classList.remove('lenis', 'lenis-smooth')
    }
  }, [])

  useEffect(() => {
    lenis?.resize()
  }, [pathname, lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
