import Link from "next/link";

import { CommandMenu } from "@/components/agent/command-menu";
import { SponsorLink } from "@/components/home/sponsor-link";
import { BrandContextMenu } from "@/components/layout/brand-context-menu";
import { LogoMark } from "@/components/layout/logo";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ModeSwitcher } from "@/components/layout/mode-switcher";
import { NavItemGithub } from "@/components/layout/nav-item-github";
import { SiteSettings } from "@/components/layout/site-settings";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { THEMES } from "@/kromm/registry";
import { source } from "@/lib/source";

const themePrimaryBySlug = Object.fromEntries(
  THEMES.map((theme) => [
    theme.name,
    (theme.cssVars as { light?: Record<string, string> }).light?.primary ?? "",
  ])
);

const navItems = [
  { href: ROUTES.DOCS, label: "Docs" },
  { href: ROUTES.DOCS_COMPONENTS, label: "Components" },
  { href: ROUTES.DOCS_CHANGELOG, label: "Changelog" },
];

export const SiteHeader = () => (
  <header
    className="bg-background sticky top-0 z-50 w-full"
    style={{ viewTransitionName: "site-header" }}
  >
    <div className="container-wrapper 3xl:fixed:px-0 px-6">
      <div className="3xl:fixed:container flex h-(--header-height) items-center gap-2">
        <MobileNav
          items={navItems}
          tree={source.pageTree}
          className="flex lg:hidden"
        />
        <BrandContextMenu>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden size-8 lg:flex"
            sound="click"
          >
            <Link href={ROUTES.HOME} transitionTypes={["nav-back"]}>
              <LogoMark className="size-5" />
              <span className="sr-only">{SITE.NAME}</span>
            </Link>
          </Button>
        </BrandContextMenu>
        <MainNav items={navItems} className="hidden lg:flex" />
        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
            <CommandMenu
              navItems={navItems}
              tree={source.pageTree}
              themePrimaryBySlug={themePrimaryBySlug}
            />
          </div>
          <NavItemGithub />
          <SponsorLink />
          <ModeSwitcher />
          <SiteSettings />
        </div>
      </div>
    </div>
  </header>
);
