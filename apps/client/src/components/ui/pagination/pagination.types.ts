import type { Dispatch, SetStateAction } from "react";

export type PaginationProps = {
	currentPage: number;
	setCurrentPage: Dispatch<SetStateAction<number>>;
	itemsPerPage: number;
	itemsTotal: number;
};
