import { type FC, useState } from 'react'
import { Button } from '../ui/button/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog/dialog'
import type { ModalProps } from './modal.types'


export const Modal: FC<ModalProps> = ({
    title,
    cancelBtn,
    children,
    description,
    state,
    submitBtn,
    trigger,
    overlayClose
  }) => {
  const [openInternal,setOpenInternal] = useState(false)


  return (
    <Dialog
      open={state ? state.open : openInternal}
      onOpenChange={(currState) => state ? state.setOpen(currState) : setOpenInternal(currState)}
      modal
    >
      {trigger !== null && (
        <DialogTrigger>
          {typeof trigger === "object" && "text" in trigger ? (
            <Button variant={"outline"} {...trigger.props}>{trigger.text}</Button>
          ) : (
              trigger
          )}
        </DialogTrigger>
      )}
      <DialogContent overlayClickClose={overlayClose}>
        <DialogHeader>
          <DialogTitle>{title ?? "New dialog"}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">{cancelBtn?.text ?? "Cancel"}</Button>
          </DialogClose>
          <Button onClick={() => {
            submitBtn?.onSubmit?.()
          }} disabled={submitBtn?.disabled}>{submitBtn?.text ?? "Submit"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
