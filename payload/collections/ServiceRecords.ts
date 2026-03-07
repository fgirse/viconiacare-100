import type { CollectionConfig } from 'payload'

export const ServiceRecords: CollectionConfig = {
  slug: 'service-records',
  admin: {
    useAsTitle: 'serviceDate',
    defaultColumns: ['patient', 'staff', 'serviceDate', 'serviceType', 'status'],
    group: 'Leistungserfassung',
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
      required: true,
      label: 'Pflegekraft',
    },
    {
      name: 'serviceDate',
      type: 'date',
      required: true,
      label: 'Leistungsdatum',
    },
    {
      name: 'startTime',
      type: 'text',
      label: 'Beginn (HH:MM)',
    },
    {
      name: 'endTime',
      type: 'text',
      label: 'Ende (HH:MM)',
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Dauer (Minuten)',
    },
    {
      name: 'serviceType',
      type: 'select',
      label: 'Leistungsart',
      options: [
        { label: 'Grundpflege', value: 'basic_care' },
        { label: 'Behandlungspflege', value: 'treatment_care' },
        { label: 'Hauswirtschaft', value: 'housekeeping' },
        { label: 'Betreuungsleistung', value: 'supervision' },
        { label: 'Pflegeberatung', value: 'consulting' },
        { label: 'Nachtdienst', value: 'night_care' },
      ],
    },
    {
      name: 'performedServices',
      type: 'array',
      label: 'Erbrachte Leistungen',
      fields: [
        {
          name: 'service',
          type: 'select',
          label: 'Leistung',
          options: [
            { label: 'Ganzkörperwäsche', value: 'full_wash' },
            { label: 'Teilwäsche', value: 'partial_wash' },
            { label: 'Duschen', value: 'shower' },
            { label: 'Baden', value: 'bath' },
            { label: 'Mundpflege', value: 'oral_care' },
            { label: 'An-/Auskleiden', value: 'dressing' },
            { label: 'Medikamente verabreichen', value: 'medication' },
            { label: 'Wundversorgung', value: 'wound_care' },
            { label: 'Injektionen', value: 'injection' },
            { label: 'Blutdruck messen', value: 'blood_pressure' },
            { label: 'Blutzucker messen', value: 'blood_sugar' },
            { label: 'Mobilisation', value: 'mobilization' },
            { label: 'Kochen', value: 'cooking' },
            { label: 'Einkaufen', value: 'shopping' },
            { label: 'Reinigung', value: 'cleaning' },
          ],
        },
        { name: 'duration', type: 'number', label: 'Minuten' },
        { name: 'notes', type: 'text', label: 'Notiz' },
      ],
    },
    {
      name: 'vitalSigns',
      type: 'group',
      label: 'Vitalzeichen',
      fields: [
        { name: 'bloodPressureSys', type: 'number', label: 'Blutdruck systolisch' },
        { name: 'bloodPressureDia', type: 'number', label: 'Blutdruck diastolisch' },
        { name: 'pulse', type: 'number', label: 'Puls' },
        { name: 'temperature', type: 'number', label: 'Temperatur (°C)' },
        { name: 'bloodSugar', type: 'number', label: 'Blutzucker (mg/dL)' },
        { name: 'weight', type: 'number', label: 'Gewicht (kg)' },
        { name: 'oxygenSaturation', type: 'number', label: 'Sauerstoffsättigung (%)' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'completed',
      label: 'Status',
      options: [
        { label: 'Abgeschlossen', value: 'completed' },
        { label: 'Geplant', value: 'planned' },
        { label: 'Abgebrochen', value: 'cancelled' },
        { label: 'Kein Zutritt', value: 'no_access' },
      ],
    },
    {
      name: 'signature',
      type: 'text',
      label: 'Unterschrift (digital)',
    },
    {
      name: 'billable',
      type: 'checkbox',
      label: 'Abrechenbar',
      defaultValue: true,
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Dokumentation / Notizen',
    },
  ],
  timestamps: true,
}
