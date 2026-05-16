'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import Image from 'next/image'

export interface PolaroidItem {
  id: string
  titulo: string
  videoUrl?: string | null
  imageUrl?: string | null
}

const PARALLAX = [
  { y: -55, delay: 0 },
  { y: -75, delay: 0.06 },
  { y: -45, delay: 0.12 },
  { y: -65, delay: 0.04 },
  { y: -50, delay: 0.09 },
]

function Card({
  item,
  parallaxY,
  delay,
  scrollYProgress,
}: {
  item: PolaroidItem
  parallaxY: number
  delay: number
  scrollYProgress: MotionValue<number>
}) {
  const rawY = useTransform(scrollYProgress, [0, 1], [0, parallaxY])
  const y = useSpring(rawY, { stiffness: 45, damping: 18, mass: 1 })

  return (
    <motion.div
      style={{ y }}
      className="w-[85vw] shrink-0 basis-[85vw] md:w-auto md:flex-[0_0_calc((100%-2.5rem)/3)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ rotate: 10 }}
        viewport={{ once: true, margin: '-6%' }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden bg-[#f0efed] cursor-pointer"
        style={{ boxShadow: '0 20px 70px rgba(0,0,0,0.65), 0 6px 20px rgba(0,0,0,0.4)' }}
      >
        {/* Vídeo / imagem */}
        <div style={{ padding: '10px 10px 0' }}>
          <div className="relative w-full overflow-hidden bg-neutral-300" style={{ aspectRatio: '16/9' }}>
            {item.videoUrl ? (
              <video
                src={item.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 85vw, 32vw"
                draggable={false}
              />
            ) : null}
          </div>
        </div>

        {/* Texto */}
        <div className="px-4 pb-6 pt-4">
          <h3
            className="leading-[0.9] text-[#0f0f0f]"
            style={{
              fontFamily: 'var(--font-big-shoulders)',
              fontWeight: 900,
              fontSize: 'clamp(1.1rem,2.2vw,2rem)',
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
            }}
          >
            {item.titulo}
          </h3>
          <div className="mt-3 flex items-center gap-3">
            <span className="h-4 w-px bg-[#0f0f0f]/40" />
            <span
              className="text-[10px] uppercase tracking-[0.2em] text-[#0f0f0f]/55"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              Produção
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function HomePolaroidSection({ items }: { items: PolaroidItem[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const shown = items.slice(0, PARALLAX.length)

  return (
    <section
      ref={sectionRef}
      id="producoes-polaroid"
      className="relative flex w-full items-center overflow-hidden bg-[#0d0d0d] p-[100px]"
      style={{ minHeight: '100vh' }}
    >
      {/* Watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] -translate-y-1/2 select-none overflow-hidden"
      >
        <p
          className="whitespace-nowrap text-white"
          style={{
            fontFamily: 'var(--font-big-shoulders)',
            fontWeight: 900,
            fontSize: 'clamp(8rem,22vw,20rem)',
            lineHeight: 0.82,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            opacity: 0.04,
          }}
        >
          PRODUÇÕES
        </p>
      </div>

      {/* Mobile: 1 card/linha (85vw); desktop: 3 por linha */}
      <div
        className="relative z-[2] mx-auto w-full max-w-[min(100%,2200px)]"
      >
        <div className="flex flex-col items-center gap-5 md:flex-row md:flex-wrap md:justify-center">
          {shown.map((item, i) => (
            <Card
              key={item.id}
              item={item}
              parallaxY={PARALLAX[i].y}
              delay={PARALLAX[i].delay}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
