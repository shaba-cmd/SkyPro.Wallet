import { createContext } from "react";
import type {
  CategoryFilter,
  NewTransaction,
  SortBy,
  Transaction,
} from "../../types";

export interface TransactionsContextValue {
  transactions: Transaction[];
  tableTransactions: Transaction[];
  filter: CategoryFilter;
  sortBy: SortBy;
  setFilter: (filter: CategoryFilter) => void;
  setSortBy: (sortBy: SortBy) => void;
  isLoading: boolean;
  isTableLoading: boolean;
  error: string | null;
  addTransaction: (data: NewTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const TransactionsContext =
  createContext<TransactionsContextValue | null>(null);