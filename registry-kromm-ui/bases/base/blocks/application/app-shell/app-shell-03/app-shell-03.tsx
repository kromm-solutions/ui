import { cn } from "cn";
import {
  Calendar,
  FileText,
  FolderKanban,
  History,
  Inbox,
  LayoutDashboard,
  PanelRightClose,
  Search,
  Settings,
  Tag,
  Users,
} from "lucide-react";

import { Badge } from "@/registry/bases/base/ui/badge";
import { Button } from "@/registry/bases/base/ui/button";
import { Separator } from "@/registry/bases/base/ui/separator";
import { Skeleton } from "@/registry/bases/base/ui/skeleton";

const nav = [
  { icon: LayoutDashboard, label: "Home" },
  { active: true, badge: "8", icon: Inbox, label: "Inbox" },
  { icon: FolderKanban, label: "Projects" },
  { icon: FileText, label: "Docs" },
  { icon: Users, label: "Members" },
  { icon: Settings, label: "Settings" },
];

const activity = [
  { text: "commented on Invoice #1042", time: "2m", who: "AK" },
  { text: "moved card to Review", time: "18m", who: "MR" },
  { text: "created project Delta", time: "1h", who: "JD" },
  { text: "closed incident #87", time: "3h", who: "SP" },
];

export function AppShell03() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Left sidebar */}
      <aside
        className="hidden w-[250px] shrink-0 flex-col border-r border-border bg-sidebar md:flex"
        aria-label="Main navigation"
      >
        <div className="flex h-[50px] items-center gap-2 border-b border-border px-4">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            K
          </div>
          <span className="text-sm font-semibold">Kromm</span>
        </div>
        <div className="border-b border-border p-3">
          <div className="flex h-8 items-center gap-2 rounded-lg border border-border bg-muted/50 px-2 text-sm text-muted-foreground">
            <Search className="size-3.5" />
            <span>Search…</span>
            <kbd className="ml-auto rounded border border-border bg-background px-1 text-[10px]">
              ⌘K
            </kbd>
          </div>
        </div>
        <nav
          className="flex-1 space-y-0.5 overflow-y-auto p-3"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <a
              key={item.label}
              href="#"
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "flex h-8 items-center gap-2 rounded-lg px-2 text-sm transition-colors",
                item.active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <Badge variant="secondary" className="rounded-full px-1.5">
                  {item.badge}
                </Badge>
              ) : null}
            </a>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              JD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Jane Doe</p>
              <p className="truncate text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[50px] items-center gap-3 border-b border-border px-4">
          <h1 className="text-sm font-semibold">Inbox</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Toggle inspector"
              className="lg:hidden"
            >
              <PanelRightClose />
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-4 p-6">
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {["AK", "MR", "SP", "TW"][i]}
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-2/5 bg-muted/55" />
                  <Skeleton className="h-3 w-3/4 bg-muted/55" />
                </div>
                <Badge variant="outline" className="rounded-full">
                  {["New", "Open", "Pending", "Done"][i]}
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            AppShell03 — doble sidebar con panel de contexto.
          </p>
        </main>
      </div>

      {/* Right inspector */}
      <aside
        className="hidden w-[280px] shrink-0 flex-col border-l border-border lg:flex"
        aria-label="Context panel"
      >
        <div className="flex h-[50px] items-center justify-between border-b border-border px-4">
          <span className="text-sm font-semibold">Details</span>
          <Badge variant="secondary" className="rounded-full">
            Live
          </Badge>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Tag className="size-3.5" /> Labels
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="rounded-full">
                billing
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                priority
              </Badge>
              <Badge variant="outline" className="rounded-full">
                + add
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Calendar className="size-3.5" /> Due date
            </p>
            <p className="text-sm">Friday, Oct 16</p>
          </div>
          <Separator />
          <div className="space-y-2.5">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <History className="size-3.5" /> Activity
            </p>
            <ul className="space-y-3">
              {activity.map((event) => (
                <li key={event.text} className="flex items-start gap-2.5">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                    {event.who}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{event.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.time} ago
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
