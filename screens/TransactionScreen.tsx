import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";
import { formatShortDate } from "../utils/formatters";
import { Transaction } from "../types";
import { useTransactions, useCategories } from "../hooks";
import { useCurrency } from "../context";
import { TransactionInput } from "../services";
import {
  TransactionDetailModal,
  TransactionFormModal,
  DeleteConfirmModal,
} from "../components/transaction";
import { SkeletonTransactionList } from "../components";

type FilterType = "all" | "income" | "expense";

interface TransactionItemProps {
  item: Transaction;
  categories: { id: string; icon: string; color: string; bgColor: string }[];
  onPress: () => void;
  formatAmount: (amount: number) => string;
}

const TransactionItem = ({ item, categories, onPress, formatAmount }: TransactionItemProps) => {
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
          {formatAmount(item.amount)}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

export default function TransactionScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const {
    transactions,
    loading,
    error,
    refetch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    deleteAllTransactions,
  } = useTransactions(activeFilter);
  const { categories } = useCategories();
  const { formatAmount } = useCurrency();

  // Modal states
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteAllConfirmVisible, setDeleteAllConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalVisible(true);
  };

  const handleAddPress = () => {
    setEditingTransaction(null);
    setFormModalVisible(true);
  };

  const handleEditPress = () => {
    setEditingTransaction(selectedTransaction);
    setDetailModalVisible(false);
    setFormModalVisible(true);
  };

  const handleDeletePress = () => {
    setDetailModalVisible(false);
    setDeleteConfirmVisible(true);
  };

  const handleDeleteAllPress = () => {
    setDeleteAllConfirmVisible(true);
  };

  const handleSaveTransaction = async (data: TransactionInput): Promise<boolean> => {
    if (editingTransaction) {
      return await updateTransaction(editingTransaction.id, data);
    } else {
      return await createTransaction(data);
    }
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

  const handleConfirmDeleteAll = async () => {
    setDeleting(true);
    const success = await deleteAllTransactions();
    setDeleting(false);

    if (success) {
      setDeleteAllConfirmVisible(false);
    }
  };

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

  const renderContent = () => {
    if (loading && transactions.length === 0) {
      return (
        <View style={styles.skeletonContainer}>
          <SkeletonTransactionList itemCount={8} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            item={item}
            categories={categories}
            onPress={() => handleTransactionPress(item)}
            formatAmount={formatAmount}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No transactions found</Text>
            <TouchableOpacity style={styles.addFirstButton} onPress={handleAddPress}>
              <Text style={styles.addFirstButtonText}>Add your first transaction</Text>
            </TouchableOpacity>
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <View style={styles.headerActions}>
          {transactions.length > 0 && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleDeleteAllPress}
            >
              <Ionicons name="trash-outline" size={22} color={colors.expense} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
            <Ionicons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FilterButton filter="all" label="All" />
        <FilterButton filter="income" label="Income" />
        <FilterButton filter="expense" label="Expense" />
      </View>

      {renderContent()}

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

      {/* Add/Edit Form Modal */}
      <TransactionFormModal
        visible={formModalVisible}
        transaction={editingTransaction}
        categories={categories}
        onClose={() => {
          setFormModalVisible(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
      />

      {/* Delete Single Transaction Confirm */}
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

      {/* Delete All Confirm */}
      <DeleteConfirmModal
        visible={deleteAllConfirmVisible}
        title="Delete All Transactions"
        message={`Are you sure you want to delete all ${transactions.length} transactions? This action cannot be undone.`}
        loading={deleting}
        onCancel={() => setDeleteAllConfirmVisible(false)}
        onConfirm={handleConfirmDeleteAll}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
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
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing["3xl"],
  },
  skeletonContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  errorText: {
    fontSize: typography.sizes.md,
    color: colors.expense,
    marginTop: spacing.md,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  retryButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
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
  addFirstButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
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
