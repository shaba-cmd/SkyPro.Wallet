import { CATEGORIES, CATEGORY_BY_ID } from "../../constants/categories";
import type { CategoryId, SortBy, Transaction } from "../../types";
import { formatDate, formatSum } from "../../utils/format";
import { Dropdown } from "../Dropdown/Dropdown";
import { TrashIcon } from "../icons";
import styles from "./ExpensesTable.module.css";

export type Filter = CategoryId | "all";

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
  filter: Filter;
  sort: SortBy;
  onFilterChange: (filter: Filter) => void;
  onSortChange: (sort: SortBy) => void;
  isMobile: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onDelete?: (id: string) => void;
  title?: string;
  message?: string | null;
}

export function ExpensesTable({
  transactions,
  filter,
  sort,
  onFilterChange,
  onSortChange,
  isMobile,
  selectedId,
  onSelect,
  onDelete,
  title,
  message,
}: Props) {
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
            onChange={onFilterChange}
          />
          <Dropdown
            label="Сортировать по"
            value={sort}
            options={SORT_OPTIONS}
            onChange={onSortChange}
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
          {!message && transactions.length === 0 && (
            <p className={styles.empty}>
              {filter === "all"
                ? "Расходов пока нет. Добавьте первый расход."
                : "Нет расходов в этой категории."}
            </p>
          )}
          {!message &&
            transactions.map((item) => {
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
