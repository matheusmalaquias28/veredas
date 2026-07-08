'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'

type FounderKey = 'natalia' | 'laila' | 'shay'

const FOUNDERS_ORDER: FounderKey[] = ['natalia', 'laila', 'shay']

const FOUNDER_IMAGES: Record<FounderKey, string> = {
  natalia: '/sobre/natalia.png',
  laila: '/sobre/laila.png',
  shay: '/sobre/shay.png',
}

const PROCESS_IMAGES = [
  '/sobre/curadoria.png',
  '/sobre/estrategia.png',
  '/sobre/oportunidades.png',
  '/sobre/relacoes.png',
  '/sobre/acompanhamento.png',
]

const FOUNDER_EMAILS: Record<FounderKey, string> = {
  natalia: 'natalia@veredas.art',
  laila: 'contato@veredas.art',
  shay: 'media@veredas.art',
}

export default function SobreContent() {
  const { translations: t } = useLang()
  const sections = t.sobre.sections
  const [activeFounder, setActiveFounder] = useState<FounderKey | null>(null)
  const [activeMedia, setActiveMedia] = useState<string | null>(null)

  return (
    <section className="mx-auto max-w-[1200px] border-t border-black/20 pb-16 md:pb-24">
      <div className="grid border-b border-black/20 py-6 md:grid-cols-2 md:items-center md:gap-8">
        <p
          className="max-w-xl text-[28px] leading-[42px] tracking-[-0.015em] text-[#242424]"
          style={{ fontFamily: '"Times New Roman", serif' }}
        >
          {t.sobre.p1}
        </p>
        <div
          className="group relative mt-5 aspect-[16/9] cursor-pointer overflow-hidden md:mt-0"
          onClick={() => setActiveMedia((prev) => (prev === 'intro' ? null : 'intro'))}
        >
          <video
            src="/sobre/sobre-intro.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={`h-full w-full object-cover transition-[filter,transform] duration-500 ease-out md:group-hover:scale-[1.02] md:group-hover:grayscale-0 ${
              activeMedia === 'intro' ? 'scale-[1.02] grayscale-0' : 'grayscale'
            }`}
            aria-label={t.sobre.media.introAria}
          />
        </div>
      </div>

      <div className="border-b border-black/20 py-7">
        <div className="mb-4 border-l border-black/20 pl-3 text-left text-[0.91rem] font-semibold uppercase tracking-[0.11em] text-[#242424]/70">
          <p>{sections.essence}</p>
          <p className="mt-3">{sections.direction}</p>
        </div>
        <p
          className="max-w-4xl text-[30px] italic leading-[39px] tracking-[-0.008em] text-[#1f1f1f]"
          style={{ fontFamily: '"Times New Roman", serif' }}
        >
          {t.sobre.p2}
        </p>
      </div>

      <div className="border-b border-black/20 py-7">
        <div className="mb-4 border-l border-black/20 pl-3 text-left text-[0.91rem] font-semibold uppercase tracking-[0.11em] text-[#242424]/70">
          {sections.process}
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {t.sobre.processSteps.map((step, index) => (
            <article
              key={step.title}
              className="group border-l border-black/20 pl-3 md:pl-4"
              onClick={() => setActiveMedia((prev) => (prev === `process-${index}` ? null : `process-${index}`))}
            >
              <p className="text-[0.874rem] font-semibold uppercase tracking-[0.09em] text-[#242424]/65">
                {String(index + 1).padStart(2, '0')}.
              </p>
              <h3
                className="mt-1 text-[1.128rem] font-semibold uppercase tracking-[0.11em] text-[#111]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {step.title}
              </h3>
              <div className="relative mt-3 aspect-[6/5] cursor-pointer overflow-hidden bg-black/10">
                <Image
                  src={PROCESS_IMAGES[index] ?? `/sobre/${FOUNDERS_ORDER[index % FOUNDERS_ORDER.length]}.png`}
                  alt={step.title}
                  fill
                  className={`object-cover transition-[filter,transform] duration-500 ease-out md:group-hover:scale-[1.02] md:group-hover:grayscale-0 ${
                    activeMedia === `process-${index}` ? 'scale-[1.02] grayscale-0' : 'grayscale'
                  }`}
                  sizes="(max-width: 767px) 100vw, 16vw"
                />
              </div>
              <p
                className="mt-3 text-[12px] leading-[1.35] text-[#242424]/80"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="border-b border-black/20 py-7">
        <div className="mb-4 border-l border-black/20 pl-3 text-left text-[0.91rem] font-semibold uppercase tracking-[0.11em] text-[#242424]/70">
          {sections.commitment}
        </div>
        <div className="grid gap-5 md:grid-cols-[1fr_420px] md:items-center md:gap-8">
          <p
            className="max-w-2xl text-[clamp(1.45rem,2.9vw,2.3rem)] leading-[1.06] tracking-[-0.015em] text-[#232323]"
            style={{ fontFamily: '"Times New Roman", serif' }}
          >
            {t.sobre.p3}
          </p>
          <div
            className="group relative mt-1 aspect-[16/8] cursor-pointer overflow-hidden md:mt-0"
            onClick={() => setActiveMedia((prev) => (prev === 'commitment' ? null : 'commitment'))}
          >
            <Image
              src="/sobre/compromisso.png"
              alt={t.sobre.media.commitmentAlt}
              fill
              className={`object-cover transition-[filter,transform] duration-500 ease-out md:group-hover:scale-[1.02] md:group-hover:grayscale-0 ${
                activeMedia === 'commitment' ? 'scale-[1.02] grayscale-0' : 'grayscale'
              }`}
              sizes="(max-width: 767px) 100vw, 24vw"
            />
          </div>
        </div>
      </div>

      <div className="border-b border-black/20 py-6">
        <div className="mb-4 border-l border-black/20 pl-3 text-left text-[0.91rem] font-semibold uppercase tracking-[0.11em] text-[#242424]/70">
          {sections.signature}
        </div>
        <p
          className="text-[clamp(3.003rem,6.37vw,4.732rem)] md:text-[clamp(1.802rem,3.822vw,2.839rem)] italic leading-[1.02] tracking-[-0.01em] text-[#1c1c1c]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.sobre.tagline}
        </p>
      </div>

      <div className="pt-7">
        <div className="mb-5 border-b border-black/20 pb-3">
          <p className="text-[0.91rem] font-semibold uppercase tracking-[0.11em] text-[#242424]/70">
            {sections.team}
          </p>
          <p className="mt-2 text-[0.91rem] font-semibold uppercase tracking-[0.11em] text-[#242424]/70">
            {sections.heading}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {FOUNDERS_ORDER.map((key) => {
            const founder = t.sobre.founders[key]
            return (
              <article
                key={key}
                className="group border-b border-black/20 pb-3"
                onClick={() => setActiveFounder((prev) => (prev === key ? null : key))}
              >
                <div
                  className={`relative overflow-hidden bg-black/10 transition-[height] duration-500 ease-out ${
                    activeFounder === key ? 'h-[672px]' : 'h-[504px]'
                  } md:h-[564px] md:group-hover:h-[672px]`}
                >
                  <Image
                    src={FOUNDER_IMAGES[key]}
                    alt={founder.name}
                    fill
                    className={`object-cover transition-[filter,transform] duration-500 ease-out md:group-hover:scale-[1.02] md:group-hover:grayscale-0 ${
                      activeFounder === key ? 'scale-[1.02] grayscale-0' : 'grayscale'
                    }`}
                    sizes="(max-width: 767px) 100vw, 30vw"
                  />
                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 transition-all duration-500 ease-out md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 ${
                      activeFounder === key ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                    }`}
                  >
                    <p className="mt-1 text-[1.238rem] font-semibold uppercase tracking-[0.1em] text-[var(--brand-pink)]">
                      {founder.role}
                    </p>
                    <p className="mt-1 text-[2.421rem] uppercase leading-none tracking-[-0.008em] text-[var(--brand-sun)]">
                      {founder.name}
                    </p>
                    <a
                      href={`mailto:${FOUNDER_EMAILS[key]}`}
                      className="pointer-events-auto mt-2 inline-block text-[0.73rem] lowercase tracking-[0.09em] text-white underline decoration-white/60 underline-offset-2 transition-colors hover:decoration-white"
                    >
                      {FOUNDER_EMAILS[key]}
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
