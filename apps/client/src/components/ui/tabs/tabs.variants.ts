import { cva } from "class-variance-authority";

export const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center p-[3px] text-blueprint-100 group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-blueprint-900 border border-blueprint-400",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)
