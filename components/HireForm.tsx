'use client'

import { FormEvent, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'

const CONTACT_EMAIL = 'contato@veredas.art'

interface HireFormProps {
  artistName?: string
}

export default function HireForm({ artistName }: HireFormProps) {
  const { translations: t } = useLang()
  const copy = t.hireForm
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [phone, setPhone] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setIsSubmitting(true)
    setFeedback('')

    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const phone = String(formData.get('phone') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    const subject = artistName
      ? `${copy.subjectPrefix} — ${artistName}`
      : `${copy.subjectPrefix} — Veredas`

    const bodyLines = [
      `${copy.name}: ${name}`,
      `${copy.email}: ${email}`,
      `${copy.phone}: ${phone}`,
    ]
    if (artistName) bodyLines.push(`Artista: ${artistName}`)
    bodyLines.push('', message)
    const body = bodyLines.join('\n')

    try {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setFeedback(copy.success)
      form.reset()
      setPhone('')
    } catch {
      setFeedback(copy.fallback)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-[var(--brand-blue)] focus:bg-white/10'

  const labelClass =
    'mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400'

  return (
    <section className="border-t border-white/10 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <h2
            className="text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] tracking-[0.01em] text-white"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 300,
            }}
          >
            {copy.title}
          </h2>
          <p
            className="mt-5 max-w-md text-neutral-400"
            style={{ fontSize: '0.95rem', lineHeight: 1.6 }}
          >
            {copy.description}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8"
        >
          <label className="block">
            <span className={labelClass}>{copy.name}</span>
            <input type="text" name="name" required autoComplete="name" className={inputClass} />
          </label>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>{copy.email}</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>{copy.phone}</span>
              <input
                type="tel"
                name="phone"
                required
                autoComplete="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => {
                  if (
                    e.key.length === 1 &&
                    !/[0-9]/.test(e.key) &&
                    !e.ctrlKey &&
                    !e.metaKey
                  ) {
                    e.preventDefault()
                  }
                }}
                className={inputClass}
              />
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>{copy.message}</span>
            <textarea name="message" required rows={5} className={`${inputClass} resize-y`} />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-blue)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? copy.submitting : copy.submit}
          </button>

          {feedback ? <p className="text-sm text-neutral-400">{feedback}</p> : null}
        </form>
      </div>
    </section>
  )
}
