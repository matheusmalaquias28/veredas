'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'

export default function HomeAgenciaSection({ imageUrl }: { imageUrl: string | null }) {
  const resolvedSrc = imageUrl ?? '/sobre-agencia.png'
  const { translations: t } = useLang()
  const copy = t.homeAgencia

  return (
    <section
      id="sobre-agencia"
      aria-labelledby="home-agencia-heading"
      className="relative w-full overflow-x-clip bg-background"
    >
      <div className="grid min-h-[100svh] grid-cols-1 md:grid-cols-2">
        {/* Imagem — metade esquerda, altura da secção */}
        <div className="relative min-h-[42vh] w-full md:min-h-[100svh]">
          <Image
            src={resolvedSrc}
            alt={copy.imageAlt}
            fill
            className="object-cover grayscale"
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          {/* Rótulo vertical (apenas traço) — margem alinhada ao site */}
          <span
            aria-hidden
            className="home-agencia-vertical-label pointer-events-none absolute top-1/2 left-6 z-[1] -translate-y-1/2 whitespace-nowrap select-none text-[3rem] md:left-10 md:text-[7rem]"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              fontFamily: 'var(--font-bebas)',
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: '0.1em',
              color: 'transparent',
              WebkitTextStroke: '1.25px #4277F6',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {copy.verticalLabel}
          </span>
        </div>

        {/* Texto */}
        <div className="flex flex-col justify-center px-6 py-14 md:px-10 md:py-16 lg:pl-14 lg:pr-16 xl:pl-20 xl:pr-24">
          <h2
            id="home-agencia-heading"
            className="max-w-xl text-[clamp(2.25rem,4.5vw,3.75rem)] font-normal leading-[0.95] tracking-[-0.025em] text-[#242424]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {copy.title}
          </h2>
          <p
            className="mt-8 max-w-xl text-neutral-700"
            style={{ fontSize: '1.02rem', lineHeight: 1.68 }}
          >
            {copy.body}
          </p>
          <p
            className="mt-8 max-w-xl border-l-2 border-[var(--brand-blue)] pl-5 text-[#242424]"
            style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', lineHeight: 1.45 }}
          >
            {copy.quote}
          </p>
          <Link
            href="/sobre"
            className="group mt-10 inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#242424] transition-colors hover:text-[var(--brand-flame)]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <span className="border-b border-current pb-0.5 transition-[border-color] group-hover:border-[var(--brand-flame)]">
              {copy.cta}
            </span>
            <span aria-hidden className="translate-x-0 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

    </section>
  )
}
