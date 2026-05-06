import type { Metadata } from 'next'
import SobreAnimatedTitle from '@/components/SobreAnimatedTitle'
import SobreContent from '@/components/SobreContent'

export const metadata: Metadata = {
  title: 'Sobre — Veredas',
  description:
    'Agência de gestão de carreira e empresariamento artístico. Curadoria, estratégia e acompanhamento para artistas de alto nível no audiovisual e em projetos com marcas.',
}

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-background pb-24 md:pb-32">
      <SobreAnimatedTitle />
      <div className="px-6 md:px-10">
        <SobreContent />
      </div>
    </main>
  )
}
