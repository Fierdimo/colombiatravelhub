# Instrucciones para Copilot — Colombia Travel Hub

## Descripción del proyecto
Sitio web estático de contenido turístico sobre destinos de Colombia. Lanzamiento con Cartagena de Indias como destino inicial, con arquitectura preparada para incorporar nuevos destinos (Medellín, Bogotá, San Andrés, etc.) sin refactoring. Monetización exclusiva mediante links de afiliados. El objetivo es ranquear en Google para búsquedas de turistas nacionales e internacionales.

---

## Arquitectura: Hexagonal (Ports & Adapters)

La arquitectura sigue el patrón hexagonal adaptado a un sitio estático en Astro. El dominio (core) no depende de ningún framework — solo TypeScript puro. Astro, las Content Collections y los proveedores de afiliados son adaptadores intercambiables.

```
Presentación (Astro UI)
      │
      ▼
  Servicios (Application)
      │
   [Puertos]
   ↙        ↘
Adaptador     Adaptador
Contenido     Afiliados
(Astro CC)   (Viator, Civitatis…)
```

### Principios aplicados

| Principio | Aplicación concreta |
|---|---|
| **S** (Single Responsibility) | Cada módulo tiene una sola razón para cambiar: modelos, puertos, adaptadores y UI son capas independientes |
| **O** (Open/Closed) | Agregar un destino o un proveedor de afiliados nuevo = crear un nuevo archivo, no modificar los existentes |
| **L** (Liskov) | Todos los adaptadores de afiliados implementan `IAffiliateRepository`; todos los adaptadores de contenido implementan `IContentRepository` |
| **I** (Interface Segregation) | `IContentRepository` y `IAffiliateRepository` son interfaces separadas; ningún módulo depende de métodos que no usa |
| **D** (Dependency Inversion) | Los servicios de aplicación dependen de interfaces (puertos), nunca de implementaciones concretas |
| **KISS** | Sin sobre-ingeniería: no hay inyección de dependencias compleja; los adaptadores se instancian directamente en los servicios de aplicación |
| **DRY** | La lógica de SEO, CTAs y filtrado de contenido vive en un único lugar; las páginas son capas delgadas que solo renderizan |

---

## Stack y convenciones

### Framework
- **Astro** con TypeScript estricto (`strict: true` en tsconfig)
- Usar `.astro` para páginas y layouts
- Las páginas son **thin layers**: solo llaman a servicios y renderizan resultados
- Nunca colocar lógica de negocio dentro de frontmatter de páginas `.astro`

### Estilos
- **Tailwind CSS** exclusivamente, sin CSS custom salvo casos excepcionales
- Diseño mobile-first
- Paleta de colores: tropical/caribeña — turquesa, coral, blanco arena, verde tropical
- Tipografía limpia y legible, prioridad en lectura larga

---

## UI/UX — Diseño visual y conversión

### Filosofía de diseño
El sitio debe transmitir **confianza, aspiración y facilidad**. El usuario llega queriendo viajar; nuestra tarea es eliminar fricción y acercar cada decisión hacia una reserva. Cada pantalla tiene una única acción principal. El diseño es luminoso, cálido y evocador — nunca genérico.

### Sistema de colores

| Token | Valor | Uso |
|---|---|---|
| `primary` | `#0EA5E9` — Azul caribe | CTAs principales, links activos |
| `secondary` | `#F97316` — Coral cálido | CTAs secundarios, badges de oferta |
| `accent` | `#10B981` — Verde tropical | Confirmaciones, disponibilidad |
| `sand` | `#FDF6EC` — Blanco arena | Fondo principal (nunca blanco puro) |
| `surface` | `#FFFFFF` | Cards, modales |
| `ink` | `#1E293B` — Azul pizarra | Texto principal |
| `muted` | `#64748B` | Texto secundario, metadatos |

Reglas:
- Fondo de página siempre `sand` (`#FDF6EC`), no blanco puro — reduce fatiga visual y transmite calidez
- Nunca usar gradientes genéricos morado/azul — rompen la identidad tropical
- Sombras cálidas: `box-shadow` con tinte ambar en cards, no gris neutro

