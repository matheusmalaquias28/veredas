/** Idade a partir do ano de nascimento (campo numérico no Sanity). */
export function ageFromBirthYear(
  birthYear: number,
  referenceDate: Date = new Date()
): number {
  const age = referenceDate.getFullYear() - birthYear
  return age >= 0 ? age : 0
}

export function formatAge(birthYear: number, locale: 'pt' | 'en' = 'pt'): string {
  const age = ageFromBirthYear(birthYear)
  return locale === 'en' ? String(age) : `${age} anos`
}
