import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import type { FC } from "react";

import { cn } from "@/lib/class";
import type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "./dialog.types";

export const Dialog: FC<DialogProps> = ({ ...props }) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
};

export const DialogTrigger: FC<DialogTriggerProps> = ({ ...props }) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
};

export const DialogPortal: FC<DialogPortalProps> = ({ ...props }) => {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
};

export const DialogClose: FC<DialogCloseProps> = ({ ...props }) => {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className="cursor-pointer"
      {...props}
    />
  );
};

export const DialogOverlay: FC<DialogOverlayProps> = ({
  className,
  ...props
}) => {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
};

export const DialogContent: FC<DialogContentProps> = ({
  className,
  children,
  showCloseButton = true,
  overlayClickClose = false,
  ...props
}) => {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        // TODO
        onEscapeKeyDown={(e) =>
          overlayClickClose ? e.preventDefault() : undefined
        }
        onPointerDown={(e) =>
          overlayClickClose ? e.preventDefault() : undefined
        }
        onInteractOutside={(e) =>
          overlayClickClose ? e.preventDefault() : undefined
        }
        data-slot="dialog-content"
        className={cn(
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "bg-blueprint-900 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border border-blueprint-400 p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background cursor-pointer focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
};

export const DialogHeader: FC<DialogHeaderProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
};

export const DialogFooter: FC<DialogFooterProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
};

export const DialogTitle: FC<DialogTitleProps> = ({ className, ...props }) => {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-xl leading-loose font-semibold", className)}
      {...props}
    />
  );
};

export const DialogDescription: FC<DialogDescriptionProps> = ({
  className,
  ...props
}) => {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  );
};
