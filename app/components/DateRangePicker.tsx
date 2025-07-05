"use client";

import * as React from "react";
import { Calendar } from "~/components/ui/calendar";
import dayjs from "dayjs";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import useUrlSearchParams from "~/lib/hooks/useUrlSearchParams";

const predefinedRanges = {
  "Past Week": {
    start: dayjs().subtract(7, "days").toDate(),
    end: dayjs().toDate(),
  },
  "Past Month": {
    start: dayjs().subtract(1, "month").toDate(),
    end: dayjs().toDate(),
  },
  "Past 3 Months": {
    start: dayjs().subtract(3, "months").toDate(),
    end: dayjs().toDate(),
  },
  "Past 6 Months": {
    start: dayjs().subtract(6, "months").toDate(),
    end: dayjs().toDate(),
  },
  "Past Year": {
    start: dayjs().subtract(1, "year").toDate(),
    end: dayjs().toDate(),
  },
  "Past 2 Years": {
    start: dayjs().subtract(2, "years").toDate(),
    end: dayjs().toDate(),
  },
};

export default function DateRangePicker() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  const { setParams, removeParams } = useUrlSearchParams();
  const [selectedRange, setSelectedRange] = React.useState<string | null>(null);
  const handleRangeClick = (range: string) => {
    const { start, end } = predefinedRanges[range];
    setDate({ from: start, to: end });
    setSelectedRange(range);
    setParams("dateRange", range);
    removeParams("from");
    removeParams("to");
    // Close the calendar popover when a range is selected
  };
  function handleCalendarClick(dateRange: DateRange | undefined) {
    setDate(dateRange);
    setParams("from", date?.from?.toISOString() || "");
    setParams("to", date?.to?.toISOString() || "");
    removeParams("dateRange");
  }
  return (
    <div className="flex gap-6">
      <div className="w-60 p-4 bg-white rounded-lg">
        <p className="font-bold text-lg mb-4">Predefined Ranges</p>
        <ul>
          {Object.keys(predefinedRanges).map((range) => (
            <li
              key={range}
              className={`cursor-pointer px-4 py-2 rounded-md hover:bg-gray-200 ${
                selectedRange === range ? "bg-gray-300" : ""
              }`}
              onClick={() => handleRangeClick(range)}
            >
              {range}
            </li>
          ))}
        </ul>
      </div>
      <Calendar
        mode="range"
        numberOfMonths={2}
        selected={date}
        onSelect={handleCalendarClick}
        className="rounded-lg border shadow-sm"
      />
    </div>
  );
}
