import type { CollectionConfig } from 'payload'

export const CareSchedules: CollectionConfig = {
  slug: 'care-schedules',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'patient', 'staff', 'scheduledDate', 'status'],
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
      label: 'Titel',
    },
    {
      name: 'patient',
      type: 'relationship',
      relationTo: 'patients',
      required: true,
      label: 'Patient',
    },
    {
      name: 'staff',
      type: 'relationship',
      relationTo: 'staff',
      label: 'Pflegekraft',
    },
    {
      name: 'carePlan',
      type: 'relationship',
      relationTo: 'care-plans',
      label: 'Bezug Pflegeplan',
    },
    {
      name: 'scheduledDate',
      type: 'date',
      required: true,
      label: 'Geplantes Datum',
    },
    {
      name: 'scheduledTime',
      type: 'text',
      label: 'Geplante Uhrzeit (HH:MM)',
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Dauer (Minuten)',
    },
    {
      name: 'recurrence',
      type: 'select',
      label: 'Wiederholung',
      defaultValue: 'none',
      options: [
        { label: 'Keine', value: 'none' },
        { label: 'Täglich', value: 'daily' },
        { label: 'Wöchentlich', value: 'weekly' },
        { label: 'Zweiwöchentlich', value: 'biweekly' },
        { label: 'Monatlich', value: 'monthly' },
      ],
    },
    {
      name: 'services',
      type: 'select',
      hasMany: true,
      label: 'Geplante Leistungen',
      options: [
        { label: 'Körperpflege', value: 'hygiene' },
        { label: 'Medikamentengabe', value: 'medication' },
        { label: 'Wundversorgung', value: 'wound' },
        { label: 'Mobilisation', value: 'mobility' },
        { label: 'Hauswirtschaft', value: 'housekeeping' },
        { label: 'Ernährung', value: 'nutrition' },
        { label: 'Soziale Betreuung', value: 'social' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'scheduled',
      label: 'Status',
      options: [
        { label: 'Geplant', value: 'scheduled' },
        { label: 'Bestätigt', value: 'confirmed' },
        { label: 'In Bearbeitung', value: 'in_progress' },
        { label: 'Abgeschlossen', value: 'completed' },
        { label: 'Storniert', value: 'cancelled' },
        { label: 'Verschoben', value: 'rescheduled' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      label: 'Priorität',
      options: [
        { label: 'Hoch', value: 'high' },
        { label: 'Normal', value: 'normal' },
        { label: 'Niedrig', value: 'low' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
    },
  ],
  timestamps: true,
}
