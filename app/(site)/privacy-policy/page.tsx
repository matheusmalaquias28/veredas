import type { Metadata } from 'next'
import LegalPageContent from '@/components/LegalPageContent'

export const metadata: Metadata = {
  title: 'Privacy Policy — Veredas',
  description: 'Política de privacidade Veredas Art.',
}

export default function PrivacyPolicyPage() {
  return <LegalPageContent type="privacy" />
}
