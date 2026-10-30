import { useEffect, useState, type ReactNode } from "react";
import { ApiError } from "../../api/client";
import * as api from "../../api/transactions";
import type { NewTransaction, Transaction } from "../../types";
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
    isLoading,
    error,
    addTransaction: async (data: NewTransaction) => {
      setTransactions(await api.addTransaction(token, data).catch(handleError));
    },
    deleteTransaction: async (id: string) => {
      setTransactions(
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
