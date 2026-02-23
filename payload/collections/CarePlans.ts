import type { CollectionConfig } from 'payload'
import { isEditor, readOwnCarePlan } from '../access/roles'

export const CarePlans: CollectionConfig = {
  slug: 'care-plans',
  labels: { singular: 'Pflegeplan', plural: 'Pflegepläne' },
  admin: { useAsTitle: 'title', group: 'Pflegeplanung' },
  access: { create: isEditor, read: readOwnCarePlan, update: isEditor, delete: isEditor },
  fields: [
    { name: 'title',   type: 'text',         label: 'Planbezeichnung', required: true },
    { name: 'patient', type: 'relationship', label: 'Patient',        relationTo: 'patients', required: true },
    { name: 'assignedStaff', type: 'relationship', label: 'Pflegekräfte', relationTo: 'staff', hasMany: true },
    { name: 'goals', type: 'array', label: 'Pflegeziele', fields: [
      { name: 'goal',      type: 'text',     label: 'Pflegeziel', required: true },
      { name: 'measure',   type: 'textarea', label: 'Maßnahmen' },
      { name: 'interval',  type: 'select',   label: 'Häufigkeit',
        options: [{label:'Täglich',value:'daily'},{label:'Mehrmals tägl.',value:'multiple-daily'},{label:'Wöchentlich',value:'weekly'},{label:'Bei Bedarf',value:'as-needed'}] },
      { name: 'completed', type: 'checkbox', label: 'Erreicht', defaultValue: false },
    ]},
    { name: 'medications', type: 'array', label: 'Medikation', fields: [
      { name: 'name',   type: 'text',     label: 'Medikament', required: true },
      { name: 'dosage', type: 'text',     label: 'Dosierung' },
      { name: 'time',   type: 'text',     label: 'Einnahmezeit' },
      { name: 'notes',  type: 'textarea', label: 'Hinweise' },
    ]},
    { name: 'progressNotes', type: 'array', label: 'Verlaufsberichte', fields: [
      { name: 'date',      type: 'date',         label: 'Datum',       required: true },
      { name: 'note',      type: 'richText',      label: 'Bericht' },
      { name: 'writtenBy', type: 'relationship', label: 'Verfasst von', relationTo: 'users' },
    ]},
    { name: 'status', type: 'select', label: 'Status', defaultValue: 'active',
      options: [{label:'✅ Aktiv',value:'active'},{label:'⏸️ Pausiert',value:'paused'},{label:'✔️ Abgeschlossen',value:'completed'}] },
    { name: 'validFrom',  type: 'date', label: 'Gültig ab',  required: true },
    { name: 'validUntil', type: 'date', label: 'Gültig bis' },
  ],
  timestamps: true,
}
