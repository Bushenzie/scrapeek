import type { Button as ButtonPrimitive } from "@base-ui/react/button"
import type { VariantProps } from "class-variance-authority"
import type { buttonVariants } from "./button.variants"
import type { ReactNode } from "react"

export type ButtonProps = {
  icon?: ReactNode
  disabled?: boolean
  loading?: boolean
} & ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants>
