/**
 * Inicializa orderRank em todos os documentos (necessário para arrastar no Studio).
 * Preserva ordem existente: campo `ordem` > `orderRank` > nome.
 *
 * Uso: npm run seed:order-rank
 * Requer SANITY_API_TOKEN em .env.local
 */
import { createClient } from '@sanity/client'
import { LexoRank } from 'lexorank'
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

const TYPES = ['atriz', 'ator', 'estrangeiro', 'criativo']

async function seedType(type) {
  const docs = await client.fetch(
    `*[_type == $type && !(_id in path("drafts.**"))]{
      _id,
      nome,
      ordem,
      orderRank
    }`,
    { type }
  )

  docs.sort((a, b) => {
    const ordemA = a.ordem ?? 999999
    const ordemB = b.ordem ?? 999999
    if (ordemA !== ordemB) return ordemA - ordemB
    if (a.orderRank && b.orderRank && a.orderRank !== b.orderRank) {
      return a.orderRank.localeCompare(b.orderRank)
    }
    if (a.orderRank && !b.orderRank) return -1
    if (!a.orderRank && b.orderRank) return 1
    return a.nome.localeCompare(b.nome, 'pt-BR')
  })

  let rank = LexoRank.min()
  const tx = client.transaction()
  let updated = 0

  for (const doc of docs) {
    rank = rank.genNext().genNext()
    const nextRank = rank.toString()
    if (doc.orderRank === nextRank) continue
    tx.patch(doc._id, { set: { orderRank: nextRank } })
    updated++
  }

  if (updated === 0) {
    console.log(`${type}: orderRank já ok (${docs.length} docs)`)
    return
  }

  await tx.commit()
  console.log(`${type}: orderRank definido em ${updated}/${docs.length} documento(s)`)
}

for (const type of TYPES) {
  await seedType(type)
}

console.log('Concluído. Recarregue o Studio e arraste na lista.')
