import { Slot } from "@radix-ui/react-slot";
import type { FC } from "react";
import { cn } from "@/lib/utils/utils";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import type { ButtonProps } from "./button.types";
import { buttonVariants } from "./button.variants";

export const Button: FC<ButtonProps> = ({
  className,
  size,
  variant,
  disabled = false,
  loading = false,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {props.children}
    </Comp>
  );
};
