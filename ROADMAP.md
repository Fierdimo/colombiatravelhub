# Colombia Travel Hub — Roadmap

## Concepto
Sitio web de contenido turístico sobre destinos de Colombia, orientado al viajero nacional e internacional. Lanzamiento con Cartagena de Indias; arquitectura hexagonal preparada para escalar a nuevos destinos sin refactoring. Monetización 100% mediante afiliados (Viator, GetYourGuide, Civitatis, Booking.com). Sin inventario propio, sin tratar con negocios locales directamente.

## Arquitectura
- Patrón **Hexagonal (Ports & Adapters)** — dominio TypeScript puro, Astro y afiliados como adaptadores externos
- Principios **SOLID, KISS, DRY** aplicados en cada capa
- **i18n nativo de Astro** — `es` en raíz, `en` con prefijo; `pt` en Fase 2
- Nuevos destinos se agregan creando contenido + registrando en `destinations.ts` — sin tocar código existente
- Nuevos idiomas se agregan creando el archivo de traducciones + carpetas de contenido — sin tocar lógica
- Nuevos proveedores de afiliados se agregan creando un adaptador — sin tocar servicios ni páginas

## Modelo de ingresos
| Plataforma | Tipo | Comisión estimada |
|---|---|---|
| Viator | Tours y actividades | ~8% por reserva |
| GetYourGuide | Tours y actividades | ~8–10% por reserva |
| Civitatis | Tours (enfoque latam) | ~8% por reserva |
| Booking.com | Hospedajes | ~25–40% sobre comisión de Booking |

## Stack tecnológico propuesto
- **Framework**: Astro (rendimiento SEO óptimo, ideal para sitios de contenido)
- **Estilos**: Tailwind CSS + sistema de tokens de color en `tailwind.config`
- **Tipografía**: Playfair Display (display) + DM Sans (body) — via `@fontsource`
- **Animaciones**: GSAP + ScrollTrigger (scroll), CSS puro (micro-interacciones)
- **3D**: Three.js como Astro islands (`client:visible`) — globo, ondas, cards con tilt
- **Deployment**: Vercel (gratis en tier inicial)
- **CMS**: Markdown local con Content Collections de Astro
- **Analytics**: Umami self-hosted o Plausible (privacidad + gratis)
- **Imágenes**: Unsplash API + imágenes propias progresivamente

## Fases

### Fase 0 — Arquitectura base (antes del MVP)
- [ ] Configurar Astro i18n (`es` default en raíz, `en` con prefijo)
- [ ] Crear capa `src/i18n/`: tipo `Locale`, `useTranslations()`, `getLocalizedPath()`
- [ ] Crear traducciones iniciales `es.ts` y `en.ts` con todas las keys de UI
- [ ] Definir interfaces de dominio (`models.ts` con `Locale`, puertos)
- [ ] Implementar `AstroContentAdapter`, `ContentService`, `AffiliateService`, `I18nService`
- [ ] Configurar `tailwind.config` con tokens de color y tipografía del sistema de diseño
- [ ] Instalar y configurar `@fontsource/playfair-display` y `@fontsource/dm-sans`
- [ ] Crear `BaseLayout.astro` con `<html lang>` dinámico, hreflang y fuentes
- [ ] Crear componentes Three.js: `HeroGlobe.astro`, `WaveSection.astro`, `DestinationCard3D.astro`
- [ ] Configurar GSAP + ScrollTrigger con wrapper `prefers-reduced-motion`
- [ ] Configurar rutas dinámicas `[locale]/[destino]/[categoria]/[slug]`

### Fase 1 — MVP Cartagena (2–3 semanas)
- [ ] Landing page en español e inglés con propuesta de valor clara
- [ ] 5–10 artículos de contenido inicial en `es/` y `en/` (mejores playas, qué hacer, tours, itinerarios)
- [ ] `LanguagePicker` funcional en header
- [ ] Integración de links de afiliados de Viator y Civitatis
- [ ] SEO on-page: meta tags, OG, hreflang, sitemap con variantes de idioma, robots.txt
- [ ] Deploy en Vercel con dominio propio

### Fase 2 — Contenido y SEO (semanas 4–8)
- [ ] 20–30 artículos en español (keywords de cola larga: "qué hacer en Cartagena con niños", "tour isla Barú precio")
- [ ] 10–15 artículos en inglés (keywords internacionales: "best beaches Cartagena Colombia", "Cartagena tours from cruise port")
- [ ] Páginas de categoría: Playas / Tours / Gastronomía / Hospedaje / Itinerarios (ambos idiomas)
- [ ] Integración completa de Booking.com y GetYourGuide afiliados
- [ ] Schema markup para artículos (Article, TouristAttraction, TouristTrip)
- [ ] Google Search Console configurado (ambas versiones de idioma)
- [ ] Incorporar idioma portugués (`pt`) — traducciones UI + primeros artículos

### Fase 3 — Expansión de destinos (mes 3 en adelante)
- [ ] Segundo destino: Medellín o San Andrés (solo agregar contenido + entrada en `destinations.ts`)
- [ ] Estrategia de backlinks (publicar en foros de viajeros, Reddit r/Colombia, grupos de Facebook)
- [ ] Presencia en Pinterest (tráfico visual relevante para turismo)
- [ ] Newsletter mensual con planes de viaje
- [ ] A/B testing de CTAs hacia links de afiliados
- [ ] Evaluación de monetización adicional (guías PDF de pago en Gumroad)

## KPIs objetivo
| Métrica | Mes 3 | Mes 6 |
|---|---|---|
| Visitas/mes | 1.000 | 5.000 |
| % tráfico internacional (en/pt) | 20% | 40% |
| Clicks a afiliados | 100 | 600 |
| Conversión estimada | 2–3% | 3–5% |
| Ingreso estimado | $20–50 USD | $100–300 USD |

## Inversión inicial
| Ítem | Costo |
|---|---|
| Dominio (.com) | ~$12 USD/año |
| Hosting | $0 (Vercel free tier) |
| Herramientas | $0 (todas en tier gratuito) |
| **Total** | **~$12 USD** |
