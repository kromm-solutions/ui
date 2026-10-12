import { SidebarProvider } from "@/components/ui/sidebar";
import { getCatalog } from "@/lib/catalog";
import Link from "next/link";

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  const catalog = getCatalog();

  const bases = ['base', 'aria', 'radix'] as const;
  const grouped = bases.map(base => ({
    base,
    components: catalog.filter(c => c.base === base).sort((a, b) => (a.patterns[0]?.order ?? 0) - (b.patterns[0]?.order ?? 0))
  }));

  return (
    <div className="container-wrapper flex flex-1 flex-col px-2">
      <SidebarProvider className="3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]">
        <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r p-4">
          <nav className="space-y-1">
            <Link href="/components" className="block rounded px-3 py-2 text-sm font-medium hover:bg-muted">
              All Components
            </Link>
            {grouped.map(({ base, components }) => (
              components.length > 0 && (
                <div key={base} className="space-y-1 pt-2">
                  <h3 className="px-3 py-1 text-xs font-semibold uppercase text-muted-foreground">
                    {base}
                  </h3>
                  {components.map(c => (
                    <Link
                      key={c.title}
                      href={`/components/${c.base}/${c.title}`}
                      className="block rounded px-3 py-2 text-sm hover:bg-muted"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )
            ))}
          </nav>
        </aside>
        <div className="h-full w-full">{children}</div>
      </SidebarProvider>
    </div>
  );
}