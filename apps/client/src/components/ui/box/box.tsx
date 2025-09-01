import { cn } from "@/lib/utils";
import type { ComponentProps, FC, PropsWithChildren } from "react";

type BoxProps = ComponentProps<"div"> & PropsWithChildren;

export const Box: FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "border rounded-4xl p-6 bg-blueprint-700/60 border-blueprint-400",
        className
      )}
    >
      {children}
    </div>
  );
};
