import { useState, useEffect, useCallback } from "react";
import { MonthlyData } from "../types";
import { analyticsService } from "../services";

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
