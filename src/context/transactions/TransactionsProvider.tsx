import { useCallback, useEffect, useState, type ReactNode } from "react";
import type {
  NewTransaction,
  Transaction,
  TransactionsQuery,
} from "../../types";
import { ApiError } from "../../api/client";
import * as api from "../../api/transactions";
import { useAuth } from "../auth/useAuth";
import { TransactionsContext } from "./transactionsContext";

interface Props {
  token: string;
  children: ReactNode;
}

export function TransactionsProvider({ token, children }: Props) {
  const { logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [version, setVersion] = useState(0);

  const updateTransactions = (data: Transaction[]) => {
    setTransactions(data);
    setVersion((prev) => prev + 1);
  };

  const fetchTransactions = useCallback(
    (query: TransactionsQuery) => api.getTransactions(token, query),
    [token],
  );

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

  const value = {
    transactions,
    version,
    fetchTransactions,
    isLoading,
    error,
    addTransaction: async (data: NewTransaction) => {
      updateTransactions(
        await api.addTransaction(token, data).catch(handleError),
      );
    },
    deleteTransaction: async (id: string) => {
      updateTransactions(
        await api.deleteTransaction(token, id).catch(handleError),
      );
    },
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}
