import { LoaderCircle } from "lucide-react"
import type { FC } from "react"
import { cn } from "@/lib/class"
import type { LoadingSpinnerProps } from "./loading-spinner.types"
import { loadingSpinnerVariants } from "./loading-spinner.variants"

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ className, size }) => {
  return <LoaderCircle className={cn(loadingSpinnerVariants({ size }), className)} />
}
