import type { ComponentProps } from "react"
import type { Button } from "../button/button"
import type { PaginationLink } from "./pagination"

export type PaginationProps = ComponentProps<"nav">
export type PaginationContentProps = ComponentProps<"ul">
export type PaginationItemProps = ComponentProps<"li">
export type PaginationEllipsisProps = ComponentProps<"span">
export type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ComponentProps<typeof Button>, "size"> &
  ComponentProps<"a">
export type PaginationNextProps = ComponentProps<typeof PaginationLink> & { text?: string }
export type PaginationPreviousProps = ComponentProps<typeof PaginationLink> & { text?: string }
