import { Service, ServicesResponse } from '@/src/types/service'

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL ?? 'http://localhost:3001'

export async function getActiveServices(): Promise<Service[]> {
  const res = await fetch(
    `${PAYLOAD_API_URL}/api/services?where[active][equals]=true&sort=order&limit=12`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`)

  const data: ServicesResponse = await res.json()
  return data.docs
}

/** Fallback seed data – used when Payload is unreachable */
export const seedServices: Service[] = [
  {
    id: '1',
    title: 'Körperpflege & Hygiene',
    category: 'grundpflege',
    icon: 'heart-handshake',
    shortDescription:
      'Einfühlsame Unterstützung bei der täglichen Körperpflege, Waschen, Ankleiden und Mobilisation.',
    highlights: [
      { point: 'Ganzkörperwäsche & Teilwäsche' },
      { point: 'Mund- & Zahnpflege' },
      { point: 'An- und Auskleiden' },
      { point: 'Lagerung & Transfer' },
    ],
    kassenleistung: true,
    order: 1,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    title: 'Medizinische Behandlungspflege',
    category: 'behandlungspflege',
    icon: 'syringe',
    shortDescription:
      'Professionelle Wundversorgung, Injektionen und Medikamentengabe durch examinierte Pflegefachkräfte.',
    highlights: [
      { point: 'Wundversorgung & Verbandswechsel' },
      { point: 'Subkutane Injektionen' },
      { point: 'Medikamentengabe & Kontrolle' },
      { point: 'Blutdruckmessung & Monitoring' },
    ],
    kassenleistung: true,
    order: 2,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    title: 'Hauswirtschaftliche Versorgung',
    category: 'hauswirtschaft',
    icon: 'home',
    shortDescription:
      'Reinigung, Wäschepflege, Einkauf und Mahlzeiten – damit Sie sich in Ihrem Zuhause wohlfühlen.',
    highlights: [
      { point: 'Reinigung & Ordnung' },
      { point: 'Kochen & Mahlzeitenzubereitung' },
      { point: 'Einkaufsservice' },
      { point: 'Wäsche waschen & Bügeln' },
    ],
    kassenleistung: false,
    order: 3,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    title: 'Demenzbetreuung',
    category: 'demenz',
    icon: 'brain',
    shortDescription:
      'Speziell geschulte Betreuung für Menschen mit Demenz – orientierend, aktivierend, verständnisvoll.',
    highlights: [
      { point: 'Biographieorientierte Betreuung' },
      { point: 'Gedächtnistraining & Aktivierung' },
      { point: 'Sicherheit im Alltag' },
      { point: 'Entlastung pflegender Angehöriger' },
    ],
    kassenleistung: true,
    order: 4,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '5',
    title: 'Palliativpflege & Sterbebegleitung',
    category: 'palliativ',
    icon: 'dove',
    shortDescription:
      'Würdevolle Begleitung in der letzten Lebensphase – für Patienten und ihre Familien.',
    highlights: [
      { point: 'Schmerzmanagement' },
      { point: 'Emotionale Begleitung' },
      { point: 'Koordination mit Ärzten & Hospiz' },
      { point: 'Trauerbegleitung für Angehörige' },
    ],
    kassenleistung: true,
    order: 5,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '6',
    title: 'Verhinderungspflege',
    category: 'verhinderung',
    icon: 'refresh',
    shortDescription:
      'Übernahme der Pflege, wenn Ihre reguläre Pflegeperson verhindert oder im Urlaub ist.',
    highlights: [
      { point: 'Bis zu 1.612 € jährlich über Pflegekasse' },
      { point: 'Kurzfristige Einsätze möglich' },
      { point: 'Nahtloser Übergang' },
      { point: 'Gewohnte Routinen werden fortgeführt' },
    ],
    kassenleistung: true,
    order: 6,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '7',
    title: 'Beratung & Soziale Begleitung',
    category: 'beratung',
    icon: 'message-circle',
    shortDescription:
      'Pflegeberatung nach § 37.3 SGB XI, Hilfe bei Anträgen und Alltagsbegleitung.',
    highlights: [
      { point: 'Pflegeberatungsbesuche' },
      { point: 'Antragsunterstützung Pflegekasse' },
      { point: 'Alltagsbegleitung & Gespräche' },
      { point: 'Koordination mit Behörden' },
    ],
    kassenleistung: true,
    order: 7,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '8',
    title: 'Nacht- & Bereitschaftspflege',
    category: 'nacht',
    icon: 'moon',
    shortDescription:
      'Pflegepräsenz in der Nacht für Sicherheit und Ruhe – für Pflegebedürftige und Angehörige.',
    highlights: [
      { point: 'Nächtliche Lagerung' },
      { point: 'Toilettenbegleitung & Inkontinenzversorgung' },
      { point: 'Notfallbereitschaft' },
      { point: 'Schlafüberwachung bei Bedarf' },
    ],
    kassenleistung: false,
    order: 8,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
]
