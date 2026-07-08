'use client'

import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'

export function CriativoBackLink() {
  const { translations: t } = useLang()

  return (
    <div className="fixed top-[92px] left-0 right-0 z-[90] flex items-center px-6 py-3 md:px-10">
      <Link
        href="/criativos"
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 transition-colors hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t.actions.voltarCriativos}
      </Link>
    </div>
  )
}

export function CriativoListCta() {
  const { translations: t } = useLang()

  return (
    <div className="mt-12">
      <Link
        href="/criativos"
        className="inline-flex items-center gap-3 border border-white/20 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:border-white hover:text-white"
      >
        {t.actions.verTodosCriativos}
      </Link>
    </div>
  )
}
