import { CATEGORIES } from "../../constants/categories";
import type { Transaction } from "../../types";
import { formatDateLong, formatSum } from "../../utils/format";
import { isInPeriod, type Period } from "../../utils/period";
import styles from "./ExpensesChart.module.css";

interface Props {
  transactions: Transaction[];
  period: Period;
}

const VALUE_SPACE = 32;

export function ExpensesChart({ transactions, period }: Props) {
  const inPeriod = transactions.filter((item) => isInPeriod(item.date, period));
  const sums = CATEGORIES.map((category) => ({
    ...category,
    sum: inPeriod
      .filter((item) => item.category === category.id)
      .reduce((total, item) => total + item.sum, 0),
  }));
  const total = sums.reduce((acc, item) => acc + item.sum, 0);
  const max = Math.max(...sums.map((item) => item.sum));

  return (
    <>
      <div className={styles.summary}>
        <p className={styles.total}>{formatSum(total)}</p>
        <p className={styles.range}>
          Расходы за <b>{formatDateLong(period.from)}</b>
          {period.to && (
            <>
              {" — "}
              <b>{formatDateLong(period.to)}</b>
            </>
          )}
        </p>
      </div>

      <div className={styles.chart}>
        {sums.map(({ id, label, color, sum }) => (
          <div key={id} className={styles.column}>
            <div className={styles.bars}>
              <span className={styles.value}>{formatSum(sum)}</span>
              <div
                className={[styles.bar, sum === 0 && styles.empty]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  background: color,
                  height:
                    sum > 0
                      ? `calc((100% - ${VALUE_SPACE}px) * ${sum / max})`
                      : undefined,
                }}
                title={`${label}: ${formatSum(sum)}`}
              />
            </div>
            <span className={styles.label} title={label}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
