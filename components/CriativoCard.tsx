'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { useLang } from '@/contexts/LanguageContext'
import type { Criativo } from '@/types/criativo'

interface Props {
  criativo: Criativo
  isSelected: boolean
  isExpanded: boolean
  onExpand: () => void
  onCollapse: () => void
  onSelect: () => void
}

function CirclePlus({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/90 ${className ?? ''}`}
      aria-hidden
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
        <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </span>
  )
}

function CircleArrow() {
  return (
    <span
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/90"
      aria-hidden
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
        <path
          d="M3 7h8M8 3l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export default function CriativoCard({
  criativo,
  isSelected,
  isExpanded,
  onExpand,
  onCollapse,
  onSelect,
}: Props) {
  const { translations: t } = useLang()
  const imageUrl = criativo.fotoPrincipal?.asset
    ? urlFor(criativo.fotoPrincipal).width(800).height(1067).fit('crop').url()
    : null

  return (
    /* Slot no grid — tamanho fixo, nunca muda */
    <div className="relative" style={{ aspectRatio: '3/4' }}>
      {/* Card expansível — cresce para a direita sobre os vizinhos */}
      <motion.div
        className="absolute top-0 left-0 h-full overflow-hidden cursor-pointer"
        animate={{ width: isExpanded ? '200%' : '100%' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          zIndex: isExpanded ? 20 : 1,
          background: '#e5e5e5',
        }}
        onClick={!isExpanded ? onExpand : undefined}
      >
        {/* Imagem com zoom */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: isExpanded ? 1.07 : 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={criativo.nome}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
              draggable={false}
            />
          )}
        </motion.div>

        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `
              linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 42%),
              linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)
            `,
          }}
        />

        {/* Checkmark selecionado */}
        {isSelected && (
          <div className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7l3.5 3.5L12 3"
                stroke="#db260e"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Conteúdo expandido — mesmo padrão visual do elenco */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute inset-0 flex flex-col justify-end gap-6 p-4 pb-5 md:gap-7 md:p-6 md:pb-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22, delay: 0.2 }}
            >
              <div className="min-w-0">
                {criativo.funcao && (
                  <p
                    className="mb-2 font-semibold uppercase tracking-[0.22em] text-[var(--brand-sun)]"
                    style={{ fontSize: 'clamp(0.72rem, 2.2vw, 0.95rem)' }}
                  >
                    {criativo.funcao}
                  </p>
                )}
                <h3
                  className="font-semibold uppercase leading-[1.05] tracking-[0.04em] text-white"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.15rem, 4.2vw, 1.85rem)',
                  }}
                >
                  {criativo.nome}
                </h3>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect()
                    onCollapse()
                  }}
                  className="pointer-events-auto flex max-w-full items-center gap-2 text-left transition-opacity hover:opacity-90"
                >
                  <CirclePlus
                    className={isSelected ? 'border-[var(--brand-sun)] bg-[var(--brand-sun)]/25' : ''}
                  />
                  <span
                    className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-white md:text-[0.62rem]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {isSelected ? t.actions.selecionado : t.actions.selecionar}
                  </span>
                </button>

                <Link
                  href={`/criativos/${criativo.slug?.current}`}
                  onClick={(e) => e.stopPropagation()}
                  className="pointer-events-auto flex max-w-full items-center gap-2 md:flex-row-reverse"
                >
                  <span
                    className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-white md:text-[0.62rem]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {t.actions.verDetalhes}
                  </span>
                  <CircleArrow />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão fechar */}
        <AnimatePresence>
          {isExpanded && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onCollapse()
              }}
              className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Fechar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
