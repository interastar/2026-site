# Handoff — Interastar sitio 2026 (rama `ideas/wow`)

Resumen para continuar el trabajo en otra sesión. Todo vive en la rama **`ideas/wow`**
(no en `main`). Último trabajo: rediseño "wow" aplicado a todo el sitio, migración y
limpieza del blog, badges de partner, y una pasada editorial iniciada en la Home.

---

## 1. Qué es el proyecto

- Sitio corporativo de **Interastar** (integrador de ERP, CX e IA en LATAM).
- **Astro 7** + adaptador **Cloudflare**, **Tailwind v4** (vía `@tailwindcss/vite`), **Three.js** (hero 3D).
- Bilingüe **ES (raíz)** y **EN (`/en/`)**. Copy de cada página en objetos `c = { es, en }` dentro de `src/components/pages/*.astro`; nav/footer/CTAs en `src/i18n/ui.ts`.
- Blog en Markdown en `src/content/blog/{es,en}/`.

## 2. Comandos y entorno

- Build: `pnpm install && pnpm astro build`. Dev: `pnpm astro dev` (en este contenedor cloud falla con `process is not defined` por el runtime de Cloudflare; en WSL corre bien. Alternativa: servir `dist/client/` con `python3 -m http.server`).
- Hero: `?hero=3d` fuerza WebGL, `?hero=2d` fuerza canvas 2D, `?still=1` estático.
- **Red (sandbox):** los dominios externos están bloqueados salvo los permitidos. Ya se permitieron: nk.studio, interastar.com, numia.co, infobip/genesys/acumatica/vonage.mx/telnyx.com. Para leer un sitio nuevo hay que añadirlo con la herramienta de entorno (lo aprueba el usuario).
- **GitHub:** push requiere la Claude GitHub App instalada en la org `interastar` con escritura. Commits terminan con el footer de atribución de Claude.

## 3. Reglas de DISEÑO (tema "wow")

- **Tema oscuro único** en todo el sitio. Capa semántica en `src/styles/tokens.css` (volcada a oscuro) + componentes en `src/styles/global.css`. Tokens reutilizables del tema en `src/styles/wow-theme.css` (`[data-theme="wow"]`).
- Acento **cian** (`#00a8ea`); **verde** (`#67db3c`) solo como realce. Oro/plata solo en los sellos de partner (semántico).
- Tipografía: **Exo 2** (display) + **Public Sans** (texto), self-hosted.
- Botones **píldora**; superficies con borde fino; `prefers-reduced-motion` respetado en todo.
- **Hero = estrella de Interastar en puntos** (`src/components/StarField.astro`): selector por dispositivo (3D Three.js en desktop potente; canvas 2D de respaldo en móvil/baja potencia/reduced-motion). Las partículas llegan desde fuera y forman la estrella en la 1ª carga.
- **Sin fotos de stock.** Imágenes on-brand: el hero de estrella, capturas de producto reales, y **banners de blog generativos** (`src/components/ArticleBanner.astro`, varían por slug). Para fondos de tiles de rol el usuario genera imágenes (ver pendientes).
- Marca de agua anti-slop: nada de "3 tarjetas iguales", sin cursor custom, sin "scroll ↓", bento con ritmo.

## 4. Reglas EDITORIALES (acordadas con el usuario)

