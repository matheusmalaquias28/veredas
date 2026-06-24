'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'

/* Cada polaroid: posição como % do container (left/top), rotação e z-index.
   As cards se sobrepõem levemente na faixa branca inferior — não na área de imagem. */
const POLAROIDS = [
  { src: '/agencia-polaroid-1.jpg', isVideo: false, rotate: -7, leftCls: 'left-[48%] md:left-[58%]', top: '5%',  z: 1, delay: 0.1 },
  { src: '/agencia-video.mp4',      isVideo: true,  rotate:  5, leftCls: 'left-[55%] md:left-[65%]', top: '30%', z: 2, delay: 0.2 },
  { src: '/agencia-polaroid-2.jpg', isVideo: false, rotate: -2, leftCls: 'left-[44%] md:left-[54%]', top: '55%', z: 3, delay: 0   },
]

export default function HomeAgenciaSection() {
  const { translations: t } = useLang()
  const copy = t.homeAgencia

  return (
    <section
      id="sobre-agencia"
      aria-labelledby="home-agencia-heading"
      className="relative w-full overflow-x-clip bg-background"
    >
      <div className="grid min-h-[100svh] grid-cols-1 md:grid-cols-2">
        {/* Polaroid stack — metade esquerda */}
        <div className="relative z-[2] min-h-[86vh] md:min-h-[100svh] bg-[#EADFD5]">

          {/* Rótulo vertical em azul */}
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

          {/* Polaroids absolutamente posicionados em cascata diagonal */}
          {POLAROIDS.map((p, i) => (
            <div
              key={i}
              className={`absolute ${p.leftCls}`}
              style={{
                width: 'clamp(336px, 42vw, 588px)',
                top: p.top,
                transform: `translate(-50%, 0) rotate(${p.rotate}deg)`,
                zIndex: p.z + 1,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ rotate: 4, transition: { duration: 0.3, ease: 'easeOut' } }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.85, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden bg-[#f0efed]"
                style={{ boxShadow: '0 20px 70px rgba(0,0,0,0.45), 0 6px 20px rgba(0,0,0,0.28)' }}
              >
                <div style={{ padding: '10px 10px 0' }}>
                  <div
                    className="relative w-full overflow-hidden bg-neutral-300"
                    style={{ aspectRatio: '16/9' }}
                  >
                    {p.isVideo ? (
                      <video
                        src={p.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={p.src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 767px) 90vw, 42vw"
                        draggable={false}
                      />
                    )}
                  </div>
                </div>
                <div className="h-10" />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Texto */}
        <div className="relative z-[1] flex flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:pl-14 lg:pr-16 xl:pl-20 xl:pr-24">
          <h2
            id="home-agencia-heading"
            className="max-w-xl text-[clamp(2.25rem,4.5vw,3.75rem)] font-normal leading-[0.95] tracking-[-0.025em] text-[#242424]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {copy.title}
          </h2>
          <p
            className="mt-5 max-w-xl text-neutral-700"
            style={{ fontSize: '1.02rem', lineHeight: 1.68 }}
          >
            {copy.body}
          </p>
          <p
            className="mt-5 max-w-xl border-l-2 border-[var(--brand-blue)] pl-5 text-[#242424]"
            style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', lineHeight: 1.45 }}
          >
            {copy.quote}
          </p>
          <Link
            href="/sobre"
            className="group mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#242424] transition-colors hover:text-[var(--brand-flame)]"
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
