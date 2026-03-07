import type { AccessArgs, CollectionConfig } from 'payload'

const isStaffOrAbove = ({ req: { user } }: AccessArgs) =>
  ['superadmin', 'admin', 'editor'].includes(user?.role)

export const Patients: CollectionConfig = {
  slug: 'patients',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'dateOfBirth', 'careLevel', 'status', 'updatedAt'],
    group: 'Patienten & Kunden',
  },
  access: {
    read: isStaffOrAbove,
    create: isStaffOrAbove,
    update: isStaffOrAbove,
    delete: ({ req: { user } }) => user?.role === 'superadmin' || user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Verknüpfter Nutzer-Account',
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Vollständiger Name',
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      label: 'Geburtsdatum',
    },
    {
      name: 'gender',
      type: 'select',
      label: 'Geschlecht',
      options: [
        { label: 'Männlich', value: 'male' },
        { label: 'Weiblich', value: 'female' },
        { label: 'Divers', value: 'diverse' },
      ],
    },
    {
      name: 'careLevel',
      type: 'select',
      label: 'Pflegegrad',
      options: [
        { label: 'Pflegegrad 1', value: '1' },
        { label: 'Pflegegrad 2', value: '2' },
        { label: 'Pflegegrad 3', value: '3' },
        { label: 'Pflegegrad 4', value: '4' },
        { label: 'Pflegegrad 5', value: '5' },
        { label: 'Noch nicht eingestuft', value: 'pending' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Inaktiv', value: 'inactive' },
        { label: 'Interessent', value: 'prospect' },
        { label: 'Entlassen', value: 'discharged' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Kontaktdaten',
      fields: [
        { name: 'phone', type: 'text', label: 'Telefon' },
        { name: 'mobile', type: 'text', label: 'Mobil' },
        { name: 'email', type: 'email', label: 'E-Mail' },
        { name: 'street', type: 'text', label: 'Straße und Nr.' },
        { name: 'zip', type: 'text', label: 'PLZ' },
        { name: 'city', type: 'text', label: 'Stadt' },
        {
          name: 'coordinates',
          type: 'group',
          label: 'GPS-Koordinaten',
          fields: [
            { name: 'lat', type: 'number', label: 'Breitengrad' },
            { name: 'lng', type: 'number', label: 'Längengrad' },
          ],
        },
      ],
    },
    {
      name: 'emergencyContact',
      type: 'group',
      label: 'Notfallkontakt',
      fields: [
        { name: 'name', type: 'text', label: 'Name' },
        { name: 'relation', type: 'text', label: 'Beziehung' },
        { name: 'phone', type: 'text', label: 'Telefon' },
      ],
    },
    {
      name: 'insurance',
      type: 'group',
      label: 'Versicherung',
      fields: [
        { name: 'provider', type: 'text', label: 'Krankenkasse' },
        { name: 'insuranceNumber', type: 'text', label: 'Versicherungsnummer' },
        { name: 'type', type: 'select', label: 'Versicherungsart', options: [
          { label: 'Gesetzlich', value: 'statutory' },
          { label: 'Privat', value: 'private' },
          { label: 'Beihilfe', value: 'civil_service' },
        ]},
      ],
    },
    {
      name: 'medicalInfo',
      type: 'group',
      label: 'Medizinische Informationen',
      fields: [
        { name: 'diagnoses', type: 'textarea', label: 'Diagnosen' },
        { name: 'medications', type: 'textarea', label: 'Medikamente' },
        { name: 'allergies', type: 'textarea', label: 'Allergien / Unverträglichkeiten' },
        { name: 'physician', type: 'text', label: 'Behandelnder Arzt' },
      ],
    },
    {
      name: 'notes',
      type: 'richText',
      label: 'Notizen',
    },
    {
      name: 'admissionDate',
      type: 'date',
      label: 'Aufnahmedatum',
    },
  ],
  timestamps: true,
}
