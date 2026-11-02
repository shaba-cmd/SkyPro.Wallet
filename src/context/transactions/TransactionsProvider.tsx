import { useEffect, useState, type ReactNode } from "react";
import type {
  CategoryFilter,
  NewTransaction,
  SortBy,
  Transaction,
} from "../../types";
import { ApiError } from "../../api/client";
import * as api from "../../api/transactions";
import { useAuth } from "../auth/useAuth";
import { TransactionsContext } from "./transactionsContext";

interface Props {
  token: string;
  children: ReactNode;
}

interface TableState {
  rows: Transaction[];
  error: string | null;
}

function insertInOrder(
  rows: Transaction[],
  item: Transaction,
  sortBy: SortBy,
): Transaction[] {
  const index = rows.findIndex((row) =>
    sortBy === "sum" ? row.sum < item.sum : row.date < item.date,
  );
  return index === -1
    ? [...rows, item]
    : [...rows.slice(0, index), item, ...rows.slice(index)];
}

export function TransactionsProvider({ token, children }: Props) {
  const { logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [table, setTable] = useState<TableState | null>(null);

  const handleError = (err: unknown) => {
    if (err instanceof ApiError && err.status === 401) {
      logout();
    }
    throw err;
  };

  useEffect(() => {
    let cancelled = false;
    api
      .getTransactions(token)
      .then((data) => {
        if (!cancelled) setTransactions(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }
        setError(
          err instanceof Error ? err.message : "Не удалось загрузить расходы",
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  useEffect(() => {
    let cancelled = false;
    api
      .getTransactions(token, {
        sortBy,
        filterBy: filter === "all" ? undefined : [filter],
      })
      .then((rows) => {
        if (!cancelled) setTable({ rows, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }
        setTable({
          rows: [],
          error:
            err instanceof Error ? err.message : "Не удалось загрузить расходы",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [token, logout, sortBy, filter]);

  const updateTableRows = (update: (rows: Transaction[]) => Transaction[]) =>
    setTable((prev) => prev && { ...prev, rows: update(prev.rows) });

  const value = {
    transactions,
    tableTransactions: table?.rows ?? [],
    filter,
    sortBy,
    setFilter,
    setSortBy,
    isLoading,
    isTableLoading: table === null,
    error: table?.error ?? error,
    addTransaction: async (data: NewTransaction) => {
      const updated = await api.addTransaction(token, data).catch(handleError);
      const knownIds = new Set(transactions.map((item) => item.id));
      const added = updated.find(
        (item) =>
          !knownIds.has(item.id) &&
          item.description === data.description &&
          item.category === data.category &&
          item.sum === data.sum,
      );
      setTransactions(updated);
      if (added && (filter === "all" || added.category === filter)) {
        updateTableRows((rows) => insertInOrder(rows, added, sortBy));
      }
    },
    deleteTransaction: async (id: string) => {
      setTransactions(
        await api.deleteTransaction(token, id).catch(handleError),
      );
      updateTableRows((rows) => rows.filter((row) => row.id !== id));
    },
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}