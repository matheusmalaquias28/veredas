import type { Metadata } from 'next'
import LegalPageContent from '@/components/LegalPageContent'

export const metadata: Metadata = {
  title: 'Terms of Service — Veredas',
  description: 'Termos de serviço Veredas Art.',
}

export default function TermsOfServicePage() {
  return <LegalPageContent type="terms" />
}
