'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'

const ENERGY_URL = 'https://www.energymidia.com.br'
const INSTAGRAM_URL = 'https://www.instagram.com/veredasagenciamento/'

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <p
      className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-neutral-400"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {children}
    </p>
  )
}

export default function Footer({ instagramUrl }: { instagramUrl?: string | null }) {
  const { translations: t } = useLang()
  const f = t.footer
  const resolvedInstagramUrl = instagramUrl ?? INSTAGRAM_URL

  const navLinks = [
    { href: '/elenco/atores', label: t.nav.atores },
    { href: '/elenco/atrizes', label: t.nav.atrizes },
    { href: '/criativos', label: t.nav.criativos },
    { href: '/elenco/estrangeiros', label: 'Internacionais' },
  ] as const

  return (
    <footer id="contato" className="scroll-mt-[72px]">
      <div className="border-t border-white/[0.08] bg-black">
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
                  className="w-fit text-sm text-white/90 transition-colors hover:text-[var(--brand-blue)]"
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
              className="text-sm text-white/90 underline decoration-white/25 underline-offset-4 transition-colors hover:text-[var(--brand-blue)] hover:decoration-[var(--brand-blue)]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {f.email}
            </a>
          </div>

          {/* Endereço */}
          <div>
            <FooterHeading>{f.addressHeading}</FooterHeading>
            <address
              className="not-italic text-sm leading-relaxed text-neutral-300"
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
            <a
              href={resolvedInstagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/90 transition-colors hover:text-[var(--brand-blue)]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {f.instagram}
            </a>
          </div>
          </div>

          <div
            className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-10 md:mt-20 md:flex-row md:items-center md:justify-between md:gap-8"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <p className="text-xs text-neutral-400">{f.copyright}</p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:justify-center">
              <Link
                href="/privacy-policy"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                {f.privacy}
              </Link>
              <span className="text-neutral-600" aria-hidden>
                ·
              </span>
              <Link
                href="/terms-of-service"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                {f.terms}
              </Link>
            </div>

            <p className="flex flex-wrap items-center justify-start gap-2 text-xs text-neutral-400 md:justify-end">
              <span>{f.developedBy}</span>
              <a
                href={ENERGY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 transition-opacity hover:opacity-85"
                aria-label={f.energy}
              >
                <Image
                  src="/energy-logo.png"
                  alt=""
                  width={132}
                  height={36}
                  className="h-6 w-auto md:h-7"
                />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
