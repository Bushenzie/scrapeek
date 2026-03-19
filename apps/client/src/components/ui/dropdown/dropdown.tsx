import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import type { FC } from "react";
import { cn } from "@/lib/class";
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuPortalProps,
  DropdownMenuProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
} from "./dropdown.types";

export const DropdownMenu: FC<DropdownMenuProps> = ({ ...props }) => {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
};

export const DropdownMenuPortal: FC<DropdownMenuPortalProps> = ({
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
};

export const DropdownMenuTrigger: FC<DropdownMenuTriggerProps> = ({
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
};

export const DropdownMenuContent: FC<DropdownMenuContentProps> = ({
  className,
  sideOffset = 4,
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        onSelect={(e) => {e.preventDefault()}}
        className={cn(
          "bg-blueprint-800 border-blueprint-400 text-blueprint-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto  border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
};

export const DropdownMenuGroup: FC<DropdownMenuGroupProps> = ({ ...props }) => {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
};

export const DropdownMenuItem: FC<DropdownMenuItemProps> = ({
  className,
  inset,
  variant = "default",
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2  px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
};

const DropdownMenuItemLinkComponent = createLink(DropdownMenuItem);

export const DropdownMenuItemLink: LinkComponent<typeof DropdownMenuItem> = (props) => {
  return <DropdownMenuItemLinkComponent {...props} />;
};


export const DropdownMenuCheckboxItem: FC<DropdownMenuCheckboxItemProps> = ({
  className,
  children,
  checked,
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2  py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
};

export const DropdownMenuRadioGroup: FC<DropdownMenuRadioGroupProps> = ({
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
};

export const DropdownMenuRadioItem: FC<DropdownMenuRadioItemProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2  py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
};

export const DropdownMenuLabel: FC<DropdownMenuLabelProps> = ({
  className,
  inset,
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  );
};

export const DropdownMenuSeparator: FC<DropdownMenuSeparatorProps> = ({
  className,
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-blueprint-400 -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
};

export const DropdownMenuShortcut: FC<DropdownMenuShortcutProps> = ({
  className,
  ...props
}) => {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  );
};

export const DropdownMenuSub: FC<DropdownMenuSubProps> = ({ ...props }) => {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
};

export const DropdownMenuSubTrigger: FC<DropdownMenuSubTriggerProps> = ({
  className,
  inset,
  children,
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center  px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
};

export const DropdownMenuSubContent: FC<DropdownMenuSubContentProps> = ({
  className,
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden  border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  );
};
