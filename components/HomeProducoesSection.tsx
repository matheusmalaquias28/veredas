'use client'

import HorizontalCarousel from '@/components/HorizontalCarousel'
import ProductionCard, { type Producao } from '@/components/ProductionCard'
import { useLang } from '@/contexts/LanguageContext'
import { sortProducoesForHome } from '@/lib/homeProducoesOrder'

export default function HomeProducoesSection({ producoes }: { producoes: Producao[] }) {
  const { translations: t } = useLang()

  if (producoes.length === 0) return null

  return (
    <HorizontalCarousel
      title={t.sections.producoes.toUpperCase()}
      itemCount={producoes.length}
      id="producoes"
      visibleCountDesktop={5}
      headerRowClassName="pt-20 pb-3 md:pt-28 md:pb-2 mb-[20px]"
      sectionClassName="min-h-0 md:min-h-[100svh]"
      stickyClassName="static min-h-0 md:sticky md:top-0 md:min-h-[100svh]"
      bottomRuleMbClass="mb-0"
    >
      {sortProducoesForHome(producoes).map((p) => (
        <ProductionCard key={p._id} producao={p} />
      ))}
    </HorizontalCarousel>
  )
}
