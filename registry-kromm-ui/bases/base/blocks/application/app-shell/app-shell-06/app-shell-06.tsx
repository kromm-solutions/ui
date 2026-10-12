"use client";

import {
  ArrowUpRightIcon,
  CircleCheckIcon,
  ClockIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  SearchIcon,
  TagIcon,
} from "lucide-react";
import { cn } from "cn";
import { useState } from "react";

import { Badge } from "@/registry/bases/base/ui/badge";
import { Button } from "@/registry/bases/base/ui/button";
import { Input } from "@/registry/bases/base/ui/input";
import { Separator } from "@/registry/bases/base/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/bases/base/ui/tabs";

type Record = {
  id: string;
  title: string;
  company: string;
  owner: string;
  ownerInitials: string;
  status: "Activo" | "Pendiente" | "Riesgo";
  value: string;
  updated: string;
  tags: string[];
  description: string;
};

const records: Record[] = [
  {
    id: "RC-1021",
    title: "Migración a la nueva API de pagos",
    company: "Northwind Labs",
    owner: "María Gómez",
    ownerInitials: "MG",
    status: "Activo",
    value: "$48,200",
    updated: "hace 12 min",
    tags: ["Pagos", "Backend"],
    description:
      "Sustituir el procesador de pagos legacy por la nueva API unificada. Incluye reconciliación de facturas históricas y soporte multi-moneda.",
  },
  {
    id: "RC-1020",
    title: "Rediseño del onboarding de clientes",
    company: "Acme Corp",
    owner: "Diego Lara",
    ownerInitials: "DL",
    status: "Pendiente",
    value: "$31,500",
    updated: "hace 1 h",
    tags: ["Producto", "UX"],
    description:
      "Nuevo flujo de alta en tres pasos con verificación de correo, wizard de datos de empresa y asignación automática de plan.",
  },
  {
    id: "RC-1019",
    title: "Integración con CRM externo",
    company: "Globex",
    owner: "Ana Ruiz",
    ownerInitials: "AR",
    status: "Riesgo",
    value: "$72,900",
    updated: "hace 3 h",
    tags: ["Integraciones"],
    description:
      "Sincronización bidireccional de contactos y oportunidades. Pendiente de resolver conflictos de esquema con campos personalizados.",
  },
  {
    id: "RC-1018",
    title: "Informe trimestral de retención",
    company: "Initech",
    owner: "Pablo Ortiz",
    ownerInitials: "PO",
    status: "Activo",
    value: "$12,100",
    updated: "ayer",
    tags: ["Analítica"],
    description:
      "Dashboard de churn por cohortes con exportación a CSV y alertas automáticas cuando la retención baja del umbral.",
  },
  {
    id: "RC-1017",
    title: "Automatización de facturación anual",
    company: "Umbrella Inc.",
    owner: "María Gómez",
    ownerInitials: "MG",
    status: "Pendiente",
    value: "$25,400",
    updated: "ayer",
    tags: ["Pagos", "Automatización"],
    description:
      "Facturación anual con prorrateo, recordatorios de renovación y portal de autoservicio para actualizar métodos de pago.",
  },
];

const activity = [
  { who: "María Gómez", initials: "MG", text: "actualizó el estado a Activo", time: "hace 12 min" },
  { who: "Diego Lara", initials: "DL", text: "añadió un comentario interno", time: "hace 42 min" },
  { who: "Ana Ruiz", initials: "AR", text: "subió el documento de alcance", time: "hace 2 h" },
];

const files = [
  { name: "alcance-tecnico.pdf", size: "2.4 MB" },
  { name: "contrato-v3.docx", size: "312 KB" },
  { name: "cronograma.csv", size: "84 KB" },
];

const statusDot: Record<Record["status"], string> = {
  Activo: "bg-emerald-500",
  Pendiente: "bg-amber-400",
  Riesgo: "bg-red-500",
};

export function AppShell06() {
  const [selectedId, setSelectedId] = useState(records[0].id);
  const selected = records.find((r) => r.id === selectedId) ?? records[0];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-[50px] shrink-0 items-center gap-3 border-b border-border px-4">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
          K
        </div>
        <span className="text-sm font-semibold">Kromm</span>
        <Separator orientation="vertical" className="!h-5" />
        <span className="text-sm text-muted-foreground">Registros</span>
        <div className="relative ml-auto hidden w-64 sm:block">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="app-shell-06-search"
            placeholder="Buscar registros…"
            className="h-8 rounded-lg pl-8 text-sm"
          />
        </div>
        <Button size="icon-sm" variant="ghost" aria-label="Más opciones">
          <MoreHorizontalIcon />
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Lista de registros */}
        <aside className="flex w-full flex-col border-r border-border md:w-[340px] lg:w-[380px]">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <h1 className="text-sm font-semibold">Todos los registros</h1>
            <Badge variant="secondary" className="rounded-full">
              {records.length}
            </Badge>
          </div>
          <div className="flex flex-col gap-1 overflow-y-auto px-2 pb-4">
            {records.map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={() => setSelectedId(record.id)}
                aria-current={record.id === selectedId}
                className={cn(
                  "flex flex-col gap-1.5 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:bg-muted",
                  record.id === selectedId && "border-border bg-muted"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("size-1.5 shrink-0 rounded-full", statusDot[record.status])} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{record.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{record.id}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-muted-foreground">{record.company}</span>
                  <span className="text-xs font-medium">{record.value}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Detalle */}
        <main className="hidden min-w-0 flex-1 flex-col md:flex">
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-semibold">{selected.title}</h2>
                <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {selected.id} · {selected.company} · Actualizado {selected.updated}
              </p>
            </div>
            <Badge variant="outline" className="gap-1.5 rounded-full">
              <span className={cn("size-1.5 rounded-full", statusDot[selected.status])} />
              {selected.status}
            </Badge>
          </div>

          <Tabs defaultValue="resumen" className="flex-1 gap-0">
            <TabsList className="h-auto w-full justify-start gap-4 rounded-none border-b border-border bg-transparent p-0 px-6">
              {["resumen", "actividad", "archivos"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="h-10 rounded-none border-0 border-b-2 border-b-transparent px-1 font-medium capitalize shadow-none data-[selected]:border-b-primary data-[selected]:bg-transparent dark:data-[selected]:border-b-primary dark:data-[selected]:bg-transparent data-[selected]:shadow-none"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="resumen" className="px-6 py-5">
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {selected.description}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border p-4">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <TagIcon className="size-3.5" /> Etiquetas
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selected.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ClockIcon className="size-3.5" /> Última actualización
                  </p>
                  <p className="mt-2 text-sm font-medium">{selected.updated}</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CircleCheckIcon className="size-3.5" /> Responsable
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                      {selected.ownerInitials}
                    </span>
                    <span className="text-sm font-medium">{selected.owner}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actividad" className="px-6 py-5">
              <ul className="flex max-w-xl flex-col gap-4">
                {activity.map((item) => (
                  <li key={item.time} className="flex items-start gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                      {item.initials}
                    </span>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{item.who}</span>{" "}
                        <span className="text-muted-foreground">{item.text}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="archivos" className="px-6 py-5">
              <ul className="flex max-w-xl flex-col gap-2">
                {files.map((file) => (
                  <li
                    key={file.name}
                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5"
                  >
                    <FileTextIcon className="size-4 text-muted-foreground" />
                    <span className="flex-1 truncate text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{file.size}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
