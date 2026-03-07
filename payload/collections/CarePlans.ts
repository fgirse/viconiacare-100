import type { CollectionConfig } from 'payload'

export const CarePlans: CollectionConfig = {
  slug: 'care-plans',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'patient', 'status', 'reviewDate', 'updatedAt'],
    group: 'Pflegemanagement',
  },
  access: {
    read: ({ req: { user } }) =>
      ['superadmin', 'admin', 'editor'].includes(user?.role || ''),
    create: ({ req: { user } }) =>
      ['superadmin', 'admin', 'editor'].includes(user?.role || ''),
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
      label: 'Titel des Pflegeplans',
    },
    {
      name: 'patient',
      type: 'relationship',
      relationTo: 'patients',
      required: true,
      label: 'Patient',
    },
    {
      name: 'assignedStaff',
      type: 'relationship',
      relationTo: 'staff',
      hasMany: true,
      label: 'Zuständige Pflegekräfte',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Entwurf', value: 'draft' },
        { label: 'Überprüfung fällig', value: 'review' },
        { label: 'Archiviert', value: 'archived' },
      ],
    },
    {
      name: 'careGoals',
      type: 'richText',
      label: 'Pflegeziele',
    },
    {
      name: 'problems',
      type: 'array',
      label: 'Pflegeprobleme',
      fields: [
        { name: 'problem', type: 'text', label: 'Problem' },
        { name: 'goal', type: 'text', label: 'Ziel' },
        { name: 'measures', type: 'textarea', label: 'Maßnahmen' },
        { name: 'evaluation', type: 'textarea', label: 'Evaluation' },
        {
          name: 'priority',
          type: 'select',
          label: 'Priorität',
          options: [
            { label: 'Hoch', value: 'high' },
            { label: 'Mittel', value: 'medium' },
            { label: 'Niedrig', value: 'low' },
          ],
        },
      ],
    },
    {
      name: 'activities',
      type: 'array',
      label: 'Pflegeaktivitäten',
      fields: [
        { name: 'activity', type: 'text', label: 'Aktivität' },
        { name: 'frequency', type: 'text', label: 'Häufigkeit' },
        { name: 'time', type: 'text', label: 'Uhrzeit' },
        { name: 'responsible', type: 'text', label: 'Verantwortlich' },
        {
          name: 'category',
          type: 'select',
          label: 'Kategorie',
          options: [
            { label: 'Körperpflege', value: 'hygiene' },
            { label: 'Medikamentengabe', value: 'medication' },
            { label: 'Wundversorgung', value: 'wound' },
            { label: 'Mobilisation', value: 'mobility' },
            { label: 'Ernährung', value: 'nutrition' },
            { label: 'Soziale Betreuung', value: 'social' },
          ],
        },
      ],
    },
    {
      name: 'vitalParameters',
      type: 'group',
      label: 'Vitalparameter (Zielwerte)',
      fields: [
        { name: 'bloodPressure', type: 'text', label: 'Blutdruck' },
        { name: 'pulse', type: 'text', label: 'Puls' },
        { name: 'bloodSugar', type: 'text', label: 'Blutzucker' },
        { name: 'temperature', type: 'text', label: 'Körpertemperatur' },
      ],
    },
    {
      name: 'createdDate',
      type: 'date',
      label: 'Erstellungsdatum',
    },
    {
      name: 'reviewDate',
      type: 'date',
      label: 'Nächste Überprüfung',
    },
    {
      name: 'notes',
      type: 'richText',
      label: 'Zusätzliche Notizen',
    },
  ],
  timestamps: true,
}
