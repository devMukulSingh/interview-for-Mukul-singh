"use client";
// import { useState } from "react";
// import { Button } from "~/components/ui/button";
// import { Card, CardContent } from "~/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "~/components/ui/select";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const timePresets = [
//   "Past week",
//   "Past month",
//   "Past 3 months",
//   "Past 6 months",
//   "Past year",
//   "Past 2 years",
// ];

// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// const dayAbbrevs = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// function getDaysInMonth(month: number, year: number) {
//   return new Date(year, month + 1, 0).getDate();
// }

// function getFirstDayOfMonth(month: number, year: number) {
//   return new Date(year, month, 1).getDay();
// }

// function generateCalendarDays(month: number, year: number) {
//   const daysInMonth = getDaysInMonth(month, year);
//   const firstDay = getFirstDayOfMonth(month, year);
//   const days = [];

//   // Add empty cells for days before the first day of the month
//   for (let i = 0; i < firstDay; i++) {
//     days.push(null);
//   }

//   // Add days of the month
//   for (let day = 1; day <= daysInMonth; day++) {
//     days.push(day);
//   }

//   return days;
// }

// export default function DateRangePicker() {
//   const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
//   const [leftMonth, setLeftMonth] = useState(0); // January = 0
//   const [leftYear, setLeftYear] = useState(2021);
//   const [rightMonth, setRightMonth] = useState(1); // February = 1
//   const [rightYear, setRightYear] = useState(2021);

//   const leftCalendarDays = generateCalendarDays(leftMonth, leftYear);
//   const rightCalendarDays = generateCalendarDays(rightMonth, rightYear);

//   return (
//     <div className="w-full p-0">
//       <div className="flex">
//         {/* Left Sidebar */}
//         <div className="w-48 border-r bg-gray-50 p-4">
//           <div className="space-y-1">
//             {timePresets.map((preset) => (
//               <Button
//                 key={preset}
//                 variant={selectedPreset === preset ? "secondary" : "ghost"}
//                 className="w-full justify-start text-sm font-normal"
//                 onClick={() => setSelectedPreset(preset)}
//               >
//                 {preset}
//               </Button>
//             ))}
//           </div>
//         </div>

//         {/* Calendar Area */}
//         <div className="flex-1 p-4">
//           <div className="flex items-center justify-between mb-4">
//             <Button variant="ghost" size="icon">
//               <ChevronLeft className="h-4 w-4" />
//             </Button>

//             <div className="flex items-center gap-8">
//               {/* Left Calendar Header */}
//               <div className="flex items-center gap-2">
//                 <Select
//                   value={months[leftMonth]}
//                   onValueChange={(value) => setLeftMonth(months.indexOf(value))}
//                 >
//                   <SelectTrigger className="w-32">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {months.map((month) => (
//                       <SelectItem key={month} value={month}>
//                         {month}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select
//                   value={leftYear.toString()}
//                   onValueChange={(value) => setLeftYear(Number.parseInt(value))}
//                 >
//                   <SelectTrigger className="w-20">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Array.from({ length: 10 }, (_, i) => 2020 + i).map(
//                       (year) => (
//                         <SelectItem key={year} value={year.toString()}>
//                           {year}
//                         </SelectItem>
//                       )
//                     )}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Right Calendar Header */}
//               <div className="flex items-center gap-2">
//                 <Select
//                   value={months[rightMonth]}
//                   onValueChange={(value) =>
//                     setRightMonth(months.indexOf(value))
//                   }
//                 >
//                   <SelectTrigger className="w-32">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {months.map((month) => (
//                       <SelectItem key={month} value={month}>
//                         {month}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select
//                   value={rightYear.toString()}
//                   onValueChange={(value) =>
//                     setRightYear(Number.parseInt(value))
//                   }
//                 >
//                   <SelectTrigger className="w-20">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Array.from({ length: 10 }, (_, i) => 2020 + i).map(
//                       (year) => (
//                         <SelectItem key={year} value={year.toString()}>
//                           {year}
//                         </SelectItem>
//                       )
//                     )}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <Button variant="ghost" size="icon">
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>

//           {/* Calendar Grids */}
//           <div className="flex gap-8">
//             {/* Left Calendar */}
//             <div className="flex-1">
//               <div className="grid grid-cols-7 gap-1 mb-2">
//                 {dayAbbrevs.map((day) => (
//                   <div
//                     key={day}
//                     className="text-center text-sm font-medium text-gray-500 py-2"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>
//               <div className="grid grid-cols-7 gap-1">
//                 {leftCalendarDays.map((day, index) => (
//                   <Button
//                     key={index}
//                     variant="ghost"
//                     className="h-8 w-8 p-0 text-sm hover:bg-gray-100"
//                     disabled={day === null}
//                   >
//                     {day}
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             {/* Right Calendar */}
//             <div className="flex-1">
//               <div className="grid grid-cols-7 gap-1 mb-2">
//                 {dayAbbrevs.map((day) => (
//                   <div
//                     key={day}
//                     className="text-center text-sm font-medium text-gray-500 py-2"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>
//               <div className="grid grid-cols-7 gap-1">
//                 {rightCalendarDays.map((day, index) => (
//                   <Button
//                     key={index}
//                     variant="ghost"
//                     className="h-8 w-8 p-0 text-sm hover:bg-gray-100"
//                     disabled={day === null}
//                   >
//                     {day}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
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
  const { setParams,removeParams } = useUrlSearchParams();
  const [selectedRange, setSelectedRange] = React.useState<string | null>(null);
  const handleRangeClick = (range: string) => {
    const { start, end } = predefinedRanges[range];
    setDate({ from: start, to: end });
    setSelectedRange(range);
    setParams("dateRange",range)
    removeParams("from")
    removeParams("to");
    // Close the calendar popover when a range is selected
  };
  function handleCalendarClick(dateRange:DateRange | undefined) {
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
