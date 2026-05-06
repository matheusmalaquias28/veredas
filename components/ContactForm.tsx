'use client'

import { FormEvent, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'

const CONTACT_EMAIL = 'contato@veredas.art'

export default function ContactForm() {
  const { translations: t } = useLang()
  const copy = t.contatoPage
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback('')

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const subject = String(formData.get('subject') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    const finalSubject = subject || `Contato via site - ${name || 'Veredas'}`
    const body = [`Nome: ${name}`, `E-mail: ${email}`, '', message].join('\n')

    try {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`
      setFeedback(copy.success)
      event.currentTarget.reset()
    } catch {
      setFeedback(copy.fallback)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-black/10 bg-white/40 p-6 md:p-8">
      <h2
        className="text-[clamp(1.4rem,2.5vw,2rem)] uppercase tracking-[0.03em] text-[#242424]"
        style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700 }}
      >
        {copy.formTitle}
      </h2>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
          {copy.name}
        </span>
        <input
          type="text"
          name="name"
          required
          className="w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm text-[#242424] outline-none transition focus:border-[var(--brand-blue)]"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
          {copy.email}
        </span>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm text-[#242424] outline-none transition focus:border-[var(--brand-blue)]"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
          {copy.subject}
        </span>
        <input
          type="text"
          name="subject"
          className="w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm text-[#242424] outline-none transition focus:border-[var(--brand-blue)]"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
          {copy.message}
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full resize-y rounded-lg border border-black/15 bg-white px-4 py-3 text-sm text-[#242424] outline-none transition focus:border-[var(--brand-blue)]"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-blue)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? copy.submitting : copy.submit}
      </button>

      {feedback ? <p className="text-sm text-neutral-700">{feedback}</p> : null}
    </form>
  )
}
