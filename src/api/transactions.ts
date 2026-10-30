import type { CategoryId, NewTransaction, Transaction } from "../types";
import { toIsoDate } from "../utils/format";
import { request } from "./client";

interface ApiTransaction {
  _id: string;
  description: string;
  category: CategoryId;
  date: string;
  sum: number;
}

function fromApiDate(value: string): string {
  const date = new Date(value);
  const isUtcMidnight =
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0;
  return isUtcMidnight ? value.slice(0, 10) : toIsoDate(date);
}

function toApiDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${month}-${day}-${year}`;
}

const fromApi = ({ _id, date, ...rest }: ApiTransaction): Transaction => ({
  ...rest,
  id: _id,
  date: fromApiDate(date),
});

export async function getTransactions(token: string): Promise<Transaction[]> {
  const data = await request<ApiTransaction[]>("/transactions", { token });
  return data.map(fromApi);
}

export async function addTransaction(
  token: string,
  transaction: NewTransaction,
): Promise<Transaction[]> {
  const data = await request<{ transactions: ApiTransaction[] }>(
    "/transactions",
    {
      method: "POST",
      token,
      body: { ...transaction, date: toApiDate(transaction.date) },
    },
  );
  return data.transactions.map(fromApi);
}

export async function deleteTransaction(
  token: string,
  id: string,
): Promise<Transaction[]> {
  const data = await request<{ transactions: ApiTransaction[] }>(
    `/transactions/${id}`,
    { method: "DELETE", token },
  );
  return data.transactions.map(fromApi);
}
