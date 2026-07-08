import { client } from '@/sanity/lib/client'
import {
  CONFIGURACOES_QUERY,
  PRODUCOES_QUERY,
} from '@/sanity/lib/queries'
import Hero from '@/components/Hero'
import HomeAgenciaSection from '@/components/HomeAgenciaSection'
import HomeProducoesSection from '@/components/HomeProducoesSection'
import { type Producao } from '@/components/ProductionCard'

export const revalidate = 60

export default async function HomePage() {
  const [config, producoes] = await Promise.all([
    client.fetch(CONFIGURACOES_QUERY),
    client.fetch<Producao[]>(PRODUCOES_QUERY),
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

      <HomeProducoesSection producoes={producoes} />
    </>
  )
}
