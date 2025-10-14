import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import type { FC } from "react";
import { Toaster as Sonner, type ToasterProps, toast } from "sonner";
import { Button } from "../button/button";
import type { ToastProps } from "./toasts.types";

export const Toaster: FC<ToasterProps> = ({ ...props }) => {
  return (
    <Sonner
      theme={"dark"}
      duration={2000}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      {...props}
    />
  );
};

export const Toast: FC<ToastProps> = ({ id, title, description, action }) => {
  const closeToast = () => {
    toast.dismiss(id);
  };

  return (
    <div className="bg-blueprint-700 border relative border-blueprint-400 rounded-lg px-4 py-3 min-w-96 w-full max-w-screen">
      <div
        className="absolute rounded-full h-6 w-6 flex items-center justify-center bg-blueprint-700 hover:bg-blueprint-900 border border-blueprint-400 -top-2 -right-2 cursor-pointer"
        onClick={closeToast}
      >
        <XIcon className="size-4" />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col relative w-72 gap-0.5 pr-2">
          <h3 className="text-sm font-medium select-none">{title}</h3>
          <p className="text-xs text-blueprint-200 line-clamp-1 truncate select-none">
            {description}
          </p>
        </div>
        {action && (
          <div className="flex items-center justify-center">
            <Button
              onClick={() => {
                action.onClick();
                closeToast();
              }}
              size={"sm"}
            >
              {action.btnText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
