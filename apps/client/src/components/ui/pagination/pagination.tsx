import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import type { FC } from "react"
import { Button } from "@/components/ui/button/button"
import { cn } from "@/lib/class"
import type {
  PaginationContentProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationNextProps,
  PaginationPreviousProps,
  PaginationProps,
} from "./pagination.types"

export const Pagination: FC<PaginationProps> = ({ className, ...props }) => {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

export const PaginationContent: FC<PaginationContentProps> = ({ className, ...props }) => {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

export const PaginationItem: FC<PaginationItemProps> = ({ ...props }) => {
  return <li data-slot="pagination-item" {...props} />
}

export const PaginationLink: FC<PaginationLinkProps> = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => {
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(className)}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      }
    />
  )
}

export const PaginationPrevious: FC<PaginationPreviousProps> = ({
  className,
  text = "Previous",
  ...props
}) => {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("pl-2!", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

export const PaginationNext: FC<PaginationNextProps> = ({ className, text = "Next", ...props }) => {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("pr-2!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  )
}

export const PaginationEllipsis: FC<PaginationEllipsisProps> = ({ className, ...props }) => {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}
