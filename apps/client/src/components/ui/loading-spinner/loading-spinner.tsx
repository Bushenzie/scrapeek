import type { VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import type { ComponentProps, FC } from "react";
import { cn } from "@/lib/utils/utils";
import { loadingSpinnerVariants } from "./loading-spinner.variants";

type LoadingSpinnerProps = ComponentProps<"svg"> &
  VariantProps<typeof loadingSpinnerVariants>;

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  className,
  size,
}) => {
  return (
    <LoaderCircle className={cn(loadingSpinnerVariants({ size }), className)} />
  );
};
