import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../theme";
import ModalHeader from "./ModalHeader";

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
}

interface PaymentMethodsModalProps {
  paymentMethods: PaymentMethod[];
  onClose: () => void;
}

export default function PaymentMethodsModal({ paymentMethods, onClose }: PaymentMethodsModalProps) {
  const handleAddPayment = () => {
    Alert.alert("Add Payment", "Payment method addition coming soon!");
  };

  const handleDeletePayment = (_id: string) => {
    Alert.alert("Delete Payment", "Are you sure you want to remove this payment method?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive" },
    ]);
  };

  return (
    <View style={styles.container}>
      <ModalHeader title="Payment Methods" onClose={onClose} />
      <ScrollView style={styles.content}>
        {paymentMethods.map((method) => (
          <View key={method.id} style={styles.paymentCard}>
            <View style={styles.paymentIconContainer}>
              <Ionicons
                name={method.type === "visa" ? "card" : "card-outline"}
                size={24}
                color={method.type === "visa" ? colors.blue : colors.orange}
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentType}>
                {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
              </Text>
              <Text style={styles.paymentNumber}>**** **** **** {method.last4}</Text>
            </View>
            <View style={styles.paymentActions}>
              <Text style={styles.paymentExpiry}>Exp: {method.expiry}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePayment(method.id)}
              >
                <Ionicons name="trash-outline" size={18} color={colors.expense} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addPaymentButton} onPress={handleAddPayment}>
          <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
          <Text style={styles.addPaymentText}>Add Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  paymentType: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  paymentNumber: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  paymentActions: {
    alignItems: "flex-end",
  },
  paymentExpiry: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  addPaymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary + "30",
    borderStyle: "dashed",
  },
  addPaymentText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
});
