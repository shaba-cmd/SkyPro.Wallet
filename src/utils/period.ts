import type { Transaction } from "../types";
import { toIsoDate } from "./format";

export interface Period {
  from: string;
  to: string | null;
}

export interface MonthRef {
  year: number;
  month: number;
}

export function defaultPeriod(): Period {
  const today = new Date();
  return {
    from: toIsoDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    to: toIsoDate(today),
  };
}

export function readPeriod(params: URLSearchParams): Period {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  const from = params.get("from");
  const to = params.get("to");
  if (!from || !iso.test(from)) return defaultPeriod();
  return { from, to: to && iso.test(to) && to !== from ? to : null };
}

export function periodToSearch({ from, to }: Period): string {
  const params = new URLSearchParams({ from });
  if (to) params.set("to", to);
  return `?${params}`;
}

export function isInPeriod(date: string, { from, to }: Period): boolean {
  return to ? date >= from && date <= to : date === from;
}

export function getCalendarMonths(
  transactions: Transaction[],
  period: Period,
): MonthRef[] {
  const today = new Date();
  const dates = [
    toIsoDate(new Date(today.getFullYear(), today.getMonth() - 11, 1)),
    toIsoDate(today),
    period.from,
    period.to ?? period.from,
    ...transactions.map((item) => item.date),
  ].sort();
  const [startYear, startMonth] = dates[0].split("-").map(Number);
  const [endYear, endMonth] = dates[dates.length - 1].split("-").map(Number);

  const months: MonthRef[] = [];
  for (
    let year = startYear, month = startMonth - 1;
    year < endYear || (year === endYear && month <= endMonth - 1);
    month === 11 ? ((month = 0), year++) : month++
  ) {
    months.push({ year, month });
  }
  return months;
}