### Tipografía

| Rol | Fuente | Peso |
|---|---|---|
| Display / Títulos hero | **Playfair Display** (serif) | 700, 900 |
| Subtítulos y headings | **DM Sans** (sans-serif) | 600 |
| Cuerpo de texto | **DM Sans** | 400 |
| Precios y CTA | **DM Sans** | 700 |

- Cargar vía `@fontsource` para rendimiento (sin Google Fonts externo)
- Tamaño mínimo de body: `16px`; en mobile nunca por debajo de `15px`
- Interlineado de artículos: `1.75rem` para lectura larga cómoda

### Responsive design — compatibilidad de pantallas

El sitio debe verse y funcionar correctamente en **cualquier dispositivo**: teléfono, tablet, laptop, desktop y TV. El 70–80% del tráfico turístico llega desde mobile — es el viewport primario.

**Breakpoints (Tailwind por defecto):**

| Nombre | Ancho mínimo | Dispositivo típico |
|---|---|---|
| `(base)` | 0px | Teléfonos pequeños (360px+) |
| `sm` | 640px | Teléfonos grandes / landscape |
| `md` | 768px | Tablets portrait |
| `lg` | 1024px | Tablets landscape / laptops pequeños |
| `xl` | 1280px | Desktops estándar |
| `2xl` | 1536px | Pantallas grandes / TV |

**Reglas obligatorias:**

- Diseñar y revisar **primero en 375px** (iPhone SE) antes de escalar a pantallas mayores
- Targets táctiles mínimo `44×44px` — botones, links y CTAs deben ser cómodos de tocar con el dedo
- Nunca usar unidades fijas (`px`) para anchos de contenedores — usar `%`, `vw`, `max-w-*` de Tailwind
- Imágenes siempre con `width: 100%` y `height: auto` — nunca dimensiones fijas que rompan layout
- El `<Image />` de Astro genera automáticamente `srcset` — siempre especificar `widths` y `sizes`
- Texto nunca más ancho que `65ch` en desktop (legibilidad óptima); usar `max-w-prose` de Tailwind
- Tablas de datos: hacer scroll horizontal (`overflow-x: auto`) en mobile, no contraer columnas
- Menú de navegación: hamburger en mobile/tablet (`md:hidden`), horizontal en desktop (`hidden md:flex`)

**Componentes con comportamiento diferenciado por breakpoint:**

| Componente | Mobile | Tablet | Desktop |
|---|---|---|---|
| Grid de cards | 1 columna | 2 columnas | 3–4 columnas |
| Hero | Imagen fullscreen, texto centrado | Split image/texto | Split con 3D globe |
| `DestinationCard3D` | Tilt desactivado (touch) | Tilt suave | Tilt completo |
| `StickyBookBar` | Visible — anclado al bottom | Visible | Oculto (CTA inline) |
| Sidebar de filtros | Drawer desde abajo | Panel lateral colapsable | Panel lateral fijo |
| Header nav | Hamburger + drawer | Hamburger + drawer | Links horizontales |

**Three.js en mobile:**
- Reducir `pixelRatio` a `Math.min(window.devicePixelRatio, 1.5)` — evita sobrecarga en pantallas Retina
- Simplificar geometría: globo con `32` segmentos en mobile vs `64` en desktop
- Detectar `'ontouchstart' in window` para deshabilitar el efecto de tilt basado en mouse
- Si el dispositivo tiene menos de `4GB` RAM estimada o `navigator.hardwareConcurrency <= 2`, usar fallback CSS

**Accesibilidad visual mínima (WCAG AA):**
- Contraste de texto sobre fondo: mínimo ratio **4.5:1** para texto normal, **3:1** para texto grande (+18px)
- Nunca comunicar información solo con color — acompañar siempre con icono o texto
- Todos los elementos interactivos deben tener estado `:focus-visible` visible (no eliminar el outline nativo sin reemplazarlo)
- El `LanguagePicker` y el menú hamburger deben ser operables con teclado (`Tab`, `Enter`, `Escape`)

### Animaciones — Principios generales

