import { useState, useEffect, useCallback } from "react";
import { accountService, UpdateProfileInput, ApiUserProfile } from "../services/accountService";
import { analyticsService } from "../services/analyticsService";
import {
  UserProfile,
  Currency,
  Language,
  PaymentMethod,
  defaultUserProfile,
  currencies as fallbackCurrencies,
  languages as fallbackLanguages,
  paymentMethods as fallbackPaymentMethods,
} from "../data/mockAccount";

interface UseAccountReturn {
  profile: UserProfile;
  currencies: Currency[];
  languages: Language[];
  paymentMethods: PaymentMethod[];
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

export function useAccount(): UseAccountReturn {
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [currencies, setCurrencies] = useState<Currency[]>(fallbackCurrencies);
  const [languages, setLanguages] = useState<Language[]>(fallbackLanguages);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(fallbackPaymentMethods);
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
      // Fetch all data in parallel
      const [
        profileRes,
        currenciesRes,
        languagesRes,
        paymentMethodsRes,
        analyticsRes,
      ] = await Promise.all([
        accountService.getProfile(),
        accountService.getCurrencies(),
        accountService.getLanguages(),
        accountService.getPaymentMethods(),
        analyticsService.getMonthly(),
      ]);

      // Update profile
      if (profileRes.data) {
        const apiProfile = profileRes.data;
        setProfile({
          name: apiProfile.name,
          email: apiProfile.email,
          phone: apiProfile.phone,
          avatar: apiProfile.avatar,
        });
        setSelectedCurrency(apiProfile.currency || "USD");
        setSelectedLanguage(apiProfile.language || "en");
      }

      // Update currencies
      if (currenciesRes.data && currenciesRes.data.length > 0) {
        setCurrencies(currenciesRes.data);
      }

      // Update languages
      if (languagesRes.data && languagesRes.data.length > 0) {
        setLanguages(languagesRes.data);
      }

      // Update payment methods
      if (paymentMethodsRes.data && paymentMethodsRes.data.length > 0) {
        setPaymentMethods(paymentMethodsRes.data);
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
        name: apiProfile.name,
        email: apiProfile.email,
        phone: apiProfile.phone,
        avatar: apiProfile.avatar,
      });
      return true;
    }
    // Fallback: update locally if API fails
    setProfile((prev) => ({ ...prev, ...data }));
    return true;
  }, []);

  const updateCurrency = useCallback(async (code: string): Promise<boolean> => {
    const response = await accountService.updateProfile({ currency: code });
    if (response.error) {
      // Fallback: update locally even if API fails
      setSelectedCurrency(code);
      return true;
    }
    setSelectedCurrency(code);
    return true;
  }, []);

  const updateLanguage = useCallback(async (code: string): Promise<boolean> => {
    const response = await accountService.updateProfile({ language: code });
    if (response.error) {
      // Fallback: update locally even if API fails
      setSelectedLanguage(code);
      return true;
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
