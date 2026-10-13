import { cn } from "cn";
import {
  Bell,
  ChevronDown,
  Download,
  HelpCircle,
  Plus,
  Search,
} from "lucide-react";

import { Badge } from "@/registry/bases/base/ui/badge";
import { Button } from "@/registry/bases/base/ui/button";
import { Input } from "@/registry/bases/base/ui/input";
import { Separator } from "@/registry/bases/base/ui/separator";
import { Skeleton } from "@/registry/bases/base/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/base/ui/tabs";

const mainNav = ["Products", "Solutions", "Docs", "Pricing"];

const tabItems = [
  { label: "Overview", value: "overview" },
  { label: "Analytics", value: "analytics" },
  { label: "Reports", value: "reports" },
  { badge: "4", label: "Notifications", value: "notifications" },
];

function TabSkeleton({ className }: { className: string }) {
  return (
    <div className="space-y-3 rounded-lg border border-dashed border-border/60 bg-background/60 p-4">
      <Skeleton className={cn("h-4 bg-muted/55", className)} />
      <Skeleton className="h-3 w-full bg-muted/55" />
      <Skeleton className="h-3 w-5/6 bg-muted/55" />
      <Skeleton className="h-20 w-full bg-muted/55" />
    </div>
  );
}

export function AppShell04() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {/* Top nav */}
      <header className="flex h-[50px] items-center gap-4 border-b border-border px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            K
          </div>
          <span className="text-sm font-semibold">Kromm</span>
        </div>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {mainNav.map((item, i) => (
            <a
              key={item}
              href="#"
              aria-current={i === 0 ? "page" : undefined}
              className={
                i === 0
                  ? "rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground"
                  : "rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search…"
              aria-label="Search"
              className="h-8 w-[220px] pl-8"
            />
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Help">
            <HelpCircle />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications">
            <Bell />
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm transition-colors hover:bg-muted"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
              JD
            </span>
            <span className="hidden lg:inline">Jane Doe</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Secondary tabs row */}
      <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-11 items-center gap-1 border-b border-border px-4">
          <TabsList className="h-full gap-1 rounded-none bg-transparent p-0">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="h-full flex-none rounded-none border-transparent border-b-2 px-3 text-muted-foreground shadow-none data-[selected]:border-primary data-[selected]:bg-transparent data-[selected]:text-foreground data-[selected]:shadow-none dark:data-[selected]:bg-transparent"
              >
                {tab.label}
                {tab.badge ? (
                  <Badge variant="secondary" className="rounded-full px-1.5">
                    {tab.badge}
                  </Badge>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download />
              Export
            </Button>
            <Button size="sm">
              <Plus />
              Create
            </Button>
          </div>
        </div>

        <main className="flex-1 p-6">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TabSkeleton className="w-1/3" />
              </div>
              <TabSkeleton className="w-1/2" />
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <TabSkeleton className="w-1/4" />
          </TabsContent>
          <TabsContent value="reports">
            <TabSkeleton className="w-2/5" />
          </TabsContent>
          <TabsContent value="notifications">
            <TabSkeleton className="w-1/3" />
          </TabsContent>
          <p className="mt-6 text-xs text-muted-foreground">
            AppShell04 — top nav + fila de tabs secundarios.
          </p>
        </main>
      </Tabs>
    </div>
  );
}
