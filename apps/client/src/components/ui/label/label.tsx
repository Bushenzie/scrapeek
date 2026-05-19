/** biome-ignore-all lint/a11y/noLabelWithoutControl: x */

import type { FC } from "react"
import { cn } from "@/lib/class"
import type { LabelProps } from "./label.types"

export const Label: FC<LabelProps> = ({ className, ...props }) => {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
