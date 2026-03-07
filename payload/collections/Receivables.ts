import type { CollectionConfig } from 'payload'

export const Receivables: CollectionConfig = {
  slug: 'receivables',
  admin: {
    useAsTitle: 'referenceNumber',
    defaultColumns: ['referenceNumber', 'patient', 'amount', 'status', 'dueDate'],
    group: 'Fakturierung',
  },
  access: {
    read: ({ req: { user } }) =>
      user?.role === 'superadmin' || user?.role === 'admin',
    create: ({ req: { user } }) =>
      user?.role === 'superadmin' || user?.role === 'admin',
    update: ({ req: { user } }) =>
      user?.role === 'superadmin' || user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'superadmin',
  },
  fields: [
    {
      name: 'referenceNumber',
      type: 'text',
      required: true,
      label: 'Aktenzeichen',
    },
    {
      name: 'invoice',
      type: 'relationship',
      relationTo: 'invoices',
      label: 'Ursprungsrechnung',
    },
    {
      name: 'patient',
      type: 'relationship',
      relationTo: 'patients',
      required: true,
      label: 'Patient',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Forderungsbetrag (€)',
    },
    {
      name: 'outstandingAmount',
      type: 'number',
      label: 'Offener Betrag (€)',
    },
    {
      name: 'dueDate',
      type: 'date',
      label: 'Fälligkeitsdatum',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      label: 'Status',
      options: [
        { label: 'Offen', value: 'open' },
        { label: 'Mahnung 1', value: 'reminder_1' },
        { label: 'Mahnung 2', value: 'reminder_2' },
        { label: 'Letzte Mahnung', value: 'final_reminder' },
        { label: 'Inkasso', value: 'collections' },
        { label: 'Klage', value: 'lawsuit' },
        { label: 'Beglichen', value: 'settled' },
        { label: 'Abgeschrieben', value: 'written_off' },
      ],
    },
    {
      name: 'reminders',
      type: 'array',
      label: 'Mahnungen',
      fields: [
        { name: 'sentDate', type: 'date', label: 'Versendet am' },
        { name: 'dueDate', type: 'date', label: 'Fällig bis' },
        {
          name: 'type',
          type: 'select',
          label: 'Art',
          options: [
            { label: '1. Mahnung', value: '1' },
            { label: '2. Mahnung', value: '2' },
            { label: 'Letzte Mahnung', value: 'final' },
          ],
        },
        { name: 'fee', type: 'number', label: 'Mahngebühr (€)' },
      ],
    },
    {
      name: 'payments',
      type: 'array',
      label: 'Zahlungseingänge',
      fields: [
        { name: 'date', type: 'date', label: 'Datum' },
        { name: 'amount', type: 'number', label: 'Betrag (€)' },
        { name: 'method', type: 'text', label: 'Zahlungsart' },
        { name: 'notes', type: 'text', label: 'Notiz' },
      ],
    },
    {
      name: 'notes',
      type: 'richText',
      label: 'Aktennotizen',
    },
  ],
  timestamps: true,
}
