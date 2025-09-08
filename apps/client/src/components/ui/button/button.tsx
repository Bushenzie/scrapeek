import { Slot } from "@radix-ui/react-slot";
import { LoaderCircle } from "lucide-react";
import type { FC } from "react";
import { cn } from "@/lib/utils/utils";
import type { ButtonProps } from "./button.types";
import { buttonVariants } from "./button.variants";

export const Button: FC<ButtonProps> = ({
  className,
  variant,
  size,
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
      {loading && <LoaderCircle className="animate-spin w-4 h-4" />}
      {props.children}
    </Comp>
  );
};
