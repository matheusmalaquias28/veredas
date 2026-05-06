'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import CriativoCard from './CriativoCard'
import SelectionBar from './SelectionBar'
import type { Criativo } from '@/types/criativo'

export default function CriativosGrid({ criativos }: { criativos: Criativo[] }) {
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

  // Fecha ao pressionar Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedId(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const selectedCriativos = criativos.filter((c) => selectedIds.has(c._id))

  return (
    <>
      {criativos.length === 0 ? (
        <p className="py-20 text-center text-sm text-neutral-400">
          Nenhum criativo cadastrado ainda.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {criativos.map((c) => (
            <CriativoCard
              key={c._id}
              criativo={c}
              isSelected={selectedIds.has(c._id)}
              isExpanded={expandedId === c._id}
              onExpand={() => setExpandedId(c._id)}
              onCollapse={() => setExpandedId(null)}
              onSelect={() => toggleSelect(c)}
            />
          ))}
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
