import type { CollectionConfig } from 'payload'
import { isEditor, readOwnDocuments } from '../access/roles.ts'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Dokument', plural: 'Dokumente' },
  admin: { useAsTitle: 'title', group: 'Dokumentenverwaltung' },
  access: { create: isEditor, read: readOwnDocuments, update: isEditor, delete: isEditor },
  upload: {
    staticDir: 'uploads/documents',
    mimeTypes: ['application/pdf','image/jpeg','image/png','image/webp',
                'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Titel', required: true },
    { name: 'category', type: 'select', label: 'Kategorie', required: true,
      options: [
        {label:'📋 Pflegevertrag',    value:'contract'},
        {label:'🏥 Arztbericht',      value:'medical'},
        {label:'💊 Medikationsplan',  value:'medication'},
        {label:'📊 Pflegebericht',    value:'care-report'},
        {label:'🏦 Kostenvoranschlag',value:'invoice'},
        {label:'📄 Sonstiges',        value:'other'},
      ] },
    { name: 'patient',        type: 'relationship', label: 'Patient',          relationTo: 'patients', required: true },
    { name: 'uploadedBy',     type: 'relationship', label: 'Hochgeladen von',  relationTo: 'users', admin: { readOnly: true } },
    { name: 'isConfidential', type: 'checkbox',     label: 'Vertraulich',      defaultValue: false },
    { name: 'expiresAt',      type: 'date',         label: 'Gültig bis' },
    { name: 'notes',          type: 'textarea',     label: 'Notizen' },
  ],
  hooks: { beforeChange: [({ req, data }) => ({ ...data, uploadedBy: req.user?.id })] },
  timestamps: true,
}
