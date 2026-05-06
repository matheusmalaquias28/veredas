'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import FooterMarquee from '@/components/FooterMarquee'
import { useLang } from '@/contexts/LanguageContext'

const ENERGY_URL = 'https://www.energymidia.com.br'

/** Laranja Energy / destaque do crédito */
const ENERGY_ORANGE = '#f97316'

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <p
      className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-neutral-500"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {children}
    </p>
  )
}

export default function Footer({ instagramUrl }: { instagramUrl?: string | null }) {
  const { translations: t } = useLang()
  const f = t.footer

  const navLinks = [
    { href: '/#elenco', label: t.nav.casting },
    { href: '/criativos', label: t.nav.criativos },
    { href: '/sobre', label: t.nav.sobre },
    { href: '/contato', label: t.nav.contato },
  ] as const

  return (
    <footer id="contato" className="scroll-mt-[72px]">
      <FooterMarquee />

      <div className="border-t border-white/[0.08] bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 xl:gap-16">
          {/* Navegação */}
          <div>
            <FooterHeading>{f.navHeading}</FooterHeading>
            <nav aria-label={f.navHeading} className="flex flex-col gap-3">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="w-fit text-sm text-[#242424] transition-colors hover:text-[var(--brand-blue)]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contatos */}
          <div>
            <FooterHeading>{f.contactsHeading}</FooterHeading>
            <a
              href={`mailto:${f.email}`}
              className="text-sm text-[#242424] underline decoration-black/15 underline-offset-4 transition-colors hover:text-[var(--brand-blue)] hover:decoration-[var(--brand-blue)]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {f.email}
            </a>
          </div>

          {/* Endereço */}
          <div>
            <FooterHeading>{f.addressHeading}</FooterHeading>
            <address
              className="not-italic text-sm leading-relaxed text-neutral-600"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {f.addressLine1}
              <br />
              {f.addressLine2}
              <br />
              {f.addressLine3}
            </address>
          </div>

          {/* Conecte-se */}
          <div>
            <FooterHeading>{f.connectHeading}</FooterHeading>
            {instagramUrl ? (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#242424] transition-colors hover:text-[var(--brand-blue)]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {f.instagram}
              </a>
            ) : (
              <span className="text-sm text-neutral-500" style={{ fontFamily: 'var(--font-sans)' }}>
                {f.instagram}
              </span>
            )}
            </div>
          </div>

          <div
            className="mt-16 flex flex-col gap-5 border-t border-black/[0.06] pt-10 md:mt-20 md:flex-row md:items-center md:justify-between md:gap-8"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <p className="text-xs text-neutral-500">{f.copyright}</p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:justify-center">
              <Link
                href="/privacy-policy"
                className="text-neutral-500 transition-colors hover:text-[#242424]"
              >
                {f.privacy}
              </Link>
              <span className="text-neutral-300" aria-hidden>
                ·
              </span>
              <Link
                href="/terms-of-service"
                className="text-neutral-500 transition-colors hover:text-[#242424]"
              >
                {f.terms}
              </Link>
            </div>

            <p className="text-xs text-neutral-500 md:text-right">
              {f.developedBy}{' '}
              <a
                href={ENERGY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold transition-opacity hover:opacity-90"
                style={{ color: ENERGY_ORANGE }}
              >
                {f.energy}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
