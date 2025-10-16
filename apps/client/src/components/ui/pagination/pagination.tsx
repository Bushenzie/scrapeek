import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import type { FC } from "react";
import { cn } from "@/lib/class";
import { buttonVariants } from "../button/button.variants";
import type {
  PaginationContentProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationNextProps,
  PaginationPreviousProps,
  PaginationProps,
} from "./pagination.types";

export const Pagination: FC<PaginationProps> = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
};

export const PaginationContent: FC<PaginationContentProps> = ({
  className,
  ...props
}: React.ComponentProps<"ul">) => {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
};

export const PaginationItem: FC<PaginationItemProps> = ({
  ...props
}: React.ComponentProps<"li">) => {
  return <li data-slot="pagination-item" {...props} />;
};

export const PaginationLink: FC<PaginationLinkProps> = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
};

export const PaginationPrevious: FC<PaginationPreviousProps> = ({
  className,
  ...props
}) => {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="sm"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
};

export const PaginationNext: FC<PaginationNextProps> = ({
  className,
  ...props
}) => {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="sm"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
};

export const PaginationEllipsis: FC<PaginationEllipsisProps> = ({
  className,
  ...props
}) => {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
};
