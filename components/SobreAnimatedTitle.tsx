'use client'

import { useLang } from '@/contexts/LanguageContext'

const TITLE = 'VEREDAS SINCE 2021'

export default function SobreAnimatedTitle() {
  const { lang } = useLang()
  const eyebrow = lang === 'pt' ? 'SOBRE A VEREDAS' : 'ABOUT VEREDAS'

  return (
    <div className="px-6 pb-8 pt-28 md:px-10 md:pt-32">
      <p
        className="mb-5 text-[0.29rem] font-semibold uppercase tracking-[0.18em] text-[#242424]/75 md:mb-6 md:text-[0.58rem]"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {eyebrow}
      </p>

      <h1
        className="m-0 text-center text-[15.6vw] uppercase leading-[0.88] tracking-[-0.015em] text-[#111] md:text-[260px]"
        style={{ fontFamily: 'var(--font-condensed)', fontWeight: 800 }}
      >
        {TITLE}
      </h1>

      <div className="mt-5 grid grid-cols-1 border-y border-black/25 py-2 text-[0.5rem] font-semibold uppercase tracking-[0.13em] text-[#242424]/80 md:mt-7 md:grid-cols-3">
        <span style={{ fontFamily: 'var(--font-sans)' }}>VEREDAS</span>
        <span className="text-left md:text-center" style={{ fontFamily: 'var(--font-sans)' }}>
          AGENCIA DE GESTAO E EMPRESARIAMENTO ARTISTICO
        </span>
        <span className="text-left md:text-right" style={{ fontFamily: 'var(--font-sans)' }}>
          SAO PAULO, BRASIL
        </span>
      </div>
    </div>
  )
}
