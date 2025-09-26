import type * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import type { avatarVariants } from "./avatar.variants";

export type AvatarProps = ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>;
export type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>;
export type AvatarFallbackProps = ComponentProps<
  typeof AvatarPrimitive.Fallback
>;
