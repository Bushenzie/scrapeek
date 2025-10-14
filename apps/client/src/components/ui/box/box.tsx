import type { FC } from "react";
import { cn } from "@/lib/class";
import type { BoxProps } from "./box.types";

export const Box: FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "border rounded-4xl shadow-2xl bg-blueprint-700/75 border-blueprint-400",
        className
      )}
    >
      {children}
    </div>
  );
};
