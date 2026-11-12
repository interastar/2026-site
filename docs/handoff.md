# Handoff — Interastar sitio 2026 (rama `ideas/wow`)

Resumen para continuar el trabajo en otra sesión. Todo vive en la rama **`ideas/wow`**
(no en `master`). **Última actualización: 12 nov 2026.** Último trabajo: hero nuevo (título y
rayos de luz por el borde del logo), capa de efectos visuales, imágenes y logos de clientes,
pasada editorial en español y blog bilingüe. **Para saber qué sigue, ve directo a §7.**

---

## 1. Qué es el proyecto

- Sitio corporativo de **Interastar** (integrador de ERP, CX e IA en LATAM).
- **Astro 7** + adaptador **Cloudflare**, **Tailwind v4** (vía `@tailwindcss/vite`), **Three.js** (hero 3D).
- Bilingüe **ES (raíz)** y **EN (`/en/`)**. Copy de cada página en objetos `c = { es, en }` dentro de `src/components/pages/*.astro`; nav/footer/CTAs en `src/i18n/ui.ts`.
- Blog en Markdown en `src/content/blog/{es,en}/`.

## 2. Comandos y entorno

- Build: `pnpm install && pnpm astro build`. Dev: `pnpm astro dev` (en este contenedor cloud falla con `process is not defined` por el runtime de Cloudflare; en WSL corre bien).
- **Verificación visual en el contenedor cloud (sí se puede):** el build corre bien (el aviso `Request.cf ... Request was cancelled` durante el prerender es inofensivo). Sirve `dist/client/` con `python3 -m http.server` y captura con el Playwright/Chromium preinstalado. Para WebGL en headless: `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` y `?hero=3d`. Hay que hacer scroll antes de capturar secciones para disparar los `.reveal`.
- Hero: `?hero=3d` fuerza WebGL, `?hero=2d` fuerza canvas 2D, `?still=1` estático. Rayos del hero ajustables por URL: `?rays ?len ?speed ?depth ?round ?zsmooth ?thick`.
- **Red (sandbox):** los dominios externos están bloqueados salvo los permitidos en el entorno "Default" del usuario. Hoy permitidos: nk.studio, interastar.com, numia.co, telnyx.com, acumatica.com (+www, cdn), genesys.com (+www), stackbyte.dev, y los sitios de los 9 clientes (bankaool.com, bankaya.com.mx, marzam.com.mx, fimubac.com.mx, irmleasing.com, jhl.mx, leasemd.mx, vanrenta.com.mx, yellowshine.net). Para leer un sitio nuevo hay que añadirlo con la herramienta de entorno (lo aprueba el usuario). Si un sitio bloquea al contenedor con protección anti-bot (pasó con bankaya.com.mx), no se evade: se le pide el archivo al usuario.
- **GitHub:** push requiere la Claude GitHub App instalada en la org `interastar` con escritura. Commits terminan con el footer de atribución de Claude. Desde la sesión cloud **no se pueden borrar ramas remotas** (403); eso lo hace el usuario.
- **Pasar archivos a Claude:** las imágenes pegadas o adjuntadas en el chat NO llegan a disco en la sesión cloud. El usuario las sube por git (commit + push a `ideas/wow`) y Claude hace `git pull`.

## 3. Reglas de DISEÑO (tema "wow")

