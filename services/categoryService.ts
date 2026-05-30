import { api } from "./api";
import { Category } from "../types";

export const categoryService = {
  getAll: async () => {
    return api.get<Category[]>("/categories");
  },
};
