import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Veredas',
  description: 'Termos de serviço Veredas Art.',
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-[50vh] bg-background px-6 py-24 md:px-10 md:pb-32">
      <div className="mx-auto max-w-2xl">
        <h1
          className="text-[clamp(2rem,4vw,2.75rem)] font-normal tracking-[-0.025em] text-[#242424]"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          Terms of Service
        </h1>
        <p className="mt-8 text-neutral-600" style={{ fontSize: '1.02rem', lineHeight: 1.68 }}>
          Conteúdo em atualização.
        </p>
      </div>
    </main>
  )
}
