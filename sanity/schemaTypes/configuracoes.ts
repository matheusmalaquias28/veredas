import { defineField, defineType } from 'sanity'
import { richTextField } from './richText'

export const configuracoesType = defineType({
  name: 'configuracoes',
  title: 'Configurações Gerais',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'redesSociais',
      title: 'Redes Sociais',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram', type: 'url' },
        { name: 'facebook', title: 'Facebook', type: 'url' },
        { name: 'youtube', title: 'YouTube', type: 'url' },
      ],
    }),
    richTextField(
      'textoContato',
      'Texto de Contato',
      'Texto rico. Se um documento antigo só abrir após migrar: o valor era texto simples; reabra o campo ou salve de novo.',
    ),
    defineField({
      name: 'heroVideoUrl',
      title: 'Hero — URL do Vídeo',
      type: 'url',
      description: 'URL direta para um arquivo .mp4 (ex: hospedado no CDN ou servidor próprio)',
    }),
    defineField({
      name: 'heroTitulo',
      title: 'Hero — Título',
      type: 'string',
    }),
    richTextField(
      'heroSubtexto',
      'Hero — Subtexto',
      'Texto abaixo do título (rich text). Evita erro quando o editor grava blocos em vez de string.',
    ),
    defineField({
      name: 'heroCtaTexto',
      title: 'Hero — Texto do Botão',
      type: 'string',
    }),
    defineField({
      name: 'heroCtaLink',
      title: 'Hero — Link do Botão',
      type: 'string',
    }),
    defineField({
      name: 'homeAgenciaImagem',
      title: 'Home — Imagem (bloco Sobre a Agência)',
      type: 'image',
      options: { hotspot: true },
      description:
        'Ocupa metade esquerda da tela, altura total da secção no desktop. Faça upload na horizontal ou vertical; o recorte cobre a área.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Configurações Gerais' }
    },
  },
})
