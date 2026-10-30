import { createContext } from "react";
import type { NewTransaction, Transaction } from "../../types";

export interface TransactionsContextValue {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (data: NewTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const TransactionsContext =
  createContext<TransactionsContextValue | null>(null);
