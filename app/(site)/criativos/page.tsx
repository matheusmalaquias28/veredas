import { client } from '@/sanity/lib/client'
import { CRIATIVOS_QUERY } from '@/sanity/lib/queries'
import CriativosGrid from '@/components/CriativosGrid'
import PageTitle from '@/components/PageTitle'

export const revalidate = 60

export const metadata = {
  title: 'Criativos — Veredas',
}

export default async function CriativosPage() {
  const criativos = await client.fetch(CRIATIVOS_QUERY)

  return (
    <main className="min-h-screen bg-background">
      <PageTitle pageKey="criativos" />
      <div className="px-6 pb-32 md:px-10">
        <CriativosGrid criativos={criativos} />
      </div>
    </main>
  )
}
