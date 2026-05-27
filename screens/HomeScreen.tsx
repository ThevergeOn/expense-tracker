import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, gradients, spacing, typography } from "../theme";
import {
  transactions,
  thisMonthSpend,
  lastMonthComparison,
  walletBalance,
} from "../data";
import { formatCurrency, getCurrentDate, formatShortDate } from "../utils/formatters";
import { Transaction } from "../types";
import { categories } from "../data/mockCategories";

const Header = () => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.iconButton}>
      <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
    </TouchableOpacity>
    <View style={styles.dateContainer}>
      <Ionicons name="calendar-outline" size={16} color={colors.textPrimary} />
      <Text style={styles.dateText}>{getCurrentDate()}</Text>
    </View>
    <TouchableOpacity style={styles.iconButton}>
      <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
    </TouchableOpacity>
  </View>
);

const SpendingSummary = () => (
  <View style={styles.spendingContainer}>
    <Text style={styles.spendingLabel}>This Month Spend</Text>
    <Text style={styles.spendingAmount}>{formatCurrency(thisMonthSpend)}</Text>
    <View style={styles.comparisonContainer}>
      <Ionicons
        name={lastMonthComparison < 0 ? "trending-down" : "trending-up"}
        size={16}
        color={lastMonthComparison < 0 ? colors.income : colors.expense}
      />
      <Text style={styles.comparisonText}>
        {Math.abs(lastMonthComparison)}% {lastMonthComparison < 0 ? "below" : "above"} last month
      </Text>
    </View>
  </View>
);

const WalletCard = () => (
  <TouchableOpacity style={styles.walletCard}>
    <View style={styles.walletLeft}>
      <View style={styles.walletIconContainer}>
        <Ionicons name="wallet-outline" size={20} color={colors.textPrimary} />
      </View>
      <Text style={styles.walletLabel}>Spending Wallet</Text>
    </View>
    <View style={styles.walletRight}>
      <Text style={styles.walletBalance}>{formatCurrency(walletBalance)}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </View>
  </TouchableOpacity>
);

interface TransactionItemProps {
  item: Transaction;
}

const TransactionItem = ({ item }: TransactionItemProps) => {
  const category = categories.find((c) => c.id === item.category);

  return (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: category?.bgColor || "#F3F4F6" }]}>
        <Ionicons
          name={category?.icon as any || "help-circle"}
          size={20}
          color={category?.color || colors.textMuted}
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

export default function HomeScreen() {
  const recentTransactions = transactions
    .filter((t) => t.type === "expense")
    .slice(0, 4);

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradients.header} style={styles.gradient}>
        <SafeAreaView edges={["top"]} style={styles.safe}>
          <Header />
          <SpendingSummary />
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        <WalletCard />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={recentTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem item={item} />}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    paddingBottom: spacing["2xl"],
  },
  safe: {
    paddingHorizontal: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dateText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  spendingContainer: {
    alignItems: "center",
    marginTop: spacing["3xl"],
    marginBottom: spacing.lg,
  },
  spendingLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  spendingAmount: {
    fontSize: typography.sizes["5xl"],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  comparisonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  comparisonText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    marginTop: -spacing.lg,
    paddingBottom: 100,
  },
  walletCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  walletLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  walletIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  walletLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  walletRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  walletBalance: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing["2xl"],
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
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
