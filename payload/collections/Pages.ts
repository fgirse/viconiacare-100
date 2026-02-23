import type { CollectionConfig } from 'payload';
import { isEditor, isPublic } from '../access/roles';

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Seite', plural: 'Seiten' },
  admin: { useAsTitle: 'title', group: 'Content' },
  access: { read: isPublic, create: isEditor, update: isEditor, delete: isEditor },
  versions: { drafts: true },
  fields: [
    { name: 'title',   type: 'text',     label: 'Titel',   required: true, localized: true },
    { name: 'slug',    type: 'text',     label: 'Slug',    required: true, unique: true },
    { name: 'content', type: 'richText', label: 'Inhalt',  localized: true },
    { name: 'seo', type: 'group', label: 'SEO', fields: [
      { name: 'metaTitle',       type: 'text',     label: 'Meta-Titel',       localized: true },
      { name: 'metaDescription', type: 'textarea', label: 'Meta-Beschreibung', localized: true },
    ]},
  ],
  timestamps: true,
}
