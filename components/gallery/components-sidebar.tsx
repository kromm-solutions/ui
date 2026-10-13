"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/components", label: "Overview" },
  { href: "/components/signature-pad", label: "Signature Pad Form" },
];

export function ComponentsSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r p-4">
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded px-3 py-2 text-sm hover:bg-muted",
              pathname === item.href && "bg-muted font-medium"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
