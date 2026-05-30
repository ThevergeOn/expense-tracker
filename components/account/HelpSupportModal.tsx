import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../theme";
import { helpOptions, supportContact } from "../../data";
import ModalHeader from "./ModalHeader";

interface HelpSupportModalProps {
  onClose: () => void;
}

export default function HelpSupportModal({ onClose }: HelpSupportModalProps) {
  const handleOptionPress = (action: string) => {
    switch (action) {
      case "chat":
        Alert.alert("Live Chat", "Live chat feature coming soon!");
        break;
      case "email":
        Linking.openURL(`mailto:${supportContact.email}`);
        break;
      case "phone":
        Linking.openURL(`tel:${supportContact.phone.replace(/\D/g, "")}`);
        break;
      case "faq":
        Alert.alert("FAQ", "FAQ section coming soon!");
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ModalHeader title="Help & Support" onClose={onClose} />
      <ScrollView style={styles.content}>
        {helpOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.helpItem}
            onPress={() => handleOptionPress(option.action)}
          >
            <View style={[styles.helpIcon, { backgroundColor: option.color + "20" }]}>
              <Ionicons name={option.icon as any} size={22} color={option.color} />
            </View>
            <View style={styles.helpInfo}>
              <Text style={styles.helpTitle}>{option.title}</Text>
              <Text style={styles.helpSubtitle}>{option.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackTitle}>Send Feedback</Text>
          <Text style={styles.feedbackText}>
            Have suggestions or found a bug? We'd love to hear from you!
          </Text>
          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => Alert.alert("Feedback", "Thank you for your interest in providing feedback!")}
          >
            <Ionicons name="create-outline" size={20} color={colors.primary} />
            <Text style={styles.feedbackButtonText}>Write Feedback</Text>
          </TouchableOpacity>
        </View>
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
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  helpIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  helpInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  helpTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  helpSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  feedbackSection: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  feedbackTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  feedbackText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  feedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary + "15",
    borderRadius: 8,
    padding: spacing.md,
    gap: spacing.sm,
  },
  feedbackButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
});
