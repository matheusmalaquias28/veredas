'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { client } from '@/sanity/lib/client'
import { ELENCO_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { useLang } from '@/contexts/LanguageContext'
import { formatAge } from '@/lib/ageFromBirthYear'
import type { ElencoListItem, ElencoProfile } from '@/types/elenco'

interface Props {
  artists: ElencoListItem[]
  onRemove: (id: string) => void
  onClear: () => void
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

async function generatePDF(artists: ElencoListItem[]) {
  const { default: jsPDF } = await import('jspdf')

  // Busca dados completos de cada artista
  const profiles: ElencoProfile[] = await Promise.all(
    artists.map((a) => client.fetch(ELENCO_BY_SLUG_QUERY, { slug: a.slug?.current }))
  )

  const doc = new jsPDF('p', 'mm', 'a4')
  const pageW = 210
  const pageH = 297
  const mg = 20

  for (let i = 0; i < profiles.length; i++) {
    const p = profiles[i]
    if (!p) continue
    if (i > 0) doc.addPage()

    // Header
    doc.setFillColor(36, 36, 36)
    doc.rect(0, 0, pageW, 12, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(255, 255, 255)
    doc.text('VEREDAS', mg, 8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(66, 119, 246)
    doc.text('AGENCIAMENTO ARTÍSTICO', mg + 22, 8)

    // Função
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(66, 119, 246)
    doc.text((p.funcao ?? '').toUpperCase(), mg, 28)

    // Nome
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    doc.setTextColor(36, 36, 36)
    doc.text(p.nome.toUpperCase(), mg, 40)

    // Divider
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.4)
    doc.line(mg, 45, pageW - mg, 45)

    // Foto (coluna esquerda)
    const photoX = mg
    const photoY = 52
    const photoW = 80
    const photoH = Math.round(photoW * (4 / 3))

    if (p.fotoPrincipal?.asset) {
      try {
        const imgUrl = urlFor(p.fotoPrincipal).width(400).height(533).fit('crop').url()
        const res = await fetch(imgUrl)
        const blob = await res.blob()
        const b64 = await blobToBase64(blob)
        doc.addImage(b64, 'JPEG', photoX, photoY, photoW, photoH)
      } catch {
        doc.setFillColor(230, 230, 230)
        doc.rect(photoX, photoY, photoW, photoH, 'F')
      }
    } else {
      doc.setFillColor(230, 230, 230)
      doc.rect(photoX, photoY, photoW, photoH, 'F')
    }

    // Coluna direita
    const infoX = mg + photoW + 12
    const infoW = pageW - infoX - mg
    let y = photoY

    // Dados
    const dados: { label: string; valor: string }[] = []
    if (p.anoNascimento) dados.push({ label: 'Idade', valor: formatAge(p.anoNascimento) })
    if (p.altura) dados.push({ label: 'Altura', valor: p.altura })
    if (p.cidadeEstado) dados.push({ label: 'Local', valor: p.cidadeEstado })
    if (p.idiomas?.length) dados.push({ label: 'Idiomas', valor: p.idiomas.join(', ') })

    for (const d of dados) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(36, 36, 36)
      doc.text(d.label.toUpperCase(), infoX, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(d.valor, infoX + 22, y)
      y += 7
    }

    // Biografia
    if (p.biografia) {
      y += 4
      doc.setDrawColor(220, 220, 220)
      doc.line(infoX, y, infoX + infoW, y)
      y += 6
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      const bioText = typeof p.biografia === 'string'
        ? p.biografia
        : Array.isArray(p.biografia)
          ? (p.biografia as { children?: { text?: string }[] }[])
              .map((b) => b.children?.map((c) => c.text).join('') ?? '')
              .join('\n')
          : ''
      const lines = doc.splitTextToSize(bioText, infoW)
      doc.text(lines, infoX, y)
    }

    // Fotos extras
    if (p.fotosExtras?.length) {
      const extrasY = photoY + photoH + 8
      doc.setDrawColor(220, 220, 220)
      doc.line(mg, extrasY, pageW - mg, extrasY)

      const cols = 4
      const gap = 3
      const thumbW = (pageW - mg * 2 - gap * (cols - 1)) / cols
      const thumbH = thumbW
      let gx = mg
      let gy = extrasY + 6

      for (const img of p.fotosExtras.slice(0, 4)) {
        if (!img?.asset) continue
        try {
          const imgUrl = urlFor(img).width(300).height(300).fit('crop').url()
          const res = await fetch(imgUrl)
          const blob = await res.blob()
          const b64 = await blobToBase64(blob)
          doc.addImage(b64, 'JPEG', gx, gy, thumbW, thumbH)
        } catch {
          doc.setFillColor(230, 230, 230)
          doc.rect(gx, gy, thumbW, thumbH, 'F')
        }
        gx += thumbW + gap
      }
    }

    // Footer
    doc.setDrawColor(220, 220, 220)
    doc.line(mg, pageH - 14, pageW - mg, pageH - 14)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(180, 180, 180)
    doc.text(`${i + 1} / ${profiles.length}`, pageW - mg, pageH - 7, { align: 'right' })
  }

  doc.save('veredas-elenco.pdf')
}

export default function ElencoSelectionBar({ artists, onRemove, onClear }: Props) {
  const [loading, setLoading] = useState(false)
  const { translations: t } = useLang()
  const selectedLabel = `${artists.length} ${artists.length === 1 ? t.selectionBar.selecionado : t.selectionBar.selecionados}`

  const handlePDF = async () => {
    setLoading(true)
    try {
      await generatePDF(artists)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-[150]"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center gap-4 px-6 py-4 md:px-10">
        {/* Nomes selecionados */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
            {selectedLabel}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {artists.map((a) => (
              <button
                key={a._id}
                type="button"
                onClick={() => onRemove(a._id)}
                className="group flex items-center gap-1.5 text-sm text-white/80 transition-colors hover:text-white"
                title="Remover"
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>{a.nome}</span>
                <span className="text-xs leading-none text-white/30 group-hover:text-white/70">×</span>
              </button>
            ))}
          </div>
        </div>

        {/* Limpar */}
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white/80"
        >
          {t.selectionBar.limpar}
        </button>

        {/* Gerar PDF */}
        <button
          onClick={handlePDF}
          disabled={loading}
          className="shrink-0 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] transition-all disabled:opacity-50"
          style={{ background: '#db260e', color: '#fff' }}
        >
          {loading ? t.selectionBar.gerando : t.selectionBar.gerarPdf}
        </button>
      </div>
    </motion.div>
  )
}
