import type { CollectionConfig } from 'payload'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
    defaultColumns: ['invoiceNumber', 'patient', 'amount', 'status', 'dueDate'],
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
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Rechnungsnummer',
    },
    {
      name: 'patient',
      type: 'relationship',
      relationTo: 'patients',
      required: true,
      label: 'Patient / Kunde',
    },
    {
      name: 'billingPeriod',
      type: 'group',
      label: 'Abrechnungszeitraum',
      fields: [
        { name: 'from', type: 'date', label: 'Von' },
        { name: 'to', type: 'date', label: 'Bis' },
      ],
    },
    {
      name: 'serviceRecords',
      type: 'relationship',
      relationTo: 'service-records',
      hasMany: true,
      label: 'Leistungsnachweise',
    },
    {
      name: 'lineItems',
      type: 'array',
      label: 'Rechnungspositionen',
      fields: [
        { name: 'description', type: 'text', label: 'Beschreibung' },
        { name: 'quantity', type: 'number', label: 'Menge' },
        { name: 'unit', type: 'text', label: 'Einheit' },
        { name: 'unitPrice', type: 'number', label: 'Einzelpreis (€)' },
        { name: 'totalPrice', type: 'number', label: 'Gesamtpreis (€)' },
        {
          name: 'taxRate',
          type: 'select',
          label: 'Steuersatz',
          options: [
            { label: '0% (steuerfrei)', value: '0' },
            { label: '7%', value: '7' },
            { label: '19%', value: '19' },
          ],
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      label: 'Zwischensumme (€)',
    },
    {
      name: 'taxAmount',
      type: 'number',
      label: 'Steuerbetrag (€)',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Gesamtbetrag (€)',
    },
    {
      name: 'insurancePart',
      type: 'number',
      label: 'Anteil Krankenkasse (€)',
    },
    {
      name: 'patientPart',
      type: 'number',
      label: 'Anteil Patient (€)',
    },
    {
      name: 'invoiceDate',
      type: 'date',
      label: 'Rechnungsdatum',
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
        { label: 'Versendet', value: 'sent' },
        { label: 'Bezahlt', value: 'paid' },
        { label: 'Teilbezahlt', value: 'partial' },
        { label: 'Überfällig', value: 'overdue' },
        { label: 'Storniert', value: 'cancelled' },
        { label: 'Abgerechnet (Kasse)', value: 'insurance_billed' },
      ],
    },
    {
      name: 'paymentDate',
      type: 'date',
      label: 'Zahlungseingang',
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Zahlungsart',
      options: [
        { label: 'Überweisung', value: 'transfer' },
        { label: 'Lastschrift', value: 'direct_debit' },
        { label: 'Bar', value: 'cash' },
        { label: 'Krankenkasse', value: 'insurance' },
      ],
    },
    {
      name: 'pdfDocument',
      type: 'upload',
      relationTo: 'media',
      label: 'Rechnungs-PDF',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
    },
  ],
  timestamps: true,
}
