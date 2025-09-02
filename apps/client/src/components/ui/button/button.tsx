import { Slot } from "@radix-ui/react-slot";
import type { FC } from "react";

import { cn } from "@/lib/utils";
import type { ButtonProps } from "./button.types";
import { buttonVariants } from "./button.variants";

export const Button: FC<ButtonProps> = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};
