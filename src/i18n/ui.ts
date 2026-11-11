/* =========================================================================
   i18n: languages, localized route map, and shared UI strings (nav/footer).
   Page-level copy lives inside each page component as a { es, en } object.
   ========================================================================= */

export const languages = { es: 'Español', en: 'English' } as const;
export const defaultLang = 'es';
export type Lang = keyof typeof languages;

/** Canonical route key -> localized path. Spanish is default (no prefix). */
export const routes = {
  home:      { es: '/',                     en: '/en/' },
  about:     { es: '/nosotros/',            en: '/en/about/' },
  solutions: { es: '/soluciones/',          en: '/en/solutions/' },
  acumatica: { es: '/soluciones/acumatica/',en: '/en/solutions/acumatica/' },
  genesys:   { es: '/soluciones/genesys/',  en: '/en/solutions/genesys/' },
  insights:  { es: '/insights/',            en: '/en/insights/' },
  contact:   { es: '/contacto/',            en: '/en/contact/' },
  privacy:   { es: '/aviso-de-privacidad/', en: '/en/privacy/' },
} as const;

export type RouteKey = keyof typeof routes;

export function path(key: RouteKey, lang: Lang): string {
  return routes[key][lang];
}

/** Shared UI strings used by Header / Footer and common CTAs. */
export const ui = {
  es: {
    'nav.solutions': 'Soluciones',
    'nav.acumatica': 'Acumatica ERP',
    'nav.genesys': 'Genesys CX',
    'nav.about': 'Nosotros',
    'nav.insights': 'Insights',
    'nav.contact': 'Contacto',
    'nav.cta': 'Agendar diagnóstico',
    'cta.primary': 'Agendar diagnóstico',
    'cta.explore': 'Ver soluciones',
    'footer.tagline': 'Firma de tecnología para empresas. Unificamos tu sistema de gestión (ERP), tu experiencia de cliente (CX) y tu IA en una sola operación.',
    'footer.solutions': 'Soluciones',
    'footer.company': 'Empresa',
    'footer.resources': 'Recursos',
    'footer.about': 'Nosotros',
    'footer.contact': 'Contacto',
    'footer.insights': 'Insights',
    'footer.privacy': 'Aviso de privacidad',
    'footer.managed': 'Servicios administrados',
    'footer.integration': 'Integraciones a la medida',
    'footer.consulting': 'Consultoría estratégica',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.langLabel': 'English',
    'lang.switch': 'EN',
    'skip': 'Saltar al contenido',
  },
  en: {
    'nav.solutions': 'Solutions',
    'nav.acumatica': 'Acumatica ERP',
    'nav.genesys': 'Genesys CX',
    'nav.about': 'About',
    'nav.insights': 'Insights',
    'nav.contact': 'Contact',
    'nav.cta': 'Book a diagnostic',
    'cta.primary': 'Book a diagnostic',
    'cta.explore': 'View solutions',
    'footer.tagline': 'Technology firm for businesses. We unify your ERP, your customer experience (CX) and your AI into a single operation.',
    'footer.solutions': 'Solutions',
    'footer.company': 'Company',
    'footer.resources': 'Resources',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.insights': 'Insights',
    'footer.privacy': 'Privacy notice',
    'footer.managed': 'Managed services',
    'footer.integration': 'Custom integrations',
    'footer.consulting': 'Strategic consulting',
    'footer.rights': 'All rights reserved.',
    'footer.langLabel': 'Español',
    'lang.switch': 'ES',
    'skip': 'Skip to content',
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)['es']): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
