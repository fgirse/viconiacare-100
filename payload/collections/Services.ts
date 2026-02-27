import { CollectionConfig } from 'payload'

const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Leistung',
    plural: 'Leistungen',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order', 'active'],
    group: 'Pflegeangebote',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Leistungsbezeichnung',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      label: 'Pflegebereich',
      type: 'select',
      required: true,
      options: [
        { label: 'Grundpflege', value: 'grundpflege' },
        { label: 'Behandlungspflege', value: 'behandlungspflege' },
        { label: 'Hauswirtschaft', value: 'hauswirtschaft' },
        { label: 'Demenzbetreuung', value: 'demenz' },
        { label: 'Palliativpflege', value: 'palliativ' },
        { label: 'Verhinderungspflege', value: 'verhinderung' },
        { label: 'Beratung & Soziales', value: 'beratung' },
        { label: 'Nachtpflege', value: 'nacht' },
      ],
    },
    {
      name: 'icon',
      label: 'Icon-Schlüssel',
      type: 'select',
      required: true,
      admin: {
        description: 'Symbolisches Icon für die Karte',
      },
      options: [
        { label: '🫶 Grundpflege (Herz)', value: 'heart-handshake' },
        { label: '💉 Behandlungspflege (Spritze)', value: 'syringe' },
        { label: '🏠 Hauswirtschaft (Haus)', value: 'home' },
        { label: '🧠 Demenz (Gehirn)', value: 'brain' },
        { label: '🕊 Palliativ (Taube)', value: 'dove' },
        { label: '🔄 Verhinderung (Wechsel)', value: 'refresh' },
        { label: '💬 Beratung (Sprechblase)', value: 'message-circle' },
        { label: '🌙 Nachtpflege (Mond)', value: 'moon' },
      ],
    },
    {
      name: 'shortDescription',
      label: 'Kurzbeschreibung',
      type: 'text',
      required: true,
      admin: {
        description: 'Maximal 120 Zeichen, erscheint auf der Karte',
      },
    },
    {
      name: 'description',
      label: 'Ausführliche Beschreibung',
      type: 'richText',
    },
    {
      name: 'highlights',
      label: 'Leistungsmerkmale',
      type: 'array',
      admin: {
        description: 'Stichpunkte, die auf der Karte erscheinen',
      },
      fields: [
        {
          name: 'point',
          label: 'Merkmal',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'kassenleistung',
      label: 'Kassenleistung',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Wird von der Pflegekasse übernommen',
      },
    },
    {
      name: 'order',
      label: 'Reihenfolge',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Niedrigere Zahl = früher angezeigt',
      },
    },
    {
      name: 'active',
      label: 'Aktiv',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export default Services
