import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors, spacing, typography } from "../../theme";
import { privacyContent, supportContact } from "../../data";
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
        <Text style={styles.date}>Last updated: {privacyContent.lastUpdated}</Text>

        <Text style={styles.text}>{privacyContent.introduction}</Text>

        {privacyContent.sections.map((section, index) => (
          <View key={index}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <Text key={itemIndex} style={styles.bulletPoint}>• {item}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Data Storage and Security</Text>
        <Text style={styles.text}>{privacyContent.dataStorage}</Text>

        <Text style={styles.sectionTitle}>Data Sharing</Text>
        <Text style={styles.text}>{privacyContent.dataSharing}</Text>

        <Text style={styles.sectionTitle}>Cookies and Tracking</Text>
        <Text style={styles.text}>{privacyContent.cookies}</Text>

        <Text style={styles.sectionTitle}>Children's Privacy</Text>
        <Text style={styles.text}>{privacyContent.children}</Text>

        <Text style={styles.sectionTitle}>Changes to This Policy</Text>
        <Text style={styles.text}>{privacyContent.changes}</Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.text}>
          If you have questions about this Privacy Policy, please contact us at {supportContact.privacyEmail}.
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
