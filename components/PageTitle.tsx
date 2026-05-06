'use client'

import { useLang } from '@/contexts/LanguageContext'

type PageKey = 'criativos' | 'atores' | 'atrizes' | 'estrangeiros' | 'sobre'

export default function PageTitle({ pageKey }: { pageKey: PageKey }) {
  const { translations: t } = useLang()
  return (
    <div className="px-6 pb-10 pt-32 md:px-10 md:pt-36">
      <p
        className="mb-3 uppercase"
        style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: '#4277f6' }}
      >
        {t.pages.eyebrow}
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-condensed)',
          fontSize: 'clamp(3.5rem, 8vw, 7rem)',
          fontWeight: 700,
          color: '#242424',
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
        }}
      >
        {t.pages[pageKey]}
      </h1>
      <div className="mt-6 h-px bg-neutral-100" />
    </div>
  )
}
