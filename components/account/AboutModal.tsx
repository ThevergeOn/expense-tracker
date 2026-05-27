import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../theme";
import ModalHeader from "./ModalHeader";

interface AboutModalProps {
  onClose: () => void;
}

const socialLinks = [
  { id: "website", icon: "globe-outline", label: "Website", url: "https://expensetracker.com" },
  { id: "twitter", icon: "logo-twitter", label: "Twitter", url: "https://twitter.com/expensetracker" },
  { id: "instagram", icon: "logo-instagram", label: "Instagram", url: "https://instagram.com/expensetracker" },
];

export default function AboutModal({ onClose }: AboutModalProps) {
  const handleLinkPress = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open this link");
      }
    });
  };

  return (
    <View style={styles.container}>
      <ModalHeader title="About" onClose={onClose} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.logo}>
          <Ionicons name="wallet" size={60} color={colors.primary} />
        </View>

        <Text style={styles.appName}>Expense Tracker</Text>
        <Text style={styles.version}>Version 1.0.0</Text>

        <Text style={styles.description}>
          Your personal finance companion. Track expenses, manage budgets, and achieve your
          financial goals with ease.
        </Text>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features</Text>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.income} />
            <Text style={styles.featureText}>Track income and expenses</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.income} />
            <Text style={styles.featureText}>Categorize transactions</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.income} />
            <Text style={styles.featureText}>View detailed analytics</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.income} />
            <Text style={styles.featureText}>Set and manage budgets</Text>
          </View>
        </View>

        <View style={styles.socialContainer}>
          <Text style={styles.socialTitle}>Follow Us</Text>
          <View style={styles.socialLinks}>
            {socialLinks.map((link) => (
              <TouchableOpacity
                key={link.id}
                style={styles.socialLink}
                onPress={() => handleLinkPress(link.url)}
              >
                <Ionicons name={link.icon as any} size={24} color={colors.primary} />
                <Text style={styles.socialLinkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2024 Expense Tracker</Text>
          <Text style={styles.rights}>All rights reserved.</Text>
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
  },
  contentContainer: {
    padding: spacing.xl,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  appName: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  version: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  featuresContainer: {
    width: "100%",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  featuresTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  featureText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  socialContainer: {
    width: "100%",
    marginBottom: spacing.xl,
  },
  socialTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xl,
  },
  socialLink: {
    alignItems: "center",
    gap: spacing.xs,
  },
  socialLinkText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
  },
  footer: {
    alignItems: "center",
  },
  copyright: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  rights: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
});
