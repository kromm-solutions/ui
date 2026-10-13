import { cn } from "cn";
import {
  ArrowDownUpIcon,
  DownloadIcon,
  FileIcon,
  FileTypeIcon,
  ImageIcon,
  LayoutPanelLeftIcon,
  MoreHorizontalIcon,
  Music2Icon,
  SearchIcon,
  SlidersHorizontalIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";

import { Badge } from "@/registry/bases/base/ui/badge";
import { Button } from "@/registry/bases/base/ui/button";
import { Input } from "@/registry/bases/base/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/base/ui/native-select";
import { Separator } from "@/registry/bases/base/ui/separator";

interface MediaItem {
  id: string;
  name: string;
  kind: "Imagen" | "Audio" | "Documento";
  size: string;
  updated: string;
  selected?: boolean;
}

const items: MediaItem[] = [
  {
    id: "m1",
    kind: "Imagen",
    name: "portada-hero.webp",
    selected: true,
    size: "1.8 MB",
    updated: "hace 2 h",
  },
  {
    id: "m2",
    kind: "Imagen",
    name: "logos-clientes.svg",
    size: "96 KB",
    updated: "ayer",
  },
  {
    id: "m3",
    kind: "Audio",
    name: "jingle-intro.mp3",
    size: "3.1 MB",
    updated: "hace 3 días",
  },
  {
    id: "m4",
    kind: "Documento",
    name: "guia-de-marca.pdf",
    size: "4.6 MB",
    updated: "hace 4 días",
  },
  {
    id: "m5",
    kind: "Imagen",
    name: "screenshot-flow.png",
    size: "920 KB",
    updated: "hace 1 semana",
  },
  {
    id: "m6",
    kind: "Audio",
    name: "podcast-ep07.mp3",
    size: "28 MB",
    updated: "hace 2 semanas",
  },
  {
    id: "m7",
    kind: "Documento",
    name: "contrato-2026.docx",
    size: "120 KB",
    updated: "hace 2 semanas",
  },
  {
    id: "m8",
    kind: "Imagen",
    name: "iconos-app.webp",
    size: "340 KB",
    updated: "hace 1 mes",
  },
];

const kindIcon = {
  Audio: Music2Icon,
  Documento: FileTypeIcon,
  Imagen: ImageIcon,
};

export function AppShell09() {
  const selected = items.find((item) => item.selected) ?? items[0];

  return (
    <div className="flex h-svh w-full flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-[50px] shrink-0 items-center gap-3 border-b border-border px-4">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
          K
        </div>
        <span className="text-sm font-semibold">Kromm</span>
        <Separator orientation="vertical" className="!h-5" />
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <LayoutPanelLeftIcon className="size-4" /> Biblioteca multimedia
        </span>
        <Button
          size="icon-sm"
          variant="ghost"
          className="ml-auto"
          aria-label="Más opciones"
        >
          <MoreHorizontalIcon />
        </Button>
      </header>

      {/* Barra de filtros */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
        <h1 className="text-sm font-semibold">Archivos</h1>
        <Badge variant="secondary" className="rounded-full">
          {items.length}
        </Badge>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden w-56 md:block">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="app-shell-09-search"
              placeholder="Buscar archivos…"
              className="h-8 rounded-lg pl-8 text-sm"
            />
          </div>
          <NativeSelect
            aria-label="Tipo de archivo"
            size="sm"
            defaultValue="todos"
          >
            <NativeSelectOption value="todos">
              Todos los tipos
            </NativeSelectOption>
            <NativeSelectOption value="imagen">Imagen</NativeSelectOption>
            <NativeSelectOption value="audio">Audio</NativeSelectOption>
            <NativeSelectOption value="documento">Documento</NativeSelectOption>
          </NativeSelect>
          <Button size="sm" variant="outline" aria-label="Ordenar">
            <ArrowDownUpIcon /> Recientes
          </Button>
          <Button size="sm" variant="outline" aria-label="Más filtros">
            <SlidersHorizontalIcon />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Grid de items */}
        <main className="min-w-0 flex-1 overflow-y-auto p-4">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item) => {
              const Icon = kindIcon[item.kind];
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={item.selected === true}
                    className={cn(
                      "group flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition-colors hover:border-foreground/20",
                      item.selected && "border-primary ring-2 ring-primary/20"
                    )}
                  >
                    <span className="flex aspect-[4/3] items-center justify-center bg-muted">
                      <Icon className="size-8 text-muted-foreground transition-transform group-hover:scale-105" />
                    </span>
                    <span className="flex w-full flex-col gap-1 p-2.5">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">
                          {item.name}
                        </span>
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <Badge variant="secondary" className="rounded-full">
                          {item.kind}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.size}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </main>

        {/* Panel de selección */}
        <aside className="hidden w-[280px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border p-4 lg:flex">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Detalles</h2>
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label="Destacar archivo"
            >
              <StarIcon />
            </Button>
          </div>
          <span className="flex aspect-[4/3] items-center justify-center rounded-lg border border-border bg-muted">
            <FileIcon className="size-8 text-muted-foreground" />
          </span>
          <div>
            <p className="truncate text-sm font-medium">{selected.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {selected.kind} · {selected.size}
            </p>
          </div>
          <Separator />
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Última edición</dt>
              <dd className="font-medium">{selected.updated}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Subido por</dt>
              <dd className="flex items-center gap-1.5 font-medium">
                <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[9px]">
                  MG
                </span>
                María Gómez
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Ubicación</dt>
              <dd className="font-medium">Marketing / Activos</dd>
            </div>
          </dl>
          <div className="mt-auto flex flex-col gap-2">
            <Button size="sm" className="w-full">
              <DownloadIcon /> Descargar
            </Button>
            <Button size="sm" variant="destructive" className="w-full">
              <Trash2Icon /> Eliminar
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
