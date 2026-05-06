import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contato — Veredas',
  description:
    'Entre em contato com a Veredas para parcerias, elenco, criativos e projetos audiovisuais.',
}

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-background px-6 pb-24 pt-28 md:px-10 md:pb-32 md:pt-36">
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <p
            className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-neutral-500"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Contato
          </p>
          <h1
            className="text-[clamp(2.8rem,8vw,7rem)] uppercase leading-[0.9] tracking-[0.02em] text-[#242424]"
            style={{ fontFamily: 'var(--font-condensed)', fontWeight: 800 }}
          >
            Veredas
          </h1>
          <p className="mt-6 max-w-xl text-neutral-700" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
            Entre em contato com a equipe Veredas para parcerias, elenco, criativos e projetos
            audiovisuais.
          </p>

          <div className="mt-10 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">E-mail</p>
              <a
                href="mailto:contato@veredas.art"
                className="mt-1 inline-block text-base text-[#242424] underline decoration-black/20 underline-offset-4 transition-colors hover:text-[var(--brand-blue)]"
              >
                contato@veredas.art
              </a>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Endereco
              </p>
              <p className="mt-1 text-base text-neutral-700">
                Av. Brig. Faria Lima, 3.729 Conj.5
                <br />
                Itaim Bibi - SP/Sao Paulo
                <br />
                Brasil
              </p>
            </div>
          </div>
        </div>

        <ContactForm />
      </section>
    </main>
  )
}
