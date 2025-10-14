import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type FC } from "react";
import { cn } from "@/lib/class";
import type {
  TabsContentProps,
  TabsListProps,
  TabsProps,
  TabsTriggerProps,
} from "./tabs.types";

export const Tabs: FC<TabsProps> = ({ className, ...props }) => {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
};

export const TabsList: FC<TabsListProps> = ({ className, ...props }) => {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-blueprint-900 text-blueprint-200 inline-flex h-10 w-fit items-center justify-center rounded-lg p-[3px] border border-blueprint-400",
        className
      )}
      {...props}
    />
  );
};

export const TabsTrigger: FC<TabsTriggerProps> = ({ className, ...props }) => {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-blueprint-400 data-[state=active]:shadow-sm",
        "dark:data-[state=active]:text-blueprint-200 dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:outline-1",
        "cursor-pointer text-blueprint-100 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
};

export const TabsContent: FC<TabsContentProps> = ({ className, ...props }) => {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
};
