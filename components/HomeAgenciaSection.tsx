'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useLang } from '@/contexts/LanguageContext'

export default function HomeAgenciaSection({ imageUrl }: { imageUrl: string | null }) {
  const resolvedSrc = imageUrl ?? '/sobre-agencia.png'
  const { translations: t } = useLang()
  const copy = t.homeAgencia
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const sealRotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : 360],
  )

  return (
    <section
      ref={sectionRef}
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
            className="home-agencia-vertical-label pointer-events-none absolute top-1/2 left-6 z-[1] -translate-y-1/2 whitespace-nowrap select-none md:left-10"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(9.5rem, 7vw, 5.5rem)',
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: '0.14em',
              color: 'transparent',
              WebkitTextStroke: '1.5px #4277F6',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {copy.verticalLabel}
          </span>
        </div>

        {/* Texto */}
        <div className="flex flex-col justify-center px-6 py-14 md:px-10 md:py-16 lg:pl-14 lg:pr-16 xl:pl-20 xl:pr-24">
          <p
            className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-neutral-500"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {copy.eyebrow}
          </p>
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

      {/* Selo — metade para fora à direita, roda com o scroll */}
      <div
        className="pointer-events-none absolute top-1/2 right-0 z-[3] h-[min(82vw,580px)] w-[min(82vw,580px)] -translate-y-1/2 translate-x-1/2 md:h-[min(52vw,580px)] md:w-[min(52vw,580px)]"
        aria-hidden
      >
        <motion.div
          className="relative h-full w-full bg-transparent"
          style={{ rotate: sealRotate }}
        >
          <Image
            src="/Veredas_92.png"
            alt=""
            fill
            unoptimized
            className="object-contain"
            sizes="(max-width: 767px) 82vw, 580px"
            style={{ background: 'transparent' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
