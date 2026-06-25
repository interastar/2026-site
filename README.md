# Interastar — sitio web 2026

Sitio corporativo de **Interastar** construido con **Astro** y desplegado en **Cloudflare Workers**.
Bilingüe (español por defecto, inglés en `/en`), con páginas estáticas, blog en Markdown y captura
de leads que crea tareas en ClickUp.

Diseño basado en el **Interastar Design System** (brandbook ES) y las recomendaciones del
**Reporte de Auditoría CRO** (segmentación inmediata por rol, páginas de solución dedicadas,
jerarquía de CTAs, prueba social y formularios de calificación).

## Stack

- **Astro 7** + adaptador `@astrojs/cloudflare` (Workers).
- **i18n nativo de Astro** — `defaultLocale: es`, `locales: [es, en]`, sin prefijo para español.
- **Content Collections** (Markdown) para el blog/Insights.
- **@astrojs/sitemap** — `sitemap-index.xml` con alternativas hreflang.
- Tipografía y tokens del design system (Exo 2 + Public Sans, self-hosted).

## Estructura

```text
public/
├── brand/            logos, star, OG image, brandbook PDF
├── fonts/            Exo 2 + Public Sans (variable, self-hosted)
└── robots.txt
src/
├── components/       Header, Footer, Icon, LeadForm, TrustBar, Stats, CtaBand, InsightsList
│   └── pages/        Secciones por página: HomePage, AboutPage, SolutionsPage,
│                     AcumaticaPage, GenesysPage, SolutionDetail, ContactPage, PrivacyPage
├── content/blog/     Artículos en Markdown — subcarpetas es/ y en/
├── i18n/ui.ts        Idiomas, mapa de rutas localizadas y textos de nav/footer
├── layouts/          BaseLayout (SEO, hreflang, JSON-LD, scroll-reveal)
├── lib/posts.ts      Helpers de la colección de blog
├── pages/            Rutas ES (raíz) y EN (/en). `api/lead.ts` = endpoint de leads
├── content.config.ts esquema de la colección blog
└── styles/           tokens.css (design system) + global.css
```

## Comandos

| Comando        | Acción                                          |
| :------------- | :---------------------------------------------- |
| `pnpm dev`     | Servidor local en `localhost:4321`              |
| `pnpm build`   | Build de producción en `./dist/`                |
| `pnpm preview` | Previsualiza el build con Wrangler              |
| `pnpm deploy`  | Build + despliegue a Cloudflare Workers         |

## Editar contenido

- **Textos de páginas**: cada página vive en `src/components/pages/*.astro`. Arriba de cada archivo
  hay un objeto `c = { es: {...}, en: {...} }` con todo el copy. Edita ahí los textos en ambos idiomas.
- **Navegación / footer / CTAs comunes**: `src/i18n/ui.ts`.
- **Rutas (slugs por idioma)**: el mapa `routes` en `src/i18n/ui.ts`.
- **Blog**: agrega un `.md` en `src/content/blog/es/` (y su equivalente en `en/` para la versión
  en inglés). Frontmatter requerido:

  ```yaml
  ---
  title: "Título del artículo"
  description: "Resumen para tarjetas y SEO."
  pubDate: 2026-06-24
  lang: es            # es | en
  category: "Acumatica ERP"
  author: "Interastar"
  draft: false        # opcional
  ---
  ```

  El slug del artículo es el nombre del archivo. Para enlazar la versión ES↔EN, usa el **mismo
  nombre de archivo** en ambas carpetas (así el selector de idioma apunta a la traducción correcta).

## Captura de leads (ClickUp)

El formulario (`src/components/LeadForm.astro`) hace `POST` a `src/pages/api/lead.ts`, que crea una
tarea en ClickUp con los datos del prospecto. Incluye honeypot anti-spam y validación.

Configuración:

1. **Token (secreto)** — token personal de ClickUp (Settings → Apps → API Token, empieza con `pk_`):
   ```sh
   pnpm wrangler secret put CLICKUP_API_TOKEN
   ```
2. **Lista destino** — `CLICKUP_LIST_ID` ya está en `wrangler.jsonc`, apuntando a
   **Marketing → Oportunidades → "List"** (`901113951091`). Cámbiala si creas una lista dedicada.
3. **Local** — copia `.dev.vars.example` a `.dev.vars` y pon ahí tus valores.

Si el token no está configurado, el endpoint **no falla**: registra el lead en logs y responde OK
(útil mientras se decide la lista final).

## Despliegue

```sh
pnpm build
pnpm wrangler secret put CLICKUP_API_TOKEN   # una sola vez
pnpm deploy
```

## Pendientes / mejoras sugeridas

- Sustituir el placeholder del hero por **fotografía de marca** (personas + tecnología, según las
  reglas de imagery del design system).
- Migrar los 5 artículos de blog restantes desde el sitio actual.
- Reemplazar el OG image SVG por un **PNG 1200×630** (mejor compatibilidad social).
- (Opcional) Añadir **Cloudflare Turnstile** al formulario y **GA4** con eventos de CTA, como
  recomienda el reporte CRO.
- Sustituir fuentes `.ttf` variables por `.woff2` (y Flexo licenciado si está disponible).
