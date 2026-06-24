'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { LenisProvider } from '@/contexts/LenisContext'
import Preloader from '@/components/Preloader'

export default function SiteChrome({
  children,
  instagramUrl,
  preloaderImages,
}: {
  children: React.ReactNode
  instagramUrl?: string | null
  preloaderImages?: string[]
}) {
  useEffect(() => {
    document.documentElement.classList.remove('custom-cursor')
    document.body.style.cursor = ''
  }, [])

  return (
    <LenisProvider>
      <div data-site-chrome="v0.1.4">
        <Preloader images={preloaderImages} />
        <Navbar />
        <main>{children}</main>
        <Footer instagramUrl={instagramUrl} />
      </div>
    </LenisProvider>
  )
}
