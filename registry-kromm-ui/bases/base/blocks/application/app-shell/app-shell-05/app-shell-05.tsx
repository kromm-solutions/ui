import { cn } from "cn";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronRight,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  Plus,
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

const sideNav = [
  { active: true, icon: LayoutDashboard, label: "Overview" },
  { icon: FolderKanban, label: "Projects" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Customers" },
  { icon: CreditCard, label: "Billing" },
  { icon: Settings, label: "Settings" },
];

const kpis = [
  { delta: "+12.5%", label: "Total revenue", up: true, value: "$84,254" },
  { delta: "+8.1%", label: "Active users", up: true, value: "9,412" },
  { delta: "-0.4%", label: "Conversion", up: false, value: "3.42%" },
  { delta: "-3", label: "Open tickets", up: true, value: "17" },
];

const recentRows = [
  { amount: "$4,200", name: "Acme Inc.", status: "Paid", tone: "emerald" },
  { amount: "$1,890", name: "Globex", status: "Pending", tone: "amber" },
  { amount: "$2,340", name: "Initech", status: "Paid", tone: "emerald" },
  { amount: "$780", name: "Umbrella", status: "Overdue", tone: "red" },
];

const toneClass: Record<string, string> = {
  amber: "bg-amber-400",
  emerald: "bg-emerald-500",
  red: "bg-red-500",
};

export function AppShell05() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Compact sidebar */}
      <aside
        className="hidden w-[200px] shrink-0 flex-col border-r border-border bg-sidebar md:flex"
        aria-label="Main navigation"
      >
        <div className="flex h-[50px] items-center gap-2 border-b border-border px-3">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            K
          </div>
          <span className="text-sm font-semibold">Kromm</span>
        </div>
        <nav
          className="flex-1 space-y-0.5 overflow-y-auto p-2"
          aria-label="Primary"
        >
          {sideNav.map((item) => (
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
              {item.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-border p-2">
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <div className="flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
              JD
            </div>
            <span className="truncate text-sm">Jane Doe</span>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[50px] items-center gap-2 border-b border-border px-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-sm"
          >
            <a
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Workspace
            </a>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <span className="font-medium">Overview</span>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarDays />
              Last 30 days
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Notifications">
              <Bell />
            </Button>
            <Button size="sm">
              <Plus />
              New report
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
          {/* KPI grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <Card key={kpi.label} className="gap-1 py-4">
                <CardHeader className="px-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-baseline gap-2 px-4">
                  <span className="text-2xl font-semibold">{kpi.value}</span>
                  <Badge variant="secondary" className="gap-0.5 rounded-full">
                    {kpi.up ? (
                      <ArrowUpRight className="size-3" />
                    ) : (
                      <ArrowDownRight className="size-3" />
                    )}
                    {kpi.delta}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Panels row */}
          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="gap-4 py-4 lg:col-span-3">
              <CardHeader className="px-4">
                <CardTitle className="text-sm">Revenue</CardTitle>
                <CardDescription>Daily, last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="px-4">
                <div className="flex h-[220px] items-end gap-1.5 rounded-lg border border-dashed border-border/60 bg-background/60 p-3">
                  {[40, 55, 35, 70, 62, 48, 80, 58, 92, 66, 74, 50, 86, 60].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-muted/70"
                        style={{ height: `${h}%` }}
                      />
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="gap-4 py-4 lg:col-span-2">
              <CardHeader className="px-4">
                <CardTitle className="text-sm">Recent invoices</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </CardHeader>
              <CardContent className="px-4">
                <ul className="divide-y divide-border">
                  {recentRows.map((row) => (
                    <li
                      key={row.name}
                      className="flex items-center gap-3 py-2.5"
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          toneClass[row.tone]
                        )}
                      />
                      <span className="flex-1 truncate text-sm">
                        {row.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {row.status}
                      </span>
                      <span className="text-sm font-medium">{row.amount}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-dashed border-border/60 bg-background/60 p-4"
              >
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/3 bg-muted/55" />
                  <Skeleton className="h-3 w-full bg-muted/55" />
                  <Skeleton className="h-3 w-4/5 bg-muted/55" />
                </div>
              </div>
            ))}
          </div>

          <Separator />
          <p className="text-xs text-muted-foreground">
            AppShell05 — dashboard con KPI grid.
          </p>
        </main>
      </div>
    </div>
  );
}