- **Audiencia: dueños de negocio.** Explicar cada abreviación en su **primer uso** por página: "sistema de gestión empresarial (ERP)", "experiencia de cliente (CX)", "sistema de clientes (CRM)", etc. El hero **lidera con el resultado en tono humano** ("Todo tu negocio funcionando en armonía"), **sin siglas sueltas**; nombra Acumatica/Genesys y explica en palabras llanas en el subtítulo. (Evitar la tríada "Tu ERP/CX/IA": son siglas que no dicen nada y "tu ERP" sugiere el sistema del cliente, cuando nosotros implementamos Acumatica.)
- **Español sobre anglicismos:** "de extremo a extremo" (no "end-to-end"), "sistemas antiguos" (no "legacy/legadas"), "centro de contacto" (no "contact center"). Tags de plataforma en español ("ERP en la nube", "Experiencia de cliente en la nube", etc.). Quitar siglas oscuras como "WEM", "CPaaS" de los títulos.
- **Framing de integración (importante):** NO decir "un solo sistema". Son **soluciones distintas (ERP, centro de contacto, IA) que INTEGRAMOS** "para que trabajen como una sola operación". Cuidar no confundir al lector.
- **IA tejida en toda la prosa:** mencionar que hay IA en todas las soluciones y en nuestro conocimiento (hero, servicios, bloques de marca).
- **Liderar con el resultado**, no con la actividad (ej. "Dejas de capturar lo mismo dos veces y cierras el mes más rápido").
- **Honestidad:** cero estadísticas/citas inventadas, cero casos con empresas nombradas sin respaldo, cero buzzwords sin sentido. **Cero em-dash (—)** en texto visible; usar guion/coma/paréntesis.

## 5. Descripciones de marca (según sus sitios, dic 2025)

- **Acumatica** (Gold Certified Partner): ERP en la nube para todo el negocio, vista en tiempo real, **con IA integrada**.
- **Genesys** (Silver Tier Partner): plataforma de CX **potenciada por IA**, orquestación en tiempo real.
- **Infobip:** empuje fuerte a **AgentOS** (crear/orquestar agentes de IA) sobre su base omnicanal (WhatsApp, SMS, correo, chat, voz).
- **Numia** (numia.co): "orquestador inteligente del **mundo físico**"; une agilidad digital con la operación física (sucursales/tiendas). NO es "IA conversacional".
- **Vonage + Telnyx:** APIs e infraestructura de comunicación (voz, mensajería, video, verificación); Telnyx reposicionado a **infra para agentes de IA en tiempo real**.

## 6. Estado actual (hecho en `ideas/wow`)

- Rediseño wow en todo el sitio; hero de estrella (2D+3D); manifiesto; badges de partner (home, soluciones, nosotros, footer); sección de testimonios con **placeholders** (activar con citas reales en `src/components/Testimonials.astro`).
- Blog: 7 artículos (2 previos + 5 migrados y **reescritos** sin slop), con banners generativos. Redirects legacy → nuevos slugs.
- SEO: títulos con señal de partner + `BreadcrumbList`/`Article` JSON-LD (ES y EN).
- `/wow` consolidado: redirige a `/` (el home de producción ES el diseño wow).
- Pasada editorial **aplicada solo en la Home** (muestra aprobada): abreviaciones, español, tags, "centro de contacto", framing de integración, IA tejida, footer sin "B2B".
- **Hero reescrito** (nov 2025): H1 "Todo tu negocio funcionando en armonía" (negocio en cian, armonía en verde); eyebrow "Integramos tus plataformas de negocio"; subtítulo nombra Acumatica (ERP) y Genesys (CX) con IA integrada y framing de integración. Manifiesto alineado. ES + EN.
- Marcas actualizadas (descripción + IA); logo de Telnyx agregado.
- **Pasada editorial extendida (ES)** a Acumatica, Genesys, Soluciones, Nosotros y Contacto (nov 2025): siglas expandidas en su primer uso, tags en español, "centro de contacto" (no "contact center"), "de extremo a extremo" (no "end-to-end"), "sistemas antiguos" (no "legadas"), quitado "WEM" de títulos, y framing "trabajen como una sola operación" (no "un solo sistema"). Barrido ES sin restos.
- **Imagen de Acumatica actualizada**: dashboard oficial vigente "Sales Manager" (1838x960) en `public/screens/acumatica-dashboard.png`; dimensiones corregidas en AcumaticaPage y PlatformBento.
- **Capa de efectos "wow" `src/styles/wow-fx.css`** (importada tras global.css en BaseLayout; inspiración: stackbyte.dev, reinterpretada con cian/verde). Incluye: encabezados con relleno en gradiente + brillo; **vidrio esmerilado** (backdrop-blur) en menús y tarjetas (bento, roles, form, testimonios); **borde cónico luminoso que recorre la orilla** al hover (`@property --edge-a` + conic-gradient enmascarado); **spotlight** radial que sigue al cursor (script en BaseLayout define `--mx/--my`); capturas de producto con **perspectiva 3D (3/4)** y zoom (bento y detalle de solución); resplandor radial en el hero + rejilla tenue en `.section.alt`; reveal de scroll un poco más rico. Todo respeta `prefers-reduced-motion`. Variables rgb de marca: `--rgb-cyan`, `--rgb-green`. **Pendiente de revisión visual en WSL** (el build no corre en el contenedor cloud).

