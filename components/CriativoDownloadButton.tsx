'use client'

import { useState } from 'react'
import { urlFor } from '@/sanity/lib/image'
import { useLang } from '@/contexts/LanguageContext'
import { localizeCriativo } from '@/lib/localizeCriativo'
import type { Criativo } from '@/types/criativo'
import { portableTextToPlain } from '@/lib/portableTextToPlain'

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

async function generateCriativoPDF(
  c: Criativo,
  copy: { brand: string; tagline: string; siteLabel: string; instagramLabel: string }
) {
  const { default: jsPDF } = await import('jspdf')

  const doc = new jsPDF('p', 'mm', 'a4')
  const pageW = 210
  const pageH = 297
  const mg = 20

  // ── Header bar ──────────────────────────────────────────────
  doc.setFillColor(36, 36, 36)
  doc.rect(0, 0, pageW, 12, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(255, 255, 255)
  doc.text(copy.brand, mg, 8)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(66, 119, 246)
  doc.text(copy.tagline, mg + 22, 8)

  // ── Função ───────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(66, 119, 246)
  doc.text((c.funcao ?? '').toUpperCase(), mg, 28)

  // ── Nome ─────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(26)
  doc.setTextColor(36, 36, 36)
  doc.text(c.nome.toUpperCase(), mg, 40)

  // ── Divider ──────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.4)
  doc.line(mg, 45, pageW - mg, 45)

  // ── Foto (coluna esquerda) ───────────────────────────────────
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

  // ── Coluna direita ───────────────────────────────────────────
  const infoX = mg + photoW + 12
  const infoW = pageW - infoX - mg
  let y = photoY

  // Bio curta
  const bioText = portableTextToPlain(c.biografiaCurta)
  if (bioText) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    const lines = doc.splitTextToSize(bioText, infoW)
    doc.text(lines, infoX, y)
    y += lines.length * 5 + 8
  }

  // Blocos de texto
  const blocos = [c.bloco1, c.bloco2, c.bloco3].map(portableTextToPlain).filter(Boolean)
  for (const bloco of blocos) {
    if (y > photoY + photoH - 10) break // não ultrapassa foto
    doc.setDrawColor(220, 220, 220)
    doc.line(infoX, y, infoX + infoW, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    const lines = doc.splitTextToSize(bloco, infoW)
    doc.text(lines, infoX, y)
    y += lines.length * 5 + 6
  }

  // Links
  const linksY = photoY + photoH + 8
  if (c.site || c.instagram) {
    doc.setDrawColor(220, 220, 220)
    doc.line(mg, linksY, pageW - mg, linksY)
    let lY = linksY + 6

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(36, 36, 36)

    if (c.site) {
      doc.text(copy.siteLabel, mg, lY)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(c.site.replace(/^https?:\/\//, ''), mg + 12, lY)
      lY += 7
    }
    if (c.instagram) {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(36, 36, 36)
      doc.text(copy.instagramLabel, mg, lY)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(`@${c.instagram}`, mg + 12, lY)
    }
  }

  // Galerias — todas numa única página extra, grid 4 colunas
  const todasImagens = [
    ...(c.galeria1 ?? []),
    ...(c.galeria2 ?? []),
    ...(c.galeria3 ?? []),
  ].filter((img) => img?.asset)

  if (todasImagens.length > 0) {
    doc.addPage()

    // Mini header
    doc.setFillColor(36, 36, 36)
    doc.rect(0, 0, pageW, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6)
    doc.setTextColor(255, 255, 255)
    doc.text(copy.brand, mg, 5.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(66, 119, 246)
    doc.text(c.nome.toUpperCase(), mg + 18, 5.5)

    // Grid — calcula colunas e tamanho de célula para caber tudo numa página
    const usableW = pageW - mg * 2
    const usableH = pageH - mg - 14 // abaixo do header
    const count = todasImagens.length
    const cols = Math.min(count, 4)
    const rows = Math.ceil(count / cols)
    const gap = 3
    const cellW = (usableW - gap * (cols - 1)) / cols
    const cellH = Math.min(cellW, (usableH - gap * (rows - 1)) / rows)

    let col = 0
    let row = 0

    for (const img of todasImagens) {
      const gx = mg + col * (cellW + gap)
      const gy = 14 + row * (cellH + gap)

      try {
        const imgUrl = urlFor(img).width(400).fit('max').url()
        const res = await fetch(imgUrl)
        const blob = await res.blob()
        const b64 = await blobToBase64(blob)

        // Dimensões naturais para contain sem corte
        const { w, h } = await getImageNaturalSize(b64)
        const scale = Math.min(cellW / w, cellH / h)
        const dw = w * scale
        const dh = h * scale
        const dx = gx + (cellW - dw) / 2
        const dy = gy + (cellH - dh) / 2

        doc.addImage(b64, 'JPEG', dx, dy, dw, dh)
      } catch {
        doc.setFillColor(240, 240, 240)
        doc.rect(gx, gy, cellW, cellH, 'F')
      }

      col++
      if (col >= cols) {
        col = 0
        row++
      }
    }
  }

  // ── Footer em todas as páginas ───────────────────────────────
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

  doc.save(`${c.nome.toLowerCase().replace(/\s+/g, '-')}.pdf`)
}

export default function CriativoDownloadButton({ criativo }: { criativo: Criativo }) {
  const [loading, setLoading] = useState(false)
  const { translations: t, lang } = useLang()

  const handleClick = async () => {
    setLoading(true)
    try {
      await generateCriativoPDF(localizeCriativo(criativo, lang), {
        brand: t.pdf.brand,
        tagline: t.pdf.tagline,
        siteLabel: t.pdf.siteLabel,
        instagramLabel: t.pdf.instagramLabel,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={t.actions.baixarPdf}
      title={t.actions.baixarPdf}
      className="fixed bottom-8 right-8 z-[100] flex h-12 items-center gap-3 rounded-full px-6 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
      style={{ background: '#db260e', color: '#fff' }}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin"
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
          >
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
