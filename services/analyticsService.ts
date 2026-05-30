import { api } from "./api";
import { MonthlyData } from "../types";

export type PeriodType = "daily" | "weekly" | "monthly" | "yearly";

export interface AnalyticsResponse {
  monthlyData: MonthlyData[];
  totalIncome: number;
  totalExpenses: number;
}

export interface PeriodAnalyticsResponse {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  icon: string;
  color: string;
  bgColor: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface CategoryAnalyticsResponse {
  totalIncome: number;
  totalExpenses: number;
  incomeBreakdown: CategoryBreakdown[];
  expenseBreakdown: CategoryBreakdown[];
}

export const analyticsService = {
  getMonthly: async () => {
    return api.get<AnalyticsResponse>("/analytics/monthly");
  },

  getByPeriod: async (period: PeriodType, date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return api.get<PeriodAnalyticsResponse>(`/analytics?period=${period}&date=${dateStr}`);
  },

  getCategoryBreakdown: async (period: PeriodType, date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return api.get<CategoryAnalyticsResponse>(`/analytics/categories?period=${period}&date=${dateStr}`);
  },
};
