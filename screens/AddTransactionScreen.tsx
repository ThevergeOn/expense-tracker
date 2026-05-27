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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";
import { Category } from "../types";

interface AddTransactionScreenProps {
  onClose: () => void;
  onSelectCategory: () => void;
  selectedCategory: Category | null;
}

export default function AddTransactionScreen({
  onClose,
  onSelectCategory,
  selectedCategory,
}: AddTransactionScreenProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");

  const handleSave = () => {
    // TODO: Save transaction
    console.log({
      amount: parseFloat(amount),
      description,
      category: selectedCategory,
      type: transactionType,
    });
    onClose();
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

            {/* Transaction Type Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  transactionType === "expense" && styles.toggleButtonActive,
                ]}
                onPress={() => setTransactionType("expense")}
              >
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
                onPress={() => setTransactionType("income")}
              >
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
                onChangeText={setAmount}
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
                  placeholder="Add description"
                  placeholderTextColor={colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>

            {/* Date Input */}
            <TouchableOpacity style={styles.inputRow}>
              <View style={styles.inputLeft}>
                <View style={styles.inputIcon}>
                  <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
                </View>
                <Text style={styles.inputLabel}>Today</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!amount || !selectedCategory) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!amount || !selectedCategory}
            >
              <Text style={styles.saveButtonText}>Save Transaction</Text>
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
    paddingVertical: spacing.md,
    alignItems: "center",
    borderRadius: 10,
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
