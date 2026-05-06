'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LenisSmoothScroll from '@/components/LenisSmoothScroll'
import Preloader from '@/components/Preloader'

export default function SiteChrome({
  children,
  instagramUrl,
}: {
  children: React.ReactNode
  instagramUrl?: string | null
}) {
  return (
    <>
      <LenisSmoothScroll />
      <Preloader />
      <Navbar />
      <main>{children}</main>
      <Footer instagramUrl={instagramUrl} />
    </>
  )
}
