import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

const ORDERABLE_TYPES = new Set(['ator', 'atriz', 'estrangeiro', 'criativo'])

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Conteúdo')
    .items([
      orderableDocumentListDeskItem({
        type: 'atriz',
        title: 'Atrizes',
        id: 'orderable-atrizes',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'ator',
        title: 'Atores',
        id: 'orderable-atores',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'estrangeiro',
        title: 'Estrangeiros',
        id: 'orderable-estrangeiros',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'criativo',
        title: 'Criativos',
        id: 'orderable-criativos',
        S,
        context,
      }),
      ...S.documentTypeListItems().filter((item) => !ORDERABLE_TYPES.has(item.getId() ?? '')),
    ])
