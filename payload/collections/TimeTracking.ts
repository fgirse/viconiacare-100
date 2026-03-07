import type { CollectionConfig } from 'payload'

export const TimeTracking: CollectionConfig = {
  slug: 'time-tracking',
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['staff', 'date', 'clockIn', 'clockOut', 'totalHours', 'status'],
    group: 'Personal',
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
      name: 'staff',
      type: 'relationship',
      relationTo: 'staff',
      required: true,
      label: 'Mitarbeiter',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Datum',
    },
    {
      name: 'clockIn',
      type: 'text',
      label: 'Beginn (HH:MM)',
    },
    {
      name: 'clockOut',
      type: 'text',
      label: 'Ende (HH:MM)',
    },
    {
      name: 'breakMinutes',
      type: 'number',
      label: 'Pausenzeit (Minuten)',
      defaultValue: 0,
    },
    {
      name: 'totalHours',
      type: 'number',
      label: 'Gesamtstunden',
    },
    {
      name: 'overtimeHours',
      type: 'number',
      label: 'Überstunden',
    },
    {
      name: 'type',
      type: 'select',
      label: 'Art der Arbeitszeit',
      defaultValue: 'regular',
      options: [
        { label: 'Regulär', value: 'regular' },
        { label: 'Überstunden', value: 'overtime' },
        { label: 'Bereitschaft', value: 'on_call' },
        { label: 'Nachtdienst', value: 'night' },
        { label: 'Wochenende', value: 'weekend' },
        { label: 'Feiertag', value: 'holiday' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'Ausstehend', value: 'pending' },
        { label: 'Genehmigt', value: 'approved' },
        { label: 'Abgelehnt', value: 'rejected' },
        { label: 'Abgerechnet', value: 'billed' },
      ],
    },
    {
      name: 'absenceType',
      type: 'select',
      label: 'Abwesenheitsart',
      options: [
        { label: 'Urlaub', value: 'vacation' },
        { label: 'Krank', value: 'sick' },
        { label: 'Fortbildung', value: 'training' },
        { label: 'Sonderurlaub', value: 'special_leave' },
        { label: 'Elternzeit', value: 'parental_leave' },
      ],
    },
    {
      name: 'location',
      type: 'group',
      label: 'Eincheckort',
      fields: [
        { name: 'lat', type: 'number', label: 'Breitengrad' },
        { name: 'lng', type: 'number', label: 'Längengrad' },
        { name: 'address', type: 'text', label: 'Adresse' },
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