**Librería principal: GSAP** (sin dependencias de React; funciona nativamente con Astro)
- `gsap` + `ScrollTrigger` para animaciones al hacer scroll
- CSS puro para micro-interacciones (`hover`, `focus`, `active`)
- **Three.js** exclusivamente para objetos 3D (como Astro islands con `client:visible`)

Reglas de motion:
- Las animaciones **nunca bloquean contenido** — son capas sobre él
- Duración estándar: `300ms` micro-interacciones, `500–700ms` entradas de sección, `1000–1500ms` escenas 3D
- Easing: `power2.out` para entradas, `power2.inOut` para loops suaves
- Respetar `prefers-reduced-motion`: envolver toda animación no esencial en `matchMedia`
- No animar más de 3 elementos simultáneamente en mobile

### Objetos 3D (Three.js)

Usar Three.js solo en puntos de alto impacto visual — como Astro islands (`client:visible`) para no bloquear el load inicial. Casos de uso concretos:

| Componente | Escena 3D | Comportamiento |
|---|---|---|
| `HeroGlobe.astro` | Globo terráqueo estilizado con pin en Colombia | Rotación lenta y continua; al hover pausa y muestra tooltip del destino |
| `DestinationCard3D.astro` | Tarjeta con efecto parallax 3D en tilt | Se inclina siguiendo el cursor (mouse/touch); subtle shadow depth |
| `WaveSection.astro` | Plano de agua con ondas (ShaderMaterial) | Ondas suaves en loop; separador entre secciones hero y contenido |

Reglas para Three.js:
- Siempre usar `client:visible` — nunca renderizar 3D en SSR
- Limpiar renderer en `onDestroy` para evitar memory leaks
- Usar `WebGLRenderer({ antialias: true, alpha: true })` con fondo transparente para integrarse con el fondo `sand`
- Canvas responsivo: `renderer.setSize` con `ResizeObserver`
- En mobile: reducir `pixelRatio` a `1` y simplificar geometría (menos segmentos)
- Fallback CSS puro para dispositivos sin WebGL o con `prefers-reduced-motion`

### Estructura de conversión (jerarquía de pantallas)

Cada página sigue el patrón **AIDA adaptado al turismo**:

```
1. ATENCIÓN   → Hero inmersivo (imagen/video/3D) + headline emocional
2. INTERÉS    → Beneficios concretos del destino o tour (no solo descripción)
3. DESEO      → Prueba social (reseñas, número de reservas, ratings de Viator)
4. ACCIÓN     → CTA primario visible, sin competencia de otros elementos
```

**Reglas de layout para conversión:**

- El CTA primario (`AffiliateButton`) debe ser visible **sin scroll** en desktop y mobile
- Nunca más de **2 CTAs distintos** en el mismo viewport — uno principal (coral/naranja), uno secundario (outline azul)
- Las cards de tours/actividades muestran siempre: imagen, título, precio "desde $X", rating y botón — sin información que distraiga
- Precio siempre en **tamaño mayor** que el texto descriptivo cercano
- Sección de prueba social (ratings Viator/Civitatis) inmediatamente antes del CTA final de cada página de artículo
- Breadcrumb visible en artículos — reduce tasa de rebote y da contexto de navegación

**F-pattern en páginas de listado:**
- Primera fila: los 2–3 tours/planes más rentables (mayor comisión o más clicks históricos)
- Columna izquierda: filtros de categoría
- Cards con badge `"Más popular"` o `"Mejor precio"` en los primeros resultados

### Micro-interacciones CSS

```css
/* Botón CTA principal — efecto de profundidad al presionar */
.btn-primary {
  transition: transform 80ms ease-out, box-shadow 80ms ease-out;
}
.btn-primary:active {
  transform: translateY(2px);
  box-shadow: 0 1px 4px rgba(249,115,22,0.3);
}

/* Card hover — sube suavemente */
.card {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(14,165,233,0.15);
}
```

### Animaciones de scroll (GSAP + ScrollTrigger)

