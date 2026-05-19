import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import type { FC } from "react"
import { cn } from "@/lib/class"
import type { SeparatorProps } from "./separator.types"

export const Separator: FC<SeparatorProps> = ({
  className,
  orientation = "horizontal",
  ...props
}) => {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className,
      )}
      {...props}
    />
  )
}
