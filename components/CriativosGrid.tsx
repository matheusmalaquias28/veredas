'use client'

import { useState, useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import CriativoCard from './CriativoCard'
import SelectionBar from './SelectionBar'
import type { Criativo } from '@/types/criativo'

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function useGridCols() {
  const [cols, setCols] = useState(2)
  const [isMobile, setIsMobile] = useState(false)

  useLayoutEffect(() => {
    const apply = () => {
      const mobile = window.matchMedia('(max-width: 767px)').matches
      setIsMobile(mobile)
      if (mobile) {
        setCols(2)
        return
      }
      if (window.matchMedia('(min-width: 1280px)').matches) setCols(5)
      else if (window.matchMedia('(min-width: 1024px)').matches) setCols(4)
      else setCols(3)
    }
    apply()
    const mq768 = window.matchMedia('(max-width: 767px)')
    const mq1024 = window.matchMedia('(min-width: 1024px)')
    const mq1280 = window.matchMedia('(min-width: 1280px)')
    mq768.addEventListener('change', apply)
    mq1024.addEventListener('change', apply)
    mq1280.addEventListener('change', apply)
    return () => {
      mq768.removeEventListener('change', apply)
      mq1024.removeEventListener('change', apply)
      mq1280.removeEventListener('change', apply)
    }
  }, [])

  return { cols, isMobile }
}

export default function CriativosGrid({ criativos }: { criativos: Criativo[] }) {
  const { cols, isMobile } = useGridCols()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleSelect = useCallback((criativo: Criativo) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(criativo._id)) next.delete(criativo._id)
      else next.add(criativo._id)
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedId(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const selectedCriativos = criativos.filter((c) => selectedIds.has(c._id))
  const rows = useMemo(() => chunk(criativos, cols), [criativos, cols])

  return (
    <>
      {criativos.length === 0 ? (
        <p className="py-20 text-center text-sm text-neutral-400">
          Nenhum criativo cadastrado ainda.
        </p>
      ) : (
        <div
          className="flex flex-col gap-2 md:gap-3"
          onMouseLeave={() => {
            if (!isMobile) setExpandedId(null)
          }}
        >
          {rows.map((row, ri) => {
            const rowHasExpanded =
              expandedId !== null && row.some((c) => c._id === expandedId)
            const missingSlots = Math.max(0, cols - row.length)
            return (
              <div key={ri} className="flex gap-2 md:gap-3">
                {row.map((c) => (
                  <CriativoCard
                    key={c._id}
                    criativo={c}
                    isSelected={selectedIds.has(c._id)}
                    isExpanded={expandedId === c._id}
                    rowHasExpanded={rowHasExpanded}
                    isMobile={isMobile}
                    onHover={() => setExpandedId(c._id)}
                    onExpandTap={() => setExpandedId(c._id)}
                    onToggleSelect={() => toggleSelect(c)}
                  />
                ))}
                {Array.from({ length: missingSlots }, (_, i) => (
                  <div
                    key={`placeholder-${ri}-${i}`}
                    className="min-h-0 min-w-0 basis-0"
                    style={{ flexGrow: 1 }}
                    aria-hidden
                  />
                ))}
              </div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {selectedIds.size > 0 && (
          <SelectionBar criativos={selectedCriativos} onRemove={removeById} />
        )}
      </AnimatePresence>
    </>
  )
}
