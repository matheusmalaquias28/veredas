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
  const normalizeName = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()

  const priorityOrder = [
    'Pri Helena',
    'Larissa Murai',
    'Betty Faria',
    'Ana Flavia Cavalcanti',
    'Pâmela Germano',
    'Nathalia Garcia',
    'Maria Bomani',
    'Letícia Rodrigues',
    'Isadora Ruppert',
    'Ju Akemi',
    'Castilo',
    'Adriana Perin',
    'Geane Albuquerque',
    'Carolina Oliveira',
    'Christiana Ubach',
    'Estrela Straus',
    'Jhonnã Bao',
    'Iraci Estrela',
    'Heloísa Pires',
  ]
  const priorityIndex = new Map(priorityOrder.map((name, index) => [normalizeName(name), index]))
  const sortedArtists = [...artists].sort((a, b) => {
    const aIndex = priorityIndex.get(normalizeName(a.nome))
    const bIndex = priorityIndex.get(normalizeName(b.nome))
    if (aIndex != null && bIndex != null) return aIndex - bIndex
    if (aIndex != null) return -1
    if (bIndex != null) return 1
    return a.nome.localeCompare(b.nome, 'pt-BR')
  })

  return (
    <main className="min-h-screen bg-background pb-28">
      <PageTitle pageKey="atrizes" />
      <div className="px-6 md:px-10">
        <ElencoAccordionGrid artists={sortedArtists} />
      </div>
    </main>
  )
}
