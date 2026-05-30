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
import { formatCurrency, getCurrentDate, formatShortDate } from "../utils/formatters";
import { Transaction } from "../types";
import { useTransactions, useCategories, useAnalytics } from "../hooks";
import { TransactionInput } from "../services";
import {
  TransactionDetailModal,
  TransactionFormModal,
  DeleteConfirmModal,
} from "../components/transaction";

interface HomeScreenProps {
  onSeeAllPress?: () => void;
}

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

interface SpendingSummaryProps {
  totalExpenses: number;
  loading: boolean;
}

const SpendingSummary = ({ totalExpenses, loading }: SpendingSummaryProps) => (
  <View style={styles.spendingContainer}>
    <Text style={styles.spendingLabel}>This Month Spend</Text>
    {loading ? (
      <ActivityIndicator size="small" color={colors.textPrimary} />
    ) : (
      <Text style={styles.spendingAmount}>{formatCurrency(totalExpenses)}</Text>
    )}
  </View>
);

interface WalletCardProps {
  balance: number;
  loading: boolean;
}

const WalletCard = ({ balance, loading }: WalletCardProps) => (
  <TouchableOpacity style={styles.walletCard}>
    <View style={styles.walletLeft}>
      <View style={styles.walletIconContainer}>
        <Ionicons name="wallet-outline" size={20} color={colors.textPrimary} />
      </View>
      <Text style={styles.walletLabel}>Spending Wallet</Text>
    </View>
    <View style={styles.walletRight}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.textPrimary} />
      ) : (
        <Text style={styles.walletBalance}>{formatCurrency(balance)}</Text>
      )}
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </View>
  </TouchableOpacity>
);

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
  const {
    transactions,
    loading: transactionsLoading,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();
  const { categories } = useCategories();
  const { totalIncome, totalExpenses, loading: analyticsLoading } = useAnalytics();

  // Modal states
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const recentTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .slice(0, 4);
  }, [transactions]);

  const walletBalance = totalIncome - totalExpenses;

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

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradients.header} style={styles.gradient}>
        <SafeAreaView edges={["top"]} style={styles.safe}>
          <Header />
          <SpendingSummary totalExpenses={totalExpenses} loading={analyticsLoading} />
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        <WalletCard balance={walletBalance} loading={analyticsLoading} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
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
            data={recentTransactions}
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
                <Text style={styles.emptyText}>No recent transactions</Text>
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
  loadingContainer: {
    paddingVertical: spacing["2xl"],
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
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
