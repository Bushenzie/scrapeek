import { type FC } from "react";
import { cn } from "@/lib/class";
import type {
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
} from "./table.types";

export const Table: FC<TableProps> = ({ className, ...props }) => {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
};

export const TableHeader: FC<TableHeaderProps> = ({ className, ...props }) => {
  return (
    <thead data-slot="table-header" className={cn("[&_tr]:border-b border-b-blueprint-400", className)} {...props} />
  );
};

export const TableBody: FC<TableBodyProps> = ({ className, ...props }) => {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0 ", className)} {...props} />;
};

export const TableFooter: FC<TableFooterProps> = ({ className, ...props }) => {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("bg-muted/50 border-blueprint-400/50 font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  );
};

export const TableRow: FC<TableRowProps> = ({ className, ...props }) => {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-blueprint-900 data-[state=selected]:bg-muted border-b border-blueprint-400/40 transition-colors",
        className,
      )}
      {...props}
    />
  );
};

export const TableHead: FC<TableHeadProps> = ({ className, ...props }) => {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-blueprint-100 h-10 px-3 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
};

export const TableCell: FC<TableCellProps> = ({ className, ...props }) => {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-3 align-middle text-blueprint-100 whitespace-nowrap font-normal [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
};

export const TableCaption: FC<TableCaptionProps> = ({ className, ...props }) => {
  return (
    <caption data-slot="table-caption" className={cn("text-blueprint-200/50 mt-4 text-sm", className)} {...props} />
  );
};
