/**
 * Preenche o campo `ordem` nos documentos existentes.
 * Requer SANITY_API_TOKEN com permissão de escrita no .env.local
 *
 * Uso: node scripts/seed-ordem.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvLocal()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_TOKEN
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-01-01'

if (!projectId || !token) {
  console.error('Defina NEXT_PUBLIC_SANITY_PROJECT_ID e SANITY_API_TOKEN em .env.local')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false })

const normalizeName = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const PRIORITY = {
  atriz: [
    'Pri Helena',
    'Larissa Murai',
    'Betty Faria',
    'Ana Flavia Cavalcanti',
    'Pâmela Germano',
    'Nathalia Garcia',
    'Maria Bomani',
    'Letícia Rodrigues',
    'Isadora Ruppert',
    'Ju Akemi',
    'Castilo',
    'Adriana Perin',
    'Geane Albuquerque',
    'Carolina Oliveira',
    'Christiana Ubach',
    'Estrela Straus',
    'Jhonnã Bao',
    'Iraci Estrela',
    'Heloísa Pires',
  ],
  ator: [
    'Guilherme Rodio',
    'João Pedro Mariano',
    'Sandro Guerra',
    'Vini Ranieri',
    'Fernando Moscardi',
    'Lucas Oranmian',
    'Herberth Vital',
    'Odá Silva',
    'Fernando Possani',
    'Lucas Limeira',
    'Renato Luciano',
    'Davi Françoá',
    'Alexandre Ammano',
  ],
}

function ordemFor(type, nome, fallbackIndex) {
  const list = PRIORITY[type]
  if (!list) return (fallbackIndex + 1) * 10
  const index = list.findIndex((name) => normalizeName(name) === normalizeName(nome))
  return index >= 0 ? index + 1 : 1000 + fallbackIndex
}

async function seedType(type) {
  const docs = await client.fetch(`*[_type == $type]{ _id, nome, ordem }`, { type })
  docs.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  let updated = 0
  const tx = client.transaction()

  docs.forEach((doc, index) => {
    const nextOrdem = ordemFor(type, doc.nome, index)
    if (doc.ordem === nextOrdem) return
    tx.patch(doc._id, { set: { ordem: nextOrdem } })
    updated++
  })

  if (updated === 0) {
    console.log(`${type}: nada a atualizar`)
    return
  }

  await tx.commit()
  console.log(`${type}: ${updated} documento(s) atualizado(s)`)
}

for (const type of ['atriz', 'ator', 'estrangeiro', 'criativo']) {
  await seedType(type)
}

console.log('Concluído.')
