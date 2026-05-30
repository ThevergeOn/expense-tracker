import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api } from "../services/api";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface UserProfile {
  currency?: string;
}

interface CurrencyContextType {
  selectedCurrency: string;
  currencySymbol: string;
  currencies: Currency[];
  loading: boolean;
  setSelectedCurrency: (code: string) => void;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);

  // Get the currency symbol for the selected currency
  const currencySymbol = currencies.find((c) => c.code === selectedCurrency)?.symbol || "$";

  // Format amount with the current currency symbol
  const formatAmount = useCallback(
    (amount: number): string => {
      return `${currencySymbol}${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    [currencySymbol]
  );

  // Fetch currencies and user profile from backend API on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch both currencies and user profile in parallel
      const [currenciesResponse, profileResponse] = await Promise.all([
        api.get<Currency[]>("/currencies"),
        api.get<UserProfile>("/profile"),
      ]);

      if (currenciesResponse.data) {
        setCurrencies(currenciesResponse.data);
      }

      // Set user's saved currency preference
      if (profileResponse.data?.currency) {
        setSelectedCurrency(profileResponse.data.currency);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        currencySymbol,
        currencies,
        loading,
        setSelectedCurrency,
        formatAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
