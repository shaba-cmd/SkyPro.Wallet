import { useEffect, useRef } from "react";
import { MONTHS, toIsoDate } from "../../utils/format";
import { isInPeriod, type MonthRef, type Period } from "../../utils/period";
import styles from "./Calendar.module.css";

const WEEKDAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

interface Props {
  months: MonthRef[];
  period: Period;
  onChange: (period: Period) => void;
  className?: string;
}

const monthKey = ({ year, month }: MonthRef) =>
  `${year}-${String(month + 1).padStart(2, "0")}`;

function getDays({ year, month }: MonthRef) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  return {
    offset,
    days: Array.from({ length: daysInMonth }, (_, index) =>
      toIsoDate(new Date(year, month, index + 1)),
    ),
  };
}

function nextPeriod(current: Period, day: string): Period {
  if (current.to || day === current.from) {
    return { from: day, to: null };
  }
  return day < current.from
    ? { from: day, to: current.from }
    : { from: current.from, to: day };
}

export function Calendar({ months, period, onChange, className }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedMonthRef = useRef<HTMLDivElement>(null);

  const firstMonth = months.length > 0 ? monthKey(months[0]) : "";

  useEffect(() => {
    const container = scrollRef.current;
    const month = selectedMonthRef.current;
    if (!container || !month) return;
    container.scrollTop +=
      month.getBoundingClientRect().top - container.getBoundingClientRect().top;
  }, [firstMonth]);

  const selectedMonth = period.from.slice(0, 7);

  return (
    <div className={[styles.calendar, className].filter(Boolean).join(" ")}>
      <div className={styles.weekdaysRow}>
        <div className={styles.weekdays}>
          {WEEKDAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
      <div className={styles.months} ref={scrollRef}>
        {months.map((monthRef) => {
          const { offset, days } = getDays(monthRef);
          const key = monthKey(monthRef);
          return (
            <div
              key={key}
              className={styles.month}
              ref={key === selectedMonth ? selectedMonthRef : undefined}
            >
              <h3 className={styles.monthTitle}>
                {MONTHS[monthRef.month]} {monthRef.year}
              </h3>
              <div className={styles.days}>
                {offset > 0 && (
                  <span style={{ gridColumn: `span ${offset}` }} />
                )}
                {days.map((day) => {
                  const isSelected = isInPeriod(day, period);
                  return (
                    <button
                      key={day}
                      type="button"
                      className={[styles.day, isSelected && styles.selected]
                        .filter(Boolean)
                        .join(" ")}
                      aria-pressed={isSelected}
                      onClick={() => onChange(nextPeriod(period, day))}
                    >
                      {Number(day.slice(8))}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
