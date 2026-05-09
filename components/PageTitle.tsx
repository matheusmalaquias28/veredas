'use client'

import { useRouter } from 'next/navigation'
import { useLang } from '@/contexts/LanguageContext'

type PageKey = 'criativos' | 'atores' | 'atrizes' | 'estrangeiros' | 'sobre'

const LIST_PAGE_TITLE_SIZE = 'clamp(2.45rem, 5.6vw, 4.9rem)' // ~70% de clamp(3.5rem, 8vw, 7rem)
const DEFAULT_PAGE_TITLE_SIZE = 'clamp(3.5rem, 8vw, 7rem)'

export default function PageTitle({ pageKey }: { pageKey: PageKey }) {
  const router = useRouter()
  const { lang, translations: t } = useLang()
  const titleFontSize =
    pageKey === 'sobre' ? DEFAULT_PAGE_TITLE_SIZE : LIST_PAGE_TITLE_SIZE
  return (
    <div className="px-6 pb-10 pt-32 md:px-10 md:pt-36">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-[#4277f6] transition-opacity hover:opacity-80"
      >
        <span aria-hidden>←</span>
        <span>{lang === 'pt' ? 'Voltar' : 'Back'}</span>
      </button>
      <h1
        style={{
          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
          fontSize: titleFontSize,
          fontWeight: 300,
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
