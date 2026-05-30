import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, gradients, spacing, typography } from "../theme";
import { formatCurrency, formatShortDate } from "../utils/formatters";
import { Transaction } from "../types";
import { useTransactions, useCategories, usePeriodAnalytics } from "../hooks";
import { PeriodType } from "../services";
import { TransactionInput } from "../services";
import {
  TransactionDetailModal,
  TransactionFormModal,
  DeleteConfirmModal,
} from "../components/transaction";
import DatePickerModal from "../components/DatePickerModal";

interface HomeScreenProps {
  onSeeAllPress?: () => void;
}

// Helper functions for date UI
const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getEndOfWeek = (date: Date) => {
  const d = getStartOfWeek(date);
  d.setDate(d.getDate() + 6);
  return d;
};

const navigateDate = (date: Date, period: PeriodType, direction: "prev" | "next") => {
  const d = new Date(date);
  const delta = direction === "next" ? 1 : -1;

  switch (period) {
    case "daily":
      d.setDate(d.getDate() + delta);
      break;
    case "weekly":
      d.setDate(d.getDate() + delta * 7);
      break;
    case "monthly":
      d.setMonth(d.getMonth() + delta);
      break;
    case "yearly":
      d.setFullYear(d.getFullYear() + delta);
      break;
  }
  return d;
};

const formatDateLabel = (date: Date, period: PeriodType) => {
  switch (period) {
    case "daily":
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return "Today";
      if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
      return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    case "weekly":
      const start = getStartOfWeek(date);
      const end = getEndOfWeek(date);
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    case "monthly":
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    case "yearly":
      return date.getFullYear().toString();
  }
};

const getPeriodLabel = (period: PeriodType) => {
  switch (period) {
    case "daily": return "Today's Spending";
    case "weekly": return "This Week's Spending";
    case "monthly": return "This Month's Spending";
    case "yearly": return "This Year's Spending";
  }
};

interface TransactionItemProps {
  item: Transaction;
  categories: { id: string; icon: string; color: string; bgColor: string }[];
  onPress: () => void;
}

const TransactionItem = ({ item, categories, onPress }: TransactionItemProps) => {
  const category = categories.find((c) => c.id === item.category);

  const iconName = item.icon || category?.icon || "help-circle";
  const iconColor = item.iconColor || category?.color || colors.textMuted;
  const iconBg = item.iconBg || category?.bgColor || "#F3F4F6";

  return (
    <TouchableOpacity style={styles.transactionItem} onPress={onPress}>
      <View style={[styles.transactionIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName as any} size={20} color={iconColor} />
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

export default function HomeScreen({ onSeeAllPress }: HomeScreenProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("monthly");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    transactions,
    loading: transactionsLoading,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();
  const { categories } = useCategories();

  // Server-side period analytics
  const {
    totalIncome: periodIncome,
    totalExpenses: periodExpenses,
    loading: analyticsLoading,
  } = usePeriodAnalytics(selectedPeriod, selectedDate);

  // Modal states
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Get last 5 transactions (most recent, regardless of period filter)
  const lastTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalVisible(true);
  };

  const handleEditPress = () => {
    setDetailModalVisible(false);
    setFormModalVisible(true);
  };

  const handleDeletePress = () => {
    setDetailModalVisible(false);
    setDeleteConfirmVisible(true);
  };

  const handleSaveTransaction = async (data: TransactionInput): Promise<boolean> => {
    if (selectedTransaction) {
      return await updateTransaction(selectedTransaction.id, data);
    }
    return false;
  };

  const handleConfirmDelete = async () => {
    if (!selectedTransaction) return;

    setDeleting(true);
    const success = await deleteTransaction(selectedTransaction.id);
    setDeleting(false);

    if (success) {
      setDeleteConfirmVisible(false);
      setSelectedTransaction(null);
    }
  };

  const periods: PeriodType[] = ["daily", "weekly", "monthly", "yearly"];

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradients.header} style={styles.gradient}>
        <SafeAreaView edges={["top"]} style={styles.safe}>
          {/* Date Navigation Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setSelectedDate(navigateDate(selectedDate, selectedPeriod, "prev"))}
            >
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color={colors.textPrimary} />
              <Text style={styles.dateText}>{formatDateLabel(selectedDate, selectedPeriod)}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setSelectedDate(navigateDate(selectedDate, selectedPeriod, "next"))}
            >
              <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Period Filter Tabs */}
          <View style={styles.periodContainer}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period && styles.periodTextActive,
                  ]}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Spending Summary */}
          <View style={styles.spendingContainer}>
            <Text style={styles.spendingLabel}>{getPeriodLabel(selectedPeriod)}</Text>
            {analyticsLoading || transactionsLoading ? (
              <ActivityIndicator size="small" color={colors.textPrimary} />
            ) : (
              <Text style={styles.spendingAmount}>{formatCurrency(periodExpenses)}</Text>
            )}
            <View style={styles.incomeRow}>
              <Text style={styles.incomeLabel}>Income: </Text>
              <Text style={styles.incomeAmount}>{formatCurrency(periodIncome)}</Text>
            </View>
          </View>

        </SafeAreaView>
      </LinearGradient>

      {/* Custom Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        selectedDate={selectedDate}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleDateSelect}
      />

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Last Transactions</Text>
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {transactionsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={lastTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TransactionItem
                item={item}
                categories={categories}
                onPress={() => handleTransactionPress(item)}
              />
            )}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
                <Text style={styles.emptyText}>No transactions yet</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Detail Modal */}
      <TransactionDetailModal
        visible={detailModalVisible}
        transaction={selectedTransaction}
        categories={categories}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedTransaction(null);
        }}
        onEdit={handleEditPress}
        onDelete={handleDeletePress}
      />

      {/* Edit Form Modal */}
      <TransactionFormModal
        visible={formModalVisible}
        transaction={selectedTransaction}
        categories={categories}
        onClose={() => {
          setFormModalVisible(false);
          setSelectedTransaction(null);
        }}
        onSave={handleSaveTransaction}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        visible={deleteConfirmVisible}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${selectedTransaction?.title}"? This action cannot be undone.`}
        loading={deleting}
        onCancel={() => {
          setDeleteConfirmVisible(false);
          setSelectedTransaction(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    paddingBottom: spacing.xl,
  },
  safe: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  dateText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  periodContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    padding: 4,
    marginTop: spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: colors.white,
  },
  periodText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  spendingContainer: {
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
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
  incomeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  incomeLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  incomeAmount: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.income,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
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
  loadingContainer: {
    paddingVertical: spacing["2xl"],
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: spacing["2xl"],
    alignItems: "center",
  },
  emptyText: {
    fontSize: typography.sizes.sm,
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
