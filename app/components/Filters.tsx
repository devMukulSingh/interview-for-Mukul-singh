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
import { TApiRespons, TLaunchTable, TStatus } from "~/lib/types";
import { TRocket } from "~/lib/types/rocket";
import { TLaunchPad } from "~/lib/types/launchPad";
import { useLaunches } from "store/store";
import {
  getLaunches,
  getLaunchPads,
  getPayloads,
  getRockets,
} from "~/service/api";
import LaunchDetailDialog from "./LaunchDetailDialog";
import { launchStatus } from "~/lib/constants";
export function StatusFilter({}) {
  const { setParams, getParams } = useUrlSearchParams();
  function handleFilterChange(status: TStatus) {
    setParams("status", status);
  }
  return (
    <>
      <Select
        value={getParams("status") || ""}
        onValueChange={handleFilterChange}
      >
        <SelectTrigger className="w-fit gap-2 border-none shadow-none max-sm:text-sm text-nowrap">
          <Filter className="sm:size-4 size-[14px]"  />
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
export function TimeFilter() {
  const { getParams } = useUrlSearchParams();
  const from = getParams("from");
  const to = getParams("to");
  const dateRange = getParams("dateRange");
  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2 max-sm:text-sm text-nowrap">
        <Calendar className="sm:size-4 size-[14px]" />
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
