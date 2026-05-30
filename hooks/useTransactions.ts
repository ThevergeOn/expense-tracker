import { useState, useEffect, useCallback } from "react";
import { Transaction } from "../types";
import { transactionService, TransactionInput } from "../services";

type FilterType = "all" | "income" | "expense";

interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createTransaction: (input: TransactionInput) => Promise<boolean>;
  updateTransaction: (id: string, input: TransactionInput) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  deleteAllTransactions: () => Promise<boolean>;
}

export function useTransactions(filter: FilterType = "all"): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await transactionService.getAll(filter);

    if (response.error) {
      setError(response.error);
      setTransactions([]);
    } else {
      setTransactions(response.data || []);
    }

    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = async (input: TransactionInput): Promise<boolean> => {
    const response = await transactionService.create(input);
    if (response.error) {
      setError(response.error);
      return false;
    }
    await fetchTransactions();
    return true;
  };

  const updateTransaction = async (id: string, input: TransactionInput): Promise<boolean> => {
    const response = await transactionService.update(id, input);
    if (response.error) {
      setError(response.error);
      return false;
    }
    await fetchTransactions();
    return true;
  };

  const deleteTransaction = async (id: string): Promise<boolean> => {
    const response = await transactionService.delete(id);
    if (response.error) {
      setError(response.error);
      return false;
    }
    await fetchTransactions();
    return true;
  };

  const deleteAllTransactions = async (): Promise<boolean> => {
    const response = await transactionService.deleteAll();
    if (response.error) {
      setError(response.error);
      return false;
    }
    await fetchTransactions();
    return true;
  };

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    deleteAllTransactions,
  };
}
