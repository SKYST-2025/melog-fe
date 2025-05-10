import { parseISO, getMonth, getWeek, format } from "date-fns";
import { Moment } from "@/objects/moment/model";

export function groupByWeek(moments: Moment[]): Record<string, Moment[]> {
  const grouped: Record<string, Moment[]> = {};

  for (const moment of moments) {
    const date = parseISO(moment.date);
    const monthName = format(date, "MMMM"); // "May"
    const weekInMonth = getWeek(date) - getWeek(new Date(date.getFullYear(), date.getMonth(), 1)) + 1;

    const key = `${monthName} - Week ${weekInMonth}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(moment);
  }

  return grouped;
}
