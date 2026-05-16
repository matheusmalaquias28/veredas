import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import {
  CONFIGURACOES_QUERY,
  PRODUCOES_QUERY,
  VIDEOS_PRODUCOES_QUERY,
} from '@/sanity/lib/queries'
import Hero from '@/components/Hero'
import HomeAgenciaSection from '@/components/HomeAgenciaSection'
import HomePolaroidSection from '@/components/HomePolaroidSection'
import HorizontalCarousel from '@/components/HorizontalCarousel'
import ProductionCard from '@/components/ProductionCard'

export const revalidate = 60

export default async function HomePage() {
  const [config, producoes, videosProducoes] = await Promise.all([
    client.fetch(CONFIGURACOES_QUERY),
    client.fetch(PRODUCOES_QUERY),
    client.fetch(VIDEOS_PRODUCOES_QUERY),
  ])

  /** Foto fixa em `public/sobre-agencia.png`; Sanity substitui se houver imagem em Configurações. */
  const homeAgenciaImageUrl =
    config?.homeAgenciaImagem?.asset
      ? urlFor(config.homeAgenciaImagem).width(1600).height(2400).fit('crop').quality(88).url()
      : '/sobre-agencia.png'

  return (
    <>
      <Hero
        videoUrl={config?.heroVideoUrl ?? '/brahma_1.webm'}
        titulo={config?.heroTitulo}
        subtexto={config?.heroSubtexto}
        ctaTexto={config?.heroCtaTexto}
        ctaLink={config?.heroCtaLink}
      />

      <HomeAgenciaSection imageUrl={homeAgenciaImageUrl} />

      {videosProducoes.length > 0 && (
        <HomePolaroidSection
          items={videosProducoes.slice(0, 5).map((p: { _id: string; titulo: string; videoUrl?: string; imagem?: { asset?: { _ref: string } } }) => ({
            id: p._id,
            titulo: p.titulo,
            videoUrl: p.videoUrl ?? null,
            imageUrl: p.imagem?.asset
              ? urlFor(p.imagem).width(800).height(450).fit('crop').quality(85).url()
              : null,
          }))}
        />
      )}

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
          {[...producoes].reverse().map((p: Parameters<typeof ProductionCard>[0]['producao']) => (
            <ProductionCard key={p._id} producao={p} />
          ))}
        </HorizontalCarousel>
      )}
    </>
  )
}
