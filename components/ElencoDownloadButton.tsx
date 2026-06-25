'use client'

import { useState } from 'react'
import { urlFor } from '@/sanity/lib/image'
import { useLang } from '@/contexts/LanguageContext'
import { formatAge } from '@/lib/ageFromBirthYear'
import type { ElencoProfile } from '@/types/elenco'

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function getImageNaturalSize(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
    img.onerror = () => resolve({ w: 1, h: 1 })
    img.src = src
  })
}

function bioToString(biografia: unknown): string {
  if (!biografia) return ''
  if (typeof biografia === 'string') return biografia
  if (Array.isArray(biografia)) {
    return (biografia as { children?: { text?: string }[] }[])
      .map((b) => b.children?.map((c) => c.text).join('') ?? '')
      .join('\n')
  }
  return ''
}

async function generatePDF(artist: ElencoProfile) {
  const { default: jsPDF } = await import('jspdf')

  const doc = new jsPDF('p', 'mm', 'a4')
  const pageW = 210
  const pageH = 297
  const mg = 20

  // ── Header ───────────────────────────────────────────────────
  doc.setFillColor(36, 36, 36)
  doc.rect(0, 0, pageW, 12, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(255, 255, 255)
  doc.text('VEREDAS', mg, 8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(66, 119, 246)
  doc.text('AGENCIAMENTO ARTÍSTICO', mg + 22, 8)

  // ── Função ───────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(66, 119, 246)
  doc.text((artist.funcao ?? '').toUpperCase(), mg, 28)

  // ── Nome ─────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(26)
  doc.setTextColor(36, 36, 36)
  doc.text(artist.nome.toUpperCase(), mg, 40)

  // ── Divider ──────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.4)
  doc.line(mg, 45, pageW - mg, 45)

  // ── Foto ─────────────────────────────────────────────────────
  const photoX = mg
  const photoY = 52
  const photoW = 80
  const photoH = Math.round(photoW * (4 / 3))

  if (artist.fotoPrincipal?.asset) {
    try {
      const imgUrl = urlFor(artist.fotoPrincipal).width(400).height(533).fit('crop').url()
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

  // ── Coluna direita — dados ────────────────────────────────────
  const infoX = mg + photoW + 12
  const infoW = pageW - infoX - mg
  let y = photoY

  const dados: { label: string; valor: string }[] = []
  if (artist.anoNascimento) dados.push({ label: 'Idade', valor: formatAge(artist.anoNascimento) })
  if (artist.altura) dados.push({ label: 'Altura', valor: artist.altura })
  if (artist.cidadeEstado) dados.push({ label: 'Naturalidade', valor: artist.cidadeEstado })
  if (artist.idiomas?.length) dados.push({ label: 'Idiomas', valor: artist.idiomas.join(', ') })

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

  // ── Biografia ─────────────────────────────────────────────────
  const bioText = bioToString(artist.biografia)
  if (bioText) {
    y += 4
    doc.setDrawColor(220, 220, 220)
    doc.line(infoX, y, infoX + infoW, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    const lines = doc.splitTextToSize(bioText, infoW)
    doc.text(lines, infoX, y)
  }

  // ── Fotos extras — grid contain, página extra se necessário ───
  const extras = (artist.fotosExtras ?? []).filter((img) => img?.asset)
  if (extras.length > 0) {
    doc.addPage()

    // Mini header
    doc.setFillColor(36, 36, 36)
    doc.rect(0, 0, pageW, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6)
    doc.setTextColor(255, 255, 255)
    doc.text('VEREDAS', mg, 5.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(66, 119, 246)
    doc.text(artist.nome.toUpperCase(), mg + 18, 5.5)

    const usableW = pageW - mg * 2
    const usableH = pageH - mg - 14
    const cols = Math.min(extras.length, 4)
    const rows = Math.ceil(extras.length / cols)
    const gap = 3
    const cellW = (usableW - gap * (cols - 1)) / cols
    const cellH = Math.min(cellW, (usableH - gap * (rows - 1)) / rows)

    let col = 0
    let row = 0

    for (const img of extras) {
      const gx = mg + col * (cellW + gap)
      const gy = 14 + row * (cellH + gap)

      try {
        const imgUrl = urlFor(img).width(400).fit('max').url()
        const res = await fetch(imgUrl)
        const blob = await res.blob()
        const b64 = await blobToBase64(blob)
        const { w, h } = await getImageNaturalSize(b64)
        const scale = Math.min(cellW / w, cellH / h)
        const dw = w * scale
        const dh = h * scale
        doc.addImage(b64, 'JPEG', gx + (cellW - dw) / 2, gy + (cellH - dh) / 2, dw, dh)
      } catch {
        doc.setFillColor(230, 230, 230)
        doc.rect(gx, gy, cellW, cellH, 'F')
      }

      col++
      if (col >= cols) { col = 0; row++ }
    }
  }

  // ── Footer em todas as páginas ────────────────────────────────
  const totalPages = doc.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    doc.setDrawColor(220, 220, 220)
    doc.line(mg, pageH - 14, pageW - mg, pageH - 14)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(180, 180, 180)
    doc.text(`${p} / ${totalPages}`, pageW - mg, pageH - 7, { align: 'right' })
  }

  doc.save(`${artist.nome.toLowerCase().replace(/\s+/g, '-')}.pdf`)
}

export default function ElencoDownloadButton({ artist }: { artist: ElencoProfile }) {
  const [loading, setLoading] = useState(false)
  const { translations: t } = useLang()

  const handleClick = async () => {
    setLoading(true)
    try {
      await generatePDF(artist)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label="Baixar PDF"
      className="fixed bottom-8 right-8 z-[100] flex h-12 items-center gap-3 rounded-full px-6 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
      style={{ background: '#db260e', color: '#fff' }}
    >
      {loading ? (
        <>
          <svg className="animate-spin" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="15" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">{t.actions.gerando}</span>
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M10 3v10M6 9l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 16h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">{t.actions.baixarPdf}</span>
        </>
      )}
    </button>
  )
}
