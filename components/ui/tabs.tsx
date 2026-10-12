"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "cn";

import type { FeedbackType } from "@/hooks/use-feedback";
import { useFeedback } from "@/hooks/use-feedback";

const tabsListClassName =
  "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]";

const tabsTriggerClassName =
  "data-[selected]:bg-background dark:data-[selected]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[selected]:border-input dark:data-[selected]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[selected]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const Tabs = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) => (
  <TabsPrimitive.Root
    data-slot="tabs"
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
);

const TabsList = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List
    data-slot="tabs-list"
    className={cn(tabsListClassName, className)}
    {...props}
  />
);

export interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Tab> {
  /** Optional audio/haptic feedback sound played on select. */
  sound?: FeedbackType;
}

const TabsTrigger = ({
  className,
  sound,
  onClick,
  ...props
}: TabsTriggerProps) => {
  const feedback = useFeedback({ sound });

  const handleClick: NonNullable<TabsTriggerProps["onClick"]> = (event) => {
    feedback();
    onClick?.(event);
  };

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerClassName, className)}
      onClick={handleClick}
      {...props}
    />
  );
};

const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Panel>) => (
  <TabsPrimitive.Panel
    data-slot="tabs-content"
    className={cn("flex-1 outline-none", className)}
    {...props}
  />
);

export {
  Tabs,
  TabsContent,
  TabsList,
  tabsListClassName,
  tabsTriggerClassName,
  TabsTrigger,
};
