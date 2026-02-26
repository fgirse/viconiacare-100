import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Website-Einstellungen',
  admin: { group: 'Einstellungen' },
  access: { read: () => true, update: isAdmin },
  fields: [
    { name: 'siteName', type: 'text',   label: 'Firmenname', defaultValue: 'PflegePlus' },
    { name: 'logo',     type: 'upload', label: 'Logo',       relationTo: 'media' },
    { name: 'contact',  type: 'group',  label: 'Kontakt', fields: [
      { name: 'phone',   type: 'text',     label: 'Telefon' },
      { name: 'email',   type: 'email',    label: 'E-Mail' },
      { name: 'address', type: 'textarea', label: 'Adresse' },
    ]},
    { name: 'cal', type: 'group', label: 'Cal.com', fields: [
      { name: 'username',   type: 'text', label: 'Benutzername' },
      { name: 'eventInfo',  type: 'text', label: 'Slug: Info-Telefonat' },
      { name: 'eventEval',  type: 'text', label: 'Slug: Bedarfsanalyse' },
      { name: 'eventVisit', type: 'text', label: 'Slug: Hausbesuch' },
    ]},
  ],
}
