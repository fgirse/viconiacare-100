import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: { group: 'Globals' },
  access: { read: () => true, update: isAdmin },
  fields: [
    { name: 'mainNav', type: 'array', label: 'Hauptnavigation', fields: [
      { name: 'label',      type: 'text',     label: 'Bezeichnung', localized: true, required: true },
      { name: 'href',       type: 'text',     label: 'Link',        required: true },
      { name: 'isExternal', type: 'checkbox', label: 'Extern',      defaultValue: false },
    ]},
    { name: 'footerNav', type: 'array', label: 'Footer', fields: [
      { name: 'label', type: 'text', label: 'Bezeichnung', localized: true, required: true },
      { name: 'href',  type: 'text', label: 'Link',        required: true },
    ]},
  ],
}
