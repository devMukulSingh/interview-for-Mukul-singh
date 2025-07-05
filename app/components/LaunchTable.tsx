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
import {
  useCallback,
  useEffect,
  useState,
} from "react";
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
import { TPayload } from "~/lib/types/payload";
import { TApiRespons, TStatus } from "~/lib/types";
import { TRocket } from "~/lib/types/rocket";
import { TLaunchPad } from "~/lib/types/launchPad";
import { useLaunches } from "store/store";
import { getLaunches, getLaunchPads, getPayloads, getRockets } from "~/services/api";
export type TLaunchTable = {
  no: number;
  launched: string;
  location: string;
  mission: string;
  orbit: string;
  status: "Success" | "Failed" | "Upcoming";
  rocket: string;
};
const PAGE_SIZE = 12;
export const columns: ColumnDef<TLaunchTable>[] = [
  {
    accessorKey: "no",
    header: "No.",
  },
  {
    accessorKey: "launched",
    header: "Launched (UTC)",
    cell: ({ row }) => (
      <p className="font-medium  sm:text-sm text-xs">
        {format(row.getValue("launched"), "dd MMM yyyy  hh:mm")}
      </p>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <p className=" sm:text-sm text-xs">{row.getValue("location")}</p>
    ),
  },
  {
    accessorKey: "mission",
    header: "Mission",
    cell: ({ row }) => (
      <p className=" sm:text-sm text-xs">{row.getValue("mission")}</p>
    ),
  },
  {
    accessorKey: "orbit",
    header: "Orbit",
    cell: ({ row }) => (
      <p className="md:text-sm sm:text-xs">{row.getValue("orbit")}</p>
    ),
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

export default function LaunchesTable() {
  const {
    setLaunchesData,
    tableData,
    setTableData,
    launchesData: launchesFromStore,
  } = useLaunches();
  const { getParams } = useUrlSearchParams();
  const from = getParams("from");
  const to = getParams("to");
  const status = getParams("status");
  const dateRange = getParams("dateRange");
  const [sorting, setSorting] = useState<SortingState>([]);
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
    queryKey: ["get_payloads"],
    queryFn: getPayloads,
  });
  const { data: launchPadsData } = useQuery<TApiRespons<TLaunchPad[]>>({
    queryKey: ["get_launch_pads"],
    queryFn: getLaunchPads,
  });
  const getFilteredData = useCallback(() => {
    let data: TLaunchTable[] = [];
    let no = 1;
    if (!launchesData?.data) return [];
    for (let launch of launchesData?.data) {
      const launchPad = launchPadsData?.data?.find(
        (lp) => lp?.id === launch?.launchpad
      );
      const payload = payloadData?.data?.find(
        (pl) => pl?.id === launch?.payloads?.[0]
      );
      const rocket = rocketsData?.data?.find(
        (rkt) => rkt?.id === launch?.rocket
      );
      data.push({
        no: no++,
        launched: launch.date_utc,
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
    return data;
  }, [launchesData, rocketsData, payloadData, launchPadsData]);
  useEffect(() => {
    if (!launchesData || !rocketsData || !payloadData || !launchPadsData)
      return;
    setLaunchesData(getFilteredData());
    setTableData(getFilteredData());
  }, [launchesData, rocketsData, payloadData, launchPadsData]);

  const table = useReactTable({
    data: tableData || [],
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
  useEffect(() => {
    if (!launchesFromStore) return;
    if (to && from && status) {
      if (status === "all") {
        const filtered =
          launchesFromStore?.filter(
            (data) => data.launched >= from && data.launched <= to
          ) || [];
        setTableData(filtered);
        return;
      }
      const filtered =
        launchesFromStore?.filter(
          (data) =>
            data.launched >= from &&
            data.launched <= to &&
            data.status === status
        ) || [];
      setTableData(filtered);
    } else if (to && from) {
      const filtered =
        launchesFromStore?.filter(
          (data) => data.launched >= from && data.launched <= to
        ) || [];
      setTableData(filtered);
    } else if (status) {
      if (status === "all") {
        setTableData(launchesFromStore || []);
        return;
      }
      const filtered =
        launchesFromStore?.filter((data) => data.status === status) || [];
      setTableData(filtered);
    }
  }, [to, from, status, launchesFromStore]);
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
                      className="font-medium text-gray-700 max-sm:text-sm"
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
function StatusFilter({}) {
  const { setParams, getParams } = useUrlSearchParams();
  const { setTableData, launchesData, tableData } = useLaunches();
  function handleFilterChange(status: TStatus) {
    // if (status === "all") {
    //   const to = getParams("to");
    //   const from = getParams("from");
    //   if (to && from) {
    //     const filtered =
    //       launchesData?.filter(
    //         (data) => data.launched >= from && data.launched <= to
    //       ) || [];
    //     setTableData(filtered);
    //   } else setTableData(launchesData || []);
    // } else {
    //   const filtered =
    //     launchesData?.filter((data) => data.status === status) || [];
    //   setTableData(filtered);
    // }
    setParams("status", status);
  }
  const launchStatus = [
    {
      title: "All Launches",
      value: "all",
    },
    {
      title: "Successfull Only",
      value: "Success",
    },
    {
      title: "Failed Only",
      value: "Failed",
    },
    {
      title: "Upcoming Only",
      value: "Upcoming",
    },
  ];

  return (
    <>
      <Select
        value={getParams("status") || ""}
        onValueChange={handleFilterChange}
      >
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
        {dateRange
          ? dateRange
          : from && to
          ? `${from && format(from, "dd/MM/yy")} - ${
              to && format(to, "dd/MM/yy")
            }`
          : "Select date"}
      </DialogTrigger>
      <DialogContent className="max-w-[60vw] !p-3">
        <DateRangePicker />
      </DialogContent>
    </Dialog>
  );
}

//////////////////////////////////////////
function Pagination({ table }: { table: TTable<TLaunchTable> }) {
  const { tableData } = useLaunches();
  const totalPages = Math.ceil((tableData?.length || 1) / PAGE_SIZE);
  return (
    <div className="flex items-center mt-auto justify-end space-x-2 py-4">
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
        {totalPages > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(1)}
            disabled={table.getState().pagination.pageIndex === 1}
          >
            2
          </Button>
        )}
        <span className="px-2">...</span>
        {totalPages > 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={table.getState().pagination.pageIndex === totalPages - 1}
          >
            {totalPages}
          </Button>
        )}
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
