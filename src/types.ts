export type CategoryId =
  | "food"
  | "transport"
  | "housing"
  | "joy"
  | "education"
  | "others";

export interface Transaction {
  id: string;
  description: string;
  category: CategoryId;
  date: string;
  sum: number;
}

export type SortBy = "date" | "sum";

export interface TransactionsQuery {
  sortBy?: SortBy;
  filterBy?: CategoryId[];
}

export type NewTransaction = Omit<Transaction, "id">;

export interface User {
  id: string;
  name: string;
  login: string;
  token: string;
}
