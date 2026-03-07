import type { AccessArgs, CollectionConfig } from 'payload'

const isAdminOrAbove = ({ req: { user } }: AccessArgs) =>
  user?.role === 'superadmin' || user?.role === 'admin'

export const Staff: CollectionConfig = {
  slug: 'staff',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'qualification', 'employmentType', 'status', 'updatedAt'],
    group: 'Personal',
  },
  access: {
    read: ({ req: { user } }) =>
      ['superadmin', 'admin', 'editor'].includes(user?.role || ''),
    create: isAdminOrAbove,
    update: isAdminOrAbove,
    delete: ({ req: { user } }) => user?.role === 'superadmin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Verknüpfter Account',
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Vollständiger Name',
    },
    {
      name: 'staffId',
      type: 'text',
      unique: true,
      label: 'Mitarbeiter-ID',
    },
    {
      name: 'qualification',
      type: 'select',
      label: 'Qualifikation',
      options: [
        { label: 'Examinierte Pflegefachkraft', value: 'nurse' },
        { label: 'Pflegeassistenz', value: 'assistant' },
        { label: 'Pflegehilfskraft', value: 'helper' },
        { label: 'Hauswirtschaftskraft', value: 'household' },
        { label: 'Verwaltung', value: 'admin' },
        { label: 'Pflegedienstleitung', value: 'director' },
      ],
    },
    {
      name: 'employmentType',
      type: 'select',
      label: 'Beschäftigungsart',
      options: [
        { label: 'Vollzeit', value: 'fulltime' },
        { label: 'Teilzeit', value: 'parttime' },
        { label: 'Minijob', value: 'minijob' },
        { label: 'Aushilfe', value: 'temp' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Krank', value: 'sick' },
        { label: 'Urlaub', value: 'vacation' },
        { label: 'Ausgeschieden', value: 'left' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Kontakt',
      fields: [
        { name: 'phone', type: 'text', label: 'Telefon' },
        { name: 'mobile', type: 'text', label: 'Mobil' },
        { name: 'email', type: 'email', label: 'E-Mail' },
      ],
    },
    {
      name: 'address',
      type: 'group',
      label: 'Adresse',
      fields: [
        { name: 'street', type: 'text', label: 'Straße' },
        { name: 'zip', type: 'text', label: 'PLZ' },
        { name: 'city', type: 'text', label: 'Stadt' },
      ],
    },
    {
      name: 'workingHours',
      type: 'number',
      label: 'Wochenstunden (Soll)',
    },
    {
      name: 'hireDate',
      type: 'date',
      label: 'Einstellungsdatum',
    },
    {
      name: 'certifications',
      type: 'array',
      label: 'Zertifikate & Weiterbildungen',
      fields: [
        { name: 'name', type: 'text', label: 'Bezeichnung' },
        { name: 'issuedDate', type: 'date', label: 'Ausgestellt am' },
        { name: 'expiryDate', type: 'date', label: 'Gültig bis' },
        { name: 'document', type: 'upload', relationTo: 'media', label: 'Dokument' },
      ],
    },
    {
      name: 'assignedPatients',
      type: 'relationship',
      relationTo: 'patients',
      hasMany: true,
      label: 'Zugewiesene Patienten',
    },
    {
      name: 'vehicle',
      type: 'group',
      label: 'Fahrzeug',
      fields: [
        { name: 'type', type: 'text', label: 'Fahrzeugtyp' },
        { name: 'licensePlate', type: 'text', label: 'Kennzeichen' },
        {
          name: 'coordinates',
          type: 'group',
          label: 'Aktuelle Position',
          fields: [
            { name: 'lat', type: 'number', label: 'Lat' },
            { name: 'lng', type: 'number', label: 'Lng' },
          ],
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Anmerkungen',
    },
  ],
  timestamps: true,
}
