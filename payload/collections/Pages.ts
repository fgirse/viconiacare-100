import type { AccessArgs, CollectionConfig } from 'payload'

const isAdminOrEditor = ({ req: { user } }: AccessArgs) =>
  user?.role === 'superadmin' || user?.role === 'admin' || user?.role === 'editor'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'accessLevel', 'updatedAt'],
  },
  access: {
    read: () => {
      // Public pages visible to all
      // Protected pages require login
      return true // field-level logic handles this
    },
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: ({ req: { user } }) => user?.role === 'superadmin' || user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Seitentitel',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL-Slug',
      admin: {
        description: 'URL-freundlicher Name, z.B. "ueber-uns"',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Entwurf', value: 'draft' },
        { label: 'Veröffentlicht', value: 'published' },
      ],
    },
    {
      name: 'accessLevel',
      type: 'select',
      defaultValue: 'public',
      label: 'Zugangsstufe',
      options: [
        { label: 'Öffentlich', value: 'public' },
        { label: 'Nur für registrierte Nutzer', value: 'authenticated' },
        { label: 'Nur für Mitarbeiter', value: 'staff' },
        { label: 'Nur Administratoren', value: 'admin' },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Hero-Bereich',
      fields: [
        { name: 'headline', type: 'text', label: 'Überschrift' },
        { name: 'subheadline', type: 'textarea', label: 'Untertitel' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Hintergrundbild' },
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Button Text',
          defaultValue: 'Beratungsgespräch buchen',
        },
        { name: 'ctaLink', type: 'text', label: 'Button Link' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Seiteninhalt',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Meta-Titel' },
        { name: 'metaDescription', type: 'textarea', label: 'Meta-Beschreibung' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG-Bild' },
      ],
    },
  ],
  timestamps: true,
}
