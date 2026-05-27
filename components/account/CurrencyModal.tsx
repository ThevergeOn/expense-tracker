import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../theme";
import ModalHeader from "./ModalHeader";

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface CurrencyModalProps {
  currencies: Currency[];
  selectedCurrency: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

export default function CurrencyModal({
  currencies,
  selectedCurrency,
  onSelect,
  onClose,
}: CurrencyModalProps) {
  const handleSelect = (code: string) => {
    onSelect(code);
    onClose();
  };

  return (
    <View style={styles.container}>
      <ModalHeader title="Select Currency" onClose={onClose} />
      <ScrollView style={styles.content}>
        {currencies.map((currency) => (
          <TouchableOpacity
            key={currency.code}
            style={[
              styles.selectionItem,
              selectedCurrency === currency.code && styles.selectionItemActive,
            ]}
            onPress={() => handleSelect(currency.code)}
          >
            <Text style={styles.selectionSymbol}>{currency.symbol}</Text>
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionTitle}>{currency.code}</Text>
              <Text style={styles.selectionSubtitle}>{currency.name}</Text>
            </View>
            {selectedCurrency === currency.code && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  selectionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  selectionItemActive: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  selectionSymbol: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    width: 40,
    textAlign: "center",
  },
  selectionInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  selectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  selectionSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
});
