import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { colors, spacing, typography } from "../theme";
import { Category, CategoryType } from "../types";
import { useTransactions, useCategories } from "../hooks";

// Form state interface matching App.tsx
interface TransactionFormState {
  amount: string;
  description: string;
  transactionType: "expense" | "income";
  selectedDate: Date;
}

interface AddTransactionScreenProps {
  onClose: () => void;
  onSelectCategory: () => void;
  selectedCategory: Category | null;
  formState: TransactionFormState;
  onFormChange: (updates: Partial<TransactionFormState>) => void;
}

export default function AddTransactionScreen({
  onClose,
  onSelectCategory,
  selectedCategory,
  formState,
  onFormChange,
}: AddTransactionScreenProps) {
  const { amount, description, transactionType, selectedDate } = formState;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createTransaction } = useTransactions();
  const { categories } = useCategories();

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      onFormChange({ selectedDate: date });
    }
  };

  const formatDisplayDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleSave = async () => {
    if (!amount) {
      setError("Please enter an amount");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!selectedCategory) {
      setError("Please select a category");
      return;
    }

    setSaving(true);
    setError(null);

    // Get category details from loaded categories or use selected
    const categoryData = categories.find((c) => c.id === selectedCategory.id) || selectedCategory;

    const success = await createTransaction({
      title: description.trim() || selectedCategory.name,
      amount: amountNum,
      type: transactionType,
      category: selectedCategory.id as CategoryType,
      icon: categoryData.icon,
      iconColor: categoryData.color,
      iconBg: categoryData.bgColor,
      date: selectedDate.toISOString(),
    });

    setSaving(false);

    if (success) {
      onClose();
    } else {
      setError("Failed to save transaction. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.title}>Add Transaction</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={colors.expense} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Transaction Type Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  transactionType === "expense" && styles.toggleButtonActive,
                ]}
                onPress={() => onFormChange({ transactionType: "expense" })}
              >
                <Ionicons
                  name="trending-down"
                  size={18}
                  color={transactionType === "expense" ? colors.white : colors.expense}
                />
                <Text
                  style={[
                    styles.toggleText,
                    transactionType === "expense" && styles.toggleTextActive,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  transactionType === "income" && styles.toggleButtonActiveIncome,
                ]}
                onPress={() => onFormChange({ transactionType: "income" })}
              >
                <Ionicons
                  name="trending-up"
                  size={18}
                  color={transactionType === "income" ? colors.white : colors.income}
                />
                <Text
                  style={[
                    styles.toggleText,
                    transactionType === "income" && styles.toggleTextActive,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={(text) => onFormChange({ amount: text })}
              />
            </View>

            {/* Category Selector */}
            <TouchableOpacity style={styles.inputRow} onPress={onSelectCategory}>
              <View style={styles.inputLeft}>
                <View
                  style={[
                    styles.inputIcon,
                    {
                      backgroundColor: selectedCategory?.bgColor || colors.background,
                    },
                  ]}
                >
                  <Ionicons
                    name={(selectedCategory?.icon as any) || "grid-outline"}
                    size={20}
                    color={selectedCategory?.color || colors.textMuted}
                  />
                </View>
                <Text
                  style={[
                    styles.inputLabel,
                    !selectedCategory && styles.inputPlaceholder,
                  ]}
                >
                  {selectedCategory?.name || "Select Category"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Description Input */}
            <View style={styles.inputRow}>
              <View style={styles.inputLeft}>
                <View style={styles.inputIcon}>
                  <Ionicons name="document-text-outline" size={20} color={colors.textMuted} />
                </View>
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="Add description (optional)"
                  placeholderTextColor={colors.textMuted}
                  value={description}
                  onChangeText={(text) => onFormChange({ description: text })}
                />
              </View>
            </View>

            {/* Date Input */}
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.inputLeft}>
                <View style={[styles.inputIcon, { backgroundColor: "#EFF6FF" }]}>
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.inputLabel}>{formatDisplayDate(selectedDate)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Date Picker */}
            {showDatePicker && (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  style={styles.datePicker}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerDoneButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.datePickerDoneText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!amount || !selectedCategory || saving) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!amount || !selectedCategory || saving}
            >
              {saving ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>Save Transaction</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBg,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    marginHorizontal: spacing.xl,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.expense,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.xl,
    marginVertical: spacing.lg,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    gap: spacing.xs,
  },
  toggleButtonActive: {
    backgroundColor: colors.expense,
  },
  toggleButtonActiveIncome: {
    backgroundColor: colors.income,
  },
  toggleText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.white,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing["2xl"],
  },
  currencySymbol: {
    fontSize: typography.sizes["4xl"],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  amountInput: {
    fontSize: typography.sizes["4xl"],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    minWidth: 100,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: 12,
  },
  inputLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  inputIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  inputLabel: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  inputPlaceholder: {
    color: colors.textMuted,
  },
  descriptionInput: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  datePickerContainer: {
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.xl,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  datePicker: {
    height: 200,
  },
  datePickerDoneButton: {
    alignItems: "center",
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  datePickerDoneText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing["3xl"],
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  saveButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
});
