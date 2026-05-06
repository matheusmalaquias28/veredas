import { defineArrayMember, defineField } from 'sanity'

/** Bloco de texto rico reutilizável (Portable Text). */
export const richTextBlockMember = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H2', value: 'h2' },
    { title: 'H3', value: 'h3' },
  ],
  marks: {
    decorators: [
      { title: 'Negrito', value: 'strong' },
      { title: 'Itálico', value: 'em' },
      { title: 'Sublinhado', value: 'underline' },
    ],
    annotations: [
      defineArrayMember({
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({ name: 'href', type: 'string', title: 'URL' }),
          defineField({
            name: 'blank',
            type: 'boolean',
            title: 'Abrir em nova aba',
            initialValue: true,
          }),
        ],
      }),
    ],
  },
})

export function richTextField(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    description,
    type: 'array',
    of: [richTextBlockMember],
  })
}
