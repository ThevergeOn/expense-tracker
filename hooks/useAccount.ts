import { useState, useEffect, useCallback } from "react";
import {
  accountService,
  UpdateProfileInput,
  Currency,
  Language,
  PaymentMethod,
  AppInfo
} from "../services/accountService";
import { analyticsService } from "../services/analyticsService";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface UseAccountReturn {
  profile: UserProfile;
  currencies: Currency[];
  languages: Language[];
  paymentMethods: PaymentMethod[];
  appInfo: AppInfo | null;
  selectedCurrency: string;
  selectedLanguage: string;
  totalIncome: number;
  totalExpenses: number;
  loading: boolean;
  error: string | null;
  updateProfile: (data: UpdateProfileInput) => Promise<boolean>;
  updateCurrency: (code: string) => Promise<boolean>;
  updateLanguage: (code: string) => Promise<boolean>;
  removePaymentMethod: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: "",
  email: "",
  phone: "",
};

export function useAccount(): UseAccountReturn {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel from backend
      const [
        profileRes,
        currenciesRes,
        languagesRes,
        paymentMethodsRes,
        appInfoRes,
        analyticsRes,
      ] = await Promise.all([
        accountService.getProfile(),
        accountService.getCurrencies(),
        accountService.getLanguages(),
        accountService.getPaymentMethods(),
        accountService.getAppInfo(),
        analyticsService.getMonthly(),
      ]);

      // Update profile from backend
      if (profileRes.data) {
        const apiProfile = profileRes.data;
        setProfile({
          name: apiProfile.name || "",
          email: apiProfile.email || "",
          phone: apiProfile.phone || "",
          avatar: apiProfile.avatar,
        });
        setSelectedCurrency(apiProfile.currency || "USD");
        setSelectedLanguage(apiProfile.language || "en");
      }

      // Update currencies from backend
      if (currenciesRes.data) {
        setCurrencies(currenciesRes.data);
      }

      // Update languages from backend
      if (languagesRes.data) {
        setLanguages(languagesRes.data);
      }

      // Update payment methods from backend
      if (paymentMethodsRes.data) {
        setPaymentMethods(paymentMethodsRes.data);
      }

      // Update app info from backend
      if (appInfoRes.data) {
        setAppInfo(appInfoRes.data);
      }

      // Update stats from analytics
      if (analyticsRes.data) {
        setTotalIncome(analyticsRes.data.totalIncome || 0);
        setTotalExpenses(analyticsRes.data.totalExpenses || 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load account data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  const updateProfile = useCallback(async (data: UpdateProfileInput): Promise<boolean> => {
    const response = await accountService.updateProfile(data);
    if (response.data) {
      const apiProfile = response.data;
      setProfile({
        name: apiProfile.name || "",
        email: apiProfile.email || "",
        phone: apiProfile.phone || "",
        avatar: apiProfile.avatar,
      });
      return true;
    }
    return false;
  }, []);

  const updateCurrency = useCallback(async (code: string): Promise<boolean> => {
    const response = await accountService.updateProfile({ currency: code });
    if (response.error) {
      return false;
    }
    setSelectedCurrency(code);
    return true;
  }, []);

  const updateLanguage = useCallback(async (code: string): Promise<boolean> => {
    const response = await accountService.updateProfile({ language: code });
    if (response.error) {
      return false;
    }
    setSelectedLanguage(code);
    return true;
  }, []);

  const removePaymentMethod = useCallback(async (id: string): Promise<boolean> => {
    const response = await accountService.removePaymentMethod(id);
    if (response.error) {
      return false;
    }
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    return true;
  }, []);

  return {
    profile,
    currencies,
    languages,
    paymentMethods,
    appInfo,
    selectedCurrency,
    selectedLanguage,
    totalIncome,
    totalExpenses,
    loading,
    error,
    updateProfile,
    updateCurrency,
    updateLanguage,
    removePaymentMethod,
    refetch: fetchAccountData,
  };
}
