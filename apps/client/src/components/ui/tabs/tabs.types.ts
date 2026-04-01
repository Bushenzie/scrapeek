import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import type { VariantProps } from "class-variance-authority"
import type { tabsListVariants } from "./tabs.variants"


export type TabsProps = TabsPrimitive.Root.Props
export type TabsListProps = TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>
export type TabsTriggerProps = TabsPrimitive.Tab.Props
export type TabsContentProps = TabsPrimitive.Panel.Props
