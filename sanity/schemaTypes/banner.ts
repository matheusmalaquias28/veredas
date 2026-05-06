import { defineField, defineType } from 'sanity'

export const bannerType = defineType({
  name: 'banner',
  title: 'Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'imagemDesktop',
      title: 'Imagem Desktop',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imagemMobile',
      title: 'Imagem Mobile',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'link',
      title: 'Link (opcional)',
      type: 'url',
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'ativo',
      title: 'Ativo',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      media: 'imagemDesktop',
      title: 'ordem',
    },
    prepare({ title }) {
      return { title: `Banner #${title}` }
    },
  },
})
