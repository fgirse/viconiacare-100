import type { CollectionConfig } from 'payload'
import { isEditor, isPublic } from '../access/roles.ts'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Datei', plural: 'Mediendateien' },
  admin: { group: 'Medien' },
  access: { read: isPublic, create: isEditor, update: isEditor, delete: isEditor },
  upload: {
    staticDir: 'uploads/media',
    imageSizes: [
      { name: 'thumbnail', width: 400,  height: 300,  position: 'centre' },
      { name: 'card',      width: 800,  height: 600,  position: 'centre' },
      { name: 'hero',      width: 1920, height: 1080, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    { name: 'alt',     type: 'text', label: 'Alt-Text',       required: true },
    { name: 'caption', type: 'text', label: 'Bildunterschrift' },
  ],
}
