import type { VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import type { loadingSpinnerVariants } from "./loading-spinner.variants"

export type LoadingSpinnerProps = ComponentProps<"svg"> &
  VariantProps<typeof loadingSpinnerVariants>
