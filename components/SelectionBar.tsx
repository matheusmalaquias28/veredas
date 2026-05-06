'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { useLang } from '@/contexts/LanguageContext'
import type { Criativo } from '@/types/criativo'
import { portableTextToPlain } from '@/lib/portableTextToPlain'

interface Props {
  criativos: Criativo[]
  onRemove: (id: string) => void
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

async function generatePDF(criativos: Criativo[]) {
  const { default: jsPDF } = await import('jspdf')

  const doc = new jsPDF('p', 'mm', 'a4')
  const pageW = 210
  const pageH = 297
  const mg = 20

  for (let i = 0; i < criativos.length; i++) {
    const c = criativos[i]
    if (i > 0) doc.addPage()

    // Header bar
    doc.setFillColor(36, 36, 36)
    doc.rect(0, 0, pageW, 12, 'F')

    // Agency name in header
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
    doc.text((c.funcao ?? '').toUpperCase(), mg, 28)

    // Nome
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    doc.setTextColor(36, 36, 36)
    doc.text(c.nome.toUpperCase(), mg, 40)

    // Divider
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.4)
    doc.line(mg, 45, pageW - mg, 45)

    // Photo (left column)
    const photoX = mg
    const photoY = 52
    const photoW = 80
    const photoH = Math.round(photoW * (4 / 3))

    if (c.fotoPrincipal?.asset) {
      try {
        const imgUrl = urlFor(c.fotoPrincipal).width(400).height(533).fit('crop').url()
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

    // Info column (right)
    const infoX = mg + photoW + 12
    const infoW = pageW - infoX - mg
    let infoY = photoY

    // Bio
    if (c.biografiaCurta) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      const lines = doc.splitTextToSize(portableTextToPlain(c.biografiaCurta), infoW)
      doc.text(lines, infoX, infoY)
      infoY += lines.length * 5 + 10
    }

    // Contact
    if (c.site || c.instagram) {
      doc.setDrawColor(220, 220, 220)
      doc.line(infoX, infoY, infoX + infoW, infoY)
      infoY += 6

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(36, 36, 36)

      if (c.site) {
        doc.text('SITE', infoX, infoY)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 100, 100)
        doc.text(c.site.replace(/^https?:\/\//, ''), infoX + 12, infoY)
        infoY += 7
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(36, 36, 36)
      }
      if (c.instagram) {
        doc.text('IG', infoX, infoY)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 100, 100)
        doc.text(`@${c.instagram}`, infoX + 12, infoY)
      }
    }

    // Footer
    doc.setDrawColor(220, 220, 220)
    doc.line(mg, pageH - 14, pageW - mg, pageH - 14)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(180, 180, 180)
    doc.text(`${i + 1} / ${criativos.length}`, pageW - mg, pageH - 7, { align: 'right' })
  }

  doc.save('veredas-criativos.pdf')
}

export default function SelectionBar({ criativos, onRemove }: Props) {
  const [loading, setLoading] = useState(false)
  const { translations: t } = useLang()

  const handlePDF = async () => {
    setLoading(true)
    try {
      await generatePDF(criativos)
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
        {/* Selected names */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
            {criativos.length} {criativos.length === 1 ? t.selectionBar.selecionado : t.selectionBar.selecionados}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {criativos.map((c) => (
              <button
                key={c._id}
                onClick={() => onRemove(c._id)}
                className="group flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
                title="Remover"
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>{c.nome}</span>
                <span className="text-white/30 group-hover:text-white/70 text-xs leading-none">×</span>
              </button>
            ))}
          </div>
        </div>

        {/* PDF button */}
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
