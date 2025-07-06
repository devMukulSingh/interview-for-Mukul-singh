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
import { Calendar, Filter, Loader2Icon } from "lucide-react";
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
import { useCallback, useEffect, useState } from "react";
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
import { TApiRespons, TLaunchDetail, TLaunchTable, TStatus } from "~/lib/types";
import { TRocket } from "~/lib/types/rocket";
import { TLaunchPad } from "~/lib/types/launchPad";
import { useLaunches } from "~/store/store";
import {
  getLaunches,
  getLaunchPads,
  getPayloads,
  getRockets,
} from "~/service/api";
import LaunchDetailDialog from "./LaunchDetailDialog";
import { launchStatus } from "~/lib/constants";
import { StatusFilter, TimeFilter } from "./Filters";
import { TLaunch } from "~/lib/types/launch";
import { toast } from "sonner";
import Spinner from "./Spinner";
import useIsMobile from "~/lib/hooks/useIsMobile";
const PAGE_SIZE = 12;
export const columns: ColumnDef<TLaunchTable>[] = [
  {
    accessorKey: "no",
    header: "No.",
  },
  {
    accessorKey: "id",
    meta: {
      hideOnMobile: true,
    },
    cell: ({ getValue }) => (
      <p className="font-medium max-sm:hidden sm:text-sm text-xs">
        {getValue() as string}
      </p>
    ),
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
  const isMobile = useIsMobile();
  const { getParams, setParams } = useUrlSearchParams();
  const from = getParams("from");
  const to = getParams("to");
  const status = getParams("status");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const {
    data: launchesData,
    error: getLaunchesError,
    isFetching: isFetchingLaunches,
  } = useQuery<TApiRespons<TLaunch[]>>({
    queryFn: getLaunches,
    queryKey: ["get_launches"],
  });
  const {
    data: rocketsData,
    error: getRocketError,
    isFetching: isFetchingRocket,
  } = useQuery<TApiRespons<TRocket[]>>({
    queryKey: ["get_rockets"],
    queryFn: getRockets,
  });
  const {
    data: payloadData,
    error: getPayloadError,
    isFetching: isFetchingPayload,
  } = useQuery<TApiRespons<TPayload[]>>({
    queryKey: ["get_payloads"],
    queryFn: getPayloads,
  });
  const {
    data: launchPadsData,
    error: getLaunchPadError,
    isFetching: isFetchingLaunchPads,
  } = useQuery<TApiRespons<TLaunchPad[]>>({
    queryKey: ["get_launch_pads"],
    queryFn: getLaunchPads,
  });
  const getFilteredData = useCallback(() => {
    let data: TLaunchDetail[] = [];
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
        id: launch.id,
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
        flightNumber: launch.flight_number,
        rocketType: rocket?.type,
        manufacturer: payload?.manufacturers?.[0],
        nationality: payload?.nationalities?.[0],
        payloadType: payload?.type,
        launchSite: launchPad?.name,
        image: launchPad?.images?.large?.[0],
        links: launch.links,
        description: rocket?.description,
      });
    }
    return data;
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
      columnVisibility: {
        id: !isMobile,
      },
      pagination: {
        pageSize: 12,
      },
    },
  });

  function handleRowClick(id: string) {
    setIsOpenDialog(true);
    setParams("activeId", id);
  }
  useEffect(() => {
    if (!launchesData || !rocketsData || !payloadData || !launchPadsData)
      return;
    setLaunchesData(getFilteredData());
    setTableData(getFilteredData());
  }, [launchesData, rocketsData, payloadData, launchPadsData]);
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
  useEffect(() => {
    table.setColumnVisibility({
      id: !isMobile,
    });
  }, [isMobile, table]);
  if (
    getLaunchesError ||
    getLaunchPadError ||
    getRocketError ||
    getPayloadError
  ) {
    console.log({
      getLaunchesError,
      getLaunchPadError,
      getRocketError,
      getPayloadError,
    });
    toast("Something went wrong");
  }

  return (
    <>
      <div className="w-full p-3 sm:p-6 bg-white xl:max-w-[1100px] self-center flex flex-col gap-5">
        <div className="flex justify-between itens-center">
          <TimeFilter />
          <StatusFilter />
        </div>
        <div className="rounded-md border">
          <Table className="sm:overflow-hidden min-h-[63vh]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => {
                    // const hideOnMobile = (
                    //   header.column.columnDef.meta as {
                    //     hideOnMobile?: boolean;
                    //   }
                    // )?.hideOnMobile;
                    // if (hideOnMobile && isMobile) return null;
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

            <TableBody className="">
              {isFetchingLaunchPads ||
              isFetchingLaunches ||
              isFetchingPayload ||
              isFetchingRocket ? (
                <TableRow className="">
                  <TableCell colSpan={columns.length}>
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={
                      index % 2 === 0
                        ? "bg-white cursor-pointer"
                        : "cursor-pointer bg-gray-50/50"
                    }
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          onClick={() => handleRowClick(row.original.id)}
                          key={cell.id}
                          className="py-3"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
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
      <LaunchDetailDialog
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
      />
    </>
  );
}

//////////////////////////////////////////
function Pagination({ table }: { table: TTable<TLaunchTable> }) {
  const { tableData } = useLaunches();
  const totalPages = Math.ceil((tableData?.length || 1) / PAGE_SIZE);
  return (
    <div className="flex items-center mt-auto justify-center sm:justify-end space-x-2 py-4">
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
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
          {">"}
        </Button>
      </div>
    </div>
  );
}
