import { ChevronLeft, ChevronRight } from "lucide-react"
import type { FC } from "react"
import { Button } from "../button/button"
import type { PaginationProps } from "./pagination.types"

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  itemsPerPage,
  itemsTotal,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(itemsTotal / itemsPerPage)

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => {
          setCurrentPage((prev) => (prev === 1 ? 1 : prev - 1))
        }}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
        <span>Prev</span>
      </Button>
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => {
          setCurrentPage((prev) => (prev === totalPages ? totalPages : prev + 1))
        }}
        disabled={currentPage === totalPages}
      >
        <span>Next</span>
        <ChevronRight />
      </Button>
    </div>
  )
}
