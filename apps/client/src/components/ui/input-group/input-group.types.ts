import type { VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import type { Button } from "../button/button"
import type { inputGroupAddonVariants, inputGroupButtonVariants } from "./input-group.variants"

export type InputGroupProps = ComponentProps<"div">
export type InputGroupAddonProps = ComponentProps<"div"> &
  VariantProps<typeof inputGroupAddonVariants>
export type InputGroupButtonProps = Omit<ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }
export type InputGroupTextProps = ComponentProps<"span">
export type InputGroupInputProps = ComponentProps<"input">
export type InputGroupTextareaProps = ComponentProps<"textarea">
