'use client'

import { useLang } from '@/contexts/LanguageContext'

export default function SobreAnimatedTitle() {
  const { translations: t } = useLang()
  const hero = t.sobre.hero

  return (
    <div className="px-6 pb-8 pt-28 md:px-10 md:pt-32">
      <p
        className="mb-5 text-[0.37rem] font-semibold uppercase tracking-[0.18em] text-[#242424]/75 md:mb-6 md:text-[0.739rem]"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {hero.eyebrow}
      </p>

      <h1
        className="m-0 text-center text-[19.874vw] uppercase leading-[0.88] tracking-[-0.015em] text-[#111] md:text-[331px]"
        style={{ fontFamily: 'var(--font-condensed)', fontWeight: 800 }}
      >
        {hero.title}
      </h1>

      <div className="mt-5 grid grid-cols-1 border-y border-black/25 py-2 text-[0.91rem] font-semibold uppercase tracking-[0.13em] text-[#242424]/80 md:mt-7 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-6">
        <span className="md:whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)' }}>
          {hero.brand}
        </span>
        <span
          className="text-left md:whitespace-nowrap md:text-center md:text-[clamp(0.62rem,0.72vw,0.91rem)]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {hero.subtitle}
        </span>
        <span
          className="text-left md:whitespace-nowrap md:text-right"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {hero.location}
        </span>
      </div>
    </div>
  )
}
