import type { CollectionConfig } from 'payload'

export const ShiftPlans: CollectionConfig = {
  slug: 'shift-plans',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'periodStart', 'periodEnd', 'status'],
    group: 'Personal',
  },
  access: {
    read: ({ req: { user } }) =>
      ['superadmin', 'admin', 'editor'].includes(user?.role || ''),
    create: ({ req: { user } }) =>
      user?.role === 'superadmin' || user?.role === 'admin',
    update: ({ req: { user } }) =>
      ['superadmin', 'admin', 'editor'].includes(user?.role || ''),
    delete: ({ req: { user } }) =>
      user?.role === 'superadmin' || user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Dienstplan-Titel',
    },
    {
      name: 'periodStart',
      type: 'date',
      required: true,
      label: 'Zeitraum Beginn',
    },
    {
      name: 'periodEnd',
      type: 'date',
      required: true,
      label: 'Zeitraum Ende',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Entwurf', value: 'draft' },
        { label: 'Zur Genehmigung', value: 'review' },
        { label: 'Genehmigt', value: 'approved' },
        { label: 'Veröffentlicht', value: 'published' },
        { label: 'Archiviert', value: 'archived' },
      ],
    },
    {
      name: 'shifts',
      type: 'array',
      label: 'Dienste',
      fields: [
        {
          name: 'staff',
          type: 'relationship',
          relationTo: 'staff',
          label: 'Mitarbeiter',
        },
        { name: 'date', type: 'date', label: 'Datum' },
        {
          name: 'shiftType',
          type: 'select',
          label: 'Dienstart',
          options: [
            { label: 'Frühdienst (06:00 - 14:00)', value: 'early' },
            { label: 'Spätdienst (14:00 - 22:00)', value: 'late' },
            { label: 'Nachtdienst (22:00 - 06:00)', value: 'night' },
            { label: 'Langer Dienst (07:00 - 19:00)', value: 'long' },
            { label: 'Sonderdienst', value: 'special' },
            { label: 'Frei', value: 'off' },
            { label: 'Urlaub', value: 'vacation' },
            { label: 'Krank', value: 'sick' },
          ],
        },
        { name: 'startTime', type: 'text', label: 'Beginn' },
        { name: 'endTime', type: 'text', label: 'Ende' },
        {
          name: 'assignedPatients',
          type: 'relationship',
          relationTo: 'patients',
          hasMany: true,
          label: 'Zugewiesene Patienten',
        },
        { name: 'notes', type: 'text', label: 'Notiz' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Allgemeine Anmerkungen',
    },
  ],
  timestamps: true,
}
