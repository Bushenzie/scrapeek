import { toast as sonnerToast } from "sonner"
import { Toast } from "./toasts"
import type { ToastProps } from "./toasts.types"

export const toast = (toast: Omit<ToastProps, "id">) => {
  return sonnerToast.custom((id) => <Toast id={id} {...toast} />)
}
