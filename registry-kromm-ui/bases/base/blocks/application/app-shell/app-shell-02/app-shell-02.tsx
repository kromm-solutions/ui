import { Badge } from "@/registry/bases/base/ui/badge";
import { Button } from "@/registry/bases/base/ui/button";
import { Separator } from "@/registry/bases/base/ui/separator";
import { Skeleton } from "@/registry/bases/base/ui/skeleton";
import { cn } from "cn";
import {
  BarChart3,
  Bell,
  ChevronRight,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";

const railItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FolderKanban, label: "Projects" },
  { icon: FileText, label: "Documents" },
  { icon: Users, label: "People" },
  { icon: BarChart3, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

const sections = [
  {
    title: "Favorites",
    items: ["Overview", "Release notes", "Design system"],
  },
  {
    title: "Dashboards",
    items: ["Growth Q3", "Churn analysis", "NPS tracker", "Infra health"],
  },
];

function RailButton({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        active && "bg-muted text-foreground",
        "text-muted-foreground"
      )}
    >
      <Icon />
    </Button>
  );
}

export function AppShell02() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Icon rail */}
      <aside
        className="hidden w-[54px] shrink-0 flex-col items-center gap-1 border-r border-border bg-sidebar py-3 md:flex"
        aria-label="Primary sections"
      >
        <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
          K
        </div>
        {railItems.map((item) => (
          <RailButton key={item.label} {...item} />
        ))}
        <div className="mt-auto">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="text-muted-foreground"
          >
            <Bell />
          </Button>
          <div className="mt-2 flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
            JD
          </div>
        </div>
      </aside>

      {/* Secondary panel */}
      <aside
        className="hidden w-[220px] shrink-0 flex-col border-r border-border md:flex"
        aria-label="Dashboard navigation"
      >
        <div className="flex h-[50px] items-center justify-between border-b border-border px-3">
          <span className="text-sm font-semibold">Dashboard</span>
          <Button variant="ghost" size="icon-sm" aria-label="New dashboard">
            <Plus />
          </Button>
        </div>
        <div className="border-b border-border p-3">
          <div className="flex h-8 items-center gap-2 rounded-lg border border-border bg-muted/50 px-2 text-sm text-muted-foreground">
            <Search className="size-3.5" />
            <span>Filter…</span>
          </div>
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto p-3" aria-label="Secondary">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="px-2 pb-1.5 text-xs font-medium text-muted-foreground">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item, i) => (
                  <li key={item}>
                    <a
                      href="#"
                      aria-current={
                        section.title === "Favorites" && i === 0
                          ? "page"
                          : undefined
                      }
                      className={cn(
                        "flex h-8 items-center gap-1 rounded-lg px-2 text-sm transition-colors",
                        section.title === "Favorites" && i === 0
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span className="flex-1 truncate">{item}</span>
                      <ChevronRight className="size-3.5 opacity-50" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[50px] items-center gap-3 border-b border-border px-4">
          <h1 className="text-sm font-semibold">Overview</h1>
          <Badge variant="secondary" className="rounded-full">
            Favorite
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              Share
            </Button>
            <Button size="sm">Edit</Button>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-lg border border-dashed border-border/60 bg-background/60 p-4">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/3 bg-muted/55" />
                  <Skeleton className="h-32 w-full bg-muted/55" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-dashed border-border/60 bg-background/60 p-4"
                  >
                    <div className="space-y-3">
                      <Skeleton className="h-3 w-1/2 bg-muted/55" />
                      <Skeleton className="h-16 w-full bg-muted/55" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-border/60 bg-background/60 p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-2/3 bg-muted/55" />
                <Skeleton className="h-3 w-full bg-muted/55" />
                <Skeleton className="h-3 w-5/6 bg-muted/55" />
                <Separator />
                <Skeleton className="h-3 w-full bg-muted/55" />
                <Skeleton className="h-3 w-2/3 bg-muted/55" />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            AppShell02 — icon rail + panel secundario contextual.
          </p>
        </main>
      </div>
    </div>
  );
}
