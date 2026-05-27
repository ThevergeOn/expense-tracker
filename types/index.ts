export type CategoryType =
  | "groceries"
  | "travel"
  | "car"
  | "home"
  | "insurances"
  | "education"
  | "marketing"
  | "shopping"
  | "internet"
  | "water"
  | "rent"
  | "gym"
  | "subscription"
  | "vacation"
  | "other";

export interface Transaction {
  id: string;
  title: string;
  category: CategoryType;
  amount: number;
  date: string;
  type: "income" | "expense";
  icon?: string;
  iconColor?: string;
  iconBg?: string;
}

export interface Category {
  id: CategoryType | "add";
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface WalletInfo {
  name: string;
  balance: number;
}
