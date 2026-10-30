import { useEffect, useState } from "react";
import { ApiError } from "../../api/client";
import type { CategoryId, SortBy, Transaction } from "../../types";
import { useAuth } from "../auth/useAuth";
import { useTransactions } from "./useTransactions";

interface Result {
  key: string;
  rows: Transaction[];
  error: string | null;
}

export function useTableTransactions(
  sortBy: SortBy,
  filter: CategoryId | "all",
) {
  const { logout } = useAuth();
  const { fetchTransactions, version } = useTransactions();
  const [result, setResult] = useState<Result | null>(null);
  const key = `${sortBy}|${filter}|${version}`;

  useEffect(() => {
    let cancelled = false;
    fetchTransactions({
      sortBy,
      filterBy: filter === "all" ? undefined : [filter],
    })
      .then((rows) => {
        if (!cancelled) setResult({ key, rows, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }
        setResult({
          key,
          rows: [],
          error:
            err instanceof Error ? err.message : "Не удалось загрузить расходы",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [fetchTransactions, logout, sortBy, filter, key]);

  return {
    rows: result?.rows ?? [],
    isLoading: result?.key !== key,
    isFirstLoad: result === null,
    error: result?.error ?? null,
  };
}