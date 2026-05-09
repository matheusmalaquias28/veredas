import { Resend } from 'resend'

/** Node na Vercel evita Edge, onde o SDK do Resend pode falhar. */
export const runtime = 'nodejs'

/** Destino fixo: formulários sempre chegam neste inbox. */
const TO_EMAIL = 'contato@veredas.art'
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? 'Veredas Site <onboarding@resend.dev>'

const MAX = {
  name: 200,
  email: 254,
  subject: 200,
  message: 8000,
  phone: 40,
  artistName: 200,
} as const

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function clampStr(value: unknown, max: number): string {
  const s = typeof value === 'string' ? value.trim() : ''
  return s.length > max ? s.slice(0, max) : s
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'RESEND_API_KEY is not set' }, { status: 500 })
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!json || typeof json !== 'object') {
    return Response.json({ error: 'Invalid body' }, { status: 400 })
  }

  const body = json as Record<string, unknown>
  const kind = body.kind === 'hire' ? 'hire' : body.kind === 'contact' ? 'contact' : null
  if (!kind) {
    return Response.json({ error: 'kind must be contact or hire' }, { status: 400 })
  }

  const name = clampStr(body.name, MAX.name)
  const email = clampStr(body.email, MAX.email)
  const message = clampStr(body.message, MAX.message)

  if (!name || !email || !message) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  let subject: string
  let text: string

  if (kind === 'contact') {
    const rawSubject = clampStr(body.subject, MAX.subject)
    subject = rawSubject || `Contato via site — ${name}`
    text = [
      'Formulário: Contato (site)',
      '',
      `Nome: ${name}`,
      `E-mail: ${email}`,
      `Assunto: ${rawSubject || '(sem assunto)'}`,
      '',
      'Mensagem:',
      message,
    ].join('\n')
  } else {
    const phone = clampStr(body.phone, MAX.phone)
    const artistName = clampStr(body.artistName, MAX.artistName)
    if (!phone) {
      return Response.json({ error: 'Missing phone' }, { status: 400 })
    }
    subject = artistName
      ? `Contratação — ${artistName}`
      : 'Contratação — Veredas'
    const lines = [
      'Formulário: Contratação (site)',
      '',
      `Nome: ${name}`,
      `E-mail: ${email}`,
      `Telefone: ${phone}`,
    ]
    if (artistName) lines.push(`Artista / criativo: ${artistName}`)
    lines.push('', 'Mensagem:', message)
    text = lines.join('\n')
  }

  const resend = new Resend(apiKey)

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    replyTo: email,
    subject,
    text,
  })

  if (error) {
    const message =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: string }).message)
        : String(error)
    console.error('[send-email] Resend:', error)
    return Response.json({ error: message || 'Resend error' }, { status: 502 })
  }

  return Response.json({ ok: true, id: data?.id ?? null })
}
