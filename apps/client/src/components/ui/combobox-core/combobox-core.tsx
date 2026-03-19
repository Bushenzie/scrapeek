import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import type { FC } from "react";
import { Button } from "@/components/ui/button/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group/input-group";
import { cn } from "@/lib/class";
import type {
  ComboboxChipsInputProps,
  ComboboxContentProps,
  ComboboxLabelProps,
  ComboboxSeparatorProps,
} from "./combobox-core.types";
import {
  type ComboboxChipProps,
  type ComboboxChipsProps,
  type ComboboxClearProps,
  type ComboboxCollectionProps,
  type ComboboxEmptyProps,
  type ComboboxGroupProps,
  type ComboboxInputProps,
  type ComboboxItemProps,
  type ComboboxListProps,
  type ComboboxTriggerProps,
  type ComboboxValueProps,
} from "./combobox-core.types";

export const Combobox = ComboboxPrimitive.Root;

export const ComboboxValue: FC<ComboboxValueProps> = ({ ...props }) => {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
};

export const ComboboxTrigger: FC<ComboboxTriggerProps> = ({ className, children, ...props }) => {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4 border border-blueprint-400", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon data-slot="combobox-trigger-icon" className="text-blueprint-100 pointer-events-none size-4" />
    </ComboboxPrimitive.Trigger>
  );
};

export const ComboboxClear: FC<ComboboxClearProps> = ({ className, ...props }) => {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none text-blueprint-100" />
    </ComboboxPrimitive.Clear>
  );
};

export const ComboboxInput: FC<ComboboxInputProps> = ({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}) => {
  return (
    <InputGroup className={cn("w-auto", className)}>
      <ComboboxPrimitive.Input render={<InputGroupInput disabled={disabled} />} {...props} />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            asChild
            data-slot="input-group-button"
            className="border border-blueprint-400 group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          >
            <ComboboxTrigger />
          </InputGroupButton>
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
};

export const ComboboxContent: FC<ComboboxContentProps> = ({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}) => {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "bg-blueprint-800 box-border border border-blueprint-400 text-blueprint-100 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:border-input/30 group/combobox-content relative max-h-96 w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden  shadow-md ring-1 duration-100 data-[chips=true]:min-w-(--anchor-width) *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:shadow-none",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
};

export const ComboboxList: FC<ComboboxListProps> = ({ className, ...props }) => {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "max-h-[min(calc(--spacing(96)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto p-1 data-empty:p-0",
        className,
      )}
      {...props}
    />
  );
};

export const ComboboxItem: FC<ComboboxItemProps> = ({ className, children, ...props }) => {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex w-full cursor-default items-center gap-2  py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        data-slot="combobox-item-indicator"
        render={<span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />}
      >
        <CheckIcon className="pointer-events-none size-4 pointer-coarse:size-5" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
};

export const ComboboxGroup: FC<ComboboxGroupProps> = ({ className, ...props }) => {
  return <ComboboxPrimitive.Group data-slot="combobox-group" className={cn(className)} {...props} />;
};

export const ComboboxLabel: FC<ComboboxLabelProps> = ({ className, ...props }) => {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        "text-muted-foreground px-2 py-1.5 text-xs pointer-coarse:px-3 pointer-coarse:py-2 pointer-coarse:text-sm",
        className,
      )}
      {...props}
    />
  );
};

export const ComboboxCollection: FC<ComboboxCollectionProps> = ({ ...props }) => {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />;
};

export const ComboboxEmpty: FC<ComboboxEmptyProps> = ({ className, ...props }) => {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "text-muted-foreground hidden w-full justify-center py-2 text-center text-sm group-data-empty/combobox-content:flex",
        className,
      )}
      {...props}
    />
  );
};

export const ComboboxSeparator: FC<ComboboxSeparatorProps> = ({ className, ...props }) => {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
};

export const ComboboxChips: FC<ComboboxChipsProps> = ({ className, ...props }) => {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "dark:bg-input/30 border-blueprint-400  focus-within:ring-blueprint-400 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive dark:has-aria-invalid:border-destructive/50 flex min-h-9 flex-wrap items-center gap-1.5  border bg-blueprint-900 bg-clip-padding p-2.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:ring-1 has-aria-invalid:ring-[3px] has-data-[slot=combobox-chip]:px-1.5",
        className,
      )}
      {...props}
    />
  );
};

export const ComboboxChip: FC<ComboboxChipProps> = ({ className, children, showRemove = true, ...props }) => {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "bg-blueprint-400 text-blueprint-100 flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1  px-1.5 text-xs font-medium whitespace-nowrap has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0",
        className,
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="link" size="icon-sm"/>}
          className="-ml-1 opacity-50 hover:opacity-100 text-blueprint-100"
          data-slot="combobox-chip-remove"
        >
          <XIcon className="pointer-events-none text-blueprint-100" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
};

export const ComboboxChipsInput: FC<ComboboxChipsInputProps> = ({ className, children, ...props }) => {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn("min-w-16 flex-1 outline-none", className)}
      {...props}
    />
  );
};
