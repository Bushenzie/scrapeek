import { Button as ButtonPrimitive } from "@base-ui/react/button"
import type { FC } from "react"
import { cn } from "@/lib/class"
import { LoadingSpinner } from "../loading-spinner/loading-spinner"
import type { ButtonProps } from "./button.types"
import { buttonVariants } from "./button.variants"

export const Button: FC<ButtonProps> = ({
  className,
  children,
  variant = "default",
  size = "default",
  icon,
  disabled,
  loading,
  ...props
}) => {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {icon && <span className="size-4">{icon}</span>}
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </ButtonPrimitive>
  )
}
