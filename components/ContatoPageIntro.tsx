'use client'

import { useLang } from '@/contexts/LanguageContext'

export default function ContatoPageIntro() {
  const { translations: t } = useLang()
  const copy = t.contatoPage
  const footer = t.footer

  return (
    <div>
      <p
        className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-neutral-500"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {copy.eyebrow}
      </p>
      <h1
        className="text-[clamp(2.8rem,8vw,7rem)] uppercase leading-[0.9] tracking-[0.02em] text-[#242424]"
        style={{ fontFamily: 'var(--font-condensed)', fontWeight: 800 }}
      >
        {copy.brandTitle}
      </h1>
      <p className="mt-6 max-w-xl text-neutral-700" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
        {copy.description}
      </p>

      <div className="mt-10 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            {copy.emailLabel}
          </p>
          <a
            href={`mailto:${footer.email}`}
            className="mt-1 inline-block text-base text-[#242424] underline decoration-black/20 underline-offset-4 transition-colors hover:text-[var(--brand-blue)]"
          >
            {footer.email}
          </a>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            {copy.addressLabel}
          </p>
          <p className="mt-1 text-base text-neutral-700">
            {footer.addressLine1}
            <br />
            {footer.addressLine2}
            <br />
            {footer.addressLine3}
          </p>
        </div>
      </div>
    </div>
  )
}
