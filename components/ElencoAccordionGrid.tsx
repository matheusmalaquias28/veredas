'use client'

import { useState, useCallback, useLayoutEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { urlFor } from '@/sanity/lib/image'
import type { ElencoListItem } from '@/types/elenco'
import ElencoSelectionBar from '@/components/ElencoSelectionBar'

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function profilePath(slug: string | null | undefined) {
  if (!slug) return '#'
  return `/elenco/${slug}`
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

function CircleArrow({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/90 ${className ?? ''}`}
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

interface CardProps {
  artist: ElencoListItem
  rowHasExpanded: boolean
  isExpanded: boolean
  isMobile: boolean
  onHover: () => void
  onExpandTap: () => void
  isSelected: boolean
  onToggleSelect: () => void
  labels: { selectArtist: string; artistPage: string }
}

function ElencoAccordionCard({
  artist,
  rowHasExpanded,
  isExpanded,
  isMobile,
  onHover,
  onExpandTap,
  isSelected,
  onToggleSelect,
  labels,
}: CardProps) {
  const imageUrl = artist.fotoPrincipal?.asset
    ? urlFor(artist.fotoPrincipal).width(720).height(960).fit('crop').url()
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
            alt={artist.nome}
            fill
            sizes="(max-width: 767px) 45vw, 22vw"
            className="object-cover"
            draggable={false}
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200" />
        )}

        {/* Collapsed: só foto; expandido: gradientes + UI */}
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

        {isExpanded && (
          <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-5">
            <h2
              className="pr-2 font-semibold uppercase leading-tight tracking-[0.06em] text-white"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(0.7rem, 2.5vw, 0.95rem)',
              }}
            >
              {artist.nome}
            </h2>

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
                  {labels.selectArtist}
                </span>
              </button>

              <Link
                href={profilePath(artist.slug?.current)}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto flex max-w-full items-center gap-2 md:flex-row-reverse"
              >
                <span
                  className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-white md:text-[0.62rem]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {labels.artistPage}
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

interface GridProps {
  artists: ElencoListItem[]
}

export default function ElencoAccordionGrid({ artists }: GridProps) {
  const { lang, translations: t } = useLang()
  const [cols, setCols] = useState<2 | 4>(4)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => {
      const mobile = mq.matches
      setIsMobile(mobile)
      setCols(mobile ? 2 : 4)
      if (mobile) {
        setExpandedId((prev) => {
          if (prev && artists.some((a) => a._id === prev)) return prev
          return artists[0]?._id ?? null
        })
      } else {
        setExpandedId(null)
      }
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [artists])

  const rows = useMemo(() => chunk(artists, cols), [artists, cols])

  const toggleSelect = useCallback((artist: ElencoListItem) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(artist._id)) next.delete(artist._id)
      else next.add(artist._id)
      return next
    })
  }, [])

  const removeById = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

  const selectedArtists = useMemo(
    () => artists.filter((a) => selectedIds.has(a._id)),
    [artists, selectedIds],
  )

  const selectedSummary =
    lang === 'pt'
      ? `${selectedIds.size} selecionado${selectedIds.size === 1 ? '' : 's'}`
      : `${selectedIds.size} selected`

  const labels = useMemo(
    () => ({
      selectArtist: t.elenco.selectArtist,
      artistPage: t.elenco.artistPage,
    }),
    [t.elenco.selectArtist, t.elenco.artistPage],
  )

  if (artists.length === 0) {
    return <p className="py-20 text-center text-sm text-neutral-400">{t.elenco.empty}</p>
  }

  return (
    <>
      <div
        className="flex flex-col gap-2 md:gap-3"
        onMouseLeave={() => {
          if (!isMobile) setExpandedId(null)
        }}
      >
        {rows.map((row, ri) => {
          const rowHasExpanded =
            expandedId !== null && row.some((a) => a._id === expandedId)
          return (
            <div key={ri} className="flex gap-2 md:gap-3">
              {row.map((artist) => (
                <ElencoAccordionCard
                  key={artist._id}
                  artist={artist}
                  rowHasExpanded={rowHasExpanded}
                  isExpanded={expandedId === artist._id}
                  isMobile={isMobile}
                  onHover={() => setExpandedId(artist._id)}
                  onExpandTap={() => setExpandedId(artist._id)}
                  isSelected={selectedIds.has(artist._id)}
                  onToggleSelect={() => toggleSelect(artist)}
                  labels={labels}
                />
              ))}
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {selectedIds.size > 0 && (
          <ElencoSelectionBar
            artists={selectedArtists}
            onRemove={removeById}
            onClear={clearSelection}
          />
        )}
      </AnimatePresence>
    </>
  )
}
