'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PortableText } from 'next-sanity'
import { urlFor } from '@/sanity/lib/image'
import type { Criativo } from '@/types/criativo'

interface Props {
  criativo: Criativo
  isSelected: boolean
  onClose: () => void
  onSelect: () => void
}

export default function CriativoModal({ criativo, isSelected, onClose, onSelect }: Props) {
  const imageUrl = criativo.fotoPrincipal?.asset
    ? urlFor(criativo.fotoPrincipal).width(800).height(1067).fit('crop').url()
    : null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="fixed inset-4 z-[201] md:inset-8 lg:inset-[5vw] overflow-hidden rounded-sm bg-background shadow-2xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex h-full flex-col md:flex-row">
          {/* Image — left */}
          <div className="relative h-64 w-full shrink-0 md:h-full md:w-[45%]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={criativo.nome}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 100vw, 45vw"
              />
            ) : (
              <div className="h-full w-full bg-neutral-100" />
            )}
          </div>

          {/* Info — right */}
          <div className="flex flex-1 flex-col overflow-y-auto p-8 md:p-12">
            {/* Close */}
            <button
              onClick={onClose}
              className="mb-8 flex h-8 w-8 self-end items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors"
              aria-label="Fechar"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Função */}
            {criativo.funcao && (
              <p
                className="mb-2 font-semibold uppercase"
                style={{ fontSize: '0.65rem', letterSpacing: '0.22em', color: '#4277f6' }}
              >
                {criativo.funcao}
              </p>
            )}

            {/* Nome */}
            <h2
              style={{
                fontFamily: 'var(--font-condensed)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                color: '#242424',
                lineHeight: 1,
                letterSpacing: '0.01em',
              }}
            >
              {criativo.nome}
            </h2>

            {/* Divider */}
            <div className="my-6 h-px bg-neutral-100" />

            {/* Bio */}
            {criativo.biografiaCurta && (
              <div
                className="leading-relaxed text-neutral-500"
                style={{ fontSize: '0.9rem' }}
              >
                <PortableText
                  value={criativo.biografiaCurta}
                  components={{
                    marks: {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      link: ({ value, children }: any) => (
                        <a
                          href={value?.href}
                          target={value?.blank ? '_blank' : '_self'}
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:opacity-80"
                        >
                          {children}
                        </a>
                      ),
                    },
                  }}
                />
              </div>
            )}

            {/* Links */}
            {(criativo.site || criativo.instagram) && (
              <div className="mt-6 flex flex-col gap-2">
                {criativo.site && (
                  <a
                    href={criativo.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors underline underline-offset-2"
                  >
                    {criativo.site.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {criativo.instagram && (
                  <a
                    href={`https://instagram.com/${criativo.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    @{criativo.instagram}
                  </a>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row">
              <button
                onClick={() => { onSelect(); onClose() }}
                className="flex-1 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200"
                style={{
                  background: isSelected ? '#db260e' : 'transparent',
                  color: isSelected ? '#fff' : '#db260e',
                  border: '1.5px solid #db260e',
                }}
              >
                {isSelected ? '✓ Selecionado' : 'Selecionar'}
              </button>

              <Link
                href={`/criativos/${criativo.slug?.current}`}
                className="flex-1 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200 hover:opacity-80"
                style={{ background: '#4277f6', color: '#fff' }}
                onClick={onClose}
              >
                Ver Perfil
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
