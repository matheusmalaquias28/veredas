import { defineField, defineType } from 'sanity'

export const videoProducaoType = defineType({
  name: 'videoProducao',
  title: 'Vídeos Produções',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
    }),
    defineField({
      name: 'video',
      title: 'Vídeo (16:9)',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'Faça upload do vídeo diretamente (MP4, WebM etc.).',
    }),
    defineField({
      name: 'imagem',
      title: 'Imagem de Capa (fallback)',
      type: 'image',
      options: { hotspot: true },
      description: 'Exibida enquanto o vídeo carrega ou se a URL não estiver disponível.',
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
    select: { title: 'titulo', media: 'imagem' },
  },
  orderings: [
    {
      title: 'Ordem',
      name: 'ordemAsc',
      by: [{ field: 'ordem', direction: 'asc' }],
    },
  ],
})
