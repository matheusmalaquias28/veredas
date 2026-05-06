import { client } from '@/sanity/lib/client'
import { ATORES_QUERY } from '@/sanity/lib/queries'
import ElencoAccordionGrid from '@/components/ElencoAccordionGrid'
import PageTitle from '@/components/PageTitle'
import type { ElencoListItem } from '@/types/elenco'

export const revalidate = 60

export const metadata = {
  title: 'Atores — Veredas',
  description: 'Elenco de atores — Veredas Agenciamento Artístico.',
}

export default async function AtoresPage() {
  const artists: ElencoListItem[] = await client.fetch(ATORES_QUERY)

  return (
    <main className="min-h-screen bg-background pb-28">
      <PageTitle pageKey="atores" />
      <div className="px-6 md:px-10">
        <ElencoAccordionGrid artists={artists} />
      </div>
    </main>
  )
}
