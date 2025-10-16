import type { ComponentProps } from "react";
import type { Button } from "../button/button";
import type { PaginationLink } from "./pagination";

export type PaginationProps = ComponentProps<"nav">;
export type PaginationContentProps = ComponentProps<"ul">;
export type PaginationItemProps = ComponentProps<"li">;
export type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;
export type PaginationPreviousProps = ComponentProps<typeof PaginationLink>;
export type PaginationNextProps = ComponentProps<typeof PaginationLink>;
export type PaginationEllipsisProps = ComponentProps<"span">;