- **Tema oscuro único** en todo el sitio. Capa semántica en `src/styles/tokens.css` (volcada a oscuro) + componentes en `src/styles/global.css`. Tokens reutilizables del tema en `src/styles/wow-theme.css` (`[data-theme="wow"]`).
- Acento **cian** (`#00a8ea`); **verde** (`#67db3c`) solo como realce. Oro/plata solo en los sellos de partner (semántico).
- Tipografía: **Exo 2** (display) + **Public Sans** (texto), self-hosted.
- Botones **píldora**; superficies con borde fino; `prefers-reduced-motion` respetado en todo.
- **Hero = estrella de Interastar en puntos** (`src/components/StarField.astro`): selector por dispositivo (3D Three.js en desktop potente; canvas 2D de respaldo en móvil/baja potencia/reduced-motion). Las partículas llegan desde fuera y forman la estrella en la 1ª carga.
- **Sin fotos de stock.** Imágenes on-brand: el hero de estrella, capturas de producto reales, y **banners de blog generativos** (`src/components/ArticleBanner.astro`, varían por slug). Los fondos de los tiles de rol los generó el usuario (`public/sections/role-*.webp`).
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
- Pasada editorial en la Home (muestra aprobada, luego extendida al resto en ES; ver abajo): abreviaciones, español, tags, "centro de contacto", framing de integración, IA tejida, footer sin "B2B".
- **Hero reescrito** (nov 2026): H1 "Todo tu negocio funcionando en armonía" (negocio en cian, armonía en verde); eyebrow "Integramos tus plataformas de negocio"; subtítulo nombra Acumatica (ERP) y Genesys (CX) con IA integrada y framing de integración. Manifiesto alineado. ES + EN.
- Marcas actualizadas (descripción + IA); logo de Telnyx agregado.
- **Pasada editorial extendida (ES)** a Acumatica, Genesys, Soluciones, Nosotros y Contacto (nov 2026): siglas expandidas en su primer uso, tags en español, "centro de contacto" (no "contact center"), "de extremo a extremo" (no "end-to-end"), "sistemas antiguos" (no "legadas"), quitado "WEM" de títulos, y framing "trabajen como una sola operación" (no "un solo sistema"). Barrido ES sin restos.
- **Imagen de Genesys actualizada**: captura de Agent Workspace (1920x1079) aportada por el usuario, sin la etiqueta de video, en `public/screens/genesys-dashboard.png`.
- **Blog bilingüe completo**: los 7 artículos tienen su par en inglés en `src/content/blog/en/` (mismo nombre de archivo, `lang: en`); enlaces internos EN con `/en/insights/<slug>/`.
- **Logos de cliente (9)** en blanco/transparente en `public/clients/` y activos en `TrustBar`: Bankaool, Bankaya, Marzam, Fimubac, IRM Leasing, JHL, LeaseMD, VanRenta, YellowShine (8 tomados de sus sitios y blanqueados; Bankaya la aportó el usuario).
- **Imagen de Acumatica actualizada**: dashboard oficial vigente "Sales Manager" (1838x960) en `public/screens/acumatica-dashboard.png`; dimensiones corregidas en AcumaticaPage y PlatformBento.
- **Capa de efectos "wow" `src/styles/wow-fx.css`** (importada tras global.css en BaseLayout; inspiración: stackbyte.dev, reinterpretada con cian/verde). Incluye: encabezados con relleno en gradiente + brillo; **vidrio esmerilado** (backdrop-blur) en menús y tarjetas (bento, roles, form, testimonios); **borde cónico luminoso que recorre la orilla** al hover (`@property --edge-a` + conic-gradient enmascarado); **spotlight** radial que sigue al cursor (script en BaseLayout define `--mx/--my`); capturas de producto con **perspectiva 3D (3/4)** y zoom (bento y detalle de solución); resplandor radial en el hero + rejilla tenue en `.section.alt`; reveal de scroll un poco más rico. Todo respeta `prefers-reduced-motion`. Variables rgb de marca: `--rgb-cyan`, `--rgb-green`.
- **Hero (StarField): rayos por el borde de la cinta de Möbius del logo (solo 3D).** El logo es una sola cinta doblada 5 veces (5 bandas en pentagrama); los 2 bordes largos de cada banda se encadenan por las esquinas de las puntas en un único lazo de 10 tramos (2 vueltas). 3 rayos finos recorren ese lazo: en planta siguen el contorno de las bandas y doblan en la esquina de cada punta; en profundidad el nivel cambia de forma continua (centro del tramo = nivel de su banda, verde al frente ... navy al fondo; cada punta = nivel medio entre las dos bandas). Tubo con color RGBA por vértice (alfa = brillo, invisible sin luz); gira con la estrella. La ruta (`MOB`) se genera con **`scripts/star-ray-route.py`** desde `public/brand/star.svg`. Valores por defecto elegidos por el usuario: `rays=3, len=0.06, speed=1, depth=0.8, round=0, zsmooth=1, thick=0.006` (todos ajustables por URL). El respaldo 2D conserva el barrido de brillo sobre los puntos (sin rayos). La rama de experimento `ideas/wow-lineas` ya se integró aquí; solo falta que el usuario borre la rama remota (ver §7).
- **Fondos de los 3 tiles de rol** (`public/sections/role-*.webp`, aportados por el usuario): activos en el Home. `.seg-bg` los muestra casi completos (opacidad 0.9, sin desenfoque extra) con un velo lateral para legibilidad del texto.

