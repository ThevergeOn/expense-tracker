import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../theme";
import { formatCurrency } from "../../utils/formatters";

interface AccountStatsProps {
  totalIncome: number;
  totalExpenses: number;
}

export default function AccountStats({ totalIncome, totalExpenses }: AccountStatsProps) {
  const savings = totalIncome - totalExpenses;

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <View style={[styles.statIcon, { backgroundColor: "#DCFCE7" }]}>
          <Ionicons name="trending-up" size={18} color={colors.income} />
        </View>
        <Text style={styles.statLabel}>Income</Text>
        <Text style={[styles.statAmount, { color: colors.income }]}>
          {formatCurrency(totalIncome)}
        </Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statItem}>
        <View style={[styles.statIcon, { backgroundColor: "#FEE2E2" }]}>
          <Ionicons name="trending-down" size={18} color={colors.expense} />
        </View>
        <Text style={styles.statLabel}>Expenses</Text>
        <Text style={[styles.statAmount, { color: colors.expense }]}>
          {formatCurrency(totalExpenses)}
        </Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statItem}>
        <View style={[styles.statIcon, { backgroundColor: "#DBEAFE" }]}>
          <Ionicons name="wallet" size={18} color={colors.blue} />
        </View>
        <Text style={styles.statLabel}>Savings</Text>
        <Text style={[styles.statAmount, { color: colors.blue }]}>
          {formatCurrency(savings)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    borderRadius: 16,
    padding: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  statAmount: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.background,
    marginVertical: spacing.xs,
  },
});
