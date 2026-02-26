import type { CollectionConfig } from 'payload'
import { isAdmin, isEditor } from '../access/roles'

export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: { singular: 'Mitarbeiter', plural: 'Mitarbeiter' },
  admin: { useAsTitle: 'lastName', group: 'Mitarbeiterverwaltung', defaultColumns: ['lastName','firstName','staffRole','isActive'] },
  access: { create: isAdmin, read: isEditor, update: isEditor, delete: isAdmin },
  fields: [
    { type: 'row', fields: [
      { name: 'firstName', type: 'text', label: 'Vorname',  required: true },
      { name: 'lastName',  type: 'text', label: 'Nachname', required: true },
    ]},
    { name: 'staffRole', type: 'select', label: 'Position', required: true,
      options: [
        {label:'Pflegefachkraft',value:'nurse'},
        {label:'Altenpfleger/in',value:'caregiver'},
        {label:'Pflegehelfer/in',value:'helper'},
        {label:'Pflegedienstleitung',value:'manager'},
        {label:'Verwaltung',value:'admin'},
      ] },
    { name: 'qualification', type: 'text', label: 'Qualifikation' },
    { name: 'contact', type: 'group', label: 'Kontakt', fields: [
      { name: 'phone',  type: 'text',  label: 'Telefon' },
      { name: 'mobile', type: 'text',  label: 'Mobil' },
      { name: 'email',  type: 'email', label: 'E-Mail' },
    ]},
    { name: 'employmentDetails', type: 'group', label: 'Anstellung', fields: [
      { name: 'type', type: 'select', label: 'Art',
        options: [{label:'Vollzeit',value:'fulltime'},{label:'Teilzeit',value:'parttime'},{label:'Minijob',value:'minijob'},{label:'Freelancer',value:'freelance'}] },
      { name: 'startDate',    type: 'date',   label: 'Einstellungsdatum' },
      { name: 'hoursPerWeek', type: 'number', label: 'Std./Woche' },
    ]},
    { name: 'photo',       type: 'upload',       label: 'Foto',              relationTo: 'media' },
    { name: 'userAccount', type: 'relationship',  label: 'Login-Account',     relationTo: 'users', unique: true },
    { name: 'isActive',    type: 'checkbox',      label: 'Aktiv',             defaultValue: true },
  ],
  timestamps: true,
}
