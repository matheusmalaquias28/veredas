/** Extrai texto simples de string ou Portable Text (blocos Sanity). */
export function portableTextToPlain(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return (value as { children?: { text?: string }[] }[])
      .map((b) => b.children?.map((c) => c.text ?? '').join('') ?? '')
      .join('\n')
  }
  return ''
}