## 7. SIGUIENTES PASOS (pendientes)

1. **Pasada editorial: ES hecho** en Acumatica, Genesys, Soluciones, Nosotros y Contacto (ver §6). Pendiente: revisar las páginas EN (`/en/...`) por si queda algún "single system" u otro framing a ajustar, y aplicar las reglas a nuevas secciones que se agreguen.
   - **Imagen de Genesys: hecha.** El usuario subió su captura de Agent Workspace (1920x1079) por git; Claude le quitó la etiqueta de video "Agent" (relleno plano sobre nav azul `rgb(37,61,128)` y panel `rgb(251,251,251)`) y la dejó en `public/screens/genesys-dashboard.png`. Dimensiones/alt actualizados en GenesysPage y PlatformBento. Nota de proceso: en esta sesión cloud las imágenes pegadas/adjuntadas NO llegan a disco (`/mnt/user-data/uploads/` queda vacío); para pasar un archivo, súbelo por git al repo y Claude hace `git pull`.
2. **Blog EN: hecho.** Los 7 artículos ES ya tienen su par en inglés en `src/content/blog/en/` (mismo nombre de archivo, `lang: en`, traducción fiel sin inventar datos). Los enlaces internos usan la ruta `/en/insights/<slug>/`.
3. **Imágenes pendientes (el usuario las genera/provee):**
   - Fondos difuminados de los 3 tiles de rol → `public/sections/role-direccion.webp`, `role-ti.webp`, `role-operaciones.webp` (prompts entregados en el chat).
   - 6 logos de cliente (blanco/transparente PNG) → `public/clients/bankaool.png`, `marzam.png`, `htrent.png`, `vanrenta.png`, `leasemd.png`, `yellowshine.png`. Al colocarlos, quitar `pending: true` en `src/components/TrustBar.astro`.
4. **Prueba social real:** reemplazar los placeholders de testimonios y, si hay, agregar 1 caso de éxito con resultado real.
5. **Carta de autorización de clientes:** el usuario tiene un prompt (en el chat) para generar la carta de uso de nombre/logo.
6. (Opcional) Logos oficiales de los programas de partner (Acumatica/Genesys) para los badges, si se consiguen.

## 8. Archivos clave

- `src/components/pages/HomePage.astro` — copy e hilo narrativo de la home.
- `src/components/PlatformBento.astro` — bloques de marca (5 celdas).
- `src/components/StarField.astro` — hero de estrella (2D/3D + selector).
- `src/components/ArticleBanner.astro` — banners de blog generativos.
- `src/components/TrustBar.astro` — clientes (con `pending`).
- `src/components/Testimonials.astro` — testimonios (array `items` vacío = placeholders).
- `src/components/PartnerBadges.astro` — badges de certificación.
- `src/styles/tokens.css`, `global.css`, `wow-theme.css` — tema.
- `src/i18n/ui.ts` — nav/footer/CTAs. `astro.config.mjs` — redirects.
- `docs/content-audit.md` — audit de contenido previo.
