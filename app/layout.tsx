import type { Metadata } from 'next'
import { Bebas_Neue, Big_Shoulders, Cal_Sans, Montserrat, Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { getSiteUrl } from '@/lib/siteUrl'
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

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['100', '300'],
  display: 'swap',
})

const calSans = Cal_Sans({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-cal-sans',
  display: 'swap',
})

const bigShoulders = Big_Shoulders({
  subsets: ['latin'],
  weight: ['900'],
  variable: '--font-big-shoulders',
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
  metadataBase: getSiteUrl(),
  title: 'Veredas Casting',
  description: 'Agência de casting para cinema, televisão e publicidade.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Veredas',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${druk.variable} ${bebasNeue.variable} ${montserrat.variable} ${calSans.variable} ${bigShoulders.variable}`}
    >
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
