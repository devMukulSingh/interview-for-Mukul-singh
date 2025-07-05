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
import { Calendar, Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { useEffect, useState } from "react";
import { useSearchParams } from "@remix-run/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import DateRangePicker from "./DateRangePicker";
import useUrlSearchParams from "~/lib/hooks/useUrlSearchParams";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {  TPayload } from "~/lib/types/payload";
import axios from "axios";
import { TApiRespons } from "~/lib/types";
import { TRocket } from "~/lib/types/rocket";
import { TLaunchPad } from "~/lib/types/launchPad";
export type TLaunchTable = {
  no: number;
  launched: string;
  location: string;
  mission: string;
  orbit: string;
  status: "Success" | "Failed" | "Upcoming";
  rocket: string;
};

export const columns: ColumnDef<TLaunchTable>[] = [
  {
    accessorKey: "no",
    header: "No.",
  },
  {
    accessorKey: "launched",
    header: "Launched (UTC)",
    // cell: ({ row }) => (
    //   <div className="font-medium">{row.getValue("launched")}</div>
    // ),
  },
  {
    accessorKey: "location",
    header: "Location",
    // cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  {
    accessorKey: "mission",
    header: "Mission",
    // cell: ({ row }) => <div>{row.getValue("mission")}</div>,
  },
  {
    accessorKey: "orbit",
    header: "Orbit",
    // cell: ({ row }) => <div>{row.getValue("orbit")}</div>,
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
    cell: ({ row }) => <p className="text-nowrap">{row.getValue("rocket")}</p>,
  },
];
async function getLaunches() {
  return await axios.get(`https://api.spacexdata.com/v4/launches`);
}
async function getRockets() {
  return await axios.get(`https://api.spacexdata.com/v4/rockets`);
}
async function getPayloads() {
  return await axios.get(`https://api.spacexdata.com/v4/payloads`);
}
async function getLauncPads() {
  return await axios.get(`https://api.spacexdata.com/v4/launchpads`);
}
export default function LaunchesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TLaunchTable[] | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { data: launchesData } = useQuery<TApiRespons<TLaunch[]>>({
    queryFn: getLaunches,
    queryKey: ["get_launches"],
  });
  const { data: rocketsData } = useQuery<TApiRespons<TRocket[]>>({
    queryKey: ["get_rockets"],
    queryFn: getRockets,
  });
  const { data: payloadData } = useQuery<TApiRespons<TPayload[]>>({
    queryKey: ["get_rockets"],
    queryFn: getPayloads,
  });
  const { data: launchPadsData } = useQuery<TApiRespons<TLaunchPad[]>>({
    queryKey: ["get_launch_pads"],
    queryFn: getLauncPads,
  });
  useEffect(() => {
    if (!launchesData || !rocketsData || !payloadData ||!launchPadsData) return;
    let data:TLaunchTable[]=[];
    let no = 1;
    for(let launch of launchesData?.data){
      const launchPad = launchPadsData?.data?.find( (lp => lp?.id===launch?.launchpad))
      const payload = payloadData?.data?.find(
        (pl) => pl?.id === launch?.payloads?.[0]
      );
      const rocket = rocketsData?.data?.find(
        (rkt) => rkt?.id === launch?.rocket
      );
      data.push({
        no: no++,
        launched: format(launch.date_utc, "dd MMM yyyy  hh:mm"),
        location: launchPad?.full_name || "",
        mission: launch?.name,
        orbit: payload?.orbit || "",
        rocket: rocket?.name || "",
        status: launch?.success
          ? "Success"
          : launch?.upcoming
          ? "Upcoming"
          : "Failed",
      });
    }
    setData(data)
  }, [launchesData, rocketsData, payloadData, launchPadsData]);

  const table = useReactTable({
    data: data || [],
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
    <div className="w-full p-6 bg-white xl:max-w-[1100px] self-center flex flex-col gap-5">
      <div className="flex justify-between itens-center">
        <TimeFilter />
        <StatusFilter />
      </div>
      <div className="rounded-md border px-2">
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
function StatusFilter() {
  const [searchParms, setSearchParams] = useSearchParams();
  function handleFilterChange(status: string) {
    setSearchParams(
      (prev) => {
        prev.set("status", status);
        return prev;
      },
      {
        preventScrollReset: true,
      }
    );
  }
  const launchStatus = [
    {
      title: "All Launches",
      value: "allLaunches",
    },
    {
      title: "Successfull Only",
      value: "successfullOnly",
    },
    {
      title: "Failed Only",
      value: "failedOnly",
    },
    {
      title: "Upcoming Only",
      value: "upcomingOnly",
    },
  ];
  return (
    <>
      <Select onValueChange={handleFilterChange}>
        <SelectTrigger className="w-fit gap-2 border-none shadow-none">
          <Filter size={16} />
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          {launchStatus.map((status) => (
            <SelectItem key={status.title} value={status.value}>
              {status.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
//////////////////////////////////////////
function TimeFilter() {
  const { getParams } = useUrlSearchParams();
  const from = getParams("from");
  const to = getParams("to");
  const dateRange = getParams("dateRange");

  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2">
        <Calendar size={16} />
        {/* Select Time */}
        {to && format(to, "dd-MMM-yy")}
        {to && from && " - "}
        {from && format(from, "dd-MMM-yy")}
        {dateRange}
      </DialogTrigger>
      <DialogContent className="max-w-[60vw] !p-3">
        <DateRangePicker />
      </DialogContent>
    </Dialog>
  );
}

{
  /* <SelectTrigger className="w-fit gap-2 border-none shadow-none">
  <Calendar size={16} />
  <SelectValue placeholder="Select time duration" />
</SelectTrigger>; */
}

//////////////////////////////////////////
function Pagination({ table }: { table: TTable<TLaunchTable> }) {
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
