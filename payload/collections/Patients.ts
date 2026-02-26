import type { CollectionConfig } from 'payload'
import { isAdmin, isEditor, isAdminOrSelf } from '../access/roles.ts'

export const Patients: CollectionConfig = {
  slug: 'patients',
  labels: { singular: 'Patient', plural: 'Patienten' },
  admin: { useAsTitle: 'lastName', group: 'Patienten & Kunden', defaultColumns: ['lastName','firstName','careLevel','status'] },
  access: { create: isAdmin, read: isAdminOrSelf, update: isEditor, delete: isAdmin },
  fields: [
    { type: 'row', fields: [
      { name: 'firstName', type: 'text', label: 'Vorname',  required: true },
      { name: 'lastName',  type: 'text', label: 'Nachname', required: true },
    ]},
    { name: 'dateOfBirth', type: 'date', label: 'Geburtsdatum', required: true },
    { name: 'gender', type: 'select', label: 'Geschlecht',
      options: [{label:'Männlich',value:'male'},{label:'Weiblich',value:'female'},{label:'Divers',value:'diverse'}] },
    { name: 'careLevel', type: 'select', label: 'Pflegegrad',
      options: ['1','2','3','4','5','none'].map(v => ({ label: v === 'none' ? 'Noch nicht beantragt' : `Pflegegrad ${v}`, value: v })) },
    { name: 'contact', type: 'group', label: 'Kontakt', fields: [
      { name: 'phone',      type: 'text',  label: 'Telefon' },
      { name: 'mobile',     type: 'text',  label: 'Mobil' },
      { name: 'email',      type: 'email', label: 'E-Mail' },
      { name: 'street',     type: 'text',  label: 'Straße & Nr.' },
      { type: 'row', fields: [
        { name: 'postalCode', type: 'text', label: 'PLZ' },
        { name: 'city',       type: 'text', label: 'Stadt' },
      ]},
    ]},
    { name: 'emergencyContact', type: 'group', label: 'Notfallkontakt', fields: [
      { name: 'name',         type: 'text', label: 'Name' },
      { name: 'relationship', type: 'text', label: 'Beziehung' },
      { name: 'phone',        type: 'text', label: 'Telefon' },
    ]},
    { name: 'insuranceInfo', type: 'group', label: 'Krankenversicherung', fields: [
      { name: 'provider',  type: 'text',     label: 'Krankenkasse' },
      { name: 'memberNr',  type: 'text',     label: 'Versichertennr.' },
      { name: 'isPrivate', type: 'checkbox', label: 'Privatpatient', defaultValue: false },
    ]},
    { name: 'userAccount', type: 'relationship', label: 'Login-Account', relationTo: 'users', unique: true },
    { name: 'status', type: 'select', label: 'Status', defaultValue: 'inquiry',
      options: [
        {label:'📋 Anfrage',      value:'inquiry'},
        {label:'📅 Evaluation',   value:'evaluation'},
        {label:'✅ Aktiv',         value:'active'},
        {label:'⏸️ Pausiert',     value:'paused'},
        {label:'❌ Inaktiv',      value:'inactive'},
      ] },
    { name: 'notes', type: 'textarea', label: 'Interne Notizen' },
  ],
  timestamps: true,
}
