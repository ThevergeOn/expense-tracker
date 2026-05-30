import { api } from "./api";

export interface Budget {
  id: number;
  month: number;
  amount: number;
}

export const budgetService = {
  getAll: async () => {
    return api.get<Budget[]>("/budgets");
  },
};
