import type { Metadata } from 'next'
import { Bebas_Neue, Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import { LanguageProvider } from '@/contexts/LanguageContext'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const druk = localFont({
  src: [
    { path: '../public/fonts/DrukCond-Super.woff2', weight: '900', style: 'normal' },
    { path: '../public/fonts/DrukCond-Super.woff', weight: '900', style: 'normal' },
  ],
  variable: '--font-condensed-raw',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Veredas Casting',
  description: 'Agência de casting para cinema, televisão e publicidade.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${druk.variable} ${bebasNeue.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
