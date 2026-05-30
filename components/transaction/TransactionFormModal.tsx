import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { colors, spacing, typography } from "../../theme";
import { Transaction, Category, CategoryType } from "../../types";
import { TransactionInput } from "../../services";

interface TransactionFormModalProps {
  visible: boolean;
  transaction?: Transaction | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: TransactionInput) => Promise<boolean>;
}

export default function TransactionFormModal({
  visible,
  transaction,
  categories,
  onClose,
  onSave,
}: TransactionFormModalProps) {
  const isEditing = !!transaction;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("other");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only reset form when modal opens/closes or transaction changes
  useEffect(() => {
    if (visible) {
      if (transaction) {
        setTitle(transaction.title);
        setAmount(transaction.amount.toString());
        setType(transaction.type);
        setSelectedCategory(transaction.category);
        setSelectedDate(new Date(transaction.date));
      } else {
        setTitle("");
        setAmount("");
        setType("expense");
        setSelectedCategory("other");
        setSelectedDate(new Date());
      }
      setError(null);
      setShowDatePicker(false);
    }
  }, [visible, transaction]);

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setSaving(true);
    setError(null);

    const category = filteredCategories.find((c) => c.id === selectedCategory);

    const data: TransactionInput = {
      title: title.trim(),
      amount: amountNum,
      type,
      category: selectedCategory,
      icon: category?.icon,
      iconColor: category?.color,
      iconBg: category?.bgColor,
      date: selectedDate.toISOString(),
    };

    const success = await onSave(data);
    setSaving(false);

    if (success) {
      onClose();
    } else {
      setError("Failed to save transaction. Please try again.");
    }
  };

  const filteredCategories = categories.filter((c) => c.id !== "add");

  // Default categories if none loaded from API
  const defaultCategories: Category[] = [
    { id: "groceries", name: "Groceries", icon: "cart", color: "#A855F7", bgColor: "#F3E8FF" },
    { id: "travel", name: "Travel", icon: "airplane", color: "#F97316", bgColor: "#FFF7ED" },
    { id: "car", name: "Car", icon: "car", color: "#6366F1", bgColor: "#EEF2FF" },
    { id: "home", name: "Home", icon: "home", color: "#F97316", bgColor: "#FFF7ED" },
    { id: "shopping", name: "Shopping", icon: "bag-handle", color: "#EAB308", bgColor: "#FEFCE8" },
    { id: "education", name: "Education", icon: "book", color: "#3B82F6", bgColor: "#EFF6FF" },
    { id: "subscription", name: "Subscription", icon: "notifications", color: "#EAB308", bgColor: "#FEFCE8" },
    { id: "other", name: "Other", icon: "ellipsis-horizontal", color: "#6366F1", bgColor: "#EEF2FF" },
  ];

  const displayCategories = filteredCategories.length > 0 ? filteredCategories : defaultCategories;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditing ? "Edit Transaction" : "Add Transaction"}
            </Text>
            <View style={styles.closeButton} />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={colors.expense} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Type Selector */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "expense" && styles.typeButtonActiveExpense,
                ]}
                onPress={() => setType("expense")}
              >
                <Ionicons
                  name="trending-down"
                  size={20}
                  color={type === "expense" ? colors.white : colors.expense}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    type === "expense" && styles.typeButtonTextActive,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "income" && styles.typeButtonActiveIncome,
                ]}
                onPress={() => setType("income")}
              >
                <Ionicons
                  name="trending-up"
                  size={20}
                  color={type === "income" ? colors.white : colors.income}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    type === "income" && styles.typeButtonTextActive,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter transaction title"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="sentences"
              />
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Date Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <Text style={styles.dateText}>{formatDisplayDate(selectedDate)}</Text>
                <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
              </TouchableOpacity>

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
            </View>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {displayCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      selectedCategory === category.id && styles.categoryItemSelected,
                    ]}
                    onPress={() => setSelectedCategory(category.id as CategoryType)}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: category.bgColor },
                      ]}
                    >
                      <Ionicons
                        name={category.icon as any}
                        size={20}
                        color={category.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryName,
                        selectedCategory === category.id && styles.categoryNameSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color={colors.white} />
                  <Text style={styles.saveButtonText}>
                    {isEditing ? "Save Changes" : "Add Transaction"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.expense,
  },
  typeSelector: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  typeButtonActiveExpense: {
    backgroundColor: colors.expense,
  },
  typeButtonActiveIncome: {
    backgroundColor: colors.income,
  },
  typeButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },
  currencySymbol: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
  },
  amountInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  dateText: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  datePickerContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    marginTop: spacing.sm,
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
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  categoryItem: {
    alignItems: "center",
    width: "23%",
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.cardBg,
  },
  categoryItemSelected: {
    backgroundColor: colors.primary,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: "center",
  },
  categoryNameSelected: {
    color: colors.white,
    fontWeight: typography.weights.medium,
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
});
