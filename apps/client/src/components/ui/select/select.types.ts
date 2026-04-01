import { Select as SelectPrimitive } from "@base-ui/react/select"
import type { ComponentProps } from "react"

export type SelectGroupProps = SelectPrimitive.Group.Props
export type SelectContentProps = SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >
export type SelectItemProps = SelectPrimitive.Item.Props
export type SelectLabelProps = SelectPrimitive.GroupLabel.Props
export type SelectScrollDownButtonProps = ComponentProps<typeof SelectPrimitive.ScrollDownArrow>
export type SelectScrollUpButtonProps = ComponentProps<typeof SelectPrimitive.ScrollUpArrow>
export type SelectSeparatorProps = SelectPrimitive.Separator.Props
export type SelectTriggerProps = SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}
export type SelectValueProps = SelectPrimitive.Value.Props
