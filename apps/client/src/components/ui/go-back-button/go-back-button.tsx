import { useCanGoBack, useRouter } from "@tanstack/react-router"
import { Undo2 } from "lucide-react"
import type { FC } from "react"
import { cn } from "@/lib/class"
import { Button } from "../button/button"
import type { GoBackButtonProps } from "./go-back-button.types"

export const GoBackButton: FC<GoBackButtonProps> = ({
  variant = "link",
  fallbackTo,
  className,
  onClick,
  ...props
}) => {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  const navigateBack = () => {
    if (!canGoBack) {
      if (fallbackTo) router.navigate({ to: fallbackTo })
      return
    }

    router.history.back()
  }

  return (
    <Button
      variant={variant}
      className={cn("text-blueprint-200 hover:no-underline", className)}
      onClick={(e) => {
        onClick?.(e)
        navigateBack()
      }}
      disabled={!canGoBack && !fallbackTo}
      {...props}
    >
      <Undo2 /> Go Back
    </Button>
  )
}