## 7. SIGUIENTES PASOS (pendientes)

**A. Requieren al usuario**

1. **Borrar la rama remota `ideas/wow-lineas`** (ya integrada en `ideas/wow`; la sesión cloud no puede borrarla): `git push origin --delete ideas/wow-lineas`.
2. **Revisión visual del usuario en WSL** y calibración de lo que se vea exagerado o flojo:
   - Rayos del hero: se ven algo pálidos (casi blancos) frente a los puntos; decidir si llevan más color/brillo. El usuario quería "jugar con la curvatura" (`?round`, `?zsmooth`, `?depth`) para que el trayecto se vea fluido; cuando elija valores, dejarlos como predeterminados en `StarField.astro`.
   - Fondos de los tiles de rol: Claude subió su opacidad de 0.28 a 0.9 sin que se pidiera; confirmar o bajar.
   - Capa `wow-fx.css` (glass, bordes luminosos, spotlight, perspectiva de capturas, hero de solución con imagen grande detrás del texto): el usuario la vio y siguió adelante, pero no dio un visto bueno explícito elemento por elemento.
3. **Prueba social real:** reemplazar los placeholders de testimonios (`Testimonials.astro`) y, si hay, agregar 1 caso de éxito con resultado real.
4. **Carta de autorización de clientes** para uso de nombre/logo (el usuario tiene un prompt para generarla). Aplica también a los 9 logos nuevos.

**B. Los puede hacer Claude**

5. **Revisar las páginas EN** (`/en/...`) con las reglas de §4: buscar restos de "single system" u otro framing; solo se ajustó el lede de Nosotros y el "WEM" de Genesys.
6. **Rayos en el respaldo 2D** (móvil/baja potencia): hoy el 2D solo tiene el barrido de brillo sobre puntos. Si el usuario quiere el mismo efecto en móvil, dibujar la ruta `MOB` en el canvas 2D.
7. (Opcional) Logos oficiales de los programas de partner (Acumatica/Genesys) para los badges, si se consiguen.

## 8. Archivos clave

- `src/components/pages/HomePage.astro` — copy e hilo narrativo de la home.
- `src/components/PlatformBento.astro` — bloques de marca (5 celdas).
- `src/components/StarField.astro` — hero de estrella (2D/3D + selector) y rayos por el borde de la cinta.
- `scripts/star-ray-route.py` — genera la ruta `MOB` de los rayos desde `star.svg` (requiere `svgpathtools`).
- `src/components/ArticleBanner.astro` — banners de blog generativos.
- `src/components/TrustBar.astro` — clientes (un logo con `pending: true` no se muestra).
- `src/components/Testimonials.astro` — testimonios (array `items` vacío = placeholders).
- `src/components/PartnerBadges.astro` — badges de certificación.
- `src/styles/tokens.css`, `global.css`, `wow-theme.css` — tema. `src/styles/wow-fx.css` — capa de efectos (glass, brillos, perspectiva).
- `src/components/pages/SolutionDetail.astro` — plantilla de las páginas de Acumatica/Genesys (hero `.sol-hero`).
- `public/screens/` capturas de producto, `public/sections/` fondos de tiles, `public/clients/` logos de cliente.
- `src/i18n/ui.ts` — nav/footer/CTAs. `astro.config.mjs` — redirects.
- `docs/content-audit.md` — audit de contenido previo.
