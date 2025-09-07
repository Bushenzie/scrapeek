import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { type ComponentProps, type FC } from "react";
import { cn } from "@/lib/utils/utils";

type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>;

export const Checkbox: FC<CheckboxProps> = ({ className, ...props }) => {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "data-[state=checked]:bg-blueprint-900 data-[state=checked]:text-blueprint-100",
        "dark:data-[state=checked]:bg-blueprint-900 dark:aria-invalid:ring-destructive/40",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "border-blueprint-400",
        "peer aria-invalid:ring-destructive/20 aria-invalid:border-destructive size-5 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};