- Secciones de contenido: **fade + slide up** al entrar al viewport (`y: 30 → 0`, `opacity: 0 → 1`)
- Cards de tours: **stagger de 80ms** entre cards de una misma fila
- Números de estadísticas (ej. "4.8★ de 12.000 reseñas"): **counter animation** al entrar en viewport
- Header: se vuelve `sticky` + reduce altura + agrega `backdrop-blur` al hacer scroll (CSS puro, sin JS)

### Componentes de UI clave

| Componente | Descripción |
|---|---|
| `HeroGlobe.astro` | Isla Three.js — globo 3D con pin en Colombia |
| `WaveSection.astro` | Isla Three.js — separador con agua animada |
| `DestinationCard3D.astro` | Isla Three.js — card con tilt 3D al hover |
| `PriceCard.astro` | Card de precio con badge, rating y CTA — máxima prioridad visual |
| `ReviewStrip.astro` | Tira de reseñas reales de Viator (nombre, rating, texto corto) |
| `StickyBookBar.astro` | Barra inferior sticky en mobile: precio + CTA — siempre visible en artículos |
| `TrustBadges.astro` | Logos de Viator, GetYourGuide, Civitatis — señal de confianza |

### Lo que NO hacer en UI/UX
- No usar fondos blancos puros (`#FFFFFF`) como fondo de página
- No poner más de 2 CTAs distintos en el mismo viewport
- No animar elementos de texto body — solo headings, imágenes y cards
- No usar Three.js sin `client:visible` — penaliza el LCP
- No omitir el fallback CSS para escenas 3D
- No usar tipografías genéricas (Inter, Roboto, Arial) — rompen la identidad visual
- No colocar texto sobre imágenes sin overlay de suficiente contraste (mínimo WCAG AA: ratio 4.5:1)

---
- Usar el módulo nativo de Astro i18n (`i18n` en `astro.config.mjs`)
- Idiomas soportados: `es` (español, por defecto y en raíz), `en` (inglés), `pt` (portugués — Fase 2)
- El idioma por defecto (`es`) **no lleva prefijo en la URL** → `/cartagena/tours/isla-baru`
- Los demás idiomas llevan prefijo → `/en/cartagena/tours/isla-baru`
- Strings de UI centralizados en `src/i18n/translations/{locale}.ts` — nunca texto hardcodeado en componentes
- La función `useTranslations(locale)` en `src/i18n/index.ts` es el único punto de acceso a traducciones
- Cada componente recibe `locale` como prop — nunca lo infiere por su cuenta
- El atributo `lang` del `<html>` debe reflejar el locale actual en cada página

### SEO (prioridad alta)
- Cada página debe tener `<title>`, `<meta name="description">`, OG tags completos
- Usar el componente `SEO.astro` centralizado — nunca repetir meta tags manualmente
- Todas las imágenes deben tener atributo `alt` descriptivo
- URLs: locale por prefijo (salvo `es`) + destino + categoría + slug → `/cartagena/tours/isla-baru` / `/en/cartagena/tours/isla-baru`
- **`hreflang` obligatorio** en cada página: `es`, `en` y `x-default` apuntando a la versión española
- `SEO.astro` recibe el arreglo de alternates y los renderiza automáticamente
- Generar `sitemap.xml` con todas las variantes de idioma (`@astrojs/sitemap`)
- Agregar `robots.txt` desde el inicio

### Links de afiliados
- Nunca hardcodear un link de afiliado directamente en una página o componente
- Toda lógica de afiliados pasa por `IAffiliateRepository` → adaptador concreto
- Todos los links externos deben tener `target="_blank" rel="noopener noreferrer sponsored"`
- Usar el componente `AffiliateButton.astro` para todos los CTAs

### Contenido
- Artículos en formato Markdown con frontmatter tipado (validado por Zod en Content Collections)
- El **locale se infiere de la carpeta** (`src/content/es/`, `src/content/en/`) — no se repite en el frontmatter
- Cada artículo tiene una entrada por idioma con el mismo slug en la carpeta correspondiente
- Frontmatter mínimo requerido:
  ```yaml
  ---
  title: string
  description: string
  pubDate: Date
  destination: 'cartagena' | 'medellin' | 'bogota' | 'san-andres'
  category: 'tours' | 'playas' | 'gastronomia' | 'hospedaje' | 'itinerarios'
  image: string
  imageAlt: string
  affiliateIds: string[]   # IDs que conectan con los adaptadores de afiliados
  translationSlugs:        # slugs equivalentes en otros idiomas (para hreflang)
    en: string
    pt?: string
  ---
  ```

