import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../theme";
import { formatShortDate } from "../../utils/formatters";
import { Transaction, Category } from "../../types";
import { useCurrency } from "../../context";

interface TransactionDetailModalProps {
  visible: boolean;
  transaction: Transaction | null;
  categories: Category[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TransactionDetailModal({
  visible,
  transaction,
  categories,
  onClose,
  onEdit,
  onDelete,
}: TransactionDetailModalProps) {
  const { formatAmount } = useCurrency();

  if (!transaction) return null;

  const category = categories.find((c) => c.id === transaction.category);
  const iconName = transaction.icon || category?.icon || "help-circle";
  const iconColor = transaction.iconColor || category?.color || colors.textMuted;
  const iconBg = transaction.iconBg || category?.bgColor || "#F3F4F6";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.mainCard}>
            <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
              <Ionicons name={iconName as any} size={32} color={iconColor} />
            </View>
            <Text style={styles.title}>{transaction.title}</Text>
            <Text
              style={[
                styles.amount,
                { color: transaction.type === "expense" ? colors.expense : colors.income },
              ]}
            >
              {transaction.type === "expense" ? "-" : "+"}
              {formatAmount(transaction.amount)}
            </Text>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type</Text>
              <View style={styles.detailValueContainer}>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor:
                        transaction.type === "expense" ? "#FEE2E2" : "#DCFCE7",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBadgeText,
                      {
                        color:
                          transaction.type === "expense"
                            ? colors.expense
                            : colors.income,
                      },
                    ]}
                  >
                    {transaction.type === "expense" ? "Expense" : "Income"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <View style={styles.detailValueContainer}>
                <View style={[styles.categoryIcon, { backgroundColor: iconBg }]}>
                  <Ionicons name={iconName as any} size={16} color={iconColor} />
                </View>
                <Text style={styles.detailValue}>
                  {category?.name || transaction.category}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {formatShortDate(transaction.date)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValueMuted}>#{transaction.id}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Ionicons name="pencil" size={20} color={colors.white} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Ionicons name="trash" size={20} color={colors.expense} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  mainCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: typography.sizes["3xl"],
    fontWeight: typography.weights.bold,
  },
  detailsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: spacing.lg,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  detailLabel: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
  detailValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  detailValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  detailValueMuted: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  typeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.background,
  },
  actions: {
    flexDirection: "row",
    padding: spacing.xl,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  editButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  deleteButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.expense,
  },
});
