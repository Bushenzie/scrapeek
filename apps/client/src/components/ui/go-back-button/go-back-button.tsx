import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { Undo2 } from "lucide-react";
import { type FC } from "react";
import { cn } from "@/lib/utils/utils";
import { Button } from "../button/button";
import type { ButtonProps } from "../button/button.types";

export const GoBackButton: FC<ButtonProps> = ({
  variant = "link",
  className,
  onClick,
  ...props
}) => {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const navigateBack = () => {
    if (!canGoBack) return;

    router.history.back();
  };

  return (
    <Button
      variant={variant}
      className={cn("text-blueprint-200 hover:no-underline", className)}
      onClick={(e) => {
        onClick?.(e);
        navigateBack();
      }}
      disabled={!canGoBack}
      {...props}
    >
      <Undo2 /> Go Back
    </Button>
  );
};
