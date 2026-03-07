import type { CollectionConfig } from 'payload'

export const Routes: CollectionConfig = {
  slug: 'routes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'staff', 'date', 'status', 'totalDistance'],
    group: 'Routenplanung',
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
      label: 'Routenbezeichnung',
    },
    {
      name: 'staff',
      type: 'relationship',
      relationTo: 'staff',
      required: true,
      label: 'Zugewiesene Pflegekraft',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Datum',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'planned',
      label: 'Status',
      options: [
        { label: 'Geplant', value: 'planned' },
        { label: 'Aktiv', value: 'active' },
        { label: 'Abgeschlossen', value: 'completed' },
        { label: 'Abgebrochen', value: 'cancelled' },
      ],
    },
    {
      name: 'startLocation',
      type: 'group',
      label: 'Startpunkt',
      fields: [
        { name: 'address', type: 'text', label: 'Adresse' },
        { name: 'lat', type: 'number', label: 'Breitengrad' },
        { name: 'lng', type: 'number', label: 'Längengrad' },
        { name: 'time', type: 'text', label: 'Startzeit (HH:MM)' },
      ],
    },
    {
      name: 'stops',
      type: 'array',
      label: 'Stationen',
      fields: [
        {
          name: 'patient',
          type: 'relationship',
          relationTo: 'patients',
          label: 'Patient',
        },
        {
          name: 'serviceRecord',
          type: 'relationship',
          relationTo: 'service-records',
          label: 'Leistungsnachweis',
        },
        { name: 'address', type: 'text', label: 'Adresse' },
        { name: 'lat', type: 'number', label: 'Breitengrad' },
        { name: 'lng', type: 'number', label: 'Längengrad' },
        { name: 'plannedArrival', type: 'text', label: 'Geplante Ankunft (HH:MM)' },
        { name: 'actualArrival', type: 'text', label: 'Tatsächliche Ankunft (HH:MM)' },
        { name: 'plannedDuration', type: 'number', label: 'Geplante Dauer (Min)' },
        { name: 'actualDuration', type: 'number', label: 'Tatsächliche Dauer (Min)' },
        {
          name: 'visitStatus',
          type: 'select',
          label: 'Besuchsstatus',
          options: [
            { label: 'Ausstehend', value: 'pending' },
            { label: 'Unterwegs', value: 'en_route' },
            { label: 'Angekommen', value: 'arrived' },
            { label: 'Abgeschlossen', value: 'completed' },
            { label: 'Übersprungen', value: 'skipped' },
            { label: 'Kein Zutritt', value: 'no_access' },
          ],
        },
        { name: 'notes', type: 'text', label: 'Notiz' },
        { name: 'order', type: 'number', label: 'Reihenfolge' },
      ],
    },
    {
      name: 'endLocation',
      type: 'group',
      label: 'Endpunkt',
      fields: [
        { name: 'address', type: 'text', label: 'Adresse' },
        { name: 'lat', type: 'number', label: 'Breitengrad' },
        { name: 'lng', type: 'number', label: 'Längengrad' },
      ],
    },
    {
      name: 'totalDistance',
      type: 'number',
      label: 'Gesamtdistanz (km)',
    },
    {
      name: 'estimatedDuration',
      type: 'number',
      label: 'Geschätzte Dauer (Min)',
    },
    {
      name: 'optimized',
      type: 'checkbox',
      label: 'Route optimiert',
      defaultValue: false,
    },
    {
      name: 'mapData',
      type: 'textarea',
      label: 'Kartendaten (JSON)',
      admin: {
        description: 'GeoJSON oder encoded polyline für die Kartenanzeige',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
    },
  ],
  timestamps: true,
}