### Rendimiento
- Todas las imágenes deben usar `<Image />` de Astro
- Lazy loading en imágenes fuera del viewport inicial
- No importar librerías JS pesadas sin justificación clara

---

## Estructura de carpetas

```
src/
  core/                              # Dominio puro — sin dependencias de Astro
    domain/
      models.ts                      # Interfaces: Destination, Article, AffiliateLink, Category, Locale
    ports/
      IContentRepository.ts          # Contrato: cómo consultar artículos
      IAffiliateRepository.ts        # Contrato: cómo obtener links de afiliados
      ITranslationRepository.ts      # Contrato: cómo obtener strings de UI por locale
    services/                        # Casos de uso — orquestan dominio vía puertos
      ContentService.ts              # getArticlesByDestination, getArticleBySlug, getAlternates, etc.
      AffiliateService.ts            # getLinksForArticle, getLinksByCategory, etc.
      SeoService.ts                  # buildMetadata, buildCanonical, buildHreflang, etc.
      I18nService.ts                 # useTranslations, getLocaleFromUrl, getLocalizedPath, etc.

  adapters/                          # Implementaciones concretas de los puertos
    content/
      AstroContentAdapter.ts         # Implementa IContentRepository con Content Collections
    affiliates/
      ViatorAdapter.ts               # Implementa IAffiliateRepository — Viator
      CivitatisAdapter.ts            # Implementa IAffiliateRepository — Civitatis
      BookingAdapter.ts              # Implementa IAffiliateRepository — Booking.com
      GetYourGuideAdapter.ts         # Implementa IAffiliateRepository — GetYourGuide
    i18n/
      FileTranslationAdapter.ts      # Implementa ITranslationRepository desde archivos locales

  i18n/                              # Capa de internacionalización
    index.ts                         # useTranslations(locale), getLocaleFromUrl(), getLocalizedPath()
    locales.ts                       # LOCALES, DEFAULT_LOCALE, tipo Locale = 'es' | 'en' | 'pt'
    translations/
      es.ts                          # Strings en español (completo — es la fuente de verdad)
      en.ts                          # Strings en inglés
      pt.ts                          # Strings en portugués (Fase 2)

  content/                           # Astro Content Collections (datos)
    config.ts                        # Schema Zod validado
    es/                              # Contenido en español
      cartagena/
        tours/
        playas/
        gastronomia/
        hospedaje/
        itinerarios/
    en/                              # Contenido en inglés
      cartagena/
        tours/
        playas/
        gastronomia/
        hospedaje/
        itinerarios/
    # es/medellin/ y en/medellin/ ← se agregan en el futuro sin tocar nada existente

  data/
    destinations.ts                  # Registro de destinos activos (slug, nombre por locale, imagen)
    categories.ts                    # Registro de categorías (slug, label por locale, icono)

  components/                        # UI components — solo presentación
    SEO.astro                        # Recibe locale y alternates para hreflang
    AffiliateButton.astro
    ArticleCard.astro
    DestinationCard.astro
    Header.astro                     # Recibe locale, renderiza nav traducida + selector de idioma
    Footer.astro
    CategoryNav.astro
    LanguagePicker.astro             # Selector de idioma: muestra las variantes disponibles

  layouts/
    BaseLayout.astro                 # Recibe locale → setea <html lang={locale}>
    ArticleLayout.astro

  pages/                             # Rutas de Astro — thin layers
    index.astro                      # /  → redirige según preferencia de idioma del navegador
    [locale]/                        # Segmento de locale (es, en, pt)
      index.astro                    # /es/ o /en/ → home con lista de destinos
      [destino]/
        index.astro                  # /es/cartagena — home del destino
        [categoria]/
          index.astro                # /es/cartagena/tours — listado de categoría
          [slug].astro               # /es/cartagena/tours/isla-baru — artículo
    # El locale 'es' se sirve también desde la raíz vía Astro i18n (prefixDefaultLocale: false)

public/
  images/
  robots.txt
```

