'use client'

import { FormEvent, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import FormSuccessModal from '@/components/FormSuccessModal'

export default function ContactForm() {
  const { translations: t } = useLang()
  const copy = t.contatoPage
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setIsSubmitting(true)
    setFeedback('')

    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const subject = String(formData.get('subject') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'contact',
          name,
          email,
          subject,
          message,
        }),
      })
      if (!res.ok) {
        setFeedback(copy.fallback)
        return
      }
      form.reset()
      setSuccessOpen(true)
    } catch {
      setFeedback(copy.fallback)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <FormSuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
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
    </>
  )
}
