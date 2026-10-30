import { useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_BY_ID } from "../../constants/categories";
import type { CategoryId, Transaction } from "../../types";
import { formatDate, formatSum } from "../../utils/format";
import { Dropdown } from "../Dropdown/Dropdown";
import { TrashIcon } from "../icons";
import styles from "./ExpensesTable.module.css";

type Filter = CategoryId | "all";
type Sort = "date" | "sum";

const FILTER_OPTIONS = [
  { value: "all" as const, label: "все" },
  ...CATEGORIES.map(({ id, label }) => ({ value: id, label })),
];

const SORT_OPTIONS = [
  { value: "date" as const, label: "дате" },
  { value: "sum" as const, label: "сумме" },
];

interface Props {
  transactions: Transaction[];
  isMobile: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onDelete?: (id: string) => void;
  title?: string;
  message?: string | null;
}

export function ExpensesTable({
  transactions,
  isMobile,
  selectedId,
  onSelect,
  onDelete,
  title,
  message,
}: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("date");

  const rows = useMemo(() => {
    const filtered =
      filter === "all"
        ? transactions
        : transactions.filter((item) => item.category === filter);
    return [...filtered].sort((a, b) =>
      sort === "date"
        ? b.date.localeCompare(a.date)
        : b.sum - a.sum || b.date.localeCompare(a.date),
    );
  }, [transactions, filter, sort]);

  const endClass = isMobile ? styles.alignEnd : undefined;

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.controls}>
          <Dropdown
            label="Фильтровать по категории"
            value={filter}
            options={FILTER_OPTIONS}
            onChange={setFilter}
          />
          <Dropdown
            label="Сортировать по"
            value={sort}
            options={SORT_OPTIONS}
            onChange={setSort}
          />
        </div>
      </div>

      <div className={styles.table} role="table">
        <div className={`${styles.row} ${styles.headerRow}`} role="row">
          <span role="columnheader">Описание</span>
          <span role="columnheader">Категория</span>
          <span role="columnheader" className={endClass}>
            Дата
          </span>
          <span role="columnheader" className={endClass}>
            Сумма
          </span>
          {!isMobile && <span />}
        </div>

        <div className={styles.body}>
          {message && <p className={styles.empty}>{message}</p>}
          {!message && rows.length === 0 && (
            <p className={styles.empty}>
              {transactions.length === 0
                ? "Расходов пока нет. Добавьте первый расход."
                : "Нет расходов в этой категории."}
            </p>
          )}
          {!message &&
            rows.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  role="row"
                  aria-selected={isMobile ? isSelected : undefined}
                  className={[
                    styles.row,
                    isMobile && styles.selectable,
                    isSelected && styles.selected,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={
                    isMobile
                      ? () => onSelect?.(isSelected ? null : item.id)
                      : undefined
                  }
                >
                  <span role="cell" className={styles.cell}>
                    {item.description}
                  </span>
                  <span role="cell" className={styles.cell}>
                    {CATEGORY_BY_ID[item.category].label}
                  </span>
                  <span role="cell" className={endClass}>
                    {formatDate(item.date)}
                  </span>
                  <span role="cell" className={endClass}>
                    {formatSum(item.sum)}
                  </span>
                  {!isMobile && (
                    <button
                      type="button"
                      className={styles.delete}
                      aria-label={`Удалить расход «${item.description}»`}
                      onClick={() => onDelete?.(item.id)}
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
