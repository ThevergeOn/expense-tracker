import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../theme";
import { appInfo, socialLinks } from "../../data";
import ModalHeader from "./ModalHeader";

interface AboutModalProps {
  onClose: () => void;
}

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

        <Text style={styles.appName}>{appInfo.name}</Text>
        <Text style={styles.version}>Version {appInfo.version}</Text>

        <Text style={styles.description}>{appInfo.description}</Text>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features</Text>
          {appInfo.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.income} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.socialContainer}>
          <Text style={styles.socialTitle}>Follow Us</Text>
          <View style={styles.socialLinks}>
            {socialLinks.slice(0, 3).map((link) => (
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
          <Text style={styles.copyright}>{appInfo.copyright}</Text>
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
});
