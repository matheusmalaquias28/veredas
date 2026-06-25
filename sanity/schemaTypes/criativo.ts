import { defineField, defineType } from 'sanity'
import { richTextField } from './richText'

export const criativoType = defineType({
  name: 'criativo',
  title: 'Criativo',
  type: 'document',
  orderings: [
    {
      title: 'Ordem de exibição',
      name: 'ordemAsc',
      by: [
        { field: 'ordem', direction: 'asc' },
        { field: 'nome', direction: 'asc' },
      ],
    },
  ],
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'nome' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de exibição',
      type: 'number',
      description: 'Número menor aparece primeiro (1, 2, 3…). A lista no site segue este campo.',
      initialValue: 0,
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'funcao',
      title: 'Função',
      type: 'string',
      description: 'Ex: Diretor, Roteirista, Diretor de Arte…',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'fotoPrincipal',
      title: 'Foto Principal',
      type: 'image',
      options: { hotspot: true },
    }),

    richTextField('biografiaCurta', 'Biografia Curta', 'Aparece nos cards e no topo do perfil.'),

    richTextField('bloco1', 'Bloco de Texto 1'),
    defineField({
      name: 'galeria1',
      title: 'Galeria 1',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    richTextField('bloco2', 'Bloco de Texto 2'),
    defineField({
      name: 'galeria2',
      title: 'Galeria 2',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    richTextField('bloco3', 'Bloco de Texto 3'),
    defineField({
      name: 'galeria3',
      title: 'Galeria 3',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    defineField({
      name: 'site',
      title: 'Site',
      type: 'url',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram (sem @)',
      type: 'string',
    }),
    defineField({
      name: 'ativo',
      title: 'Ativo',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'funcao', ordem: 'ordem', media: 'fotoPrincipal' },
    prepare({ title, subtitle, ordem }) {
      const prefix = ordem != null && ordem > 0 ? `#${ordem} · ` : ''
      return {
        title,
        subtitle: `${prefix}${subtitle ?? ''}`.trim() || undefined,
      }
    },
  },
})
