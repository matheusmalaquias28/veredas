'use client'

import Image from 'next/image'
import { useLang } from '@/contexts/LanguageContext'

type FounderKey = 'natalia' | 'laila' | 'shay'

const FOUNDERS_ORDER: FounderKey[] = ['natalia', 'laila', 'shay']

/** Quando existirem em `public/sobre/`, preencha os caminhos (ex: '/sobre/natalia.jpg'). */
const FOUNDER_IMAGES: Partial<Record<FounderKey, string>> = {}

export default function SobreContent() {
  const { translations: t } = useLang()

  return (
    <>
      <article
        className="mx-auto max-w-3xl space-y-6 text-neutral-700"
        style={{ fontSize: '1.02rem', lineHeight: 1.68 }}
      >
        <p>{t.sobre.p1}</p>
        <p>{t.sobre.p2}</p>
        <p>{t.sobre.p3}</p>
        <p
          className="border-l-2 border-[var(--brand-blue)] pl-5 text-[#242424]"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', lineHeight: 1.45 }}
        >
          {t.sobre.tagline}
        </p>
      </article>

      <section className="mx-auto mt-16 max-w-6xl md:mt-20" aria-labelledby="fundadoras-heading">
        <h2
          id="fundadoras-heading"
          className="mb-10 text-center font-[family-name:var(--font-bebas)] text-3xl tracking-[-0.025em] text-[#242424] md:text-4xl"
        >
          {t.sobre.teamHeading}
        </h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {FOUNDERS_ORDER.map((key) => {
            const founder = t.sobre.founders[key]
            const src = FOUNDER_IMAGES[key]
            return (
              <div key={key} className="flex flex-col items-center text-center md:items-stretch md:text-left">
                <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-neutral-300/40 md:max-w-none">
                  {src ? (
                    <Image
                      src={src}
                      alt={founder.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 767px) 90vw, 28vw"
                    />
                  ) : null}
                </div>
                <p
                  className="mt-4 text-[0.62rem] font-semibold uppercase leading-snug tracking-[0.14em] text-[#4277f6]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {founder.role}
                </p>
                <p
                  className="mt-2 font-[family-name:var(--font-bebas)] text-2xl tracking-[-0.025em] text-[#242424] md:text-[1.65rem]"
                >
                  {founder.name}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
