import { createContext } from "react";
import type {
  NewTransaction,
  Transaction,
  TransactionsQuery,
} from "../../types";

export interface TransactionsContextValue {
  transactions: Transaction[];
  version: number;
  fetchTransactions: (query: TransactionsQuery) => Promise<Transaction[]>;
  isLoading: boolean;
  error: string | null;
  addTransaction: (data: NewTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const TransactionsContext =
  createContext<TransactionsContextValue | null>(null);