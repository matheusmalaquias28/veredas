'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { useLang } from '@/contexts/LanguageContext'
import { useLocalizedField } from '@/hooks/useLocalizedField'
import type { Criativo } from '@/types/criativo'

interface Props {
  criativo: Criativo
  isSelected: boolean
  isExpanded: boolean
  rowHasExpanded: boolean
  isMobile: boolean
  onHover: () => void
  onExpandTap: () => void
  onToggleSelect: () => void
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
  rowHasExpanded,
  isMobile,
  onHover,
  onExpandTap,
  onToggleSelect,
}: Props) {
  const { translations: t } = useLang()
  const { string } = useLocalizedField()
  const nome = string(criativo.nome, criativo.nomeEn)
  const funcao = string(criativo.funcao, criativo.funcaoEn)

  const imageUrl = criativo.fotoPrincipal?.asset
    ? urlFor(criativo.fotoPrincipal).width(800).height(1067).fit('crop').url()
    : null

  const flexGrow = !rowHasExpanded ? 1 : isExpanded ? 3 : 1

  return (
    <motion.article
      className="relative min-h-0 min-w-0 overflow-hidden rounded-2xl md:rounded-3xl"
      style={{ flexBasis: 0 }}
      initial={false}
      animate={{ flexGrow }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => !isMobile && onHover()}
    >
      <div
        className={`relative h-full min-h-[clamp(264px,62.4vw,624px)] md:min-h-[clamp(336px,45.6vw,648px)] ${isMobile && !isExpanded ? 'cursor-pointer' : ''}`}
        role={isMobile && !isExpanded ? 'button' : undefined}
        tabIndex={isMobile && !isExpanded ? 0 : undefined}
        onClick={(e) => {
          if (!isMobile || isExpanded) return
          e.preventDefault()
          onExpandTap()
        }}
        onKeyDown={(e) => {
          if (!isMobile || isExpanded) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onExpandTap()
          }
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={nome}
            fill
            sizes="(max-width: 767px) 45vw, 22vw"
            className="object-cover object-center"
            draggable={false}
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200" />
        )}

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

        {isExpanded && (
          <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-5">
            <div className="min-w-0 pr-2">
              {funcao && (
                <p
                  className="mb-2 font-semibold uppercase tracking-[0.22em] text-[var(--brand-sun)]"
                  style={{ fontSize: 'clamp(0.72rem, 2.2vw, 0.95rem)' }}
                >
                  {funcao}
                </p>
              )}
              <h2
                className="font-semibold uppercase leading-tight tracking-[0.04em] text-white"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 4.2vw, 2.4rem)',
                }}
              >
                {nome}
              </h2>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleSelect()
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
          </div>
        )}
      </div>
    </motion.article>
  )
}
