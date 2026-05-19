import type { FC } from "react"
import { cn } from "@/lib/class"
import type { TextareaProps } from "./textarea.types"

export const Textarea: FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full border border-blueprint-400 bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:blueprint-100/50  focus-visible:ring-3 focus-visible:ring-blueprint-400/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  )
}
