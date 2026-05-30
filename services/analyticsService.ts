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

export const analyticsService = {
  getMonthly: async () => {
    return api.get<AnalyticsResponse>("/analytics/monthly");
  },

  getByPeriod: async (period: PeriodType, date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return api.get<PeriodAnalyticsResponse>(`/analytics?period=${period}&date=${dateStr}`);
  },
};
