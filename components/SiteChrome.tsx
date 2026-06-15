'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LenisSmoothScroll from '@/components/LenisSmoothScroll'
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
  return (
    <>
      <LenisSmoothScroll />
      <Preloader images={preloaderImages} />
      <Navbar />
      <main>{children}</main>
      <Footer instagramUrl={instagramUrl} />
    </>
  )
}
