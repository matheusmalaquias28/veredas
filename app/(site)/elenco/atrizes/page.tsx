import { client } from '@/sanity/lib/client'
import { ATRIZES_QUERY } from '@/sanity/lib/queries'
import ElencoAccordionGrid from '@/components/ElencoAccordionGrid'
import PageTitle from '@/components/PageTitle'
import type { ElencoListItem } from '@/types/elenco'

export const revalidate = 60

export const metadata = {
  title: 'Atrizes — Veredas',
  description: 'Elenco de atrizes — Veredas Agenciamento Artístico.',
}

export default async function AtrizesPage() {
  const artists: ElencoListItem[] = await client.fetch(ATRIZES_QUERY)

  return (
    <main className="min-h-screen bg-background pb-28">
      <PageTitle pageKey="atrizes" />
      <div className="px-6 md:px-10">
        <ElencoAccordionGrid artists={artists} />
      </div>
    </main>
  )
}
