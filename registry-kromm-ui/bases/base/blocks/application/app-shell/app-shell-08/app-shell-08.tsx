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
import { cn } from "cn";

import { Badge } from "@/registry/bases/base/ui/badge";
import { Button } from "@/registry/bases/base/ui/button";
import { Input } from "@/registry/bases/base/ui/input";
import { Separator } from "@/registry/bases/base/ui/separator";

type Task = {
  id: string;
  title: string;
  labels: string[];
  comments: number;
  assignee: string;
  date: string;
};

type Column = {
  id: string;
  title: string;
  dot: string;
  tasks: Task[];
};

const columns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    dot: "bg-muted-foreground",
    tasks: [
      {
        id: "KB-14",
        title: "Definir métricas de éxito para Q4",
        labels: ["Estrategia"],
        comments: 2,
        assignee: "AR",
        date: "12 oct",
      },
      {
        id: "KB-15",
        title: "Auditoría de accesibilidad en el checkout",
        labels: ["A11y", "Pagos"],
        comments: 0,
        assignee: "DL",
        date: "14 oct",
      },
      {
        id: "KB-16",
        title: "Investigar soporte de notificaciones push",
        labels: ["Investigación"],
        comments: 5,
        assignee: "PO",
        date: "17 oct",
      },
    ],
  },
  {
    id: "en-curso",
    title: "En curso",
    dot: "bg-amber-400",
    tasks: [
      {
        id: "KB-11",
        title: "Rediseño del header de navegación",
        labels: ["UI", "Producto"],
        comments: 8,
        assignee: "MG",
        date: "9 oct",
      },
      {
        id: "KB-12",
        title: "API de webhooks para integraciones",
        labels: ["Backend"],
        comments: 3,
        assignee: "AR",
        date: "10 oct",
      },
    ],
  },
  {
    id: "revision",
    title: "En revisión",
    dot: "bg-sky-500",
    tasks: [
      {
        id: "KB-9",
        title: "Formulario de edición de perfil",
        labels: ["UI", "Forms"],
        comments: 12,
        assignee: "DL",
        date: "8 oct",
      },
      {
        id: "KB-10",
        title: "Telemetría de errores en tiempo real",
        labels: ["Backend", "Analítica"],
        comments: 1,
        assignee: "PO",
        date: "11 oct",
      },
    ],
  },
  {
    id: "hecho",
    title: "Hecho",
    dot: "bg-emerald-500",
    tasks: [
      {
        id: "KB-5",
        title: "Página 404 con estado ilustrado",
        labels: ["UI"],
        comments: 4,
        assignee: "MG",
        date: "3 oct",
      },
      {
        id: "KB-6",
        title: "Migración de tokens a OKLCH",
        labels: ["Diseño"],
        comments: 7,
        assignee: "AR",
        date: "1 oct",
      },
      {
        id: "KB-7",
        title: "Configurar CI para el registry",
        labels: ["DevOps"],
        comments: 2,
        assignee: "PO",
        date: "30 sep",
      },
    ],
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
        <Button size="icon-sm" variant="ghost" className="ml-auto" aria-label="Más opciones">
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
            <Input id="app-shell-08-search" placeholder="Buscar tarea…" className="h-8 rounded-lg pl-8 text-sm" />
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
              <Button size="icon-xs" variant="ghost" className="ml-auto" aria-label={`Añadir tarea en ${column.title}`}>
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
                    <p className="text-sm leading-snug font-medium">{task.title}</p>
                    <Button size="icon-xs" variant="ghost" aria-label="Opciones de tarea">
                      <MoreHorizontalIcon />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {task.labels.map((label) => (
                      <Badge key={label} variant="secondary" className="rounded-full">
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
