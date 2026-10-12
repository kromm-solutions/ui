"use client";

import {
  HashIcon,
  ImageIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  SmileIcon,
} from "lucide-react";
import { cn } from "cn";
import { useState } from "react";

import { Badge } from "@/registry/bases/base/ui/badge";
import { Button } from "@/registry/bases/base/ui/button";
import { Input } from "@/registry/bases/base/ui/input";
import { Separator } from "@/registry/bases/base/ui/separator";

type Conversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
  initials: string;
};

type Message = {
  id: number;
  author: string;
  initials: string;
  text: string;
  time: string;
  mine: boolean;
};

const conversations: Conversation[] = [
  {
    id: "c1",
    name: "Equipo Producto",
    preview: "Sí, subo el mock en un rato 👍",
    time: "10:42",
    unread: 2,
    initials: "EP",
  },
  {
    id: "c2",
    name: "María Gómez",
    preview: "¿Revisaste el PR de ayer?",
    time: "09:18",
    unread: 0,
    initials: "MG",
  },
  {
    id: "c3",
    name: "Soporte Clientes",
    preview: "Caso #4812 resuelto y cerrado",
    time: "Ayer",
    unread: 0,
    initials: "SC",
  },
  {
    id: "c4",
    name: "Ana Ruiz",
    preview: "La demo del viernes queda confirmada",
    time: "Ayer",
    unread: 4,
    initials: "AR",
  },
  {
    id: "c5",
    name: "Canal #releases",
    preview: "v2.4.0 publicada en producción",
    time: "Lun",
    unread: 0,
    initials: "#r",
  },
];

const initialMessages: Message[] = [
  {
    id: 1,
    author: "María Gómez",
    initials: "MG",
    text: "Buenos días, ¿ya está lista la propuesta del nuevo flujo de onboarding?",
    time: "09:02",
    mine: false,
  },
  {
    id: 2,
    author: "Tú",
    initials: "TU",
    text: "Casi. Me falta ajustar el paso de verificación de correo, lo cierro esta mañana.",
    time: "09:07",
    mine: true,
  },
  {
    id: 3,
    author: "María Gómez",
    initials: "MG",
    text: "Perfecto. Cuando lo tengas, lo revisamos juntos antes de enseñarlo al equipo.",
    time: "09:09",
    mine: false,
  },
  {
    id: 4,
    author: "Tú",
    initials: "TU",
    text: "Hecho, acabo de subir los cambios a la rama `feat/onboarding-v2`.",
    time: "10:41",
    mine: true,
  },
];

export function AppShell07() {
  const [activeId, setActiveId] = useState("c1");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        author: "Tú",
        initials: "TU",
        text,
        time: "ahora",
        mine: true,
      },
    ]);
    setDraft("");
  };

  return (
    <div className="flex h-svh w-full flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-[50px] shrink-0 items-center gap-3 border-b border-border px-4">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
          K
        </div>
        <span className="text-sm font-semibold">Kromm</span>
        <Separator orientation="vertical" className="!h-5" />
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageSquareIcon className="size-4" /> Mensajes
        </span>
        <Button size="icon-sm" variant="ghost" className="ml-auto" aria-label="Más opciones">
          <MoreHorizontalIcon />
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar de conversaciones */}
        <aside className="hidden w-[280px] shrink-0 flex-col border-r border-border md:flex">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <h1 className="text-sm font-semibold">Conversaciones</h1>
            <Button size="icon-xs" variant="outline" aria-label="Nueva conversación">
              <PlusIcon />
            </Button>
          </div>
          <div className="relative mx-3 mb-2">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input id="app-shell-07-search" placeholder="Buscar…" className="h-8 rounded-lg pl-8 text-sm" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-3">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setActiveId(conversation.id)}
                aria-current={conversation.id === activeId}
                className={cn(
                  "flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted",
                  conversation.id === activeId && "bg-muted"
                )}
              >
                <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium">
                  {conversation.initials}
                  <span className="absolute right-0 bottom-0 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{conversation.name}</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{conversation.time}</span>
                  </span>
                  <span className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted-foreground">{conversation.preview}</span>
                    {conversation.unread > 0 && (
                      <Badge variant="default" className="size-5 shrink-0 rounded-full p-0 text-[10px]">
                        {conversation.unread}
                      </Badge>
                    )}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Hilo central */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border px-4">
            <span className="flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
              {active.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{active.name}</p>
            </div>
            <Badge variant="outline" className="gap-1.5 rounded-full">
              <span className="size-1.5 rounded-full bg-emerald-500" /> En línea
            </Badge>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 md:px-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex items-end gap-2.5", message.mine && "flex-row-reverse")}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                  {message.initials}
                </span>
                <div className={cn("flex max-w-[70%] flex-col gap-1", message.mine && "items-end")}>
                  <div
                    className={cn(
                      "rounded-lg border border-border bg-muted px-3.5 py-2 text-sm leading-relaxed",
                      message.mine && "bg-primary text-primary-foreground"
                    )}
                  >
                    {message.text}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {message.mine ? "Tú" : message.author} · {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="shrink-0 border-t border-border p-3 md:px-6">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-1.5">
              <Input
                id="app-shell-07-composer"
                placeholder={`Mensaje para ${active.name}…`}
                value={draft}
                onChange={(event) => setDraft(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendMessage();
                  }
                }}
                className="h-8 flex-1 rounded-md border-0 shadow-none focus-visible:ring-0"
              />
              <Button size="icon-sm" variant="ghost" aria-label="Adjuntar archivo">
                <PaperclipIcon />
              </Button>
              <Button size="icon-sm" variant="ghost" aria-label="Añadir imagen">
                <ImageIcon />
              </Button>
              <Button size="icon-sm" variant="ghost" aria-label="Añadir emoji">
                <SmileIcon />
              </Button>
              <Button
                size="sm"
                className="rounded-md"
                onClick={sendMessage}
                disabled={!draft.trim()}
                data-icon="inline-end"
              >
                Enviar
                <SendIcon />
              </Button>
            </div>
            <p className="mt-2 flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
              <HashIcon className="size-3" /> Enter para enviar · Shift+Enter para salto de línea
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
