import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access/roles'

// ─── Reusable helper: simple nav item fields (label + link + openInNewTab) ───
const simpleNavItemFields = [
  {
    name: 'label',
    type: 'text' as const,
    required: true,
    localized: true,
    label: {
      de: 'Bezeichnung',
      en: 'Label',
      es: 'Etiqueta',
      fr: 'Libelle',
      it: 'Etichetta',
      pt: 'Rotulo',
      tr: 'Etiket',
      ru: 'Название',
      uk: 'Назва',
    },
  },
  {
    name: 'link',
    type: 'text' as const,
    required: true,
    label: {
      de: 'Link',
      en: 'Link',
      es: 'Enlace',
      fr: 'Lien',
      it: 'Collegamento',
      pt: 'Link',
      tr: 'Baglanti',
      ru: 'Ссылка',
      uk: 'Посилання',
    },
    admin: {
      placeholder: 'https://example.com oder /seite',
    },
  },
  {
    name: 'openInNewTab',
    type: 'checkbox' as const,
    defaultValue: false,
    label: {
      de: 'In neuem Tab oeffnen',
      en: 'Open in new tab',
      es: 'Abrir en nueva pestana',
      fr: 'Ouvrir dans un nouvel onglet',
      it: 'Apri in una nuova scheda',
      pt: 'Abrir em nova aba',
      tr: 'Yeni sekmede ac',
      ru: 'Открыть в новой вкладке',
      uk: 'Відкрити в новій вкладці',
    },
  },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: {
    de: 'Navigation',
    en: 'Navigation',
    es: 'Navegacion',
    fr: 'Navigation',
    it: 'Navigazione',
    pt: 'Navegacao',
    tr: 'Navigasyon',
    ru: 'Навигация',
    uk: 'Навігація',
  },
  admin: {
    group: {
      de: 'Globale Einstellungen',
      en: 'Global Settings',
      es: 'Configuracion global',
      fr: 'Parametres globaux',
      it: 'Impostazioni globali',
      pt: 'Configuracoes globais',
      tr: 'Genel Ayarlar',
      ru: 'Глобальные настройки',
      uk: 'Глобальні налаштування',
    },
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    // ─────────────────────────────────────────────────────────────────────────
    // TABS: A. Hauptnavigation  |  B. Footer Navigation
    // ─────────────────────────────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ════════════════════════════════════════════════════════════════════
        // A. HAUPTNAVIGATION  (existing structure preserved)
        // ════════════════════════════════════════════════════════════════════
        {
          label: {
            de: 'A. Hauptnavigation',
            en: 'A. Main Navigation',
            es: 'A. Navegacion principal',
            fr: 'A. Navigation principale',
            it: 'A. Navigazione principale',
            pt: 'A. Navegacao principal',
            tr: 'A. Ana Navigasyon',
            ru: 'A. Основная навигация',
            uk: 'A. Головна навігація',
          },
          fields: [
            {
              name: 'items',
              type: 'array',
              label: {
                de: 'Navigationspunkte',
                en: 'Navigation Items',
                es: 'Elementos de navegacion',
                fr: 'Elements de navigation',
                it: 'Elementi di navigazione',
                pt: 'Itens de navegacao',
                tr: 'Navigasyon Ogeleri',
                ru: 'Элементы навигации',
                uk: 'Елементи навігації',
              },
              maxRows: 10,
              labels: {
                singular: {
                  de: 'Navigationspunkt',
                  en: 'Navigation Item',
                  es: 'Elemento de navegacion',
                  fr: 'Element de navigation',
                  it: 'Elemento di navigazione',
                  pt: 'Item de navegacao',
                  tr: 'Navigasyon Ogesi',
                  ru: 'Элемент навигации',
                },

                plural: {
                  de: 'Navigationspunkte',
                  en: 'Navigation Items',
                  es: 'Elementos de navegacion',
                  fr: 'Elements de navigation',
                  it: 'Elementi di navigazione',
                  pt: 'Itens de navegacao',
                  tr: 'Navigasyon Ogeleri',
                  ru: 'Элементы навигации',
                  uk: 'Елементи навігації',
                },
              },
              fields: [
                ...simpleNavItemFields,
                {
                  name: 'subItems',
                  type: 'array',
                  label: {
                    de: 'Unterpunkte',
                    en: 'Sub Items',
                    es: 'Sub elementos',
                    fr: 'Sous-elements',
                    it: 'Sotto-elementi',
                    pt: 'Sub itens',
                    tr: 'Alt Ogeler',
                    ru: 'Подэлементы',
                    uk: 'Піделементи',
                  },
                  maxRows: 10,
                  labels: {
                    singular: {
                      de: 'Unterpunkt',
                      en: 'Sub Item',
                      es: 'Sub elemento',
                      fr: 'Sous-element',
                      it: 'Sotto-elemento',
                      pt: 'Sub item',
                      tr: 'Alt Oge',
                      ru: 'Подэлемент',
                      uk: 'Піделемент',
                    },
                    plural: {
                      de: 'Unterpunkte',
                      en: 'Sub Items',
                      es: 'Sub elementos',
                      fr: 'Sous-elements',
                      it: 'Sotto-elementi',
                      pt: 'Sub itens',
                      tr: 'Alt Ogeler',
                      ru: 'Подэлементы',
                      uk: 'Піделементи',
                    },
                  },
                  admin: {
                    initCollapsed: true,
                  },
                  fields: [
                    ...simpleNavItemFields,
                    {
                      name: 'subSubItems',
                      type: 'array',
                      label: {
                        de: 'Unter-Unterpunkte',
                        en: 'Sub-Sub Items',
                        es: 'Sub-sub elementos',
                        fr: 'Sous-sous-elements',
                        it: 'Sotto-sotto-elementi',
                        pt: 'Sub-sub itens',
                        tr: 'Alt-Alt Ogeler',
                        ru: 'Подэлементы',
                        uk: 'Піделементи',
                      },
                      maxRows: 6,
                      labels: {
                        singular: {
                          de: 'Unter-Unterpunkt',
                          en: 'Sub-Sub Item',
                          es: 'Sub-sub elemento',
                          fr: 'Sous-sous-element',
                          it: 'Sotto-sotto-elemento',
                          pt: 'Sub-sub item',
                          tr: 'Alt-Alt Oge',
                          ru: 'Подэлемент',
                          uk: 'Піделемент',
                        },
                        plural: {
                          de: 'Unter-Unterpunkte',
                          en: 'Sub-Sub Items',
                          es: 'Sub-sub elementos',
                          fr: 'Sous-sous-elements',
                          it: 'Sotto-sotto-elementi',
                          pt: 'Sub-sub itens',
                          tr: 'Alt-Alt Ogeler',
                          ru: 'Подэлементы',
                          uk: 'Піделементи',
                        },
                      },
                      admin: {
                        initCollapsed: true,
                      },
                      fields: [...simpleNavItemFields],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ════════════════════════════════════════════════════════════════════
        // B. FOOTER NAVIGATION
        //    B1 – Leistungen (max 6 items)
        //    B2 – Infos      (max 6 items)
        // ════════════════════════════════════════════════════════════════════
        {
          label: {
            de: 'B. Footer Navigation',
            en: 'B. Footer Navigation',
            es: 'B. Navegacion de pie de pagina',
            fr: 'B. Navigation du pied de page',
            it: 'B. Navigazione del footer',
            pt: 'B. Navegacao do rodape',
            tr: 'B. Alt Bilgi Navigasyonu',
            ru: 'B. Нижняя навигация',
            uk: 'B. Нижня навігація',
          },
          fields: [
            // ── B1: Leistungen ──────────────────────────────────────────────
            {
              name: 'footerLeistungen',
              type: 'array',
              label: {
                de: 'B1 – Leistungen',
                en: 'B1 – Services',
                es: 'B1 – Servicios',
                fr: 'B1 – Prestations',
                it: 'B1 – Servizi',
                pt: 'B1 – Servicos',
                tr: 'B1 – Hizmetler',
                ru: 'B1 – Услуги',
                uk: 'B1 – Послуги',
              },
              maxRows: 6,
              labels: {
                singular: {
                  de: 'Leistung',
                  en: 'Service Item',
                  es: 'Servicio',
                  fr: 'Prestation',
                  it: 'Servizio',
                  pt: 'Servico',
                  tr: 'Hizmet',
                  ru: 'Услуга',
                  uk: 'Послуга',
                },
                plural: {
                  de: 'Leistungen',
                  en: 'Service Items',
                  es: 'Servicios',
                  fr: 'Prestations',
                  it: 'Servizi',
                  pt: 'Servicos',
                  tr: 'Hizmetler',
                },
              },
              admin: {
                description: {
                  de: 'Bis zu 6 Leistungs-Links im Footer (Spalte "Leistungen")',
                  en: 'Up to 6 service links in the footer (column "Services")',
                },
              },
              fields: [...simpleNavItemFields],
            },

            // ── B2: Infos ────────────────────────────────────────────────────
            {
              name: 'footerInfos',
              type: 'array',
              label: {
                de: 'B2 – Infos',
                en: 'B2 – Infos',
                es: 'B2 – Informacion',
                fr: 'B2 – Informations',
                it: 'B2 – Informazioni',
                pt: 'B2 – Informacoes',
                tr: 'B2 – Bilgiler',
                ru: 'B2 – Информация',
                uk: 'B2 – Інформація',
              },
              maxRows: 6,
              labels: {
                singular: {
                  de: 'Info',
                  en: 'Info Item',
                  es: 'Informacion',
                  fr: 'Information',
                  it: 'Informazione',
                  pt: 'Informacao',
                  tr: 'Bilgi',
                  ru: 'Информация',
                  uk: 'Інформація',
                },
                plural: {
                  de: 'Infos',
                  en: 'Info Items',
                  es: 'Informaciones',
                  fr: 'Informations',
                  it: 'Informazioni',
                  pt: 'Informacoes',
                  tr: 'Bilgiler',
                  ru: 'Информация',
                  uk: 'Інформація',
                },
              },
              admin: {
                description: {
                  de: 'Bis zu 6 Info-Links im Footer (Spalte "Infos")',
                  en: 'Up to 6 info links in the footer (column "Infos")',
                },
              },
              fields: [...simpleNavItemFields],
              
            },
          ],
        },
      ],
    },
  ],
}
