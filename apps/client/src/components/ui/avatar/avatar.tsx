import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { FC } from "react";

import { cn } from "@/lib/utils/utils";
import type {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarProps,
} from "./avatar.types";
import { avatarVariants } from "./avatar.variants";

export const Avatar: FC<AvatarProps> = ({ className, size, ...props }) => {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
};

export const AvatarImage: FC<AvatarImageProps> = ({ className, ...props }) => {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
};

export const AvatarFallback: FC<AvatarFallbackProps> = ({
  className,
  ...props
}) => {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-blueprint-100 text-blueprint-700 flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
};
