import PortableTextLink from '@/components/PortableTextLink'

export const profilePortableTextComponents = {
  marks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    link: ({ value, children }: any) => (
      <PortableTextLink
        value={value}
        className="underline underline-offset-2 hover:opacity-70"
      >
        {children}
      </PortableTextLink>
    ),
  },
}
