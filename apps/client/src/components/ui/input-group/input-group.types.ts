import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import type { inputGroupAddonVariants, inputGroupButtonVariants } from "./input-group.variants";
import type { Button } from "@/components/ui/button/button";

export type InputGroupProps = ComponentProps<"div">;
export type InputGroupAddonProps = ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>;
export type InputGroupButtonProps = Omit<ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>;
export type InputGroupTextProps = ComponentProps<"span">;
export type InputGroupInputProps = ComponentProps<"input">;
export type InputGroupTextareaProps = ComponentProps<"textarea">;
