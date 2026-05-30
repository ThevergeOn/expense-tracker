import { useState, useEffect, useCallback } from "react";
import { MonthlyData, Transaction, Category } from "../types";
import { analyticsService, PeriodType, CategoryBreakdown, transactionService, categoryService } from "../services";

interface UseAnalyticsReturn {
  monthlyData: MonthlyData[];
  totalIncome: number;
  totalExpenses: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await analyticsService.getMonthly();

    if (response.error) {
      setError(response.error);
      setMonthlyData([]);
      setTotalIncome(0);
      setTotalExpenses(0);
    } else if (response.data) {
      setMonthlyData(response.data.monthlyData || []);
      setTotalIncome(response.data.totalIncome || 0);
      setTotalExpenses(response.data.totalExpenses || 0);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    monthlyData,
    totalIncome,
    totalExpenses,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}

interface UseCategoryAnalyticsReturn {
  totalIncome: number;
  totalExpenses: number;
  incomeBreakdown: CategoryBreakdown[];
  expenseBreakdown: CategoryBreakdown[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Helper to filter transactions by period
const filterTransactionsByPeriod = (
  transactions: Transaction[],
  period: PeriodType,
  date: Date
): Transaction[] => {
  return transactions.filter((t) => {
    const txDate = new Date(t.date);
    const targetDate = new Date(date);

    switch (period) {
      case "daily":
        return txDate.toDateString() === targetDate.toDateString();
      case "weekly":
        const startOfWeek = new Date(targetDate);
        startOfWeek.setDate(targetDate.getDate() - targetDate.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return txDate >= startOfWeek && txDate <= endOfWeek;
      case "monthly":
        return (
          txDate.getMonth() === targetDate.getMonth() &&
          txDate.getFullYear() === targetDate.getFullYear()
        );
      case "yearly":
        return txDate.getFullYear() === targetDate.getFullYear();
    }
  });
};

// Helper to calculate category breakdown from transactions
const calculateCategoryBreakdown = (
  transactions: Transaction[],
  categories: Category[],
  type: "income" | "expense"
): { breakdown: CategoryBreakdown[]; total: number } => {
  const filtered = transactions.filter((t) => t.type === type);
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap = new Map<string, { amount: number; count: number }>();

  filtered.forEach((t) => {
    const existing = categoryMap.get(t.category) || { amount: 0, count: 0 };
    categoryMap.set(t.category, {
      amount: existing.amount + t.amount,
      count: existing.count + 1,
    });
  });

  const breakdown: CategoryBreakdown[] = Array.from(categoryMap.entries())
    .map(([categoryId, data]) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name || categoryId,
        icon: category?.icon || "ellipse",
        color: category?.color || "#6366F1",
        bgColor: category?.bgColor || "#EEF2FF",
        amount: data.amount,
        percentage: total > 0 ? (data.amount / total) * 100 : 0,
        count: data.count,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return { breakdown, total };
};

export function useCategoryAnalytics(
  period: PeriodType,
  date: Date
): UseCategoryAnalyticsReturn {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [incomeBreakdown, setIncomeBreakdown] = useState<CategoryBreakdown[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Try the category breakdown endpoint first
    const response = await analyticsService.getCategoryBreakdown(period, date);

    if (response.data) {
      setTotalIncome(response.data.totalIncome || 0);
      setTotalExpenses(response.data.totalExpenses || 0);
      setIncomeBreakdown(response.data.incomeBreakdown || []);
      setExpenseBreakdown(response.data.expenseBreakdown || []);
      setLoading(false);
      return;
    }

    // Fallback: Calculate from transactions locally
    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll(),
      ]);

      const transactions = transactionsRes.data || [];
      const categories = categoriesRes.data || [];

      const filteredTx = filterTransactionsByPeriod(transactions, period, date);

      const incomeResult = calculateCategoryBreakdown(filteredTx, categories, "income");
      const expenseResult = calculateCategoryBreakdown(filteredTx, categories, "expense");

      setTotalIncome(incomeResult.total);
      setTotalExpenses(expenseResult.total);
      setIncomeBreakdown(incomeResult.breakdown);
      setExpenseBreakdown(expenseResult.breakdown);
    } catch (err) {
      setError("Failed to load analytics");
      setTotalIncome(0);
      setTotalExpenses(0);
      setIncomeBreakdown([]);
      setExpenseBreakdown([]);
    }

    setLoading(false);
  }, [period, date]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    totalIncome,
    totalExpenses,
    incomeBreakdown,
    expenseBreakdown,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}

interface UsePeriodAnalyticsReturn {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePeriodAnalytics(
  period: PeriodType,
  date: Date
): UsePeriodAnalyticsReturn {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await analyticsService.getByPeriod(period, date);

    if (response.error) {
      setError(response.error);
      setTotalIncome(0);
      setTotalExpenses(0);
      setBalance(0);
      setTransactionCount(0);
    } else if (response.data) {
      setTotalIncome(response.data.totalIncome || 0);
      setTotalExpenses(response.data.totalExpenses || 0);
      setBalance(response.data.balance || 0);
      setTransactionCount(response.data.transactionCount || 0);
    }

    setLoading(false);
  }, [period, date]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    totalIncome,
    totalExpenses,
    balance,
    transactionCount,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
