# Familia `blocks/application/app-shell` (base: `base` / Base UI)

Catálogo de shells de aplicación para Kromm UI. Cada block es una pantalla completa,
autocontenida, renderizable en la ruta de preview del sitio: `/preview/base/app-shell-NN`.

## Convenciones duras (leer antes de escribir código)

- Directorio por variante: `app-shell-NN/app-shell-NN.tsx`.
- Export nombrado: `AppShellNN` (NN con dos dígitos, p. ej. `export function AppShell01()`).
- Un archivo por variante. Datos mock inline en el mismo archivo. Sin fetch, sin estado
  de servidor. `"use client"` solo si hay interactividad (useState, handlers).
- Solo pueden importarse:
  - Primitivos de `@/registry/bases/base/ui/`: `button`, `badge`, `card`, `field`,
    `input`, `kbd`, `label`, `native-select`, `separator`, `skeleton`, `tabs`.
    (Revisar cada archivo antes de usarlo: nombres de export reales.)
  - `cn` desde `"cn"` (paquete npm `cn`).
  - Iconos desde `lucide-react` (v1.11).
  - React.
- **Prohibido**: `@/components/ui/*` (fuga del sitio), nuevas dependencias npm, CSS
  global, imports de otras variantes, archivos fuera de tu directorio asignado.
- Tema: usar tokens semánticos (`bg-background`, `text-foreground`, `border-border`,
  `bg-muted`, `text-muted-foreground`, `bg-sidebar`…). Nada de colores hardcodeados salvo
  acentos puntuales (dots de estado: `bg-emerald-500`, `bg-amber-400`…).
- Sizing: el block raíz es `min-h-screen w-full bg-background` (o `h-svh` con
  `overflow-hidden` cuando el shell gestiona su propio scroll). Sidebar ≈ `--sidebar-width: 250px`,
  header 50px, topbars 44–48px. Todo responsive: en `<md` el sidebar se oculta.
- A11y mínima: `aria-label` en botones de icono, landmarks (`<aside>`, `<header>`,
  `<main>`), foco visible heredado de los primitivos.
- Estilo: replica la estética ReUI/nova (borde sutil, radius lg, tab “line” con subrayado,
  badges pill pequeños). Nada de gradientes salvo acentos de marca muy puntuales.

## Catálogo de variantes

| Block        | Nombre interno | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| app-shell-01 | AppShell01     | Sidebar nav simple: logo, secciones de menú, footer de usuario, contenido con cabecera y grid de tarjetas.                                                                                                                                                                                                                                                                                                                        |
| app-shell-02 | AppShell02     | Icon rail (54px) + panel secundario contextual + contenido.                                                                                                                                                                                                                                                                                                                                                                       |
| app-shell-03 | AppShell03     | Doble sidebar: nav izquierda + panel derecho de contexto (tipo inspector).                                                                                                                                                                                                                                                                                                                                                        |
| app-shell-04 | AppShell04     | Top nav principal + fila de tabs secundarios + contenido.                                                                                                                                                                                                                                                                                                                                                                         |
| app-shell-05 | AppShell05     | Dashboard: sidebar compacta + header con breadcrumb + KPI grid + fila de paneles.                                                                                                                                                                                                                                                                                                                                                 |
| app-shell-06 | AppShell06     | Record list                                                                                                                                                                                                                                                                                                                                                                                                                       | detail: lista a la izquierda, detalle con tabs a la derecha. |
| app-shell-07 | AppShell07     | Consola/chat: sidebar de conversaciones + hilo central + composer fijo abajo.                                                                                                                                                                                                                                                                                                                                                     |
| app-shell-08 | AppShell08     | Kanban shell: toolbar + columnas de estados con tarjetas.                                                                                                                                                                                                                                                                                                                                                                         |
| app-shell-09 | AppShell09     | Library/media: barra de filtros + grid de items + panel lateral de selección.                                                                                                                                                                                                                                                                                                                                                     |
| app-shell-10 | AppShell10     | Settings shell: nav de secciones vertical + formulario con secciones.                                                                                                                                                                                                                                                                                                                                                             |
| app-shell-11 | AppShell11     | Extracción 1:1 del preview ReUI `base/app-shell-11`: sidebar completa (search ⌘K, notificaciones, grupos, operadoras, frame “AI Drafts”, footer Codex), header con breadcrumb de workspace + acciones, topbar de registro con grupo de toggles de layout, panes resizables (ma ʻin: tabs + skeletons, detalle con tabs), workbench bottom sheet con tabs estado, panel de contexto derecho (calendario + My Calendars + Up Next). |

## Preview

La ruta `apps/web/app/preview/[base]/[block]/page.tsx` resuelve el componente desde
`apps/web/lib/preview/blocks.ts` (owner: Lead). No editar esos archivos.
