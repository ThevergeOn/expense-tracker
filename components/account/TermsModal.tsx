import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors, spacing, typography } from "../../theme";
import ModalHeader from "./ModalHeader";

interface TermsModalProps {
  onClose: () => void;
}

export default function TermsModal({ onClose }: TermsModalProps) {
  return (
    <View style={styles.container}>
      <ModalHeader title="Terms of Service" onClose={onClose} />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.date}>Last updated: January 1, 2024</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing and using this application, you accept and agree to be bound by the terms
          and conditions of this agreement. If you do not agree to these terms, please do not
          use our services.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of Service</Text>
        <Text style={styles.text}>
          You agree to use the service only for lawful purposes and in accordance with these
          Terms. You are responsible for ensuring that your use of the app complies with all
          applicable laws and regulations.
        </Text>

        <Text style={styles.sectionTitle}>3. User Accounts</Text>
        <Text style={styles.text}>
          You are responsible for maintaining the confidentiality of your account and password.
          You agree to accept responsibility for all activities that occur under your account.
        </Text>

        <Text style={styles.sectionTitle}>4. Data and Privacy</Text>
        <Text style={styles.text}>
          Your use of the service is also governed by our Privacy Policy. Please review our
          Privacy Policy to understand our practices regarding your personal data.
        </Text>

        <Text style={styles.sectionTitle}>5. Financial Information</Text>
        <Text style={styles.text}>
          The app helps you track expenses and manage finances. We do not provide financial
          advice. Always consult with a qualified financial advisor for important financial
          decisions.
        </Text>

        <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
        <Text style={styles.text}>
          The app and its original content, features, and functionality are owned by Expense
          Tracker and are protected by international copyright, trademark, and other
          intellectual property laws.
        </Text>

        <Text style={styles.sectionTitle}>7. Modifications</Text>
        <Text style={styles.text}>
          We reserve the right to modify these terms at any time. We will notify users of any
          changes by updating the "Last updated" date. Continued use of the service after
          changes constitutes acceptance of the new terms.
        </Text>

        <Text style={styles.sectionTitle}>8. Termination</Text>
        <Text style={styles.text}>
          We may terminate or suspend your account and access to the service immediately,
          without prior notice, for conduct that we believe violates these Terms or is harmful
          to other users, us, or third parties.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about these Terms, please contact us at
          legal@expensetracker.com.
        </Text>
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
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
