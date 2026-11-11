// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// Permanent redirects from the previous site's URL structure (Nicepage export).
// Blog posts not yet migrated land on the Insights index until their new slug exists.
const legacyBlog = '/blog/';
const redirects = {
  '/wow': '/',
  '/Home.html': '/',
  '/Nosotros.html': '/nosotros/',
  '/Insights.html': '/insights/',
  '/blog/blog.html': '/insights/',
  '/Acumatica-ERP.html': '/soluciones/acumatica/',
  '/Genesys-Contact-Center.html': '/soluciones/genesys/',
  '/Contacto.html': '/contacto/',
  '/Aviso-de-Privacidad.html': '/aviso-de-privacidad/',
  '/FAQ-Page.html': '/',
  '/en/Home.html': '/en/',
  '/en/Nosotros.html': '/en/about/',
  '/en/Insights.html': '/en/insights/',
  '/en/Acumatica-ERP.html': '/en/solutions/acumatica/',
  '/en/Genesys-Contact-Center.html': '/en/solutions/genesys/',
  '/en/Contacto.html': '/en/contact/',
  '/en/Aviso-de-Privacidad.html': '/en/privacy/',
  '/en/FAQ-Page.html': '/en/',
  [legacyBlog + 'erp-para-arrendadoras-en-2025-acumatica-la-solución-que-evoluciona-con-tu-negocio.html']: '/insights/erp-arrendadoras-2025/',
  [legacyBlog + 'genesys-cloud-2025-4-claves-para-maximizar-la-productividad-de-tus-agentes-con-ia-ética-y-xr.html']: '/insights/genesys-productividad-agentes-2025/',
  [legacyBlog + 'acumatica-erp-2025-para-el-sector-automotriz-gestión-inteligente-de-flotas-eléctricas-y-sostenibilidad.html']: '/insights/acumatica-sector-automotriz/',
  [legacyBlog + 'ciberseguridad-en-erps-2025-cómo-acumatica-protege-contra-ransomware-y-fraude-en-arrendadoras.html']: '/insights/ciberseguridad-erp-acumatica/',
  [legacyBlog + 'erp-en-la-nube-2025-7-resultados-que-revolucionarán-tu-empresa-más-allá-del-ahorro-de-costos.html']: '/insights/',
  [legacyBlog + 'erp-para-pymes-2025-5-mitos-derribados-casos-reales-de-éxito-y-costos-asequibles.html']: '/insights/erp-pymes-mitos/',
  [legacyBlog + 'genesys-cloud-2025-3-estrategias-revolucionarias-para-duplicar-la-productividad-de-tus-agentes-con-ia-ética.html']: '/insights/genesys-productividad-bienestar/',
  [legacyBlog + 'migrar-tu-contact-center-a-la-nube-en-2025-guía-definitiva-con-ia-cuántica-ahorro-real-y-cumplimiento-gdpr-5.html']: '/insights/migrar-contact-center-nube/',
  [legacyBlog + 'odoo-vs-acumatica-2025-comparativa-definitiva-con-ia-generativa-costos-reales-y-casos-de-uso.html']: '/insights/',
};

// https://astro.build/config
export default defineConfig({
  site: 'https://www.interastar.com',

  adapter: cloudflare({
    imageService: 'compile',
  }),

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  redirects,

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-MX', en: 'en-US' },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
