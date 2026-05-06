import SiteChrome from '@/components/SiteChrome'
import { client } from '@/sanity/lib/client'
import { CONFIGURACOES_QUERY } from '@/sanity/lib/queries'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const config = await client.fetch(CONFIGURACOES_QUERY)
  const instagramUrl = config?.redesSociais?.instagram ?? null

  return <SiteChrome instagramUrl={instagramUrl}>{children}</SiteChrome>
}
