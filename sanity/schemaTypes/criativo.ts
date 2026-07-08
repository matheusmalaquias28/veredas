import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { richTextField } from './richText'

export const criativoType = defineType({
  name: 'criativo',
  title: 'Criativo',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'criativo' }),
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
      name: 'nomeEn',
      title: 'Nome (inglês)',
      description: 'Opcional. Se vazio, o site mantém o nome em português.',
      type: 'string',
    }),
    defineField({
      name: 'funcao',
      title: 'Função',
      type: 'string',
      description: 'Ex: Diretor, Roteirista, Diretor de Arte…',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'funcaoEn',
      title: 'Função (inglês)',
      description: 'Opcional. Ex: Director, Screenwriter, Art Director…',
      type: 'string',
    }),
    defineField({
      name: 'fotoPrincipal',
      title: 'Foto Principal',
      type: 'image',
      options: { hotspot: true },
    }),

    richTextField('biografiaCurta', 'Biografia Curta', 'Aparece nos cards e no topo do perfil.'),
    richTextField(
      'biografiaCurtaEn',
      'Biografia Curta (inglês)',
      'Opcional. Se vazio, mantém a versão em português.'
    ),

    richTextField('bloco1', 'Bloco de Texto 1'),
    richTextField('bloco1En', 'Bloco de Texto 1 (inglês)', 'Opcional.'),
    defineField({
      name: 'galeria1',
      title: 'Galeria 1',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    richTextField('bloco2', 'Bloco de Texto 2'),
    richTextField('bloco2En', 'Bloco de Texto 2 (inglês)', 'Opcional.'),
    defineField({
      name: 'galeria2',
      title: 'Galeria 2',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    richTextField('bloco3', 'Bloco de Texto 3'),
    richTextField('bloco3En', 'Bloco de Texto 3 (inglês)', 'Opcional.'),
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
    select: { title: 'nome', subtitle: 'funcao', media: 'fotoPrincipal' },
  },
})
