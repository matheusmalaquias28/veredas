import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import {
  CONFIGURACOES_QUERY,
  PRODUCOES_QUERY,
  ELENCO_ALL_QUERY,
} from '@/sanity/lib/queries'
import Hero from '@/components/Hero'
import HomeAgenciaSection from '@/components/HomeAgenciaSection'
import HorizontalCarousel from '@/components/HorizontalCarousel'
import ProductionCard from '@/components/ProductionCard'
import ActorCard from '@/components/ActorCard'

export const revalidate = 60

type AtorCardData = Parameters<typeof ActorCard>[0]['ator']

function filterElencoByTipoQuery(
  list: AtorCardData[],
  categoria: string | undefined
): AtorCardData[] {
  if (!categoria) return list
  if (categoria === 'ator') return list.filter((a) => a._type === 'ator')
  if (categoria === 'atriz') return list.filter((a) => a._type === 'atriz')
  if (categoria === 'estrangeiro') return list.filter((a) => a._type === 'estrangeiro')
  return list
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const { categoria: categoriaParam } = await searchParams
  const [config, producoes, atores] = await Promise.all([
    client.fetch(CONFIGURACOES_QUERY),
    client.fetch(PRODUCOES_QUERY),
    client.fetch(ELENCO_ALL_QUERY),
  ])

  const atoresFiltrados = filterElencoByTipoQuery(atores, categoriaParam)

  /** Foto fixa em `public/sobre-agencia.png`; Sanity substitui se houver imagem em Configurações. */
  const homeAgenciaImageUrl =
    config?.homeAgenciaImagem?.asset
      ? urlFor(config.homeAgenciaImagem).width(1600).height(2400).fit('crop').quality(88).url()
      : '/sobre-agencia.png'

  return (
    <>
      <Hero
        videoUrl={config?.heroVideoUrl ?? '/hero-background.webm'}
        titulo={config?.heroTitulo}
        subtexto={config?.heroSubtexto}
        ctaTexto={config?.heroCtaTexto}
        ctaLink={config?.heroCtaLink}
      />

      <HomeAgenciaSection imageUrl={homeAgenciaImageUrl} />

      {producoes.length > 0 && (
        <HorizontalCarousel
          title="PRODUÇÕES"
          itemCount={producoes.length}
          id="producoes"
          titleBlueBox
          titleBoxColor="#DB260E"
          titleBoxTextColor="#FFABDB"
          headerRowClassName="pt-20 pb-3 md:pt-28 md:pb-2 mb-[20px]"
        >
          {producoes.map((p: Parameters<typeof ProductionCard>[0]['producao']) => (
            <ProductionCard key={p._id} producao={p} />
          ))}
        </HorizontalCarousel>
      )}

      {atores.length > 0 && (
        <HorizontalCarousel
          title="ELENCO"
          itemCount={atoresFiltrados.length}
          id="elenco"
          visibleCountDesktop={3}
          visibleCountMobile={1.2}
          titleBlueBox
          sectionClassName="-mt-10 md:-mt-14"
          headerRowClassName="pt-6 pb-5 md:pt-8 md:pb-6"
        >
          {atoresFiltrados.map((a) => (
            <ActorCard key={a._id} ator={a} />
          ))}
        </HorizontalCarousel>
      )}
    </>
  )
}
