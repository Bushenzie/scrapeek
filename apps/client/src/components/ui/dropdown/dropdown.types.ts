import type * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import type { ComponentProps } from "react"

export type DropdownMenuProps = ComponentProps<typeof DropdownMenuPrimitive.Root>
export type DropdownMenuPortalProps = ComponentProps<typeof DropdownMenuPrimitive.Portal>
export type DropdownMenuTriggerProps = ComponentProps<typeof DropdownMenuPrimitive.Trigger>
export type DropdownMenuContentProps = ComponentProps<typeof DropdownMenuPrimitive.Content>
export type DropdownMenuGroupProps = ComponentProps<typeof DropdownMenuPrimitive.Group>
export type DropdownMenuItemProps = ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}
export type DropdownMenuCheckboxItemProps = ComponentProps<
  typeof DropdownMenuPrimitive.CheckboxItem
>
export type DropdownMenuRadioGroupProps = ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>
export type DropdownMenuRadioItemProps = ComponentProps<typeof DropdownMenuPrimitive.RadioItem>
export type DropdownMenuLabelProps = ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}
export type DropdownMenuSeparatorProps = ComponentProps<typeof DropdownMenuPrimitive.Separator>
export type DropdownMenuShortcutProps = ComponentProps<"span">
export type DropdownMenuSubProps = ComponentProps<typeof DropdownMenuPrimitive.Sub>
export type DropdownMenuSubTriggerProps = ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  inset?: boolean
}
export type DropdownMenuSubContentProps = ComponentProps<typeof DropdownMenuPrimitive.SubContent>
