import { api } from "./api";
import { Transaction } from "../types";

export interface TransactionInput {
  title: string;
  category?: string;
  amount: number;
  date?: string;
  type: "income" | "expense";
  icon?: string;
  iconColor?: string;
  iconBg?: string;
}

type FilterType = "all" | "income" | "expense";

export const transactionService = {
  getAll: async (filter?: FilterType) => {
    const endpoint = filter && filter !== "all"
      ? `/transactions?type=${filter}`
      : "/transactions";
    return api.get<Transaction[]>(endpoint);
  },

  create: async (transaction: TransactionInput) => {
    return api.post<Transaction>("/transactions", transaction);
  },

  update: async (id: string | number, transaction: TransactionInput) => {
    return api.put<Transaction>(`/transactions/${id}`, transaction);
  },

  delete: async (id: string | number) => {
    return api.delete<{ success: boolean }>(`/transactions/${id}`);
  },

  deleteAll: async () => {
    return api.delete<{ success: boolean }>("/transactions");
  },
};
