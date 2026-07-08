'use client'

import HireForm from '@/components/HireForm'
import { useLocalizedField } from '@/hooks/useLocalizedField'

interface Props {
  nome: string
  nomeEn?: string | null
}

export default function LocalizedHireForm({ nome, nomeEn }: Props) {
  const { string } = useLocalizedField()
  return <HireForm artistName={string(nome, nomeEn)} />
}
