import SiteChrome from '@/components/SiteChrome'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { CONFIGURACOES_QUERY, PRODUCOES_QUERY } from '@/sanity/lib/queries'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [config, producoes] = await Promise.all([
    client.fetch(CONFIGURACOES_QUERY),
    client.fetch(PRODUCOES_QUERY),
  ])
  const instagramUrl = config?.redesSociais?.instagram ?? null
  const TARGET_PRELOADER_TITLES = [
    'Agente Secreto',
    'Tremembé',
    'Emergência Radioativa',
    'Ainda estou aqui',
  ]

  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()

  const targetSet = new Set(TARGET_PRELOADER_TITLES.map(normalize))

  const preloaderImages: string[] = producoes
    .filter((p: { titulo?: string }) => p.titulo && targetSet.has(normalize(p.titulo)))
    .map((p: { imagem?: unknown }) =>
      p.imagem ? urlFor(p.imagem).width(1100).height(1400).fit('crop').quality(80).url() : null
    )
    .filter((img: string | null): img is string => Boolean(img))

  return (
    <SiteChrome instagramUrl={instagramUrl} preloaderImages={preloaderImages}>
      {children}
    </SiteChrome>
  )
}
