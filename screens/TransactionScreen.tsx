import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";
import { transactions } from "../data";
import { formatCurrency, formatShortDate } from "../utils/formatters";
import { Transaction } from "../types";
import { categories } from "../data/mockCategories";

type FilterType = "all" | "income" | "expense";

interface TransactionItemProps {
  item: Transaction;
}

const TransactionItem = ({ item }: TransactionItemProps) => {
  const category = categories.find((c) => c.id === item.category);

  // Use custom icon/colors if available, otherwise fall back to category
  const iconName = item.icon || category?.icon || "help-circle";
  const iconColor = item.iconColor || category?.color || colors.textMuted;
  const iconBg = item.iconBg || category?.bgColor || "#F3F4F6";

  return (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: iconBg }]}>
        <Ionicons
          name={iconName as any}
          size={20}
          color={iconColor}
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>{formatShortDate(item.date)}</Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text
          style={[
            styles.transactionAmount,
            { color: item.type === "expense" ? colors.expense : colors.income },
          ]}
        >
          {item.type === "expense" ? "-" : "+"}
          {formatCurrency(item.amount)}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

export default function TransactionScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredTransactions = useMemo(() => {
    if (activeFilter === "all") return transactions;
    return transactions.filter((t) => t.type === activeFilter);
  }, [activeFilter]);

  const FilterButton = ({ filter, label }: { filter: FilterType; label: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          activeFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      <View style={styles.filterContainer}>
        <FilterButton filter="all" label="All" />
        <FilterButton filter="income" label="Income" />
        <FilterButton filter="expense" label="Expense" />
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.cardBg,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing["3xl"],
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  transactionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  transactionDate: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  transactionAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  transactionAmount: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
});
