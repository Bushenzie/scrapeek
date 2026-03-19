import type * as React from "react"

import { cn } from "@/lib/class"

type InputProps = React.ComponentProps<"input">

export const Input: React.FC<InputProps> = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-blueprint-400 bg-blueprint-900 flex h-9 w-full min-w-0  border p-3 py-5 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:ring-blueprint-400 focus-visible:ring",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  )
}
