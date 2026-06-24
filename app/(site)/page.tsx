import { client } from '@/sanity/lib/client'
import {
  CONFIGURACOES_QUERY,
  PRODUCOES_QUERY,
} from '@/sanity/lib/queries'
import Hero from '@/components/Hero'
import HomeAgenciaSection from '@/components/HomeAgenciaSection'
import HorizontalCarousel from '@/components/HorizontalCarousel'
import ProductionCard from '@/components/ProductionCard'
import { sortProducoesForHome } from '@/lib/homeProducoesOrder'

export const revalidate = 60

export default async function HomePage() {
  const [config, producoes] = await Promise.all([
    client.fetch(CONFIGURACOES_QUERY),
    client.fetch(PRODUCOES_QUERY),
  ])

  return (
    <>
      <Hero
        videoUrl="/hero.mp4"
        titulo={config?.heroTitulo}
        subtexto={config?.heroSubtexto}
        ctaTexto={config?.heroCtaTexto}
        ctaLink={config?.heroCtaLink}
      />

      <HomeAgenciaSection />

      {producoes.length > 0 && (
        <HorizontalCarousel
          title="PRODUÇÕES"
          itemCount={producoes.length}
          id="producoes"
          visibleCountDesktop={5}
          headerRowClassName="pt-20 pb-3 md:pt-28 md:pb-2 mb-[20px]"
          sectionClassName="min-h-0 md:min-h-[100svh]"
          stickyClassName="static min-h-0 md:sticky md:top-0 md:min-h-[100svh]"
          bottomRuleMbClass="mb-0"
        >
          {sortProducoesForHome(producoes).map((p: Parameters<typeof ProductionCard>[0]['producao']) => (
            <ProductionCard key={p._id} producao={p} />
          ))}
        </HorizontalCarousel>
      )}
    </>
  )
}
