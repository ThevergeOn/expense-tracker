import { useState, useEffect, useCallback } from "react";
import { MonthlyData } from "../types";
import { analyticsService, PeriodType } from "../services";

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