---

## Convenciones de código

- Nunca usar `any` en TypeScript
- Todos los tipos del dominio se definen en `src/core/domain/models.ts` (incluye el tipo `Locale`)
- Los adaptadores solo implementan la interfaz de su puerto — no contienen lógica de negocio
- Los servicios (`ContentService`, `AffiliateService`, `I18nService`) son las únicas clases que importan adaptadores
- Las páginas `.astro` solo importan servicios, nunca adaptadores directamente
- Todos los componentes que muestran texto reciben `locale: Locale` como prop — nunca usan `Astro.currentLocale` directamente
- El texto de la UI **nunca** se hardcodea en componentes `.astro`; siempre via `useTranslations(locale).key`
- `es.ts` es la fuente de verdad para todas las keys — si una key existe en `es.ts` debe existir en `en.ts`
- Para agregar un nuevo destino: crear carpetas en `src/content/es/` y `src/content/en/`, registrar en `destinations.ts`, listo
- Para agregar un nuevo idioma: crear `src/i18n/translations/{locale}.ts`, registrar en `locales.ts`, crear carpetas de contenido, listo
- Para agregar un nuevo proveedor de afiliados: crear adaptador en `src/adapters/affiliates/`, registrar en `AffiliateService`, listo

---

## Lo que NO hacer
- No usar React/Vue/Svelte a menos que sea estrictamente necesario (Astro islands solo si hay interactividad real — Three.js y GSAP no requieren React)
- No agregar CSS frameworks adicionales a Tailwind
- No usar base de datos — todo es contenido estático en Markdown
- No colocar lógica de negocio en páginas `.astro` ni en componentes UI
- No hardcodear slugs de destinos fuera de `destinations.ts`
- No hardcodear texto de UI dentro de componentes — siempre via `useTranslations()`
- No omitir las etiquetas `hreflang` en ninguna página pública
- No usar `Astro.currentLocale` directamente en componentes — recibirlo como prop desde la página
- No usar Three.js sin `client:visible` — penaliza el LCP
- No omitir el fallback CSS estático para escenas 3D
- No usar tipografías genéricas (Inter, Roboto, Arial)
- No usar unidades fijas (`px`) para anchos de contenedores
- No omitir el estado `:focus-visible` en elementos interactivos
- No comunicar información únicamente con color (sin texto o icono de apoyo)
- No autenticación de ningún tipo en esta fase
- No crear páginas de admin o dashboard
- No usar `any` en TypeScript

---

## Primeros pasos cuando se inicie el desarrollo
1. `npm create astro@latest` con template mínimo
2. Instalar `@astrojs/tailwind`, `@astrojs/sitemap`
3. Instalar fuentes: `@fontsource/playfair-display`, `@fontsource/dm-sans`
4. Instalar animaciones: `gsap`, `three`, `@types/three`
5. Configurar `tsconfig.json` con `strict: true`
4. Configurar i18n en `astro.config.mjs`:
   ```js
   i18n: {
     defaultLocale: 'es',
     locales: ['es', 'en'],
     routing: { prefixDefaultLocale: false } // 'es' en raíz, 'en' con prefijo
   }
   ```
5. Crear `src/i18n/locales.ts` con el tipo `Locale` y `DEFAULT_LOCALE`
6. Crear `src/i18n/translations/es.ts` y `en.ts` con todas las keys de UI
7. Crear `src/i18n/index.ts` con `useTranslations(locale)` y `getLocalizedPath()`
8. Definir interfaces en `src/core/domain/models.ts` (incluir `Locale`)
9. Definir puertos `IContentRepository`, `IAffiliateRepository`, `ITranslationRepository`
10. Implementar `AstroContentAdapter` con soporte multi-locale
11. Crear `ContentService`, `AffiliateService` e `I18nService`
12. Crear `BaseLayout.astro` con `<html lang={locale}>` y `SEO.astro` con hreflang
13. Crear estructura de rutas `[locale]/[destino]/[categoria]/[slug]`
14. Registrarse en Viator Affiliate Program y Civitatis antes de publicar
