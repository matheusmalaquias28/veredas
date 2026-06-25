import { defineField, defineType } from 'sanity'
import { richTextField } from './richText'

const ordemField = defineField({
  name: 'ordem',
  title: 'Ordem de exibição',
  type: 'number',
  description: 'Número menor aparece primeiro (1, 2, 3…). A lista no site segue este campo.',
  initialValue: 0,
  validation: (rule) => rule.integer().min(0),
})

const camposComuns = [
  defineField({
    name: 'nome',
    title: 'Nome',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    options: { source: 'nome' },
    validation: (rule) => rule.required(),
  }),
  ordemField,
  defineField({
    name: 'destaque',
    title: 'Destaque na Home',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    name: 'fotoPrincipal',
    title: 'Foto Principal',
    type: 'image',
    options: { hotspot: true },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'fotosExtras',
    title: 'Fotos Extras (máx. 4)',
    type: 'array',
    of: [{ type: 'image', options: { hotspot: true } }],
    validation: (rule) => rule.max(4),
  }),
  richTextField('biografia', 'Biografia'),
  defineField({
    name: 'funcao',
    title: 'Função',
    description: 'Ex: Fotógrafo, Diretor, Modelo',
    type: 'string',
  }),
  defineField({
    name: 'anoNascimento',
    title: 'Ano de Nascimento',
    type: 'number',
    validation: (rule) => rule.min(1900).max(new Date().getFullYear()),
  }),
  defineField({
    name: 'altura',
    title: 'Altura',
    description: 'Ex: 1,75m',
    type: 'string',
  }),
  defineField({
    name: 'cidadeEstado',
    title: 'Cidade / Estado',
    description: 'Ex: São Paulo, SP',
    type: 'string',
  }),
  defineField({
    name: 'idiomas',
    title: 'Idiomas',
    type: 'array',
    of: [{ type: 'string' }],
    options: {
      list: [
        { title: 'Português', value: 'Português' },
        { title: 'Inglês', value: 'Inglês' },
        { title: 'Espanhol', value: 'Espanhol' },
        { title: 'Francês', value: 'Francês' },
        { title: 'Alemão', value: 'Alemão' },
        { title: 'Italiano', value: 'Italiano' },
        { title: 'Mandarim', value: 'Mandarim' },
        { title: 'Japonês', value: 'Japonês' },
        { title: 'Árabe', value: 'Árabe' },
        { title: 'Russo', value: 'Russo' },
      ],
    },
  }),
]

const elencoOrderings = [
  {
    title: 'Ordem de exibição',
    name: 'ordemAsc',
    by: [
      { field: 'ordem', direction: 'asc' as const },
      { field: 'nome', direction: 'asc' as const },
    ],
  },
]

function elencoPreview() {
  return {
    select: {
      title: 'nome',
      subtitle: 'funcao',
      ordem: 'ordem',
      media: 'fotoPrincipal',
    },
    prepare({
      title,
      subtitle,
      ordem,
    }: {
      title: string
      subtitle?: string
      ordem?: number
    }) {
      const prefix = ordem != null && ordem > 0 ? `#${ordem} · ` : ''
      return {
        title,
        subtitle: `${prefix}${subtitle ?? ''}`.trim() || undefined,
      }
    },
  }
}

export const atorType = defineType({
  name: 'ator',
  title: 'Atores',
  type: 'document',
  orderings: elencoOrderings,
  fields: camposComuns,
  preview: elencoPreview(),
})

export const atrizType = defineType({
  name: 'atriz',
  title: 'Atrizes',
  type: 'document',
  orderings: elencoOrderings,
  fields: camposComuns,
  preview: elencoPreview(),
})

export const estraneiroType = defineType({
  name: 'estrangeiro',
  title: 'Estrangeiros',
  type: 'document',
  orderings: elencoOrderings,
  fields: camposComuns,
  preview: elencoPreview(),
})
