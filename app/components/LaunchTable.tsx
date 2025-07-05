"use client";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  Table as TTable,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Calendar, ChevronDown, Filter } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { useState } from "react";

const data: TLaunch[] = [
  {
    id: "01",
    launched: "24 March 2006 at 22:30",
    location: "Kwajalein Atoll",
    mission: "FalconSat",
    orbit: "LEO",
    status: "Failed",
    rocket: "Falcon 9",
  },
  {
    id: "02",
    launched: "28 September 2008 23:15",
    location: "Kwajalein Atoll",
    mission: "RatSat",
    orbit: "LEO",
    status: "Success",
    rocket: "Falcon 9",
  },
  {
    id: "03",
    launched: "04 June 2010 18:45",
    location: "CCAFS SLC 40",
    mission: "Falcon 9 Test Flight",
    orbit: "LEO",
    status: "Success",
    rocket: "Falcon 9",
  },
  {
    id: "04",
    launched: "06 December 2020 16:17",
    location: "KSC LC 39A",
    mission: "CRS-21",
    orbit: "ISS",
    status: "Upcoming",
    rocket: "Falcon 9",
  },
  {
    id: "05",
    launched: "24 March 2006 at 22:30",
    location: "Kwajalein Atoll",
    mission: "FalconSat",
    orbit: "LEO",
    status: "Failed",
    rocket: "Falcon 9",
  },
  {
    id: "06",
    launched: "28 September 2008 23:15",
    location: "Kwajalein Atoll",
    mission: "RatSat",
    orbit: "LEO",
    status: "Success",
    rocket: "Falcon 9",
  },
  {
    id: "07",
    launched: "04 June 2010 18:45",
    location: "CCAFS SLC 40",
    mission: "Falcon 9 Test Flight",
    orbit: "LEO",
    status: "Success",
    rocket: "Falcon 9",
  },
  {
    id: "08",
    launched: "06 December 2020 16:17",
    location: "KSC LC 39A",
    mission: "CRS-21",
    orbit: "ISS",
    status: "Upcoming",
    rocket: "Falcon 9",
  },
  {
    id: "09",
    launched: "24 March 2006 at 22:30",
    location: "Kwajalein Atoll",
    mission: "FalconSat",
    orbit: "LEO",
    status: "Failed",
    rocket: "Falcon 9",
  },
  {
    id: "10",
    launched: "28 September 2008 23:15",
    location: "Kwajalein Atoll",
    mission: "RatSat",
    orbit: "LEO",
    status: "Success",
    rocket: "Falcon 9",
  },
  {
    id: "11",
    launched: "04 June 2010 18:45",
    location: "CCAFS SLC 40",
    mission: "Falcon 9 Test Flight",
    orbit: "LEO",
    status: "Success",
    rocket: "Falcon 9",
  },
  {
    id: "12",
    launched: "06 December 2020 16:17",
    location: "KSC LC 39A",
    mission: "CRS-21",
    orbit: "ISS",
    status: "Upcoming",
    rocket: "Falcon 9",
  },
];

export type TLaunch = {
  id: string;
  launched: string;
  location: string;
  mission: string;
  orbit: string;
  status: "Success" | "Failed" | "Upcoming";
  rocket: string;
};

export const columns: ColumnDef<TLaunch>[] = [
  {
    accessorKey: "id",
    header: "No.",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "launched",
    header: "Launched (UTC)",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("launched")}</div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  {
    accessorKey: "mission",
    header: "Mission",
    cell: ({ row }) => <div>{row.getValue("mission")}</div>,
  },
  {
    accessorKey: "orbit",
    header: "Orbit",
    cell: ({ row }) => <div>{row.getValue("orbit")}</div>,
  },
  {
    accessorKey: "status",
    header: "Launch Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "Success"
              ? "default"
              : status === "Failed"
              ? "destructive"
              : "secondary"
          }
          className={
            status === "Success"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : status === "Failed"
              ? "bg-red-100 text-red-800 hover:bg-red-100"
              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "rocket",
    header: "Rocket",
    cell: ({ row }) => <div>{row.getValue("rocket")}</div>,
  },
];

export default function LaunchesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 12,
      },
    },
  });

  return (
    <div className="w-full p-6 bg-white xl:max-w-[1200px] self-center flex flex-col gap-5">
      <div className="flex justify-between itens-center">
        <Filters />
        <TimeFilter />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-medium text-gray-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} />
    </div>
  );
}
///////////////////////////////////
function Filters() {
  const launchStatus = [
    "All Launches",
    "Successfull Only",
    "Failed Only",
    "Upcoming Onl",
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Select Status
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {launchStatus.map((status, index) => (
          <DropdownMenuCheckboxItem key={index}>
            {status}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
//////////////////////////////////////////
function TimeFilter() {
  const timeFilters = ["Past 6 Month", "Past Year", "All time"];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Calendar className="h-4 w-4" />
          Select time
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {timeFilters.map((time, index) => (
          <DropdownMenuCheckboxItem key={index}>
            {time}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
//////////////////////////////////////////
function Pagination({ table }: { table: TTable<TLaunch> }) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={table.getState().pagination.pageIndex === 0}
        >
          1
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(1)}
          disabled={table.getState().pagination.pageIndex === 1}
        >
          2
        </Button>
        <span className="px-2">...</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(9)}
          disabled={table.getState().pagination.pageIndex === 9}
        >
          10
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
