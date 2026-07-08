import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import ContatoPageIntro from '@/components/ContatoPageIntro'

export const metadata: Metadata = {
  title: 'Contato — Veredas',
  description:
    'Entre em contato com a Veredas para parcerias, elenco, criativos e projetos audiovisuais.',
}

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-background px-6 pb-24 pt-28 md:px-10 md:pb-32 md:pt-36">
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <ContatoPageIntro />
        <ContactForm />
      </section>
    </main>
  )
}
