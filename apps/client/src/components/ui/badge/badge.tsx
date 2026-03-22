import { Slot } from "@radix-ui/react-slot"
import type { FC } from "react"
import { cn } from "@/lib/class"
import type { BadgeProps } from "./badge.types"
import { badgeVariants } from "./badge.variants"

export const Badge: FC<BadgeProps> = ({ className, variant, asChild = false, ...props }) => {
  const Comp = asChild ? Slot : "span"

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}
