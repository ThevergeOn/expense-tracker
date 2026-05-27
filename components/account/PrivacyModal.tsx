import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors, spacing, typography } from "../../theme";
import ModalHeader from "./ModalHeader";

interface PrivacyModalProps {
  onClose: () => void;
}

export default function PrivacyModal({ onClose }: PrivacyModalProps) {
  return (
    <View style={styles.container}>
      <ModalHeader title="Privacy Policy" onClose={onClose} />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.date}>Last updated: January 1, 2024</Text>

        <Text style={styles.text}>
          Your privacy is important to us. This policy explains how we collect, use, and
          protect your information when you use our Expense Tracker application.
        </Text>

        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.bulletPoint}>• Personal information (name, email address)</Text>
        <Text style={styles.bulletPoint}>• Financial data (transactions, categories, budgets)</Text>
        <Text style={styles.bulletPoint}>• Device information (device type, operating system)</Text>
        <Text style={styles.bulletPoint}>• Usage data (how you interact with the app)</Text>

        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.bulletPoint}>• To provide and improve our services</Text>
        <Text style={styles.bulletPoint}>• To personalize your experience</Text>
        <Text style={styles.bulletPoint}>• To communicate with you about updates and features</Text>
        <Text style={styles.bulletPoint}>• To analyze usage patterns and improve the app</Text>
        <Text style={styles.bulletPoint}>• To ensure security and prevent fraud</Text>

        <Text style={styles.sectionTitle}>Data Storage and Security</Text>
        <Text style={styles.text}>
          We implement appropriate technical and organizational security measures to protect
          your personal information against unauthorized access, alteration, disclosure, or
          destruction. Your data is encrypted both in transit and at rest.
        </Text>

        <Text style={styles.sectionTitle}>Data Sharing</Text>
        <Text style={styles.text}>
          We do not sell your personal information to third parties. We may share data with
          trusted service providers who assist us in operating our app, subject to
          confidentiality agreements.
        </Text>

        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.bulletPoint}>• Access your personal data</Text>
        <Text style={styles.bulletPoint}>• Correct inaccurate data</Text>
        <Text style={styles.bulletPoint}>• Delete your account and data</Text>
        <Text style={styles.bulletPoint}>• Export your data</Text>
        <Text style={styles.bulletPoint}>• Opt out of marketing communications</Text>

        <Text style={styles.sectionTitle}>Cookies and Tracking</Text>
        <Text style={styles.text}>
          We use cookies and similar technologies to enhance your experience, analyze usage,
          and assist in our marketing efforts. You can control cookie preferences through
          your device settings.
        </Text>

        <Text style={styles.sectionTitle}>Children's Privacy</Text>
        <Text style={styles.text}>
          Our service is not intended for children under 13. We do not knowingly collect
          personal information from children under 13.
        </Text>

        <Text style={styles.sectionTitle}>Changes to This Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy from time to time. We will notify you of any
          changes by posting the new policy on this page and updating the "Last updated" date.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.text}>
          If you have questions about this Privacy Policy, please contact us at
          privacy@expensetracker.com.
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
  bulletPoint: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 28,
    paddingLeft: spacing.sm,
  },
});
