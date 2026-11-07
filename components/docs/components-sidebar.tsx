"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getCatalog } from "@/lib/catalog";

const MENU_BUTTON_CLS =
  "relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-[active=true]:border-accent data-[active=true]:bg-accent 3xl:fixed:w-full 3xl:fixed:max-w-48";

export function ComponentsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const catalog = getCatalog();

  const bases = ["base", "aria", "radix"] as const;
  const grouped = bases.map((base) => ({
    base,
    components: catalog
      .filter((c) => c.base === base)
      .toSorted(
        (a, b) => (a.patterns[0]?.order ?? 0) - (b.patterns[0]?.order ?? 0)
      ),
  }));

  return (
    <Sidebar
      className="text-sidebar-foreground sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-10rem)] flex-col overscroll-none bg-transparent [--sidebar-menu-width:--spacing(48)] lg:flex"
      collapsible="none"
      {...props}
    >
      <div className="h-9" />
      <div className="absolute top-8 z-10 h-8 w-(--sidebar-menu-width) shrink-0 bg-linear-to-b from-background via-background/80 to-background/50 blur-xs" />
      <div className="absolute top-12 right-2 bottom-0 hidden h-full w-px bg-linear-to-b from-transparent via-border to-transparent lg:flex" />
      <SidebarContent className="mx-auto no-scrollbar w-(--sidebar-menu-width) overflow-x-hidden px-2">
        <SidebarGroup className="pt-6">
          <SidebarGroupLabel className="text-muted-foreground font-medium">
            Components
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={MENU_BUTTON_CLS}
                  isActive={pathname === "/components"}
                >
                  <Link href="/components">
                    <span className="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent" />
                    All Components
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {grouped.map(
          ({ base, components }) =>
            components.length > 0 && (
              <SidebarGroup key={base}>
                <SidebarGroupLabel className="text-muted-foreground font-medium">
                  {base}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {components.map((c) => (
                      <SidebarMenuItem key={`${c.base}-${c.title}`}>
                        <SidebarMenuButton
                          asChild
                          className={MENU_BUTTON_CLS}
                          isActive={
                            pathname === `/components/${c.base}/${c.title}`
                          }
                        >
                          <Link href={`/components/${c.base}/${c.title}`}>
                            <span className="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent" />
                            {c.name}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )
        )}

        {/* Patrones - Sección separada */}
        {catalog
          .filter((c) => c.base === "patterns")
          .map(
            (patternGroup) =>
              patternGroup.patterns.length > 0 && (
                <SidebarGroup key="patterns">
                  <SidebarGroupLabel className="text-muted-foreground font-medium">
                    Patterns
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className={MENU_BUTTON_CLS}
                          isActive={pathname === "/components/patterns"}
                        >
                          <Link href="/components/patterns">
                            <span className="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent" />
                            All Patterns
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {patternGroup.patterns.map((pattern) => (
                        <SidebarMenuItem key={`pattern-${pattern.name}`}>
                          <SidebarMenuButton
                            asChild
                            className={MENU_BUTTON_CLS}
                            isActive={
                              pathname ===
                              `/components/patterns/${pattern.name}`
                            }
                          >
                            <Link href={`/components/patterns/${pattern.name}`}>
                              <span className="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent" />
                              {pattern.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )
          )}
        <div className="from-background via-background/80 to-background/50 sticky -bottom-1 z-10 h-16 shrink-0 bg-linear-to-t blur-xs" />
      </SidebarContent>
    </Sidebar>
  );
}
