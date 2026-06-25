import type { StructureResolver } from 'sanity/structure'

const ORDERED_TYPES = ['atriz', 'ator', 'estrangeiro', 'criativo'] as const

const TITLES: Record<(typeof ORDERED_TYPES)[number], string> = {
  atriz: 'Atrizes',
  ator: 'Atores',
  estrangeiro: 'Estrangeiros',
  criativo: 'Criativos',
}

const defaultOrdering = [
  { field: 'ordem', direction: 'asc' as const },
  { field: 'nome', direction: 'asc' as const },
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo')
    .items([
      ...ORDERED_TYPES.map((type) =>
        S.listItem()
          .title(TITLES[type])
          .id(type)
          .schemaType(type)
          .child(
            S.documentTypeList(type)
              .title(TITLES[type])
              .defaultOrdering(defaultOrdering)
          )
      ),
      ...S.documentTypeListItems().filter(
        (item) => !ORDERED_TYPES.includes(item.getId() as (typeof ORDERED_TYPES)[number])
      ),
    ])
