import { api } from "./api";
import {
  UserProfile,
  Currency,
  Language,
  PaymentMethod,
} from "../data/mockAccount";

export interface ApiUserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  currency: string;
  language: string;
  notifications: boolean;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  currency?: string;
  language?: string;
  notifications?: boolean;
}

export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface PaymentMethodInput {
  type: "visa" | "mastercard" | "amex" | "discover";
  last4: string;
  expiry: string;
  isDefault?: boolean;
}

export interface AppInfo {
  name: string;
  version: string;
  description: string;
  copyright: string;
  features: string[];
}

export const accountService = {
  // Profile - GET /api/profile
  getProfile: async () => {
    return api.get<ApiUserProfile>("/profile");
  },

  // Profile - PUT /api/profile
  updateProfile: async (data: UpdateProfileInput) => {
    return api.put<ApiUserProfile>("/profile", data);
  },

  // Currencies - GET /api/currencies
  getCurrencies: async () => {
    return api.get<Currency[]>("/currencies");
  },

  // Languages - GET /api/languages
  getLanguages: async () => {
    return api.get<Language[]>("/languages");
  },

  // Payment Methods - GET /api/payment-methods
  getPaymentMethods: async () => {
    return api.get<PaymentMethod[]>("/payment-methods");
  },

  // Payment Methods - POST /api/payment-methods
  addPaymentMethod: async (data: PaymentMethodInput) => {
    return api.post<PaymentMethod>("/payment-methods", data);
  },

  // Payment Methods - PUT /api/payment-methods/:id
  updatePaymentMethod: async (id: string, data: PaymentMethodInput) => {
    return api.put<PaymentMethod>(`/payment-methods/${id}`, data);
  },

  // Payment Methods - DELETE /api/payment-methods/:id
  removePaymentMethod: async (id: string) => {
    return api.delete<{ success: boolean }>(`/payment-methods/${id}`);
  },

  // App Info - GET /api/app-info
  getAppInfo: async () => {
    return api.get<AppInfo>("/app-info");
  },
};
