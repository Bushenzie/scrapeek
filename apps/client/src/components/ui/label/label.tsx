import * as LabelPrimitive from "@radix-ui/react-label";
import { type ComponentProps, type FC } from "react";

import { cn } from "@/lib/utils/utils";

type LabelProps = ComponentProps<typeof LabelPrimitive.Root>;

export const Label: FC<LabelProps> = ({ className, ...props }) => {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};
