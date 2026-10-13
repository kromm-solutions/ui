import { cn } from "cn";
import {
  BarChart3,
  Bell,
  FolderKanban,
  LayoutDashboard,
  LifeBuoy,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";

import { Badge } from "@/registry/bases/base/ui/badge";
import { Button } from "@/registry/bases/base/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card";
import { Separator } from "@/registry/bases/base/ui/separator";
import { Skeleton } from "@/registry/bases/base/ui/skeleton";

const mainNav = [
  { active: true, icon: LayoutDashboard, label: "Dashboard" },
  { badge: "12", icon: FolderKanban, label: "Projects" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Team" },
];

const workspaceNav = [
  { icon: Settings, label: "Settings" },
  { icon: LifeBuoy, label: "Support" },
];

const cards = [
  {
    description: "Last 24 hours",
    title: "Active deployments",
    trend: "+12%",
    value: "128",
  },
  {
    description: "Across all services",
    title: "Open incidents",
    trend: "-2",
    value: "3",
  },
  {
    description: "With access",
    title: "Team members",
    trend: "+4",
    value: "24",
  },
];

function NavItem({
  icon: Icon,
  label,
  active,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <li>
      <a
        href="#"
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-8 items-center gap-2 rounded-lg px-2 text-sm transition-colors",
          active
            ? "bg-muted font-medium text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="size-4" />
        <span className="flex-1">{label}</span>
        {badge ? (
          <Badge variant="secondary" className="rounded-full px-1.5">
            {badge}
          </Badge>
        ) : null}
      </a>
    </li>
  );
}

export function AppShell01() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-[250px] shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <div className="flex h-[50px] items-center gap-2 border-b border-border px-4">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            K
          </div>
          <span className="text-sm font-semibold">Kromm</span>
          <Badge variant="outline" className="ml-auto rounded-full">
            Pro
          </Badge>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto p-3" aria-label="Main">
          <div>
            <p className="px-2 pb-1.5 text-xs font-medium text-muted-foreground">
              General
            </p>
            <ul className="space-y-0.5">
              {mainNav.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </ul>
          </div>
          <div>
            <p className="px-2 pb-1.5 text-xs font-medium text-muted-foreground">
              Workspace
            </p>
            <ul className="space-y-0.5">
              {workspaceNav.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </ul>
          </div>
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              JD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Jane Doe</p>
              <p className="truncate text-xs text-muted-foreground">
                jane@kromm.dev
              </p>
            </div>
            <Button variant="ghost" size="icon-sm" aria-label="Notifications">
              <Bell />
            </Button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[50px] items-center gap-3 border-b border-border px-4">
          <h1 className="text-sm font-semibold">Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" aria-label="Search">
              <Search />
              <span className="hidden sm:inline">Search</span>
            </Button>
            <Button size="sm">
              <Plus />
              New project
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Card key={card.title} className="gap-2 py-4">
                <CardHeader className="px-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-baseline gap-2 px-4">
                  <span className="text-2xl font-semibold">{card.value}</span>
                  <Badge variant="secondary" className="rounded-full">
                    {card.trend}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="gap-4 py-4">
            <CardHeader className="px-4">
              <CardTitle className="text-sm">Activity overview</CardTitle>
              <CardDescription>Deploys per day, last 2 weeks</CardDescription>
            </CardHeader>
            <CardContent className="px-4">
              <div className="rounded-lg border border-dashed border-border/60 bg-background/60 p-4">
                <div className="space-y-3">
                  <Skeleton className="h-3 w-3/4 bg-muted/55" />
                  <Skeleton className="h-3 w-1/2 bg-muted/55" />
                  <Skeleton className="h-3 w-2/3 bg-muted/55" />
                  <Skeleton className="h-24 w-full bg-muted/55" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />
          <p className="text-xs text-muted-foreground">
            AppShell01 — sidebar nav simple.
          </p>
        </main>
      </div>
    </div>
  );
}
