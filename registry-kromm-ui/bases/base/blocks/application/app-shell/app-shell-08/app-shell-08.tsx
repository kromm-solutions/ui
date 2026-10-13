import { cn } from "cn";
import {
  CalendarIcon,
  LayoutGridIcon,
  ListFilterIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SquareKanbanIcon,
} from "lucide-react";

import { Badge } from "@/registry/bases/base/ui/badge";
import { Button } from "@/registry/bases/base/ui/button";
import { Input } from "@/registry/bases/base/ui/input";
import { Separator } from "@/registry/bases/base/ui/separator";

interface Task {
  id: string;
  title: string;
  labels: string[];
  comments: number;
  assignee: string;
  date: string;
}

interface Column {
  id: string;
  title: string;
  dot: string;
  tasks: Task[];
}

const columns: Column[] = [
  {
    dot: "bg-muted-foreground",
    id: "backlog",
    tasks: [
      {
        assignee: "AR",
        comments: 2,
        date: "12 oct",
        id: "KB-14",
        labels: ["Estrategia"],
        title: "Definir métricas de éxito para Q4",
      },
      {
        assignee: "DL",
        comments: 0,
        date: "14 oct",
        id: "KB-15",
        labels: ["A11y", "Pagos"],
        title: "Auditoría de accesibilidad en el checkout",
      },
      {
        assignee: "PO",
        comments: 5,
        date: "17 oct",
        id: "KB-16",
        labels: ["Investigación"],
        title: "Investigar soporte de notificaciones push",
      },
    ],
    title: "Backlog",
  },
  {
    dot: "bg-amber-400",
    id: "en-curso",
    tasks: [
      {
        assignee: "MG",
        comments: 8,
        date: "9 oct",
        id: "KB-11",
        labels: ["UI", "Producto"],
        title: "Rediseño del header de navegación",
      },
      {
        assignee: "AR",
        comments: 3,
        date: "10 oct",
        id: "KB-12",
        labels: ["Backend"],
        title: "API de webhooks para integraciones",
      },
    ],
    title: "En curso",
  },
  {
    dot: "bg-sky-500",
    id: "revision",
    tasks: [
      {
        assignee: "DL",
        comments: 12,
        date: "8 oct",
        id: "KB-9",
        labels: ["UI", "Forms"],
        title: "Formulario de edición de perfil",
      },
      {
        assignee: "PO",
        comments: 1,
        date: "11 oct",
        id: "KB-10",
        labels: ["Backend", "Analítica"],
        title: "Telemetría de errores en tiempo real",
      },
    ],
    title: "En revisión",
  },
  {
    dot: "bg-emerald-500",
    id: "hecho",
    tasks: [
      {
        assignee: "MG",
        comments: 4,
        date: "3 oct",
        id: "KB-5",
        labels: ["UI"],
        title: "Página 404 con estado ilustrado",
      },
      {
        assignee: "AR",
        comments: 7,
        date: "1 oct",
        id: "KB-6",
        labels: ["Diseño"],
        title: "Migración de tokens a OKLCH",
      },
      {
        assignee: "PO",
        comments: 2,
        date: "30 sep",
        id: "KB-7",
        labels: ["DevOps"],
        title: "Configurar CI para el registry",
      },
    ],
    title: "Hecho",
  },
];

export function AppShell08() {
  return (
    <div className="flex h-svh w-full flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-[50px] shrink-0 items-center gap-3 border-b border-border px-4">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
          K
        </div>
        <span className="text-sm font-semibold">Kromm</span>
        <Separator orientation="vertical" className="!h-5" />
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <SquareKanbanIcon className="size-4" /> Tablero de producto
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

      {/* Toolbar */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
        <LayoutGridIcon className="size-4 text-muted-foreground" />
        <h1 className="text-sm font-semibold">Sprint 24 · Kanban</h1>
        <Badge variant="secondary" className="rounded-full">
          10 tareas
        </Badge>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden w-56 sm:block">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="app-shell-08-search"
              placeholder="Buscar tarea…"
              className="h-8 rounded-lg pl-8 text-sm"
            />
          </div>
          <Button size="sm" variant="outline">
            <ListFilterIcon /> Filtros
          </Button>
          <Button size="sm">
            <PlusIcon /> Nueva tarea
          </Button>
        </div>
      </div>

      {/* Columnas */}
      <main className="flex min-h-0 flex-1 gap-4 overflow-x-auto p-4">
        {columns.map((column) => (
          <section
            key={column.id}
            className="flex w-[290px] shrink-0 flex-col rounded-lg border border-border bg-muted/40"
            aria-label={column.title}
          >
            <div className="flex items-center gap-2 px-3 pt-3 pb-2">
              <span className={cn("size-1.5 rounded-full", column.dot)} />
              <h2 className="text-sm font-semibold">{column.title}</h2>
              <Badge variant="secondary" className="rounded-full">
                {column.tasks.length}
              </Badge>
              <Button
                size="icon-xs"
                variant="ghost"
                className="ml-auto"
                aria-label={`Añadir tarea en ${column.title}`}
              >
                <PlusIcon />
              </Button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
              {column.tasks.map((task) => (
                <article
                  key={task.id}
                  className="flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm leading-snug font-medium">
                      {task.title}
                    </p>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      aria-label="Opciones de tarea"
                    >
                      <MoreHorizontalIcon />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {task.labels.map((label) => (
                      <Badge
                        key={label}
                        variant="secondary"
                        className="rounded-full"
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="size-3.5" /> {task.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquareIcon className="size-3.5" /> {task.comments}
                    </span>
                    <span className="ml-auto flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-foreground">
                      {task.assignee}
                    </span>
                  </div>
                </article>
              ))}
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <PlusIcon className="size-3.5" /> Añadir tarjeta
              </button>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
