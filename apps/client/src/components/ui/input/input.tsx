import { Input as InputPrimitive } from "@base-ui/react/input"
import type { FC } from "react"
import { cn } from "@/lib/class"
import type { InputProps } from "./input.types"

export const Input: FC<InputProps> = ({ className, type, ...props }) => {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 border border-blueprint-400 bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-blueprint-100 placeholder:text-bluepriont-100/50 focus-visible:border-blueprint-400 focus-visible:ring-3 focus-visible:ring-blueprint-400/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  )
}
