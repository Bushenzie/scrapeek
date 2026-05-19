import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import type { FC } from "react"
import { cn } from "@/lib/class"
import type { BadgeProps } from "./badge.types"
import { badgeVariants } from "./badge.variants"

export const Badge: FC<BadgeProps> = ({ className, variant = "default", render, ...props }) => {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}
