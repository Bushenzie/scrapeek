import { type FC, Fragment, useState } from 'react'
import { Button } from '../ui/button/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog/dialog'
import { DropdownMenuItem } from '../ui/dropdown/dropdown'
import type { ModalProps } from './modal.types'


export const Modal: FC<ModalProps> = ({
    title,
    cancelBtn,
    children,
    description,
    state,
    submitBtn,
    trigger,
    overlayClose,
    isDropdownMenuItem = false
  }) => {
  const [openInternal,setOpenInternal] = useState(false)

  return (
    <Dialog
      open={state ? state.open : openInternal}
      onOpenChange={(currState) => state ? state.setOpen(currState) : setOpenInternal(currState)}
    >
      {trigger !== null && (
        <Fragment>
          {isDropdownMenuItem ? (
            <DropdownMenuItem asChild onSelect={(e) => console.log("Ssd") } onClick={() => state ? state.setOpen(true) : setOpenInternal(true)}>
              <DialogTrigger render={(
                <Button variant={"outline"} {...trigger?.props}>{trigger?.content}</Button>
              )}/>
            </DropdownMenuItem>
          ): (

              <DialogTrigger render={(
                <Button variant={"outline"} {...trigger?.props}>{trigger?.content}</Button>
              )}/>
          )}
        </Fragment>
      )}
      <DialogContent className={"flex flex-col gap-4"}>
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
