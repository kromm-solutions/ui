"use client";

import Link from "next/link";

import {
  codeTabsListClassName,
  codeTabsTriggerClassName,
} from "@/components/docs/code-tabs-styles";
import { tabsListClassName, tabsTriggerClassName } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BASES } from "@/registry/bases";

interface BaseItem {
  name: string;
  title: string;
  meta?: {
    logo?: string;
  };
}

const basesList = BASES as unknown as BaseItem[];

export const DocsBaseSwitcher = ({
  base,
  component,
  className,
}: {
  base: string;
  component: string;
  className?: string;
}) => {
  const activeBase = basesList.find((item) => item.name === base);
  const activeLogo = activeBase?.meta?.logo;

  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <div className={cn(tabsListClassName, codeTabsListClassName)}>
        {basesList.map((item) => {
          const isActive = base === item.name;
          const href = `/docs/components/${item.name}/${component}`;
          return (
            <Link
              key={item.name}
              href={href}
              data-state={isActive ? "active" : "inactive"}
              aria-current={isActive ? "page" : undefined}
              className={cn(tabsTriggerClassName, codeTabsTriggerClassName)}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
      {activeLogo && (
        <div
          className="text-muted-foreground flex items-center justify-center [&_svg]:size-4 [&_svg]:shrink-0"
          dangerouslySetInnerHTML={{ __html: activeLogo }}
        />
      )}
    </div>
  );
};
