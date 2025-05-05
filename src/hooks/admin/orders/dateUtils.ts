
import { addDays, startOfDay, endOfDay } from "date-fns";
import { DateRangeType } from "./types";

export const calculateDateFilters = (
  dateRange: DateRangeType, 
  customDateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }
) => {
  const today = new Date();
  
  if (dateRange === "custom" && customDateRange.startDate && customDateRange.endDate) {
    return {
      startDate: startOfDay(customDateRange.startDate),
      endDate: endOfDay(customDateRange.endDate),
    };
  } else if (dateRange === "7days") {
    return {
      startDate: startOfDay(addDays(today, -7)),
      endDate: endOfDay(today),
    };
  } else if (dateRange === "30days") {
    return {
      startDate: startOfDay(addDays(today, -30)),
      endDate: endOfDay(today),
    };
  }
  
  return {
    startDate: undefined,
    endDate: undefined,
  };
};
