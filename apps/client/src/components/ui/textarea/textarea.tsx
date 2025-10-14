import { type FC } from "react";

import { cn } from "@/lib/class";

type TextareaProps = React.ComponentProps<"textarea">;

export const Textarea: FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-blueprint-400 placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-blueprint-900 p-3 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-blue-400 focus-visible:ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
};
