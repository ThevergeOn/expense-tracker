import { api } from "./api";
import { MonthlyData } from "../types";

export interface AnalyticsResponse {
  monthlyData: MonthlyData[];
  totalIncome: number;
  totalExpenses: number;
}

export const analyticsService = {
  getMonthly: async () => {
    return api.get<AnalyticsResponse>("/analytics/monthly");
  },
};
