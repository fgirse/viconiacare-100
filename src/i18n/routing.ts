import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/about/history': {
      de: '/ueber-uns/geschichte',
      en: '/about/history',
      fr: '/a-propos/histoire',
      it: '/chi-siamo/storia',
      es: '/sobre-nosotros/historia',
      pt: '/sobre-nos/historia',
      tr: '/hakkimizda/tarihce',
    },
    '/about/leitbild': {
      de: '/ueber-uns/leitbild',
      en: '/about/mission',
      fr: '/a-propos/mission',
      it: '/chi-siamo/missione',
      es: '/sobre-nosotros/mision',
      pt: '/sobre-nos/missao',
      tr: '/hakkimizda/misyon',
    },
    '/about/team': {
      de: '/ueber-uns/team',
      en: '/about/team',
      fr: '/a-propos/equipe',
      it: '/chi-siamo/team',
      es: '/sobre-nosotros/equipo',
      pt: '/sobre-nos/equipe',
      tr: '/hakkimizda/ekip',
    },
    '/contact': {
      de: '/kontakt',
      en: '/contact',
      fr: '/contact',
      it: '/contatti',
      es: '/contacto',
      pt: '/contato',
      tr: '/iletisim',
    },
    '/menu_4': {
      de: '/mehr',
      en: '/more',
      fr: '/plus',
      it: '/altro',
      es: '/mas',
      pt: '/mais',
      tr: '/daha-fazla',
    },
    '/homevisit': '/homevisit',
    '/interview': '/interview',
    '/phone': '/phone',
  },
})
